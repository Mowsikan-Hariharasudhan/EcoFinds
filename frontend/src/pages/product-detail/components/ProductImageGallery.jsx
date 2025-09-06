import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductImageGallery = ({ images = [], productName = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const defaultImages = [
    'https://images.pexels.com/photos/586744/pexels-photo-586744.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/586744/pexels-photo-586744.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/586744/pexels-photo-586744.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const displayImages = images?.length > 0 ? images : defaultImages;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? displayImages?.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === displayImages?.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-card rounded-lg overflow-hidden shadow-soft">
        <div className="aspect-square relative group">
          <Image
            src={displayImages?.[currentImageIndex]}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className={`w-full h-full object-cover cursor-pointer transition-transform duration-300 ${
              isZoomed ? 'scale-110' : 'scale-100'
            }`}
            onClick={toggleZoom}
          />
          
          {/* Navigation Arrows */}
          {displayImages?.length > 1 && (
            <>
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center shadow-medium opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label="Previous image"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center shadow-medium opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label="Next image"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="absolute top-4 right-4 bg-background/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Icon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={16} />
          </div>

          {/* Image Counter */}
          {displayImages?.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-background/80 px-3 py-1 rounded-full text-sm font-data">
              {currentImageIndex + 1} / {displayImages?.length}
            </div>
          )}
        </div>
      </div>
      {/* Thumbnail Navigation */}
      {displayImages?.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {displayImages?.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? 'border-primary shadow-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;