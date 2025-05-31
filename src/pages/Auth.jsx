import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import {
  ArrowLeft,
  Building,
  ShieldCheck,
  Globe,
  Users,
  Star,
  Sparkles,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import Button from "../components/ui/Button";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center space-x-3 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-white hover:bg-white/20 backdrop-blur-sm rounded-xl p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Reset Password</h2>
              <p className="text-blue-100">We'll send you a reset link</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex flex-col lg:flex-row min-h-screen lg:gap-4">
        {/* Left side - Enhanced Branding */}
        <div className="lg:flex-1 lg:flex lg:items-center lg:justify-center">
          <div className="max-w-2xl space-y-6 lg:space-y-8">
            {/* Logo and Title */}
            <div className="text-center lg:text-left space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Building className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    VendorHub
                  </h1>
                  <p className="text-gray-600 text-base lg:text-lg">
                    Professional B2B Marketplace
                  </p>
                </div>
              </div>

              <div className="relative">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-medium">
                  Connect, Trade, and Grow Your Business
                </p>
                <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3">
                  <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  Verified Platform
                </h3>
                <p className="text-gray-600 text-sm">
                  Secure and trusted marketplace with verified vendors only
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  Growing Network
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect with thousands of potential buyers worldwide
                </p>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 lg:p-6 text-white shadow-2xl">
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold mb-1">5K+</div>
                  <div className="text-xs lg:text-sm text-blue-100">
                    Active Vendors
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold mb-1">
                    50K+
                  </div>
                  <div className="text-xs lg:text-sm text-blue-100">
                    Products Listed
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold mb-1">
                    100+
                  </div>
                  <div className="text-xs lg:text-sm text-blue-100">
                    Countries
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Enhanced Auth Form */}
        <div className="lg:flex-1 lg:flex lg:items-center lg:justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 lg:p-6 text-white">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-3">
                    {isLogin ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <Users className="w-6 h-6" />
                    )}
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold mb-1">
                    {isLogin ? "Welcome Back!" : "Join VendorHub"}
                  </h2>
                  <p className="text-blue-100 text-sm lg:text-base">
                    {isLogin
                      ? "Sign in to your vendor account"
                      : "Start your journey as a vendor"}
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-4 lg:p-6">
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
      </div>
    </div>
  );
};

export default Auth;