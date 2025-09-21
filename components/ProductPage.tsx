"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface ProductPageProps {
  productId: string
  isArtistView?: boolean
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  artisan: string
  rating: number
  reviews: number
  status: 'active' | 'draft' | 'sold'
  images: string[]
  tags: string[]
  enhancedData?: {
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
    story: string
  }
}

export default function ProductPage({ productId, isArtistView = false }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate fetching product data
    setTimeout(() => {
      const sampleProduct: Product = {
        id: productId,
        name: 'Handcrafted Ceramic Vase with Gold & Silver',
        price: 89.99,
        originalPrice: 120.00,
        category: 'Pottery & Ceramics',
        artisan: 'Maya Pottery Studio',
        rating: 4.8,
        reviews: 124,
        status: 'active',
        images: [
          '/api/placeholder/600/600',
          '/api/placeholder/600/601',
          '/api/placeholder/600/602',
          '/api/placeholder/600/603'
        ],
        tags: ['handmade', 'ceramic', 'luxury', 'home-decor', 'vase'],
        enhancedData: {
          title: 'Handcrafted Ceramic Vase with Gold & Silver',
          subtitle: 'Elegant Hand-Thrown Pottery for Luxe Home Decor',
          shortDescription: 'This stunning handcrafted ceramic vase celebrates a milestone as the artisan\'s 100th creation. Featuring intricate gold and silver accents on premium ceramic, it\'s perfect for elevating home decor or as a thoughtful gift.',
          keyFeatures: [
            'Hand-thrown on a potter\'s wheel for one-of-a-kind organic shapes',
            'Luxurious gold and silver metallic accents',
            'Milestone edition: Artisan\'s 100th handcrafted product', 
            'Versatile for home decoration or gifting',
            'High-quality ceramic construction for durability'
          ],
          specifications: {
            materials: 'Ceramic with gold and silver accents',
            dimensions: 'Varies (typically 12-18 inches tall)',
            technique: 'Hand-thrown',
            style: 'Contemporary artisan',
            care: 'Hand wash gently; avoid dishwasher'
          },
          highlights: [
            'Exclusive 100th product milestone',
            'Premium metallic detailing for luxury appeal',
            'Unique handmade craftsmanship',
            'Ideal for modern interiors or special gifts'
          ],
          story: 'As an artisan potter with a passion for blending traditional techniques with modern luxury, this vase marks my 100th creation—a testament to years of dedication. Inspired by natural forms and metallic elegance, each piece is thrown by hand to capture unique beauty and heirloom quality.'
        }
      }
      setProduct(sampleProduct)
      setLoading(false)
    }, 500)
  }, [productId])

  const handleAddToCart = async () => {
    setAddingToCart(true)
    // Simulate adding to cart
    setTimeout(() => {
      setAddingToCart(false)
      setCartAdded(true)
      setTimeout(() => setCartAdded(false), 2000)
    }, 1000)
  }

  const handleEditProduct = () => {
    router.push('/for-artists?edit=' + productId)
  }

  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="font-sans min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Product Not Found</h2>
            <p className="text-neutral-600 dark:text-neutral-400">This product doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="font-sans min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-stone-50 dark:bg-neutral-900 border-b border-stone-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => router.back()} className="text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">
              ← Back
            </button>
            <span className="text-neutral-400 dark:text-neutral-600">/</span>
            <span className="text-neutral-600 dark:text-neutral-400">{product.category}</span>
            <span className="text-neutral-400 dark:text-neutral-600">/</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-stone-100 dark:bg-neutral-800 rounded-3xl overflow-hidden relative">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                    Sale
                  </span>
                </div>
              )}
              {product.status !== 'active' && (
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                    product.status === 'draft' 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {product.status}
                  </span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-stone-200 dark:border-neutral-700 hover:border-primary/50'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-primary font-medium mb-1">{product.artisan}</p>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {product.enhancedData?.title || product.name}
                  </h1>
                  {product.enhancedData?.subtitle && (
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                      {product.enhancedData.subtitle}
                    </p>
                  )}
                </div>
                {isArtistView && (
                  <button
                    onClick={handleEditProduct}
                    className="p-2 text-neutral-600 hover:text-primary hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-stone-300 dark:text-neutral-600'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-neutral-600 dark:text-neutral-400 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-neutral-500 dark:text-neutral-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.enhancedData?.shortDescription && (
              <div className="bg-stone-50 dark:bg-neutral-800 p-6 rounded-2xl">
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {product.enhancedData.shortDescription}
                </p>
              </div>
            )}

            {/* Key Features */}
            {product.enhancedData?.keyFeatures && (
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.enhancedData.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart or Artist Actions */}
            {!isArtistView ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stone-200 dark:border-neutral-700 rounded-xl">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-l-xl transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-3 text-neutral-900 dark:text-neutral-100 font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-r-xl transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                      cartAdded 
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    } ${addingToCart ? 'opacity-75' : ''}`}
                  >
                    {addingToCart ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </div>
                    ) : cartAdded ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart!
                      </div>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleEditProduct}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300"
                >
                  Edit Product
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 py-3 px-4 rounded-xl font-medium transition-all">
                    View Analytics
                  </button>
                  <button className="flex-1 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 py-3 px-4 rounded-xl font-medium transition-all">
                    Share Product
                  </button>
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-stone-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Sections */}
        <div className="mt-16 space-y-12">
          
          {/* Specifications */}
          {product.enhancedData?.specifications && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Specifications</h2>
              <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(product.enhancedData.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="text-neutral-900 dark:text-neutral-100 font-medium">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Artisan Story */}
          {product.enhancedData?.story && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Artisan Story</h2>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">{product.artisan}</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {product.enhancedData.story}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Highlights */}
          {product.enhancedData?.highlights && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Why Choose This Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.enhancedData.highlights.map((highlight, index) => (
                  <div key={index} className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <p className="text-neutral-700 dark:text-neutral-300">{highlight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
