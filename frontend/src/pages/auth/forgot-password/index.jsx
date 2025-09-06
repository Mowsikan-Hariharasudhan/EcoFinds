import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../components/ui/Header';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, send password reset email here
      console.log('Password reset email sent to:', email);
      setIsSuccess(true);
    } catch (error) {
      setErrors({ submit: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center">
                    <Icon name="CheckCircle" size={32} color="var(--color-success)" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground font-heading">
                  Check your email
                </h1>
                <p className="mt-2 text-muted-foreground">
                  We've sent a password reset link to
                </p>
                <p className="font-medium text-foreground">{email}</p>
              </div>

              <div className="space-y-4">
                <Button
                  fullWidth
                  onClick={() => navigate('/login')}
                  className="h-12"
                >
                  Back to Sign In
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email?{' '}
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>
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
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo and Title */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                  <Icon name="Key" size={32} color="var(--color-primary-foreground)" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground font-heading">
                Forgot your password?
              </h1>
              <p className="mt-2 text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  placeholder="Enter your email"
                  error={errors.email}
                  className={errors.email ? 'border-error' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error">{errors.email}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-md">
                  <p className="text-sm text-error">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className="h-12"
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>

            {/* Back to login link */}
            <div className="text-center">
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="ArrowLeft" size={16} />
                <span>Back to sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
