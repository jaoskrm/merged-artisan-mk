import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get all active products with ALL fields
    const allProductsQuery = await db
      .select({
        // Basic Info
        id: products.id,
        name: products.name,
        category: products.category,
        price: products.price,
        priceMax: products.priceMax,
        status: products.status,
        
        // Enhanced AI Data
        title: products.title,
        subtitle: products.subtitle,
        shortDescription: products.shortDescription,
        keyFeatures: products.keyFeatures,
        specifications: products.specifications,
        highlights: products.highlights,
        tags: products.tags,
        story: products.story,
        
        // Original Form Data
        originalDescription: products.originalDescription,
        materials: products.materials,
        techniques: products.techniques,
        targetAudience: products.targetAudience,
        additionalDetails: products.additionalDetails,
        
        // Media
        primaryImage: products.primaryImage,
        images: products.images,
        
        // Analytics & Timestamps
        views: products.views,
        likes: products.likes,
        saves: products.saves,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        publishedAt: products.publishedAt,
        
        // Artist Info
        artistName: users.name,
        artistId: users.id,
      })
      .from(products)
      .innerJoin(users, eq(products.userId, users.id))
      .where(eq(products.status, 'active'));

    let filteredProducts = allProductsQuery;

    // Apply search filter
    if (search) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.title && product.title.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply category filter
    if (category && category !== 'all') {
      const categoryMap: Record<string, string> = {
        'pottery': 'Pottery & Ceramics',
        'jewelry': 'Jewelry & Accessories',
        'textiles': 'Textiles & Fabrics',
        'woodwork': 'Woodwork & Furniture',
        'metalwork': 'Metalwork & Sculpture',
        'paintings': 'Paintings & Art',
        'photography': 'Photography',
        'digital': 'Digital Art'
      };
      
      const fullCategoryName = categoryMap[category] || category;
      filteredProducts = filteredProducts.filter(product => 
        product.category === fullCategoryName
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'popular':
          return (b.views + b.likes) - (a.views + a.likes);
        case 'featured':
          return b.views - a.views;
        default: // newest
          const aDate = new Date(a.publishedAt || a.createdAt).getTime();
          const bDate = new Date(b.publishedAt || b.createdAt).getTime();
          return bDate - aDate;
      }
    });

    // Apply pagination
    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      total: total,
      hasMore: offset + limit < total,
    });

  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
