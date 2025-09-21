'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface Product {
  id: number
  name: string
  category: string
  price: number
  status: 'active' | 'draft' | 'sold'
  views: number
  likes: number
  image: string
  dateAdded: string
  enhancedData?: EnhancedProduct
}

interface EnhancedProduct {
  title: string
  subtitle: string
  shortDescription: string
  keyFeatures: string[]
  specifications: {
    materials: string
    dimensions: string
    technique: string
    style: string
    care: string
  }
  highlights: string[]
  tags: string[]
  story: string
}

interface ProductFormData {
  name: string
  category: string
  priceMin: string
  priceMax: string
  description: string
  materials: string
  techniques: string
  targetAudience: string
  additionalDetails: string
}

export default function ForArtists() {
  const [products, setProducts] = useState<Product[]>([])
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '', category: '', priceMin: '', priceMax: '', description: '',
    materials: '', techniques: '', targetAudience: '', additionalDetails: ''
  })
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [enhancedProduct, setEnhancedProduct] = useState<EnhancedProduct | null>(null)
  const [editableProduct, setEditableProduct] = useState<EnhancedProduct | null>(null)
  const router = useRouter()

  const categories = [
    'Pottery & Ceramics', 'Jewelry & Accessories', 'Textiles & Fabrics',
    'Woodwork & Furniture', 'Metalwork & Sculpture', 'Paintings & Art',
    'Photography', 'Digital Art'
  ]

  // Sample products data
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: 'Handcrafted Ceramic Vase',
        category: 'Pottery & Ceramics',
        price: 89.99,
        status: 'active',
        views: 245,
        likes: 18,
        image: '/api/placeholder/300/300',
        dateAdded: '2025-09-15',
        enhancedData: {
          title: 'Handcrafted Ceramic Vase with Traditional Patterns',
          subtitle: 'Elegant Hand-Thrown Pottery for Luxe Home Decor',
          shortDescription: 'Beautiful handcrafted ceramic vase featuring traditional patterns, perfect for any home decor.',
          keyFeatures: ['Hand-thrown pottery', 'Traditional glazing', 'Unique patterns', 'Durable ceramic'],
          specifications: {
            materials: 'High-quality ceramic',
            dimensions: '12" H x 6" W',
            technique: 'Hand-thrown',
            style: 'Traditional',
            care: 'Hand wash only'
          },
          highlights: ['One-of-a-kind design', 'Artisan crafted', 'Perfect gift'],
          tags: ['ceramic', 'handmade', 'pottery', 'vase', 'traditional'],
          story: 'This vase represents hours of careful craftsmanship, inspired by traditional pottery techniques passed down through generations.'
        }
      }
    ]
    setProducts(sampleProducts)
  }, [])

  const generateAIDescription = async (regenerateSection?: string) => {
    setIsGenerating(true)
    if (regenerateSection) setRegeneratingSection(regenerateSection)
    setError('')

    // Debug log
    console.log('Generating with data:', formData)

    try {
      const response = await fetch('/api/generate-product-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productInfo: formData,
          regenerateSection
        }),
      })

      const data = await response.json()
      console.log('AI Response:', data) // Debug log

      if (data.success) {
        if (regenerateSection && editableProduct) {
          // Update specific section
          setEditableProduct({
            ...editableProduct,
            [regenerateSection]: data.enhancedProduct[regenerateSection]
          })
        } else {
          setEnhancedProduct(data.enhancedProduct)
          setEditableProduct(data.enhancedProduct)
          setCurrentStep(4)
        }
      } else {
        setError(data.error || 'Failed to generate AI description')
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsGenerating(false)
      setRegeneratingSection(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditableChange = (section: string, value: string | string[] | object) => {
    if (!editableProduct) return
    
    setEditableProduct({
      ...editableProduct,
      [section]: value
    })
  }

  const handleSpecificationChange = (key: string, value: string) => {
    if (!editableProduct) return
    
    setEditableProduct({
      ...editableProduct,
      specifications: {
        ...editableProduct.specifications,
        [key]: value
      }
    })
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: return !!(formData.name && formData.category && formData.priceMin)
      case 2: return !!(formData.description && formData.materials)
      default: return true
    }
  }

  const nextStep = () => {
    if (currentStep < 4 && validateStep(currentStep)) {
      if (currentStep === 2) {
        generateAIDescription()
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '', category: '', priceMin: '', priceMax: '', description: '',
      materials: '', techniques: '', targetAudience: '', additionalDetails: ''
    })
    setShowAddProduct(false)
    setCurrentStep(1)
    setEnhancedProduct(null)
    setEditableProduct(null)
    setError('')
  }

  const handleSubmitProduct = async () => {
    if (!editableProduct) return

    const newProduct: Product = {
      id: Date.now(),
      name: editableProduct.title,
      category: formData.category,
      price: parseFloat(formData.priceMin),
      status: 'draft',
      views: 0,
      likes: 0,
      image: '/api/placeholder/300/300',
      dateAdded: new Date().toISOString().split('T')[0],
      enhancedData: editableProduct
    }

    setProducts(prev => [newProduct, ...prev])
    setSuccess('Product created successfully!')
    resetForm()
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <ProtectedRoute>
      <div className="font-sans min-h-screen bg-background">
        <Header />
        
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  Artist Studio
                </h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-400">
                  Create professional listings with AI assistance
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm()
                  setShowAddProduct(true)
                }}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Create Listing
              </button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Messages */}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-4 rounded-2xl mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-2xl mb-6">
              {error}
            </div>
          )}

          {/* AI Product Creation Modal */}
          {showAddProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 max-w-6xl w-full mx-6 max-h-[90vh] overflow-y-auto border border-stone-200/60 dark:border-neutral-800/60">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    AI Product Listing Creator
                  </h2>
                  <button onClick={resetForm} className="p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                    <svg className="w-6 h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Step {currentStep} of 4</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{Math.round((currentStep/4) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-neutral-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{width: `${(currentStep/4) * 100}%`}}></div>
                  </div>
                </div>

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Basic Product Information</h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Starting Price *
                        </label>
                        <input
                          type="number"
                          name="priceMin"
                          value={formData.priceMin}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                          placeholder="Starting price"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Product Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Product Details</h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Product Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                        placeholder="Describe your product..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Materials Used *
                        </label>
                        <input
                          type="text"
                          name="materials"
                          value={formData.materials}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                          placeholder="e.g., Silver, Crystal, Gold (separate with commas)"
                          required
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Separate multiple materials with commas
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Techniques
                        </label>
                        <input
                          type="text"
                          name="techniques"
                          value={formData.techniques}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                          placeholder="e.g., Hand-thrown, Carved"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                        placeholder="e.g., Home decorators, Gift buyers"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Additional Details
                      </label>
                      <textarea
                        name="additionalDetails"
                        value={formData.additionalDetails}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                        placeholder="Any special details, inspiration, or story..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: AI Generation */}
                {currentStep === 3 && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                      {isGenerating ? (
                        <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {isGenerating ? 'AI is creating your listing...' : 'Ready for AI Enhancement'}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                      {isGenerating ? 'Creating professional product sections...' : 'Click generate to create your listing'}
                    </p>
                    
                    {!isGenerating && (
                      <button
                        onClick={() => generateAIDescription()}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                      >
                        Generate Listing
                      </button>
                    )}
                  </div>
                )}

                {/* Step 4: Modular Product Preview & Editing */}
                {currentStep === 4 && editableProduct && (
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">Review & Edit Your Listing</h3>
                    
                    {/* Product Title */}
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200">Product Title</h4>
                        <button
                          onClick={() => generateAIDescription('title')}
                          disabled={regeneratingSection === 'title'}
                          className="text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 disabled:opacity-50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          {regeneratingSection === 'title' ? (
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                          Regenerate
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editableProduct.title}
                        onChange={(e) => handleEditableChange('title', e.target.value)}
                        className="w-full bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-700/50 rounded-xl px-4 py-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                        Subtitle: {editableProduct.subtitle}
                      </p>
                    </div>

                    {/* Short Description */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-emerald-900 dark:text-emerald-200">Product Summary</h4>
                        <button
                          onClick={() => generateAIDescription('shortDescription')}
                          disabled={regeneratingSection === 'shortDescription'}
                          className="text-sm bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/60 disabled:opacity-50 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          {regeneratingSection === 'shortDescription' ? (
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                          Regenerate
                        </button>
                      </div>
                      <textarea
                        value={editableProduct.shortDescription}
                        onChange={(e) => handleEditableChange('shortDescription', e.target.value)}
                        rows={3}
                        className="w-full bg-white dark:bg-neutral-800 border border-emerald-200 dark:border-emerald-700/50 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Key Features */}
                      <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-200">Key Features</h4>
                          <button
                            onClick={() => generateAIDescription('keyFeatures')}
                            disabled={regeneratingSection === 'keyFeatures'}
                            className="text-sm bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-800/60 disabled:opacity-50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {regeneratingSection === 'keyFeatures' ? (
                              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            )}
                            Regenerate
                          </button>
                        </div>
                        <div className="space-y-2">
                          {editableProduct.keyFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => {
                                  const newFeatures = [...editableProduct.keyFeatures]
                                  newFeatures[index] = e.target.value
                                  handleEditableChange('keyFeatures', newFeatures)
                                }}
                                className="flex-1 bg-white dark:bg-neutral-800 border border-purple-200 dark:border-purple-700/50 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-amber-900 dark:text-amber-200">Unique Highlights</h4>
                          <button
                            onClick={() => generateAIDescription('highlights')}
                            disabled={regeneratingSection === 'highlights'}
                            className="text-sm bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-800/60 disabled:opacity-50 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {regeneratingSection === 'highlights' ? (
                              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            )}
                            Regenerate
                          </button>
                        </div>
                        <div className="space-y-2">
                          {editableProduct.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                              </svg>
                              <input
                                type="text"
                                value={highlight}
                                onChange={(e) => {
                                  const newHighlights = [...editableProduct.highlights]
                                  newHighlights[index] = e.target.value
                                  handleEditableChange('highlights', newHighlights)
                                }}
                                className="flex-1 bg-white dark:bg-neutral-800 border border-amber-200 dark:border-amber-700/50 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Specifications */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-700/40 p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-200">Product Specifications</h4>
                        <button
                          onClick={() => generateAIDescription('specifications')}
                          disabled={regeneratingSection === 'specifications'}
                          className="text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 disabled:opacity-50 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          {regeneratingSection === 'specifications' ? (
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                          Regenerate
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(editableProduct.specifications).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 capitalize">
                              {key}
                            </label>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleSpecificationChange(key, e.target.value)}
                              className="w-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags and Story */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Tags */}
                      <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-indigo-900 dark:text-indigo-200">Search Tags</h4>
                          <button
                            onClick={() => generateAIDescription('tags')}
                            disabled={regeneratingSection === 'tags'}
                            className="text-sm bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-800/60 disabled:opacity-50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {regeneratingSection === 'tags' ? (
                              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            )}
                            Regenerate
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editableProduct.tags.map((tag, index) => (
                            <input
                              key={index}
                              type="text"
                              value={tag}
                              onChange={(e) => {
                                const newTags = [...editableProduct.tags]
                                newTags[index] = e.target.value
                                handleEditableChange('tags', newTags)
                              }}
                              className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm border border-indigo-200 dark:border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Artisan Story */}
                      <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-rose-900 dark:text-rose-200">Artisan Story</h4>
                          <button
                            onClick={() => generateAIDescription('story')}
                            disabled={regeneratingSection === 'story'}
                            className="text-sm bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-800/60 disabled:opacity-50 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {regeneratingSection === 'story' ? (
                              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            )}
                            Regenerate
                          </button>
                        </div>
                        <textarea
                          value={editableProduct.story}
                          onChange={(e) => handleEditableChange('story', e.target.value)}
                          rows={4}
                          className="w-full bg-white dark:bg-neutral-800 border border-rose-200 dark:border-rose-700/50 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        />
                      </div>

                    </div>

                    {/* Final Actions */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 p-6 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-200 mb-2">Ready to Publish?</h4>
                          <p className="text-sm text-emerald-700 dark:text-emerald-300">Your professional listing is ready to go live!</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={resetForm}
                            className="px-6 py-3 bg-white dark:bg-neutral-700 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 rounded-xl font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                          >
                            Start Over
                          </button>
                          <button
                            onClick={handleSubmitProduct}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                            Publish Listing
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex justify-between pt-6 border-t border-stone-200 dark:border-neutral-700 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                        currentStep === 1
                          ? 'bg-stone-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                          : 'bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                        validateStep(currentStep)
                          ? 'bg-primary hover:bg-primary/90 text-white'
                          : 'bg-stone-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      {currentStep === 2 ? 'Generate with AI' : 'Next Step'}
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                My Listings ({products.length})
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  No listings yet
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Create your first AI-enhanced listing
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-stone-200/60 dark:border-neutral-800/60 hover:shadow-lg transition-all">
                    <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
                      <span className="text-4xl opacity-30">🎨</span>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {product.category}
                      </p>
                      
                      {product.enhancedData && (
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-3">
                          {product.enhancedData.shortDescription}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                          ${product.price}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          product.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {product.status}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => router.push(`/product/${product.id}?artist=true`)}
                          className="flex-1 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold py-2 px-4 rounded-xl transition-all text-sm"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => router.push(`/product/${product.id}?artist=true`)}
                          className="p-2 text-neutral-600 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
