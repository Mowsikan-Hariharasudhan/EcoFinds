import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderSummary = ({ 
  subtotal, 
  tax, 
  shipping, 
  discount, 
  total, 
  itemCount, 
  onProceedToCheckout,
  isProcessing = false 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft sticky top-24">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Icon name="Receipt" size={20} />
        Order Summary
      </h2>

      {/* Items Count */}
      <div className="mb-6 p-3 bg-muted/50 rounded-md">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Items in cart:</span>
          <span className="font-medium text-foreground">{itemCount}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium font-data text-foreground">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-success">
            <span className="flex items-center gap-1">
              <Icon name="Tag" size={14} />
              Discount
            </span>
            <span className="font-medium font-data">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Icon name="Truck" size={14} />
            Shipping
          </span>
          <span className="font-medium font-data text-foreground">
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium font-data text-foreground">
            {formatCurrency(tax)}
          </span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold font-data text-foreground">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="mb-6 p-3 bg-success/5 border border-success/20 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm font-medium text-success">Secure Checkout</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Lock" size={12} />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="CreditCard" size={12} />
            <span>Secure Payment</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        variant="default"
        size="lg"
        fullWidth
        onClick={onProceedToCheckout}
        loading={isProcessing}
        iconName="ArrowRight"
        iconPosition="right"
        className="mb-4"
      >
        Proceed to Checkout
      </Button>

      {/* Continue Shopping */}
      <Button
        variant="outline"
        size="default"
        fullWidth
        iconName="ArrowLeft"
        iconPosition="left"
        onClick={() => window.location.href = '/product-feed'}
      >
        Continue Shopping
      </Button>

      {/* Payment Methods */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center mb-2">
          We accept
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
            <Icon name="CreditCard" size={12} className="text-muted-foreground" />
          </div>
          <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">PP</span>
          </div>
          <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">GP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;