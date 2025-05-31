// Mock data service for the application

// User and vendor profile interfaces
export const mockUsers = [
  {
    id: '1',
    email: 'vendor@example.com',
    fullName: 'John Vendor',
    userType: 'vendor',
    isVerified: true
  },
  {
    id: '2',
    email: 'buyer@example.com',
    fullName: 'Jane Buyer',
    userType: 'buyer',
    isVerified: true
  }
];

export const mockVendorProfiles = [
  {
    id: '1',
    userId: '1',
    vendorType: 'manufacturer',
    businessName: 'TechParts Manufacturing Co.',
    address: '123 Industrial Ave, Tech City, TC 12345',
    phone: '+1 (555) 123-4567',
    website: 'https://techparts.com',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=200&fit=crop',
    isProfileComplete: true,
    verificationStatus: 'verified'
  }
];

export const mockProducts = [
  {
    id: '1',
    vendorId: '1',
    name: 'Industrial Laptop Pro',
    subheading: 'Rugged laptop for industrial environments',
    categories: ['Electronics', 'Computers', 'Industrial Equipment'],
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
    stockStatus: 'in-stock',
    price: 1299.99,
    description: 'High-performance industrial laptop designed for harsh environments. Features IP65 rating, military-grade durability, and extended battery life.',
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    vendorId: '1',
    name: 'Smart Sensor Module',
    subheading: 'IoT-enabled environmental monitoring sensor',
    categories: ['Electronics', 'IoT', 'Sensors'],
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400&h=300&fit=crop',
    stockStatus: 'low-stock',
    price: 89.99,
    description: 'Advanced IoT sensor for temperature, humidity, and air quality monitoring. Wireless connectivity and long battery life.',
    uploadDate: '2024-01-10'
  },
  {
    id: '3',
    vendorId: '1',
    name: 'Cable Management System',
    subheading: 'Professional cable organization solution',
    categories: ['Infrastructure', 'Cable Management'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    stockStatus: 'out-of-stock',
    price: 45.50,
    description: 'Complete cable management system for data centers and office environments. Modular design for easy installation.',
    uploadDate: '2024-01-05'
  }
];

export const mockEnquiries = [
  {
    id: '1',
    buyerName: 'Alice Johnson',
    buyerEmail: 'alice.johnson@techcorp.com',
    productId: '1',
    message: 'Hi, I\'m interested in bulk purchasing of your Industrial Laptop Pro. Can you provide pricing for 50+ units?',
    date: '2024-01-20',
    status: 'new'
  },
  {
    id: '2',
    buyerName: 'Bob Smith',
    buyerEmail: 'bob.smith@automation.com',
    productId: '2',
    message: 'Does the Smart Sensor Module support LoRaWAN connectivity? We need it for our IoT infrastructure.',
    date: '2024-01-19',
    status: 'new'
  },
  {
    id: '3',
    buyerName: 'Carol Davis',
    buyerEmail: 'carol.davis@datacenter.com',
    productId: '3',
    message: 'When will the Cable Management System be back in stock? We have an urgent project coming up.',
    date: '2024-01-18',
    status: 'responded'
  }
];

export const productCategories = [
  'Electronics',
  'Computers',
  'Industrial Equipment',
  'IoT',
  'Sensors',
  'Infrastructure',
  'Cable Management',
  'Automation',
  'Machinery',
  'Tools'
];

// Local storage helpers
export const getStoredData = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Authentication helpers
export const getCurrentUser = () => {
  const userId = localStorage.getItem('currentUserId');
  if (!userId) return null;
  
  const users = getStoredData('users', mockUsers);
  return users.find(user => user.id === userId) || null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUserId', user.id);
  const users = getStoredData('users', mockUsers);
  const updatedUsers = users.filter(u => u.id !== user.id);
  updatedUsers.push(user);
  setStoredData('users', updatedUsers);
};

export const logout = () => {
  localStorage.removeItem('currentUserId');
};