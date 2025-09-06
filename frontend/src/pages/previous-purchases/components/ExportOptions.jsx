import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportOptions = ({ purchases, onExport }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportRange, setExportRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel Compatible)' },
    { value: 'json', label: 'JSON (Data Format)' },
    { value: 'pdf', label: 'PDF (Printable Report)' }
  ];

  const rangeOptions = [
    { value: 'all', label: 'All Purchases' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'currentyear', label: 'Current Year' }
  ];

  const filterPurchasesByRange = (purchases, range) => {
    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case 'last30days':
        startDate?.setDate(now?.getDate() - 30);
        break;
      case 'last3months':
        startDate?.setMonth(now?.getMonth() - 3);
        break;
      case 'last6months':
        startDate?.setMonth(now?.getMonth() - 6);
        break;
      case 'lastyear':
        startDate?.setFullYear(now?.getFullYear() - 1);
        break;
      case 'currentyear':
        startDate?.setMonth(0, 1);
        break;
      default:
        return purchases;
    }

    return purchases?.filter(purchase => 
      new Date(purchase.orderDate) >= startDate
    );
  };

  const generateCSV = (data) => {
    const headers = [
      'Order ID',
      'Product Title',
      'Seller',
      'Category',
      'Quantity',
      'Unit Price',
      'Total Amount',
      'Order Date',
      'Status',
      'Payment Method',
      'Tracking Number',
      'Delivery Date'
    ];

    const csvContent = [
      headers?.join(','),
      ...data?.map(purchase => [
        purchase?.orderId,
        `"${purchase?.product?.title}"`,
        `"${purchase?.seller?.name}"`,
        purchase?.product?.category,
        purchase?.quantity,
        purchase?.product?.price?.toFixed(2),
        purchase?.totalAmount?.toFixed(2),
        new Date(purchase.orderDate)?.toLocaleDateString(),
        purchase?.status,
        purchase?.paymentMethod,
        purchase?.trackingNumber || '',
        purchase?.deliveryDate ? new Date(purchase.deliveryDate)?.toLocaleDateString() : ''
      ]?.join(','))
    ]?.join('\n');

    return csvContent;
  };

  const generateJSON = (data) => {
    return JSON.stringify(data, null, 2);
  };

  const generatePDF = (data) => {
    // In a real app, this would generate a proper PDF
    // For now, we'll create a formatted text version
    let content = `
PURCHASE HISTORY REPORT
Generated: ${new Date()?.toLocaleDateString()}
Total Purchases: ${data?.length}

${data?.map(purchase => `
Order ID: ${purchase?.orderId}
Product: ${purchase?.product?.title}
Seller: ${purchase?.seller?.name}
Amount: $${purchase?.totalAmount?.toFixed(2)}
Date: ${new Date(purchase.orderDate)?.toLocaleDateString()}
Status: ${purchase?.status}
---
`)?.join('')}
    `;
    return content;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filteredPurchases = filterPurchasesByRange(purchases, exportRange);
      let content;
      let filename;
      let mimeType;

      switch (exportFormat) {
        case 'csv':
          content = generateCSV(filteredPurchases);
          filename = `purchases_${exportRange}_${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = generateJSON(filteredPurchases);
          filename = `purchases_${exportRange}_${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
          content = generatePDF(filteredPurchases);
          filename = `purchases_${exportRange}_${Date.now()}.txt`;
          mimeType = 'text/plain';
          break;
        default:
          throw new Error('Invalid export format');
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL?.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      window.URL?.revokeObjectURL(url);

      onExport?.(exportFormat, exportRange, filteredPurchases?.length);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredCount = filterPurchasesByRange(purchases, exportRange)?.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Download" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Export Purchase History</h3>
          <p className="text-sm text-muted-foreground">Download your purchase records</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />

          <Select
            label="Date Range"
            options={rangeOptions}
            value={exportRange}
            onChange={setExportRange}
          />
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>
              {filteredCount} purchase{filteredCount !== 1 ? 's' : ''} will be exported in {exportFormat?.toUpperCase()} format
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            loading={isExporting}
            onClick={handleExport}
            disabled={filteredCount === 0}
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>

          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
          >
            Preview Export
          </Button>
        </div>

        {/* Export Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• CSV files can be opened in Excel or Google Sheets</div>
          <div>• JSON files contain complete data structure for developers</div>
          <div>• PDF files provide a formatted printable report</div>
          <div>• All exports include order details, product info, and transaction data</div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;