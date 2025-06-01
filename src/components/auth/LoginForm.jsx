// src/components/auth/LoginForm.jsx - Using @react-oauth/google
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../ui/Toast";
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';

const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, loading, error, clearError, googleLogin } = useAuth();
  const { addToast } = useToast();

  // Google One Tap Login (automatic popup)
  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      await handleGoogleSuccess(credentialResponse);
    },
    onError: () => {
      console.log('Google One Tap Login Failed');
    },
    // Optional: disable auto-select and cancel on tap outside
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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

  const handleGoogleSuccess = async (credentialResponse) => {
    if (googleLoading) return; // Prevent multiple requests

    setGoogleLoading(true);
    clearError();

    try {
      console.log('🔐 Google login credential received');
      
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Send the credential to your backend
      const result = await googleLogin(credentialResponse.credential, 'vendor');
      
      if (result.success) {
        addToast(result.message || "Welcome back!", "success");
      }
    } catch (error) {
      console.error('Google login error:', error);
      
      let errorMessage = error.message;
      
      if (error.message.includes('popup_closed_by_user')) {
        errorMessage = "Google sign-in was cancelled. Please try again.";
      } else if (error.message.includes('popup_blocked')) {
        errorMessage = "Popup was blocked. Please allow popups for this site and try again.";
      } else if (error.message.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      addToast(errorMessage, "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    addToast("Google sign-in failed. Please try again or use email/password.", "error");
    setGoogleLoading(false);
  };

  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear general error
    if (error) {
      clearError();
    }
  };

  const isFormDisabled = loading || googleLoading;

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

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-700"
          >
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
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`h-10 pl-9 text-sm border-2 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.email ? "border-red-500" : "border-gray-200"
              }`}
              disabled={isFormDisabled}
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
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-gray-700"
          >
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
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`h-10 pl-9 pr-10 text-sm border-2 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.password ? "border-red-500" : "border-gray-200"
              }`}
              disabled={isFormDisabled}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isFormDisabled}
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
          disabled={isFormDisabled}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-medium">
            Or
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <div className="w-full">
        {googleLoading ? (
          <Button
            variant="outline"
            className="w-full h-10 text-gray-700 border-2 border-gray-200 rounded-xl text-sm cursor-not-allowed opacity-50"
            disabled
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in with Google...</span>
            </div>
          </Button>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
            disabled={isFormDisabled}
          />
        )}
      </div>

      {/* Action Links */}
      <div className="space-y-2">
        <div className="text-center">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <Button
            variant="ghost"
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold p-1 rounded transition-all duration-200 text-sm"
            disabled={isFormDisabled}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;