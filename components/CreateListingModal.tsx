// components/CreateListingModal.tsx
'use client'

import { useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Sparkles, RefreshCw, Check, 
  Eye, Star, Hammer, Tag, Palette, ChevronDown, ChevronUp
} from 'lucide-react';

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

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: 'draft' | 'active') => Promise<void>;
  formData: FormData;
  setFormData: (data: FormData) => void;
  enhancedProduct: EnhancedProduct | null;
  setEnhancedProduct: (product: EnhancedProduct | null) => void;
  isGenerating: boolean;
  onGenerateAI: () => Promise<void>;
  categories: string[];
}

type ExpandedSections = {
  [key: string]: boolean;
};

const initialExpandedState = {
  features: true,
  highlights: false,
  story: false,
  specifications: false,
  tags: false
};

export default function CreateListingModal({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  enhancedProduct,
  setEnhancedProduct,
  isGenerating,
  onGenerateAI,
  categories
}: CreateListingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>(initialExpandedState);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep = () => {
    if (currentStep === 1) return formData.name && formData.category && formData.price;
    if (currentStep === 2) return formData.description && formData.materials;
    return true;
  };

  const nextStep = async () => {
    if (!validateStep()) return;
    if (currentStep === 2) {
      await onGenerateAI();
      setCurrentStep(3);
    } else if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setEnhancedProduct(null);
    setExpandedSections(initialExpandedState);
    onClose();
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const StepIndicator = ({ step, active }: { step: number; active: boolean }) => (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
      active ? 'bg-primary text-white shadow-lg' : 'bg-stone-200 dark:bg-neutral-700 text-neutral-500'
    }`}>
      {step}
    </div>
  );

  const CollapsibleSection = ({ 
    title, 
    icon, 
    isExpanded, 
    onToggle, 
    children 
  }: {
    title: string; 
    icon: React.ReactNode; 
    isExpanded: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
  }) => (
    <div className="bg-stone-50 dark:bg-neutral-800 rounded-xl border border-stone-200 dark:border-neutral-700 overflow-hidden">
      <button 
        onClick={onToggle} 
        className="w-full flex items-center justify-between p-4 hover:bg-stone-100 dark:hover:bg-neutral-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-stone-200 dark:border-neutral-700">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Mobile: Full screen */}
      <div className="lg:hidden bg-white dark:bg-neutral-900 h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-stone-200 dark:border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Create Listing
            </h2>
            <button onClick={resetForm} className="p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Progress */}
          <div className="flex items-center justify-between mt-4">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center flex-1">
                <StepIndicator step={step} active={currentStep >= step} />
                {step < 4 && <div className={`flex-1 h-1 mx-2 rounded ${currentStep > step ? 'bg-primary' : 'bg-stone-200 dark:bg-neutral-700'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="Enter your product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Starting Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Max Price</label>
                      <input
                        type="number"
                        name="priceMax"
                        value={formData.priceMax}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="Describe your product in detail..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Materials *</label>
                    <input
                      type="text"
                      name="materials"
                      value={formData.materials}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="e.g., Clay, Ceramic glaze, Natural pigments"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Techniques</label>
                    <input
                      type="text"
                      name="techniques"
                      value={formData.techniques}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="e.g., Hand-thrown, Glazed, Fired at high temperature"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Target Audience</label>
                    <input
                      type="text"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="e.g., Art collectors, Home decorators, Plant enthusiasts"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Additional Details</label>
                    <textarea
                      name="additionalDetails"
                      value={formData.additionalDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="Any additional information about your product..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                {isGenerating ? (
                  <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <Sparkles className="w-10 h-10 text-primary" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                {isGenerating ? 'Generating...' : 'AI Enhancement Complete!'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-sm">
                {isGenerating ? 'Our AI is crafting your professional listing with enhanced descriptions and features...' : 'Your listing has been enhanced with professional content!'}
              </p>
            </div>
          )}

          {currentStep === 4 && enhancedProduct && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Your Enhanced Listing</h3>
                
                {/* Title and Subtitle */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {enhancedProduct.title}
                  </h4>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                    {enhancedProduct.subtitle}
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {enhancedProduct.shortDescription}
                  </p>
                </div>

                {/* Enhanced Content Sections */}
                <div className="space-y-4">
                  {enhancedProduct.keyFeatures && enhancedProduct.keyFeatures.length > 0 && (
                    <CollapsibleSection 
                      title="Key Features" 
                      icon={<Check className="w-5 h-5" />} 
                      isExpanded={expandedSections.features} 
                      onToggle={() => toggleSection('features')}
                    >
                      <div className="space-y-3 pt-3">
                        {enhancedProduct.keyFeatures.map((feature, index) => (
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

                  {enhancedProduct.highlights && enhancedProduct.highlights.length > 0 && (
                    <CollapsibleSection 
                      title="Product Highlights" 
                      icon={<Star className="w-5 h-5" />} 
                      isExpanded={expandedSections.highlights} 
                      onToggle={() => toggleSection('highlights')}
                    >
                      <div className="space-y-2 pt-3">
                        {enhancedProduct.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Star className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                            <span className="text-neutral-700 dark:text-neutral-300">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}

                  {enhancedProduct.story && (
                    <CollapsibleSection 
                      title="Artist's Story" 
                      icon={<Eye className="w-5 h-5" />} 
                      isExpanded={expandedSections.story} 
                      onToggle={() => toggleSection('story')}
                    >
                      <div className="pt-3">
                        <div className="bg-white dark:bg-neutral-700 p-4 rounded-xl">
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                            "{enhancedProduct.story}"
                          </p>
                        </div>
                      </div>
                    </CollapsibleSection>
                  )}

                  {enhancedProduct.specifications && Object.keys(enhancedProduct.specifications).length > 0 && (
                    <CollapsibleSection 
                      title="Specifications" 
                      icon={<Hammer className="w-5 h-5" />} 
                      isExpanded={expandedSections.specifications} 
                      onToggle={() => toggleSection('specifications')}
                    >
                      <div className="pt-3 space-y-3">
                        {Object.entries(enhancedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
                            <span className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-neutral-600 dark:text-neutral-400">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}

                  {enhancedProduct.tags && enhancedProduct.tags.length > 0 && (
                    <CollapsibleSection 
                      title="Tags" 
                      icon={<Tag className="w-5 h-5" />} 
                      isExpanded={expandedSections.tags} 
                      onToggle={() => toggleSection('tags')}
                    >
                      <div className="flex flex-wrap gap-2 pt-3">
                        {enhancedProduct.tags.map((tag, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => onSave('draft')}
                    className="flex-1 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold py-4 px-6 rounded-xl transition-all"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => onSave('active')}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Publish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between pt-6 border-t border-stone-200 dark:border-neutral-700 mt-8">
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  currentStep === 1
                    ? 'bg-stone-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                    : 'bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={nextStep}
                disabled={!validateStep()}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  validateStep()
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-stone-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
                }`}
              >
                {currentStep === 2 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Centered modal */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/50">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Create Listing</h2>
            <button onClick={resetForm} className="p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Progress */}
          <div className="flex items-center justify-center py-6 bg-stone-50/30 dark:bg-neutral-800/30">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <StepIndicator step={step} active={currentStep >= step} />
                {step < 4 && <div className={`w-16 h-1 mx-4 rounded ${currentStep > step ? 'bg-primary' : 'bg-stone-200 dark:bg-neutral-700'}`} />}
              </div>
            ))}
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
            {/* Same step content as mobile but with desktop styling adjustments */}
            {currentStep === 1 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center">Basic Information</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-lg"
                        placeholder="Enter your product name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Starting Price *</label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Max Price</label>
                          <input
                            type="number"
                            name="priceMax"
                            value={formData.priceMax}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Similar desktop styling for other steps... */}
            {currentStep === 2 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center">Product Details</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="Describe your product in detail..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Materials *</label>
                        <input
                          type="text"
                          name="materials"
                          value={formData.materials}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          placeholder="e.g., Clay, Ceramic glaze"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Techniques</label>
                        <input
                          type="text"
                          name="techniques"
                          value={formData.techniques}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          placeholder="e.g., Hand-thrown, Glazed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Target Audience</label>
                      <input
                        type="text"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="e.g., Art collectors, Home decorators"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Additional Details</label>
                      <textarea
                        name="additionalDetails"
                        value={formData.additionalDetails}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="Any additional information..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-8">
                  {isGenerating ? (
                    <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                  ) : (
                    <Sparkles className="w-12 h-12 text-primary" />
                  )}
                </div>
                <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  {isGenerating ? 'Generating...' : 'AI Enhancement Complete!'}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-xl max-w-md">
                  {isGenerating ? 'Our AI is crafting your professional listing with enhanced descriptions and features...' : 'Your listing has been enhanced with professional content!'}
                </p>
              </div>
            )}

            {currentStep === 4 && enhancedProduct && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center">Review Your Enhanced Listing</h3>
                  
                  {/* Title and Subtitle */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 rounded-2xl mb-8">
                    <h4 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                      {enhancedProduct.title}
                    </h4>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
                      {enhancedProduct.subtitle}
                    </p>
                    <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {enhancedProduct.shortDescription}
                    </p>
                  </div>

                  {/* Enhanced Content in Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {enhancedProduct.keyFeatures && enhancedProduct.keyFeatures.length > 0 && (
                      <CollapsibleSection 
                        title="Key Features" 
                        icon={<Check className="w-5 h-5" />} 
                        isExpanded={expandedSections.features} 
                        onToggle={() => toggleSection('features')}
                      >
                        <div className="space-y-3 pt-3">
                          {enhancedProduct.keyFeatures.map((feature, index) => (
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

                    {enhancedProduct.highlights && enhancedProduct.highlights.length > 0 && (
                      <CollapsibleSection 
                        title="Product Highlights" 
                        icon={<Star className="w-5 h-5" />} 
                        isExpanded={expandedSections.highlights} 
                        onToggle={() => toggleSection('highlights')}
                      >
                        <div className="space-y-2 pt-3">
                          {enhancedProduct.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Star className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                              <span className="text-neutral-700 dark:text-neutral-300">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </CollapsibleSection>
                    )}

                    {enhancedProduct.specifications && Object.keys(enhancedProduct.specifications).length > 0 && (
                      <CollapsibleSection 
                        title="Specifications" 
                        icon={<Hammer className="w-5 h-5" />} 
                        isExpanded={expandedSections.specifications} 
                        onToggle={() => toggleSection('specifications')}
                      >
                        <div className="pt-3 space-y-3">
                          {Object.entries(enhancedProduct.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
                              <span className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-neutral-600 dark:text-neutral-400">{value}</span>
                            </div>
                          ))}
                        </div>
                      </CollapsibleSection>
                    )}

                    {enhancedProduct.tags && enhancedProduct.tags.length > 0 && (
                      <CollapsibleSection 
                        title="Tags" 
                        icon={<Tag className="w-5 h-5" />} 
                        isExpanded={expandedSections.tags} 
                        onToggle={() => toggleSection('tags')}
                      >
                        <div className="flex flex-wrap gap-2 pt-3">
                          {enhancedProduct.tags.map((tag, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </CollapsibleSection>
                    )}

                    {enhancedProduct.story && (
                      <div className="lg:col-span-2">
                        <CollapsibleSection 
                          title="Artist's Story" 
                          icon={<Eye className="w-5 h-5" />} 
                          isExpanded={expandedSections.story} 
                          onToggle={() => toggleSection('story')}
                        >
                          <div className="pt-3">
                            <div className="bg-white dark:bg-neutral-700 p-6 rounded-xl">
                              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg italic">
                                "{enhancedProduct.story}"
                              </p>
                            </div>
                          </div>
                        </CollapsibleSection>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-8 max-w-md mx-auto">
                    <button
                      onClick={() => onSave('draft')}
                      className="flex-1 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold py-4 px-6 rounded-xl transition-all"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => onSave('active')}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation for desktop */}
            {currentStep < 4 && (
              <div className="flex justify-between pt-8 border-t border-stone-200 dark:border-neutral-700 mt-8">
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    currentStep === 1
                      ? 'bg-stone-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                      : 'bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <button
                  onClick={nextStep}
                  disabled={!validateStep()}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    validateStep()
                      ? 'bg-primary hover:bg-primary/90 text-white'
                      : 'bg-stone-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {currentStep === 2 ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate with AI
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
