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

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [products, setProducts] = useState<any[]>([]);

  const categories: Category[] = [
    { id: 'all', name: 'All Categories', icon: '🎨' },
    { id: 'pottery', name: 'Pottery & Ceramics', icon: '🏺' },
    { id: 'jewelry', name: 'Jewelry & Accessories', icon: '💎' },
    { id: 'textiles', name: 'Textiles & Fabrics', icon: '🧵' },
    { id: 'woodwork', name: 'Woodwork & Furniture', icon: '🪵' },
    { id: 'metalwork', name: 'Metalwork & Sculpture', icon: '⚒️' },
    { id: 'paintings', name: 'Paintings & Art', icon: '🎨' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'digital', name: 'Digital Art', icon: '💻' }
  ];

  const sortOptions: SortOption[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Sample products data
  useEffect(() => {
    const sampleProducts = [
      {
        id: 1,
        name: 'Handcrafted Ceramic Bowl',
        artist: 'Maya Patel',
        category: 'pottery',
        price: 45.99,
        originalPrice: 55.99,
        rating: 4.8,
        reviews: 24,
        image: '/api/placeholder/300/300',
        featured: true,
        isNew: false
      },
      {
        id: 2,
        name: 'Sterling Silver Necklace',
        artist: 'Arjun Singh',
        category: 'jewelry',
        price: 89.99,
        rating: 4.9,
        reviews: 18,
        image: '/api/placeholder/300/300',
        featured: true,
        isNew: true
      },
      {
        id: 3,
        name: 'Handwoven Silk Scarf',
        artist: 'Priya Sharma',
        category: 'textiles',
        price: 65.00,
        rating: 4.7,
        reviews: 31,
        image: '/api/placeholder/300/300',
        featured: false,
        isNew: false
      }
    ];
    setProducts(sampleProducts);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="font-sans min-h-screen bg-background">
      <Header />
      
      {/* ADD PT-20 WRAPPER TO FIX HEADER OVERLAP */}
      <div className="pt-20">
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
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Filters & Categories */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200/60 dark:border-neutral-800/60 p-6">
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                          selectedCategory === category.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'hover:bg-stone-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-neutral-900 dark:text-neutral-100"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  Products ({products.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-stone-200/60 dark:border-neutral-800/60 hover:shadow-lg transition-all duration-300 group">
                    
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 relative overflow-hidden">
                      {product.featured && (
                        <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          Featured
                        </div>
                      )}
                      {product.isNew && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          New
                        </div>
                      )}
                      {product.originalPrice && (
                        <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          Sale
                        </div>
                      )}
                      <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                        {categories.find(cat => cat.id === product.category)?.icon || '🎨'}
                      </div>
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
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-stone-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {product.rating} ({product.reviews})
                        </span>
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
                        <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300">
                          View Details
                        </button>
                        <button className="p-2 text-neutral-600 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
