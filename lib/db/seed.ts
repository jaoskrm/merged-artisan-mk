import { db } from './index';
import { categories } from './schema';

export async function seedCategories() {
  const defaultCategories = [
    { name: 'Pottery & Ceramics', slug: 'pottery-ceramics', description: 'Handcrafted pottery, ceramics, and clay work' },
    { name: 'Jewelry & Accessories', slug: 'jewelry-accessories', description: 'Handmade jewelry, accessories, and wearables' },
    { name: 'Textiles & Fabrics', slug: 'textiles-fabrics', description: 'Woven goods, fabrics, and textile arts' },
    { name: 'Woodwork & Furniture', slug: 'woodwork-furniture', description: 'Wooden crafts, furniture, and carpentry' },
    { name: 'Metalwork & Sculpture', slug: 'metalwork-sculpture', description: 'Metal crafts, sculptures, and forged items' },
    { name: 'Paintings & Art', slug: 'paintings-art', description: 'Original paintings, drawings, and visual arts' },
    { name: 'Photography', slug: 'photography', description: 'Fine art photography and photographic prints' },
    { name: 'Digital Art', slug: 'digital-art', description: 'Digital artwork, NFTs, and computer-generated art' },
  ];

  for (const category of defaultCategories) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }
}
