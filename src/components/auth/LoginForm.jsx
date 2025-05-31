import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '../ui/Toast';

const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      addToast("Please fill in all fields", "error");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        addToast("Welcome back!", "success");
      }
    } catch (error) {
      addToast("Invalid credentials. Please try again.", "error");
    }
  };

  const handleGoogleLogin = () => {
    addToast("Google authentication would be integrated here.", "info");
  };

  return (
    <div className="space-y-4">
      {/* Google Login Button */}
      <Button 
        onClick={handleGoogleLogin}
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
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 pl-9 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              required
            />
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={onForgotPassword}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-200 text-sm"
          >
            Forgot your password?
          </Button>
        </div>
        
        <div className="text-center">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <Button 
            variant="ghost" 
            onClick={onSwitchToSignup} 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold p-1 rounded transition-all duration-200 text-sm"
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;