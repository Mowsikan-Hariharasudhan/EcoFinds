import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImageUploadSection = ({ images, onImagesChange, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      const isValidType = file?.type?.startsWith('image/');
      const isValidSize = file?.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles?.length > 0) {
      const newImages = validFiles?.map(file => ({
        id: Date.now() + Math.random(),
        file,
        url: URL.createObjectURL(file),
        name: file?.name
      }));
      
      onImagesChange([...images, ...newImages]?.slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images?.filter(img => img?.id !== imageId);
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Product Images
          <span className="text-error ml-1">*</span>
        </label>
        <span className="text-xs text-muted-foreground">
          {images?.length}/5 images
        </span>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-error bg-error/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Icon name="ImagePlus" size={32} className="text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              Upload Product Images
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your images here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, WebP • Max size: 5MB • Up to 5 images
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            iconName="Upload"
            iconPosition="left"
          >
            Choose Files
          </Button>
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <p className="text-sm text-error flex items-center space-x-2">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </p>
      )}
      {/* Image Preview Grid */}
      {images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images?.map((image, index) => (
            <div key={image?.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-border">
                <Image
                  src={image?.url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Primary Image Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                  Primary
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(image?.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-error/90"
              >
                <Icon name="X" size={14} />
              </button>

              {/* Image Name */}
              <p className="mt-1 text-xs text-muted-foreground truncate">
                {image?.name}
              </p>
            </div>
          ))}
        </div>
      )}
      {/* Upload Tips */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Lightbulb" size={16} className="text-accent" />
          <span>Photo Tips</span>
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use natural lighting for the best image quality</li>
          <li>• Show the item from multiple angles</li>
          <li>• Include close-ups of any wear or damage</li>
          <li>• The first image will be your main product photo</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadSection;