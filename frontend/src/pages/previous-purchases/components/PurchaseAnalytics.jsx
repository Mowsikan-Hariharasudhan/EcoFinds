import React from 'react';
import Icon from '../../../components/AppIcon';

const PurchaseAnalytics = ({ purchases }) => {
  const calculateAnalytics = () => {
    const totalSpent = purchases?.reduce((sum, purchase) => sum + purchase?.totalAmount, 0);
    const totalItems = purchases?.reduce((sum, purchase) => sum + purchase?.quantity, 0);
    const averageOrderValue = purchases?.length > 0 ? totalSpent / purchases?.length : 0;
    
    // Calculate sustainability metrics
    const estimatedCO2Saved = totalItems * 2.3; // kg CO2 per item saved
    const estimatedWasteDiverted = totalItems * 0.8; // kg waste diverted per item
    
    // Category breakdown
    const categoryBreakdown = purchases?.reduce((acc, purchase) => {
      const category = purchase?.product?.category;
      acc[category] = (acc?.[category] || 0) + purchase?.totalAmount;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryBreakdown)?.sort(([,a], [,b]) => b - a)?.[0];

    // Monthly spending
    const currentYear = new Date()?.getFullYear();
    const monthlySpending = purchases?.filter(p => new Date(p.orderDate)?.getFullYear() === currentYear)?.reduce((acc, purchase) => {
        const month = new Date(purchase.orderDate)?.getMonth();
        acc[month] = (acc?.[month] || 0) + purchase?.totalAmount;
        return acc;
      }, {});

    const averageMonthlySpending = Object.values(monthlySpending)?.length > 0 
      ? Object.values(monthlySpending)?.reduce((sum, amount) => sum + amount, 0) / Object.values(monthlySpending)?.length 
      : 0;

    return {
      totalSpent,
      totalItems,
      averageOrderValue,
      estimatedCO2Saved,
      estimatedWasteDiverted,
      topCategory: topCategory ? { name: topCategory?.[0], amount: topCategory?.[1] } : null,
      averageMonthlySpending
    };
  };

  const analytics = calculateAnalytics();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const analyticsCards = [
    {
      title: 'Total Spent',
      value: formatCurrency(analytics?.totalSpent),
      icon: 'DollarSign',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Items Purchased',
      value: analytics?.totalItems?.toString(),
      icon: 'Package',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Average Order',
      value: formatCurrency(analytics?.averageOrderValue),
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'CO₂ Saved',
      value: `${analytics?.estimatedCO2Saved?.toFixed(1)} kg`,
      icon: 'Leaf',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Waste Diverted',
      value: `${analytics?.estimatedWasteDiverted?.toFixed(1)} kg`,
      icon: 'Recycle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Monthly Average',
      value: formatCurrency(analytics?.averageMonthlySpending),
      icon: 'Calendar',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Purchase Analytics</h3>
          <p className="text-sm text-muted-foreground">Your sustainable shopping impact</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {analyticsCards?.map((card, index) => (
          <div key={index} className="p-4 rounded-lg border border-border bg-background">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${card?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={card?.icon} size={18} className={card?.color} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{card?.title}</div>
                <div className="text-lg font-semibold text-foreground">{card?.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Top Category */}
      {analytics?.topCategory && (
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-3">
            <Icon name="Award" size={20} className="text-primary" />
            <div>
              <div className="text-sm font-medium text-foreground">Top Category</div>
              <div className="text-sm text-muted-foreground">
                {analytics?.topCategory?.name} • {formatCurrency(analytics?.topCategory?.amount)}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Environmental Impact Message */}
      <div className="mt-6 p-4 rounded-lg bg-success/5 border border-success/20">
        <div className="flex items-start gap-3">
          <Icon name="Heart" size={20} className="text-success mt-0.5" />
          <div>
            <div className="text-sm font-medium text-success mb-1">Environmental Impact</div>
            <div className="text-sm text-muted-foreground">
              By choosing second-hand items, you've helped save approximately{' '}
              <span className="font-medium text-success">{analytics?.estimatedCO2Saved?.toFixed(1)} kg of CO₂</span>{' '}
              and diverted <span className="font-medium text-success">{analytics?.estimatedWasteDiverted?.toFixed(1)} kg of waste</span>{' '}
              from landfills. Thank you for supporting sustainable consumption!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseAnalytics;