import { pgTable, serial, varchar, timestamp, boolean, text, decimal, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  unsubscribedAt: timestamp('unsubscribed_at'),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Basic Product Info
  name: varchar('name', { length: 500 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft', 'active', 'sold', 'archived'
  
  // Enhanced Product Data (AI Generated)
  title: varchar('title', { length: 500 }),
  subtitle: varchar('subtitle', { length: 500 }),
  shortDescription: text('short_description'),
  keyFeatures: jsonb('key_features'), // Array of strings
  specifications: jsonb('specifications'), // Object with materials, dimensions, etc.
  highlights: jsonb('highlights'), // Array of strings
  tags: jsonb('tags'), // Array of strings
  story: text('story'),
  
  // Form Data (Original Input)
  originalDescription: text('original_description'),
  materials: varchar('materials', { length: 500 }),
  techniques: varchar('techniques', { length: 500 }),
  targetAudience: varchar('target_audience', { length: 500 }),
  additionalDetails: text('additional_details'),
  priceMax: decimal('price_max', { precision: 10, scale: 2 }),
  
  // Images and Media
  images: jsonb('images'), // Array of image URLs
  primaryImage: varchar('primary_image', { length: 500 }),
  
  // Analytics
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  saves: integer('saves').default(0).notNull(),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

// Product Images table (for multiple images per product)
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  altText: varchar('alt_text', { length: 255 }),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Product Categories for better organization
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
