// pages/for-artists.tsx (Updated main component)
'use client'

import { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Eye, Heart, Edit, Package, PlusCircle, Trash2, ExternalLink
} from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';
import CreateListingModal from '../../../components/CreateListingModal';
import EditProductModal from '../../../components/EditProductModal';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  priceMax?: number;
  status: 'active' | 'draft' | 'sold';
  likes: number;
  saves: number;
  views: number;
  primaryImage?: string;
  images?: string[];
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
  // Enhanced fields
  title?: string;
  subtitle?: string;
  shortDescription?: string;
  keyFeatures?: string[];
  specifications?: Record<string, string>;
  highlights?: string[];
  tags?: string[];
  story?: string;
  // Form data
  originalDescription?: string;
  materials?: string;
  techniques?: string;
  targetAudience?: string;
  additionalDetails?: string;
}

interface FormData {
  name: string;
  category: string;
  price: string;
  priceMax: string;
  description: string;
  materials: string;
  techniques: string;
  targetAudience: string;
  additionalDetails: string;
}

interface EnhancedProduct {
  title: string;
  subtitle: string;
  shortDescription: string;
  keyFeatures: string[];
  specifications: Record<string, string>;
  highlights: string[];
  tags: string[];
  story: string;
}

const categories = [
  'Pottery & Ceramics', 'Jewelry & Accessories', 'Textiles & Fabrics',
  'Woodwork & Furniture', 'Metalwork & Sculpture', 'Paintings & Art',
  'Photography', 'Digital Art'
];

const initialForm: FormData = {
  name: '', category: '', price: '', priceMax: '', description: '',
  materials: '', techniques: '', targetAudience: '', additionalDetails: ''
};

const ProductImage = memo(({ product, className = "" }: { product: Product; className?: string }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!product.primaryImage || imageError) {
    return (
      <div className={`bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center ${className}`}>
        <Package className="w-12 h-12 text-white" />
      </div>
    );
  }

  return (
    <img 
      src={product.primaryImage} 
      alt={product.title || product.name}
      className={className}
      onError={() => setImageError(true)}
    />
  );
});

ProductImage.displayName = 'ProductImage';

export default function ForArtists() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [enhancedProduct, setEnhancedProduct] = useState<EnhancedProduct | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Prevent body scroll when modals are open
  useEffect(() => {
    document.body.style.overflow = (showCreateModal || showEditModal) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showCreateModal, showEditModal]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      showMessage('error', 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const generateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-product-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInfo: formData })
      });

      const data = await response.json();
      if (data.success) {
        setEnhancedProduct(data.enhancedProduct);
      } else {
        showMessage('error', data.error || 'AI generation failed');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProduct = async (status: 'draft' | 'active' = 'draft') => {
    if (!enhancedProduct) return;

    try {
      const token = localStorage.getItem('authToken');
      const productData = {
        ...formData,
        ...enhancedProduct,
        status,
        primaryImage: '/api/placeholder/300/300'
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        showMessage('success', `Product ${status === 'active' ? 'published' : 'saved as draft'}!`);
        resetCreateForm();
        fetchProducts();
      } else {
        showMessage('error', 'Failed to save product');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });

      if (response.ok) {
        showMessage('success', 'Product updated successfully!');
        setShowEditModal(false);
        setSelectedProduct(null);
        fetchProducts();
      } else {
        showMessage('error', 'Failed to update product');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        showMessage('success', 'Product deleted successfully!');
        fetchProducts();
      } else {
        showMessage('error', 'Failed to delete product');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    }
  };

  const publishProduct = async (product: Product) => {
    const updatedProduct: Product = {
      ...product, 
      status: 'active',
      updatedAt: new Date().toISOString()
    };
    await updateProduct(updatedProduct);
  };

  const resetCreateForm = () => {
    setFormData(initialForm);
    setShowCreateModal(false);
    setEnhancedProduct(null);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  return (
    <ProtectedRoute>
      <div className="font-sans min-h-screen bg-background">
        <Header />
        
        <div className="pt-20">
          {/* Header Section */}
          <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Artist Studio
                  </h1>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400">
                    Create and manage your professional listings with AI assistance
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Listing
                </button>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Message Display */}
            {message.text && (
              <div className={`p-4 rounded-xl mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Products Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  My Listings ({products.length})
                </h2>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl p-6 animate-pulse">
                      <div className="aspect-square bg-stone-200 dark:bg-neutral-700 rounded-xl mb-4"></div>
                      <div className="h-4 bg-stone-200 dark:bg-neutral-700 rounded mb-2"></div>
                      <div className="h-3 bg-stone-200 dark:bg-neutral-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    No listings yet
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Create your first AI-enhanced listing
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 mx-auto"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-stone-200/60 dark:border-neutral-800/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 relative overflow-hidden group">
                        <ProductImage product={product} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-2">
                              {product.title || product.name}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {product.category}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ml-2 ${
                            product.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        
                        {product.shortDescription && (
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-2">
                            {product.shortDescription}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            ${product.price}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {product.likes || 0}
                          </div>
                          <div className="text-xs">
                            Updated {new Date(product.updatedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="flex-1 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium py-2 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          
                          {product.status === 'draft' ? (
                            <button 
                              onClick={() => publishProduct(product)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Publish
                            </button>
                          ) : (
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Modal */}
        <CreateListingModal
          isOpen={showCreateModal}
          onClose={resetCreateForm}
          onSave={saveProduct}
          formData={formData}
          setFormData={setFormData}
          enhancedProduct={enhancedProduct}
          setEnhancedProduct={setEnhancedProduct}
          isGenerating={isGenerating}
          onGenerateAI={generateAI}
          categories={categories}
        />

        {/* Edit Modal */}
        <EditProductModal
          isOpen={showEditModal}
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          categories={categories}
        />

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
