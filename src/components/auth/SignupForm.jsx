import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, User, Lock, Eye, EyeOff, Building, ShoppingCart, CheckCircle } from 'lucide-react';
import { useToast } from '../ui/Toast';

const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userType: 'vendor',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signup, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      addToast("Please fill in all fields", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }

    if (formData.password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      const success = await signup({
        fullName: formData.fullName,
        email: formData.email,
        userType: formData.userType
      });

      if (success) {
        addToast("Account created successfully!", "success");
      }
    } catch (error) {
      addToast("Failed to create account. Please try again.", "error");
    }
  };

  const handleGoogleSignup = () => {
    addToast("Google authentication would be integrated here.", "info");
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Google Signup Button */}
      <Button 
        onClick={handleGoogleSignup}
        variant="outline" 
        className="w-full h-10 text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-sm"
        type="button"
      >
        <div className="w-4 h-4 mr-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full flex items-center justify-center">
          <Mail className="w-2.5 h-2.5 text-white" />
        </div>
        Continue with Google
      </Button>
      
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-medium">Or continue with email</span>
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="h-10 pl-9 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="h-10 pl-9 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Account Type Selection - Compact */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">Account Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleInputChange('userType', 'vendor')}
              className={`relative p-2 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.userType === 'vendor'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              {formData.userType === 'vendor' && (
                <div className="absolute -top-1 -right-1">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-0.5">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  formData.userType === 'vendor' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gray-100'
                }`}>
                  <Building className={`w-3 h-3 ${formData.userType === 'vendor' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs">Vendor</h4>
                  <p className="text-xs text-gray-600">Sell</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleInputChange('userType', 'buyer')}
              className={`relative p-2 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.userType === 'buyer'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              {formData.userType === 'buyer' && (
                <div className="absolute -top-1 -right-1">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-0.5">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  formData.userType === 'buyer' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gray-100'
                }`}>
                  <ShoppingCart className={`w-3 h-3 ${formData.userType === 'buyer' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs">Buyer</h4>
                  <p className="text-xs text-gray-600">Purchase</p>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Password Field */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="h-10 pl-9 pr-10 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="h-10 pl-9 pr-10 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="text-center">
        <span className="text-gray-600 text-sm">Already have an account? </span>
        <Button 
          variant="ghost" 
          onClick={onSwitchToLogin} 
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold p-1 rounded transition-all duration-200 text-sm"
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default SignupForm;