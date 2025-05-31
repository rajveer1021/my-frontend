// src/components/auth/LoginForm.jsx - Fixed Google Auth and 
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../ui/Toast';

// Mock Google Auth function - replace with real implementation
const getGoogleAuthToken = async () => {
  // This should be replaced with actual Google OAuth implementation
  throw new Error('Google authentication not implemented yet');
};

const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const { login, loading, error, clearError, googleLogin } = useAuth();
  const { addToast } = useToast();

  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError();
    setFormErrors({});
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        addToast(result.message || "Welcome back!", "success");
      }
    } catch (error) {
      // Error is already handled in the auth context
      addToast(error.message, "error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      addToast("Google authentication integration coming soon!", "info");
      // Uncomment when Google OAuth is implemented
      // const googleToken = await getGoogleAuthToken();
      // const result = await googleLogin(googleToken, 'vendor');
      // if (result.success) {
      //   addToast(result.message || "Welcome!", "success");
      // }
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear general error
    if (error) {
      clearError();
    }
  };

  return (
    <div className="space-y-4">
      {/* Display general error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Google Login Button */}
      <Button 
        onClick={handleGoogleLogin}
        variant="outline" 
        className="w-full h-10 text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-sm"
        type="button"
        disabled={loading}
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

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`h-10 pl-9 text-sm border-2 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={loading}
              required
            />
          </div>
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {formErrors.email}
            </p>
          )}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`h-10 pl-9 pr-10 text-sm border-2 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.password ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {formErrors.password}
            </p>
          )}
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
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Action Links */}
      <div className="space-y-2">
        {onForgotPassword && (
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={onForgotPassword}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-200 text-sm"
              disabled={loading}
            >
              Forgot your password?
            </Button>
          </div>
        )}
        
        <div className="text-center">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <Button 
            variant="ghost" 
            onClick={onSwitchToSignup} 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold p-1 rounded transition-all duration-200 text-sm"
            disabled={loading}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;