import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DraftManager = ({ onLoadDraft, onDeleteDraft }) => {
  const [drafts, setDrafts] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);

  // Mock drafts data - in real app, this would come from localStorage or API
  useEffect(() => {
    const mockDrafts = [
      {
        id: 1,
        title: 'Vintage Leather Armchair',
        category: 'furniture',
        price: '150.00',
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        imageCount: 3
      },
      {
        id: 2,
        title: 'MacBook Pro 13-inch',
        category: 'electronics',
        price: '899.99',
        lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        imageCount: 0
      }
    ];
    setDrafts(mockDrafts);
  }, []);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      furniture: 'Armchair',
      electronics: 'Smartphone',
      clothing: 'Shirt',
      books: 'Book',
      sports: 'Bike',
      toys: 'Gamepad2',
      kitchen: 'ChefHat',
      garden: 'Flower',
      art: 'Palette',
      automotive: 'Car',
      beauty: 'Sparkles',
      other: 'Package'
    };
    return categoryIcons?.[category] || 'Package';
  };

  const handleLoadDraft = (draft) => {
    onLoadDraft(draft);
    setShowDrafts(false);
  };

  const handleDeleteDraft = (draftId) => {
    setDrafts(drafts?.filter(draft => draft?.id !== draftId));
    onDeleteDraft?.(draftId);
  };

  if (drafts?.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowDrafts(!showDrafts)}
        iconName={showDrafts ? 'ChevronUp' : 'ChevronDown'}
        iconPosition="right"
        className="w-full sm:w-auto"
      >
        {drafts?.length} Saved Draft{drafts?.length > 1 ? 's' : ''}
      </Button>
      {showDrafts && (
        <div className="mt-4 space-y-3 bg-muted/30 rounded-lg p-4 border border-border">
          <h3 className="font-medium text-foreground flex items-center space-x-2">
            <Icon name="FileText" size={18} />
            <span>Your Drafts</span>
          </h3>

          <div className="space-y-3">
            {drafts?.map((draft) => (
              <div
                key={draft?.id}
                className="bg-background rounded-lg p-4 border border-border hover:shadow-soft transition-smooth"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon 
                        name={getCategoryIcon(draft?.category)} 
                        size={20} 
                        className="text-primary" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {draft?.title || 'Untitled Draft'}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        {draft?.price && (
                          <span className="text-sm font-medium text-success">
                            ${draft?.price}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(draft?.lastModified)}
                        </span>
                        {draft?.imageCount > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Icon name="Image" size={12} />
                            <span>{draft?.imageCount}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadDraft(draft)}
                      iconName="Edit"
                    >
                      Continue
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDraft(draft?.id)}
                      iconName="Trash2"
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Drafts are automatically saved as you type and will be kept for 30 days.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftManager;