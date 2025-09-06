import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const CategorySelector = ({ value, onChange, error }) => {
  const [selectedCategory, setSelectedCategory] = useState(value || '');

  const categories = [
    {
      value: 'furniture',
      label: 'Furniture & Home Decor',
      description: 'Chairs, tables, lamps, decorative items',
      icon: 'Armchair'
    },
    {
      value: 'clothing',
      label: 'Clothing & Accessories',
      description: 'Shirts, dresses, shoes, bags, jewelry',
      icon: 'Shirt'
    },
    {
      value: 'electronics',
      label: 'Electronics & Gadgets',
      description: 'Phones, laptops, cameras, headphones',
      icon: 'Smartphone'
    },
    {
      value: 'books',
      label: 'Books & Media',
      description: 'Books, magazines, DVDs, vinyl records',
      icon: 'Book'
    },
    {
      value: 'sports',
      label: 'Sports & Outdoor',
      description: 'Exercise equipment, camping gear, bikes',
      icon: 'Bike'
    },
    {
      value: 'toys',
      label: 'Toys & Games',
      description: 'Board games, puzzles, educational toys',
      icon: 'Gamepad2'
    },
    {
      value: 'kitchen',
      label: 'Kitchen & Appliances',
      description: 'Cookware, small appliances, utensils',
      icon: 'ChefHat'
    },
    {
      value: 'garden',
      label: 'Garden & Plants',
      description: 'Plants, pots, gardening tools, outdoor furniture',
      icon: 'Flower'
    },
    {
      value: 'art',
      label: 'Art & Crafts',
      description: 'Paintings, sculptures, craft supplies',
      icon: 'Palette'
    },
    {
      value: 'automotive',
      label: 'Automotive & Parts',
      description: 'Car accessories, tools, spare parts',
      icon: 'Car'
    },
    {
      value: 'beauty',
      label: 'Beauty & Personal Care',
      description: 'Skincare, makeup, hair care products',
      icon: 'Sparkles'
    },
    {
      value: 'other',
      label: 'Other Items',
      description: 'Items that don\'t fit other categories',
      icon: 'Package'
    }
  ];

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    onChange(categoryValue);
  };

  const selectedCategoryData = categories?.find(cat => cat?.value === selectedCategory);

  return (
    <div className="space-y-4">
      <Select
        label="Product Category"
        description="Choose the category that best describes your item"
        placeholder="Select a category..."
        required
        error={error}
        options={categories?.map(category => ({
          value: category?.value,
          label: category?.label,
          description: category?.description
        }))}
        value={selectedCategory}
        onChange={handleCategoryChange}
        searchable
      />
      {/* Category Preview */}
      {selectedCategoryData && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon 
                name={selectedCategoryData?.icon} 
                size={20} 
                className="text-primary" 
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">
                {selectedCategoryData?.label}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedCategoryData?.description}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Category Guidelines */}
      <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-accent" />
          <span>Category Guidelines</span>
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Choose the most specific category that fits your item</li>
          <li>• Accurate categorization helps buyers find your product</li>
          <li>• If unsure, select "Other Items" and describe in detail</li>
          <li>• Some categories may have specific listing requirements</li>
        </ul>
      </div>
    </div>
  );
};

export default CategorySelector;