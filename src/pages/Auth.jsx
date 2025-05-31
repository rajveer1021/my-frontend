import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { ArrowLeft, Building, ShieldCheck, Globe, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowForgotPassword(false)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl sm:text-2xl font-bold">Reset Password</h2>
          </div>
          <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
            Enter your email to receive a password reset link
          </p>
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Branding */}
        <div className="lg:flex-1 lg:flex lg:items-center lg:justify-center p-6 sm:p-8 lg:p-12">
          <div className="max-w-lg space-y-6 sm:space-y-8">
            {/* Logo and Title */}
            <div className="text-center lg:text-left space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  VendorHub
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-gray-600">
                Professional B2B Marketplace for Vendors
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Verified Platform</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Secure and trusted marketplace with verified vendors only</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Growing Network</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Connect with thousands of potential buyers worldwide</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Global Reach</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Expand your business reach with international buyers</p>
                </div>
              </div>
            </div>

            {/* Stats - Hidden on mobile */}
            <div className="hidden sm:grid grid-cols-3 gap-4 lg:gap-6 pt-6 border-t border-gray-200">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600">5K+</div>
                <div className="text-sm text-gray-600">Active Vendors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Products Listed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-purple-600">100+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="lg:flex-1 lg:flex lg:items-center lg:justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            {isLogin ? (
              <LoginForm 
                onSwitchToSignup={() => setIsLogin(false)}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;