import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditListingModal = ({ listing, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing & Accessories' },
    { value: 'books', label: 'Books & Media' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'other', label: 'Other' }
  ];

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'sold', label: 'Sold' }
  ];

  useEffect(() => {
    if (listing && isOpen) {
      setFormData({
        title: listing?.title || '',
        description: listing?.description || '',
        price: listing?.price?.toString() || '',
        category: listing?.category || '',
        condition: listing?.condition || '',
        status: listing?.status || ''
      });
      setErrors({});
    }
  }, [listing, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData?.title?.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData?.description?.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData?.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData?.price) || parseFloat(formData?.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.condition) {
      newErrors.condition = 'Condition is required';
    }

    if (!formData?.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const updatedListing = {
        ...listing,
        ...formData,
        price: parseFloat(formData?.price),
        updatedAt: new Date()?.toISOString()
      };
      
      await onSave(updatedListing);
      onClose();
    } catch (error) {
      console.error('Error updating listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-prominent max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Edit2" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Edit Listing</h2>
              <p className="text-sm text-muted-foreground">Update your product information</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <Input
                label="Product Title"
                type="text"
                value={formData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                placeholder="Enter product title"
                error={errors?.title}
                required
                maxLength={100}
              />
            </div>

            {/* Price */}
            <div>
              <Input
                label="Price ($)"
                type="number"
                value={formData?.price}
                onChange={(e) => handleInputChange('price', e?.target?.value)}
                placeholder="0.00"
                error={errors?.price}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Category */}
            <div>
              <Select
                label="Category"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                placeholder="Select category"
                error={errors?.category}
                required
              />
            </div>

            {/* Condition */}
            <div>
              <Select
                label="Condition"
                options={conditionOptions}
                value={formData?.condition}
                onChange={(value) => handleInputChange('condition', value)}
                placeholder="Select condition"
                error={errors?.condition}
                required
              />
            </div>

            {/* Status */}
            <div>
              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
                placeholder="Select status"
                error={errors?.status}
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Input
                label="Description"
                type="text"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                placeholder="Describe your product in detail"
                error={errors?.description}
                required
                maxLength={500}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;