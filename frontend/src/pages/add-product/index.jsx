import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import ImageUploadSection from './components/ImageUploadSection';
import CategorySelector from './components/CategorySelector';
import ProductForm from './components/ProductForm';
import DraftManager from './components/DraftManager';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: '',
    acceptOffers: false,
    localPickup: false,
    shippingAvailable: false
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);

  // Auto-save draft functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData?.title || formData?.description || images?.length > 0) {
        // Auto-save logic would go here
        console.log('Auto-saving draft...');
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [formData, images]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Product title is required';
    } else if (formData?.title?.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Product description is required';
    } else if (formData?.description?.length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    }

    if (!formData?.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData?.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData?.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Please enter a valid price';
      } else if (price > 10000) {
        newErrors.price = 'Price cannot exceed $10,000';
      }
    }

    if (!formData?.condition) {
      newErrors.condition = 'Please select the item condition';
    }

    if (images?.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    if (!formData?.localPickup && !formData?.shippingAvailable) {
      newErrors.delivery = 'Please select at least one delivery option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
    if (errors?.images && newImages?.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would submit to API
      console.log('Submitting product:', {
        ...formData,
        images: images?.map(img => img?.file)
      });

      // Success - redirect to my listings
      navigate('/my-listings', { 
        state: { 
          message: 'Product listed successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error submitting product:', error);
      setErrors({ submit: 'Failed to publish listing. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    
    try {
      // Simulate saving draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving draft:', { ...formData, images });
      
      // Show success message
      setErrors({ draft: '' });
    } catch (error) {
      console.error('Error saving draft:', error);
      setErrors({ draft: 'Failed to save draft. Please try again.' });
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleLoadDraft = (draft) => {
    setFormData({
      title: draft?.title || '',
      description: draft?.description || '',
      category: draft?.category || '',
      price: draft?.price || '',
      condition: draft?.condition || '',
      acceptOffers: draft?.acceptOffers || false,
      localPickup: draft?.localPickup || false,
      shippingAvailable: draft?.shippingAvailable || false
    });
    
    // In real app, would also load saved images
    setImages([]);
    setErrors({});
  };

  const handleDeleteDraft = (draftId) => {
    console.log('Deleting draft:', draftId);
    // In real app, would delete from storage/API
  };

  const customBreadcrumbs = [
    { label: 'Home', path: '/product-feed', icon: 'Home' },
    { label: 'Add Product', path: '/add-product', icon: 'Plus', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <BreadcrumbNavigation customBreadcrumbs={customBreadcrumbs} />
            
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Plus" size={24} className="text-primary" />
                </div>
                <span>Add New Product</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Create a listing for your second-hand item and help it find a new home
              </p>
            </div>
          </div>

          {/* Draft Manager */}
          <DraftManager
            onLoadDraft={handleLoadDraft}
            onDeleteDraft={handleDeleteDraft}
          />

          {/* Main Form */}
          <div className="bg-card rounded-lg border border-border shadow-soft">
            <div className="p-6 sm:p-8">
              {/* Form Errors */}
              {errors?.submit && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} className="text-error" />
                    <p className="text-sm text-error font-medium">{errors?.submit}</p>
                  </div>
                </div>
              )}

              {errors?.delivery && (
                <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={20} className="text-warning" />
                    <p className="text-sm text-warning font-medium">{errors?.delivery}</p>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {/* Image Upload Section */}
                <ImageUploadSection
                  images={images}
                  onImagesChange={handleImagesChange}
                  error={errors?.images}
                />

                {/* Category Selection */}
                <CategorySelector
                  value={formData?.category}
                  onChange={(value) => handleFormDataChange('category', value)}
                  error={errors?.category}
                />

                {/* Product Form */}
                <ProductForm
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                  errors={errors}
                  onSubmit={handleSubmit}
                  onSaveDraft={handleSaveDraft}
                  isSubmitting={isSubmitting}
                  isDraftSaving={isDraftSaving}
                />
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-muted/30 rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="HelpCircle" size={20} className="text-primary" />
              <span>Need Help?</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">Listing Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use clear, well-lit photos from multiple angles</li>
                  <li>• Write detailed descriptions including flaws</li>
                  <li>• Research similar items to price competitively</li>
                  <li>• Respond quickly to buyer inquiries</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground mb-2">Safety Guidelines</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Meet buyers in public places for exchanges</li>
                  <li>• Don't share personal information unnecessarily</li>
                  <li>• Use secure payment methods</li>
                  <li>• Trust your instincts about potential buyers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;