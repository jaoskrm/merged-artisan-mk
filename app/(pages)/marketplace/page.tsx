'use client'

import { useState, useEffect, useCallback, memo } from 'react';
import { 
  Search, Grid3X3, List, ShoppingCart, Loader2, Package, X, Tag, 
  Star, Palette, Hammer, User, SlidersHorizontal, Check, Sparkles,
  Zap, Crown, TrendingUp, DollarSign, Paintbrush, Gem, Scissors, 
  TreePine, Wrench, Camera, Monitor, Filter, ChevronDown, ChevronUp, ArrowLeft, Eye
} from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  title?: string;
  shortDescription?: string;
  keyFeatures?: string[];
  tags?: string[];
  story?: string;
  materials?: string;
  techniques?: string;
  primaryImage?: string;
  createdAt: string;
  artistName: string;
  artistId: number;
}

type ExpandedSections = { features: boolean; story: boolean; craftsmanship: boolean; [key: string]: boolean; };

const categories = [
  { id: 'all', name: 'All Categories', icon: <Paintbrush className="w-4 h-4" />, gradient: 'from-blue-400 to-blue-600' },
  { id: 'pottery', name: 'Pottery & Ceramics', icon: <Package className="w-4 h-4" />, gradient: 'from-orange-400 to-red-500' },
  { id: 'jewelry', name: 'Jewelry & Accessories', icon: <Gem className="w-4 h-4" />, gradient: 'from-purple-400 to-pink-500' },
  { id: 'textiles', name: 'Textiles & Fabrics', icon: <Scissors className="w-4 h-4" />, gradient: 'from-pink-400 to-rose-500' },
  { id: 'woodwork', name: 'Woodwork & Furniture', icon: <TreePine className="w-4 h-4" />, gradient: 'from-amber-400 to-orange-600' },
  { id: 'metalwork', name: 'Metalwork & Sculpture', icon: <Wrench className="w-4 h-4" />, gradient: 'from-slate-400 to-slate-600' },
  { id: 'paintings', name: 'Paintings & Art', icon: <Paintbrush className="w-4 h-4" />, gradient: 'from-red-400 to-rose-600' },
  { id: 'photography', name: 'Photography', icon: <Camera className="w-4 h-4" />, gradient: 'from-green-400 to-emerald-600' },
  { id: 'digital', name: 'Digital Art', icon: <Monitor className="w-4 h-4" />, gradient: 'from-indigo-400 to-purple-600' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: <Zap className="w-4 h-4" /> },
  { value: 'featured', label: 'Featured', icon: <Crown className="w-4 h-4" /> },
  { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'price-low', label: 'Price: Low to High', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'price-high', label: 'Price: High to Low', icon: <DollarSign className="w-4 h-4" /> }
];

const priceRanges = [
  { id: 'all', label: 'All Prices' }, { id: 'under-50', label: 'Under $50' }, { id: '50-100', label: '$50 - $100' },
  { id: '100-250', label: '$100 - $250' }, { id: '250-500', label: '$250 - $500' }, { id: 'over-500', label: 'Over $500' }
];

