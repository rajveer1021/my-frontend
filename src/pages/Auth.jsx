import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
          <p className="text-center text-muted-foreground mb-4">
            Enter your email to receive a password reset link
          </p>
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg"
            />
            <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
              Send Reset Link
            </button>
            <button 
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Multi-Vendor Marketplace
            </h1>
            <p className="text-xl text-gray-600">
              Connect with verified vendors and buyers in our trusted B2B platform
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified Vendors</h3>
                <p className="text-gray-600">All vendors go through our strict verification process</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Transactions</h3>
                <p className="text-gray-600">Protected communication and secure payment processing</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Global Reach</h3>
                <p className="text-gray-600">Connect with suppliers and buyers worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full">
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
  );
};

export default Auth;