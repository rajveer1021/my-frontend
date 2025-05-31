export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStockStatusColor = (status) => {
  const statusColors = {
    'In Stock': 'success',
    'Low Stock': 'warning',
    'Out of Stock': 'destructive'
  };
  return statusColors[status] || 'secondary';
};