import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductForm = ({ 
  formData, 
  onFormDataChange, 
  errors, 
  onSubmit, 
  onSaveDraft, 
  isSubmitting, 
  isDraftSaving 
}) => {
  const [charCount, setCharCount] = useState(formData?.description?.length || 0);
  const maxDescriptionLength = 2000;

  const handleInputChange = (field, value) => {
    if (field === 'description') {
      setCharCount(value?.length);
    }
    onFormDataChange(field, value);
  };

  const formatPrice = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value?.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue?.split('.');
    if (parts?.length > 2) {
      return parts?.[0] + '.' + parts?.slice(1)?.join('');
    }
    
    // Limit to 2 decimal places
    if (parts?.[1] && parts?.[1]?.length > 2) {
      return parts?.[0] + '.' + parts?.[1]?.substring(0, 2);
    }
    
    return numericValue;
  };

  const handlePriceChange = (e) => {
    const formattedValue = formatPrice(e?.target?.value);
    handleInputChange('price', formattedValue);
  };

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, minimal signs of use' },
    { value: 'good', label: 'Good', description: 'Minor wear, fully functional' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear, works well' },
    { value: 'poor', label: 'Poor', description: 'Significant wear, may need repair' }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Product Title */}
      <Input
        label="Product Title"
        type="text"
        placeholder="Enter a descriptive title for your product"
        description="Be specific and include key details like brand, model, or size"
        required
        value={formData?.title || ''}
        onChange={(e) => handleInputChange('title', e?.target?.value)}
        error={errors?.title}
        maxLength={100}
      />
      {/* Product Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Product Description
          <span className="text-error ml-1">*</span>
        </label>
        <div className="relative">
          <textarea
            placeholder={`Describe your item in detail. Include:\n• Condition and any flaws\n• Dimensions or size\n• Brand and model\n• Why you're selling\n• Any included accessories`}
            required
            value={formData?.description || ''}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            maxLength={maxDescriptionLength}
            rows={8}
            className={`w-full px-3 py-2 border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-vertical ${
              errors?.description
                ? 'border-error bg-error/5' :'border-border bg-input'
            }`}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
            {charCount}/{maxDescriptionLength}
          </div>
        </div>
        {errors?.description && (
          <p className="text-sm text-error flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} />
            <span>{errors?.description}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Detailed descriptions help buyers make informed decisions and reduce returns
        </p>
      </div>
      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Price (USD)
            <span className="text-error ml-1">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
              $
            </span>
            <input
              type="text"
              placeholder="0.00"
              required
              value={formData?.price || ''}
              onChange={handlePriceChange}
              className={`w-full pl-8 pr-3 py-2 border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth ${
                errors?.price
                  ? 'border-error bg-error/5' :'border-border bg-input'
              }`}
            />
          </div>
          {errors?.price && (
            <p className="text-sm text-error flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} />
              <span>{errors?.price}</span>
            </p>
          )}
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Condition
            <span className="text-error ml-1">*</span>
          </label>
          <select
            required
            value={formData?.condition || ''}
            onChange={(e) => handleInputChange('condition', e?.target?.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth ${
              errors?.condition
                ? 'border-error bg-error/5' :'border-border bg-input'
            }`}
          >
            <option value="">Select condition</option>
            {conditionOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label} - {option?.description}
              </option>
            ))}
          </select>
          {errors?.condition && (
            <p className="text-sm text-error flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} />
              <span>{errors?.condition}</span>
            </p>
          )}
        </div>
      </div>
      {/* Additional Options */}
      <div className="space-y-4 bg-muted/30 rounded-lg p-4">
        <h3 className="font-medium text-foreground flex items-center space-x-2">
          <Icon name="Settings" size={18} />
          <span>Listing Options</span>
        </h3>
        
        <div className="space-y-3">
          <Checkbox
            label="Accept offers"
            description="Allow buyers to negotiate the price"
            checked={formData?.acceptOffers || false}
            onChange={(e) => handleInputChange('acceptOffers', e?.target?.checked)}
          />
          
          <Checkbox
            label="Local pickup available"
            description="Buyers can collect the item in person"
            checked={formData?.localPickup || false}
            onChange={(e) => handleInputChange('localPickup', e?.target?.checked)}
          />
          
          <Checkbox
            label="Shipping available"
            description="You can ship this item to buyers"
            checked={formData?.shippingAvailable || false}
            onChange={(e) => handleInputChange('shippingAvailable', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          loading={isDraftSaving}
          iconName="Save"
          iconPosition="left"
          className="sm:w-auto"
        >
          Save as Draft
        </Button>
        
        <Button
          type="submit"
          variant="default"
          loading={isSubmitting}
          iconName="Upload"
          iconPosition="left"
          className="sm:flex-1"
        >
          Publish Listing
        </Button>
      </div>
      {/* Publishing Guidelines */}
      <div className="bg-success/10 rounded-lg p-4 border border-success/20">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span>Before Publishing</span>
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Double-check all information for accuracy</li>
          <li>• Ensure images clearly show the item's condition</li>
          <li>• Set a fair price based on similar listings</li>
          <li>• Be honest about any defects or wear</li>
        </ul>
      </div>
    </form>
  );
};

export default ProductForm;