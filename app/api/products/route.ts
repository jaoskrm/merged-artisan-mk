import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

// GET - Fetch user's products
export async function GET(request: NextRequest) {
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

    const userProducts = await db
      .select()
      .from(products)
      .where(eq(products.userId, user.id))
      .orderBy(desc(products.createdAt));

    return NextResponse.json({
      success: true,
      products: userProducts,
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
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

    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.category || !productData.price) {
      return NextResponse.json(
        { success: false, message: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const newProduct = await db.insert(products).values({
      userId: user.id,
      name: productData.name,
      category: productData.category,
      price: productData.price.toString(),
      priceMax: productData.priceMax ? productData.priceMax.toString() : null,
      title: productData.title,
      subtitle: productData.subtitle,
      shortDescription: productData.shortDescription,
      keyFeatures: productData.keyFeatures,
      specifications: productData.specifications,
      highlights: productData.highlights,
      tags: productData.tags,
      story: productData.story,
      originalDescription: productData.originalDescription,
      materials: productData.materials,
      techniques: productData.techniques,
      targetAudience: productData.targetAudience,
      additionalDetails: productData.additionalDetails,
      status: productData.status || 'draft',
      primaryImage: productData.primaryImage || '/api/placeholder/300/300',
      publishedAt: productData.status === 'active' ? new Date() : null,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct[0],
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
