import { apiService } from './api';

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Industrial Laptop Pro',
    description: 'Rugged laptop for industrial environments',
    categories: ['Electronics', 'Computers'],
    price: 1299.99,
    stock: 25,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    uploadDate: '2024-01-15',
    views: 145,
    orders: 8
  },
  {
    id: 2,
    name: 'Smart Sensor Module',
    description: 'IoT-enabled environmental monitoring sensor',
    categories: ['Electronics', 'IoT'],
    price: 89.99,
    stock: 5,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1518312647448-0b2b6ba5c8e4?w=400&h=300&fit=crop',
    uploadDate: '2024-01-10',
    views: 89,
    orders: 12
  },
  {
    id: 3,
    name: 'Cable Management System',
    description: 'Professional cable organization solution',
    categories: ['Infrastructure', 'Cable Management'],
    price: 45.50,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    uploadDate: '2024-01-05',
    views: 67,
    orders: 5
  }
];

export const productService = {
  async getProducts(filters = {}) {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredProducts = [...mockProducts];
    
    if (filters.search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.categories.some(cat => 
          cat.toLowerCase() === filters.category.toLowerCase()
        )
      );
    }
    
    return filteredProducts;
  },

  async getProduct(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async createProduct(productData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newProduct = {
      id: mockProducts.length + 1,
      ...productData,
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      orders: 0
    };
    mockProducts.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id, productData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts[index] = { ...mockProducts[index], ...productData };
    return mockProducts[index];
  },

  async deleteProduct(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts.splice(index, 1);
    return true;
  }
};