import React from 'react';
import ProductManagement from '../components/products/ProductManagement';

const Products = ({ onNavigate }) => {
  return <ProductManagement onNavigate={onNavigate} />;
};

export default Products;