const ProductImage = memo(({ product, className = "" }: { product: Product; className?: string }) => {
  const [imageError, setImageError] = useState(false);
  
  const getProductGradient = useCallback((category: string) => {
    const categoryData = categories.find(cat => 
      category.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0].toLowerCase())
    );
    return categoryData?.gradient || 'from-primary/20 to-primary/40';
  }, []);

  if (!product.primaryImage || imageError) {
    return (
      <div className={`bg-gradient-to-br ${getProductGradient(product.category)} flex items-center justify-center relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-white/10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-white">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
            {categories.find(cat => product.category.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0].toLowerCase()))?.icon || <Package className="w-6 h-6 sm:w-8 sm:h-8" />}
          </div>
          <span className="text-xs font-medium opacity-80">{product.category.split(' ')[0]}</span>
        </div>
      </div>
    );
  }

  return <img src={product.primaryImage} alt={product.title || product.name} className={className} onError={() => setImageError(true)} />;
});

ProductImage.displayName = 'ProductImage';

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({ features: true, story: false, craftsmanship: false });

  useEffect(() => {
    document.body.style.overflow = (showProductModal || showMobileFilters) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showProductModal, showMobileFilters]);

  const fetchProducts = useCallback(async (reset = false) => {
    try {
      reset ? setIsLoading(true) : setIsLoadingMore(true);
      if (reset) setProducts([]);

      const params = new URLSearchParams({
        search: searchTerm, category: selectedCategory, sortBy, limit: '12',
        offset: reset ? '0' : products.length.toString()
      });

      const response = await fetch(`/api/products/public?${params}`);
      const data = await response.json();

      if (data.success) {
        const newProducts = data.products;
        setProducts(prev => reset ? newProducts : [...prev, ...newProducts]);
        setHasMore(data.hasMore && newProducts.length > 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchTerm, selectedCategory, sortBy, products.length]);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchProducts(true), 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedPriceRange, sortBy]);

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    setExpandedSections({ features: true, story: false, craftsmanship: false });
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
    setShowProductModal(false);
  }, []);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSearchTerm('');
    setShowMobileFilters(false);
  }, []);

  // Grid Product Card
  const GridCard = memo(({ product }: { product: Product }) => (
    <div className="group bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-sm font-bold shadow-lg">
            <span className="text-primary">${Number(product.price).toFixed(0)}</span>
          </div>
        </div>

        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
          <div className="bg-black/80 text-white px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg text-xs font-medium">
            {product.category.split(' ')[0]}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={() => openProductModal(product)} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              Quick View
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-3 h-3 text-primary" />
            <span className="text-xs text-neutral-500 font-medium">{product.artistName}</span>
          </div>
          <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title || product.name}
          </h3>
        </div>

        {product.shortDescription && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">{product.shortDescription}</p>
        )}

        <div className="flex gap-2 sm:gap-2.5">
          <button onClick={() => openProductModal(product)} className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </button>
          <button className="bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ));

  // List Product Card (Desktop Only)
  const ListCard = memo(({ product }: { product: Product }) => (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 p-6">
      <div className="flex gap-6">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
          <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 left-2">
            <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
              {product.category.split(' ')[0]}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 h-full">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">{product.artistName}</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {product.title || product.name}
              </h3>

              {product.shortDescription && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4 leading-relaxed">{product.shortDescription}</p>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.slice(0, 4).map((tag, index) => (
                    <span key={index} className="bg-stone-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                  {product.tags.length > 4 && (
                    <span className="text-xs text-neutral-400 flex items-center">+{product.tags.length - 4} more</span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                {product.materials && (
                  <div className="flex items-center gap-1"><Palette className="w-3 h-3" /><span>{product.materials}</span></div>
                )}
                {product.techniques && (
                  <div className="flex items-center gap-1"><Hammer className="w-3 h-3" /><span>{product.techniques}</span></div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 min-w-[140px]">
              <div className="text-right">
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">${Number(product.price).toFixed(0)}</div>
                <p className="text-xs text-neutral-500">Handcrafted</p>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <button onClick={() => openProductModal(product)} className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <Eye className="w-4 h-4" />View Details
                </button>
                <button className="bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 p-2.5 rounded-lg transition-all flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  GridCard.displayName = 'GridCard';
  ListCard.displayName = 'ListCard';

  const FilterPanel = memo(({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? 'p-6' : ''}>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Search Products</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search artworks..." className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Category</label>
        <div className="space-y-2">
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all ${selectedCategory === category.id ? 'bg-primary text-white shadow-md' : 'hover:bg-stone-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}`}>
              {category.icon}<span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Price Range</label>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button key={range.id} onClick={() => setSelectedPriceRange(range.id)} className={`w-full p-3 rounded-xl text-left text-sm transition-all font-medium ${selectedPriceRange === range.id ? 'bg-primary text-white shadow-md' : 'hover:bg-stone-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}`}>
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className={isMobile ? 'mb-6' : ''}>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Sort By</label>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button key={option.value} onClick={() => setSortBy(option.value)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all ${sortBy === option.value ? 'bg-primary text-white shadow-md' : 'hover:bg-stone-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}`}>
              {option.icon}<span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isMobile && (
        <div className="flex gap-3 pt-4 border-t border-stone-200 dark:border-neutral-800">
          <button onClick={clearFilters} className="flex-1 bg-stone-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 py-3 px-4 rounded-xl font-semibold transition-all">Clear All</button>
          <button onClick={() => setShowMobileFilters(false)} className="flex-1 bg-primary text-white py-3 px-4 rounded-xl font-semibold transition-all">Apply Filters</button>
        </div>
      )}
    </div>
  ));

  FilterPanel.displayName = 'FilterPanel';

  const CollapsibleSection = ({ title, icon, isExpanded, onToggle, children }: { title: string; icon: React.ReactNode; isExpanded: boolean; onToggle: () => void; children: React.ReactNode; }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-stone-200 dark:border-neutral-700 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-stone-50 dark:hover:bg-neutral-700 transition-colors">
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isExpanded && (<div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-stone-200 dark:border-neutral-700">{children}</div>)}
    </div>
  );

  const ProductModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 z-50">
        {/* Mobile: Full screen */}
        <div className="lg:hidden bg-white dark:bg-neutral-900 h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-stone-200 dark:border-neutral-800 p-4">
            <div className="flex items-center gap-4">
              <button onClick={closeProductModal} className="p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate">{selectedProduct.title || selectedProduct.name}</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">By {selectedProduct.artistName}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <ProductImage product={selectedProduct} className="w-full h-full object-cover" />
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">${Number(selectedProduct.price).toFixed(2)}</div>
                <p className="text-neutral-600 dark:text-neutral-400">Handcrafted with care</p>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl transition-all mb-3 flex items-center justify-center gap-3">
                <ShoppingCart className="w-6 h-6" />Add to Cart
              </button>
              <p className="text-xs text-center text-neutral-500">✨ Free shipping over $100</p>
            </div>

            <div className="bg-stone-50 dark:bg-neutral-800 p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100 text-lg">{selectedProduct.artistName}</p>
                  <p className="text-neutral-600 dark:text-neutral-400">Artist & Craftsperson</p>
                </div>
              </div>
            </div>

            {selectedProduct.shortDescription && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-stone-200 dark:border-neutral-700">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">About This Piece</h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{selectedProduct.shortDescription}</p>
              </div>
            )}

            <div className="space-y-4">
              {selectedProduct.keyFeatures && selectedProduct.keyFeatures.length > 0 && (
                <CollapsibleSection title="Key Features" icon={<Check className="w-5 h-5" />} isExpanded={expandedSections.features} onToggle={() => toggleSection('features')}>
                  <div className="space-y-3 pt-4">
                    {selectedProduct.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {selectedProduct.story && (
                <CollapsibleSection title="Artist's Story" icon={<Star className="w-5 h-5" />} isExpanded={expandedSections.story} onToggle={() => toggleSection('story')}>
                  <div className="pt-4"><p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{selectedProduct.story}</p></div>
                </CollapsibleSection>
              )}

              {(selectedProduct.materials || selectedProduct.techniques) && (
                <CollapsibleSection title="Craftsmanship" icon={<Hammer className="w-5 h-5" />} isExpanded={expandedSections.craftsmanship} onToggle={() => toggleSection('craftsmanship')}>
                  <div className="space-y-4 pt-4">
                    {selectedProduct.materials && (
                      <div className="p-4 bg-stone-50 dark:bg-neutral-700 rounded-xl">
                        <div className="flex items-center gap-2 mb-2"><Palette className="w-4 h-4 text-primary" /><span className="font-semibold text-neutral-900 dark:text-neutral-100">Materials</span></div>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{selectedProduct.materials}</p>
                      </div>
                    )}
                    {selectedProduct.techniques && (
                      <div className="p-4 bg-stone-50 dark:bg-neutral-700 rounded-xl">
                        <div className="flex items-center gap-2 mb-2"><Hammer className="w-4 h-4 text-primary" /><span className="font-semibold text-neutral-900 dark:text-neutral-100">Techniques</span></div>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{selectedProduct.techniques}</p>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              )}
            </div>

            <div className="h-8"></div>
          </div>
        </div>

        {/* Desktop: Centered modal with transparent blurred background */}
        <div className="hidden lg:flex items-center justify-center min-h-screen p-4 bg-black/50 backdrop-blur-md">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="relative p-6 border-b border-stone-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/50">
              <button onClick={closeProductModal} className="absolute top-4 right-4 p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="pr-16">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{selectedProduct.title || selectedProduct.name}</h1>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{selectedProduct.category} • By {selectedProduct.artistName}</div>
              </div>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  <ProductImage product={selectedProduct} className="w-full h-full object-cover" />
                </div>

                {selectedProduct.shortDescription && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">About This Piece</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{selectedProduct.shortDescription}</p>
                  </div>
                )}

                {selectedProduct.keyFeatures && selectedProduct.keyFeatures.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">Key Features</h3>
                    <div className="space-y-2">
                      {selectedProduct.keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.story && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">Artist's Story</h3>
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl">
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{selectedProduct.story}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-80 border-l border-stone-200 dark:border-neutral-800 p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">${Number(selectedProduct.price).toFixed(2)}</div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">Handcrafted with care</p>
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl transition-all mb-3 flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />Add to Cart
                    </button>
                    <p className="text-xs text-neutral-500">✨ Free shipping over $100</p>
                  </div>

                  <div className="bg-stone-50 dark:bg-neutral-800 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
                      <div>
                        <p className="font-semibold">{selectedProduct.artistName}</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Artist</p>
                      </div>
                    </div>
                  </div>

                  {(selectedProduct.materials || selectedProduct.techniques) && (
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-stone-200 dark:border-neutral-700">
                      <h4 className="font-semibold mb-3 flex items-center gap-2"><Hammer className="w-4 h-4 text-primary" />Craftsmanship</h4>
                      <div className="space-y-3 text-sm">
                        {selectedProduct.materials && (<div><span className="font-medium">Materials:</span><p className="text-neutral-600 dark:text-neutral-400">{selectedProduct.materials}</p></div>)}
                        {selectedProduct.techniques && (<div><span className="font-medium">Techniques:</span><p className="text-neutral-600 dark:text-neutral-400">{selectedProduct.techniques}</p></div>)}
                      </div>
                    </div>
                  )}

                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-stone-200 dark:border-neutral-700">
                      <h4 className="font-semibold mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-primary" />Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans min-h-screen bg-stone-50 dark:bg-neutral-950">
      <Header />
      
      <div className="pt-20">
        <section className="bg-gradient-to-br from-white to-stone-100 dark:from-neutral-950 dark:to-neutral-900 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Artisan <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Marketplace</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Discover unique, handcrafted treasures from talented artisans worldwide
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex gap-8">
            
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-stone-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-primary" />Filters</h2>
                      <button onClick={clearFilters} className="text-sm text-primary hover:text-primary/80 font-semibold">Clear All</button>
                    </div>
                  </div>
                  <div className="h-[calc(100vh-280px)] overflow-y-auto p-6"><FilterPanel /></div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="lg:hidden mb-6">
                <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 px-4 py-3 rounded-xl font-semibold shadow-sm">
                  <Filter className="w-5 h-5" />Filters & Search
                </button>
              </div>

              {/* Header with View Toggle (Desktop Only) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedCategory === 'all' ? 'All Artworks' : categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-2">{products.length} {products.length === 1 ? 'artwork' : 'artworks'} found</p>
                </div>

                {/* Desktop View Toggle Only */}
                <div className="hidden lg:flex items-center bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800'}`}>
                    <Grid3X3 className="w-4 h-4" />Grid
                  </button>
                  <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800'}`}>
                    <List className="w-4 h-4" />List
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl animate-pulse border border-stone-200 dark:border-neutral-800">
                      <div className="aspect-square bg-stone-200 dark:bg-neutral-700 rounded-t-2xl"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-stone-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-3 bg-stone-200 dark:bg-neutral-700 rounded w-2/3"></div>
                        <div className="h-10 bg-stone-200 dark:bg-neutral-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24">
                  <Package className="w-20 h-20 mx-auto text-neutral-400 mb-6" />
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">No artworks found</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">Try adjusting your search terms or filters to discover amazing handcrafted pieces.</p>
                  <button onClick={clearFilters} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg">View All Artworks</button>
                </div>
              ) : (
                <>
                  {/* Products Display - Mobile always Grid, Desktop can switch */}
                  {viewMode === 'grid' || window.innerWidth < 1024 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (<GridCard key={product.id} product={product} />))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {products.map((product) => (<ListCard key={product.id} product={product} />))}
                    </div>
                  )}

                  {hasMore && (
                    <div className="text-center mt-16">
                      <button onClick={() => fetchProducts(false)} disabled={isLoadingMore} className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-4 px-10 rounded-2xl transition-all flex items-center gap-3 mx-auto shadow-lg">
                        {isLoadingMore ? (<><Loader2 className="w-5 h-5 animate-spin" />Loading more artworks...</>) : (<><Sparkles className="w-5 h-5" />Load More Artworks</>)}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-neutral-900 rounded-t-3xl max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-stone-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Filters & Search</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(85vh-80px)]"><FilterPanel isMobile /></div>
          </div>
        </div>
      )}

      {showProductModal && <ProductModal />}
      <Footer />
    </div>
  );
}
