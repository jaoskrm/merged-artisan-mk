'use client'

import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface Product {
  id: number;
  name: string;
  artist: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  tags: string[];
}

const categories: Category[] = [
  { id: 'all', name: 'All Categories', icon: '🎨' },
  { id: 'pottery', name: 'Pottery & Ceramics', icon: '🏺' },
  { id: 'jewelry', name: 'Jewelry & Accessories', icon: '💍' },
  { id: 'textiles', name: 'Textiles & Fabrics', icon: '🧵' },
  { id: 'woodwork', name: 'Woodwork & Furniture', icon: '🪵' },
  { id: 'metalwork', name: 'Metalwork & Sculpture', icon: '⚒️' },
  { id: 'paintings', name: 'Paintings & Art', icon: '🎭' }
];

const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' }
];

// Sample products data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Handcrafted Ceramic Vase',
    artist: 'Maya Pottery Studio',
    price: 89.99,
    originalPrice: 120.00,
    rating: 4.8,
    reviews: 124,
    image: '/api/placeholder/400/400',
    category: 'pottery',
    isFeatured: true,
    isOnSale: true,
    tags: ['Handmade', 'Limited Edition']
  },
  {
    id: 2,
    name: 'Sterling Silver Earrings',
    artist: 'Artisan Jewelry Co.',
    price: 156.00,
    rating: 4.9,
    reviews: 89,
    image: '/api/placeholder/400/400',
    category: 'jewelry',
    isFeatured: true,
    tags: ['925 Silver', 'Gift Ready']
  },
  {
    id: 3,
    name: 'Handwoven Silk Scarf',
    artist: 'Heritage Textiles',
    price: 245.00,
    rating: 4.7,
    reviews: 156,
    image: '/api/placeholder/400/400',
    category: 'textiles',
    tags: ['Pure Silk', 'Traditional']
  },
  {
    id: 4,
    name: 'Reclaimed Wood Coffee Table',
    artist: 'Rustic Craft Works',
    price: 899.99,
    originalPrice: 1200.00,
    rating: 4.9,
    reviews: 67,
    image: '/api/placeholder/400/400',
    category: 'woodwork',
    isOnSale: true,
    tags: ['Sustainable', 'Custom Size']
  },
  {
    id: 5,
    name: 'Bronze Sculpture - Abstract',
    artist: 'Modern Metal Arts',
    price: 1850.00,
    rating: 4.6,
    reviews: 34,
    image: '/api/placeholder/400/400',
    category: 'metalwork',
    tags: ['Original', 'Signed']
  },
  {
    id: 6,
    name: 'Oil Painting - Landscape',
    artist: 'Canvas & Dreams',
    price: 675.00,
    rating: 4.8,
    reviews: 89,
    image: '/api/placeholder/400/400',
    category: 'paintings',
    isFeatured: true,
    tags: ['Original', 'Framed']
  }
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return b.id - a.id;
      case 'popular': return b.reviews - a.reviews;
      default: return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="font-sans min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Discover Unique Artisan Creations
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Explore thousands of handcrafted items from talented artisans around the world
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for art, jewelry, pottery, and more..."
              className="w-full px-6 py-4 pl-14 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
            />
            <svg className="absolute left-5 top-4 w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-stone-200 dark:border-neutral-700 hover:border-primary/30 hover:bg-primary/5'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Showing {sortedProducts.length} products
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
              </svg>
              Filters
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-neutral-900 dark:text-neutral-100"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm border border-stone-200/60 dark:border-neutral-800/60 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
                  <div className="text-6xl opacity-30">🎨</div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.isFeatured && (
                    <span className="bg-primary text-white px-2 py-1 rounded-lg text-xs font-medium">Featured</span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">Sale</span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-neutral-900/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800">
                  <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <p className="text-sm text-primary font-medium">{product.artist}</p>
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors duration-200">
                    {product.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-stone-300 dark:text-neutral-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-stone-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
                    Add to Cart
                  </button>
                  <button className="p-3 border border-stone-200 dark:border-neutral-700 hover:border-primary/30 text-neutral-600 dark:text-neutral-400 hover:text-primary rounded-2xl transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white dark:bg-neutral-900 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300">
            Load More Products
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
