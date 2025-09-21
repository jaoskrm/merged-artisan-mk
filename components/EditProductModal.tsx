// components/EditProductModal.tsx
'use client'

import { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  priceMax?: number;
  status: 'active' | 'draft' | 'sold';
  title?: string;
  subtitle?: string;
  shortDescription?: string;
  keyFeatures?: string[];
  specifications?: Record<string, string>;
  highlights?: string[];
  tags?: string[];
  story?: string;
  originalDescription?: string;
  materials?: string;
  techniques?: string;
  targetAudience?: string;
  additionalDetails?: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  categories: string[];
}

export default function EditProductModal({
  isOpen,
  product,
  onClose,
  categories
}: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    priceMax: '',
    title: '',
    subtitle: '',
    shortDescription: '',
    keyFeatures: [] as string[],
    specifications: {} as Record<string, string>,
    highlights: [] as string[],
    tags: [] as string[],
    story: '',
    originalDescription: '',
    materials: '',
    techniques: '',
    targetAudience: '',
    additionalDetails: ''
  });

  const [newFeature, setNewFeature] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        priceMax: product.priceMax?.toString() || '',
        title: product.title || '',
        subtitle: product.subtitle || '',
        shortDescription: product.shortDescription || '',
        keyFeatures: product.keyFeatures || [],
        specifications: product.specifications || {},
        highlights: product.highlights || [],
        tags: product.tags || [],
        story: product.story || '',
        originalDescription: product.originalDescription || '',
        materials: product.materials || '',
        techniques: product.techniques || '',
        targetAudience: product.targetAudience || '',
        additionalDetails: product.additionalDetails || ''
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSave = async () => {
    const updatedProduct: Product = {
      ...product,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      priceMax: formData.priceMax ? parseFloat(formData.priceMax) : undefined,
      title: formData.title,
      subtitle: formData.subtitle,
      shortDescription: formData.shortDescription,
      keyFeatures: formData.keyFeatures,
      specifications: formData.specifications,
      highlights: formData.highlights,
      tags: formData.tags,
      story: formData.story,
      originalDescription: formData.originalDescription,
      materials: formData.materials,
      techniques: formData.techniques,
      targetAudience: formData.targetAudience,
      additionalDetails: formData.additionalDetails
    };

  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Mobile: Full screen */}
      <div className="lg:hidden bg-white dark:bg-neutral-900 h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-stone-200 dark:border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Edit Listing
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Enhanced Content</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Story</label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Key Features</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a key feature"
                className="flex-1 px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <button
                onClick={addFeature}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {formData.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-neutral-800 rounded-lg">
                  <span className="flex-1 text-neutral-700 dark:text-neutral-300">{feature}</span>
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Highlights</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add a highlight"
                className="flex-1 px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
              />
              <button
                onClick={addHighlight}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-neutral-800 rounded-lg">
                  <span className="flex-1 text-neutral-700 dark:text-neutral-300">{highlight}</span>
                  <button
                    onClick={() => removeHighlight(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Tags</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  <span>#{tag}</span>
                  <button
                    onClick={() => removeTag(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Specifications</h3>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Property name"
                  className="px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value"
                  className="px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <button
                onClick={addSpecification}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
              >
                Add Specification
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{key}:</span>
                    <span className="ml-2 text-neutral-600 dark:text-neutral-400">{value}</span>
                  </div>
                  <button
                    onClick={() => removeSpecification(key)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Original Form Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Additional Details</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Original Description</label>
              <textarea
                name="originalDescription"
                value={formData.originalDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Materials</label>
                <input
                  type="text"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-stone-200 dark:border-neutral-700">
            <button
              onClick={onClose}
              className="flex-1 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold py-4 px-6 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.category || !formData.price}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Desktop version would be similar but with better layout */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/50">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Edit Listing</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Short Description</label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Story</label>
                    <textarea
                      name="story"
                      value={formData.story}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Enhanced Content */}
              <div className="space-y-6">
                {/* Key Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Key Features</h3>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a key feature"
                      className="flex-1 px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <button
                      onClick={addFeature}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-neutral-800 rounded-lg">
                        <span className="flex-1 text-neutral-700 dark:text-neutral-300 text-sm">{feature}</span>
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Highlights</h3>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add a highlight"
                      className="flex-1 px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                    />
                    <button
                      onClick={addHighlight}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-neutral-800 rounded-lg">
                        <span className="flex-1 text-neutral-700 dark:text-neutral-300 text-sm">{highlight}</span>
                        <button
                          onClick={() => removeHighlight(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Tags</h3>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1 px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        <span>#{tag}</span>
                        <button
                          onClick={() => removeTag(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Specifications</h3>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        placeholder="Property name"
                        className="px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                      />
                      <input
                        type="text"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        placeholder="Value"
                        className="px-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                      />
                    </div>
                    <button
                      onClick={addSpecification}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm"
                    >
                      Add Specification
                    </button>
                  </div>

                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-neutral-800 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{key}:</span>
                          <span className="ml-2 text-neutral-600 dark:text-neutral-400 text-sm">{value}</span>
                        </div>
                        <button
                          onClick={() => removeSpecification(key)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 p-6 border-t border-stone-200 dark:border-neutral-700 bg-stone-50/50 dark:bg-neutral-800/50">
            <button
              onClick={onClose}
              className="flex-1 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.category || !formData.price}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
