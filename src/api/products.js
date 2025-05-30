import apiClient from './client';

// Mock product data for demonstration
const mockProducts = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: { rate: 4.5, count: 120 },
    description: "High-quality wireless headphones with noise cancellation"
  },
  {
    id: 2,
    title: "Organic Cotton T-Shirt",
    price: 29.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    rating: { rate: 4.2, count: 89 },
    description: "Comfortable organic cotton t-shirt in various colors"
  },
  {
    id: 3,
    title: "Smart Fitness Watch",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: { rate: 4.7, count: 156 },
    description: "Track your fitness goals with this advanced smartwatch"
  },
  {
    id: 4,
    title: "Leather Crossbody Bag",
    price: 89.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    rating: { rate: 4.3, count: 67 },
    description: "Stylish leather crossbody bag perfect for daily use"
  },
  {
    id: 5,
    title: "Bluetooth Speaker",
    price: 79.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    rating: { rate: 4.1, count: 94 },
    description: "Portable Bluetooth speaker with excellent sound quality"
  },
  {
    id: 6,
    title: "Yoga Mat Set",
    price: 45.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
    rating: { rate: 4.6, count: 78 },
    description: "Complete yoga mat set with blocks and strap"
  }
];

export const productsAPI = {
  // Get all products
  getProducts: async (params = {}) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredProducts = [...mockProducts];
      
      // Apply category filter
      if (params.category && params.category !== 'all') {
        filteredProducts = filteredProducts.filter(
          product => product.category.toLowerCase() === params.category.toLowerCase()
        );
      }
      
      // Apply search filter
      if (params.search) {
        filteredProducts = filteredProducts.filter(
          product => product.title.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      // Apply sorting
      if (params.sort) {
        filteredProducts.sort((a, b) => {
          switch (params.sort) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'rating':
              return b.rating.rate - a.rating.rate;
            default:
              return 0;
          }
        });
      }
      
      return { data: filteredProducts };
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const product = mockProducts.find(p => p.id === parseInt(id));
      if (!product) {
        throw new Error('Product not found');
      }
      return { data: product };
    } catch (error) {
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const categories = [...new Set(mockProducts.map(p => p.category))];
      return { data: categories };
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }
};