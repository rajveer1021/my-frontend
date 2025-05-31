import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PRODUCT_CATEGORIES, PRODUCT_STATUS_OPTIONS } from '../../utils/constants';

export const ProductForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    stock: '',
    tags: [],
    image: '',
    ...initialData
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        categories: [formData.category, formData.subCategory].filter(Boolean)
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const subCategories = {
    Electronics: ['Computers', 'Mobile Phones', 'Tablets', 'Audio', 'Gaming'],
    Computers: ['Laptops', 'Desktops', 'Accessories', 'Components'],
    IoT: ['Sensors', 'Controllers', 'Modules', 'Gateways'],
    Infrastructure: ['Networking', 'Security', 'Storage'],
    'Cable Management': ['Cables', 'Organizers', 'Accessories'],
    Tools: ['Hand Tools', 'Power Tools', 'Measuring'],
    'Industrial Equipment': ['Machinery', 'Safety', 'Automation']
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Category and Sub Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  handleInputChange('category', e.target.value);
                  handleInputChange('subCategory', ''); // Reset subcategory
                }}
                className={`w-full h-12 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    className={`h-12 pl-8 ${errors.price ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                  className={`h-12 ${errors.stock ? 'border-red-500' : ''}`}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Right Column - Image Upload Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images (Coming Soon)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Image upload functionality will be available soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-32 h-12"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-32 h-12 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};
