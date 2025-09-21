import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const productId = parseInt(params.id);
    const updateData = await request.json();

    // Check if product belongs to user
    const existingProduct = await db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), eq(products.userId, user.id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = await db
      .update(products)
      .set({
        ...updateData,
        updatedAt: new Date(),
        publishedAt: updateData.status === 'active' && !existingProduct[0].publishedAt 
          ? new Date() 
          : existingProduct[0].publishedAt,
      })
      .where(and(eq(products.id, productId), eq(products.userId, user.id)))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct[0],
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const productId = parseInt(params.id);

    await db
      .delete(products)
      .where(and(eq(products.id, productId), eq(products.userId, user.id)));

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
