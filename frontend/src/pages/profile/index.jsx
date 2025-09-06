import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Set form data from user context
    if (user) {
      setFormData({
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || ''
      });
    }
  }, [user, isAuthenticated, navigate]);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', path: '/profile' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, update user profile here
      console.log('Profile updated:', formData);
      
      // Update user in context
      updateUser({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`
      });
      
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.name?.split(' ')[1] || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || '',
      website: user.website || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <Icon name="Loader" size={32} className="animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="w-full px-4 lg:px-6 py-8">
          <BreadcrumbNavigation items={breadcrumbItems} />
          
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
                      <Image
                        src={user.avatar}
                        alt={user.name || 'Profile picture'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Icon name="Camera" size={16} className="text-primary-foreground" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="text-2xl font-bold text-card-foreground">
                        {user.name || `${formData.firstName} ${formData.lastName}`}
                      </h1>
                      {user.verified && (
                        <Icon name="BadgeCheck" size={20} className="text-primary" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{user.location || 'Location not set'}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={16} className="text-warning fill-current" />
                        <span className="font-medium">{user.rating || '5.0'}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Joined {user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        }) : 'Recently'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        iconName="Edit"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        iconName="ArrowLeft"
                      >
                        Back to Dashboard
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        loading={isLoading}
                        disabled={isLoading}
                      >
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-card-foreground mb-6">
                    Personal Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            error={errors.firstName}
                          />
                        ) : (
                          <p className="text-muted-foreground">{formData.firstName || user.name?.split(' ')[0] || 'Not set'}</p>
                        )}
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-error">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            error={errors.lastName}
                          />
                        ) : (
                          <p className="text-muted-foreground">{formData.lastName || user.name?.split(' ')[1] || 'Not set'}</p>
                        )}
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-error">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={errors.email}
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.email}</p>
                      )}
                      {errors.email && (
                        <p className="mt-1 text-sm text-error">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.phone || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Location
                      </label>
                      {isEditing ? (
                        <Input
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Enter your location"
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.location || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Website
                      </label>
                      {isEditing ? (
                        <Input
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://your-website.com"
                          error={errors.website}
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          {user.website ? (
                            <a 
                              href={user.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              {user.website}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      )}
                      {errors.website && (
                        <p className="mt-1 text-sm text-error">{errors.website}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                          placeholder="Tell us about yourself and your passion for sustainability..."
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.bio || 'No bio provided'}</p>
                      )}
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-md">
                      <p className="text-sm text-error">{errors.submit}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Activity Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Sales</span>
                      <span className="font-medium text-card-foreground">${user.totalSales || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Purchases</span>
                      <span className="font-medium text-card-foreground">{user.totalPurchases || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium text-card-foreground">
                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Account Settings
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Key"
                      onClick={() => navigate('/change-password')}
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Bell"
                      onClick={() => navigate('/notification-settings')}
                    >
                      Notifications
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="Shield"
                      onClick={() => navigate('/privacy-settings')}
                    >
                      Privacy Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
