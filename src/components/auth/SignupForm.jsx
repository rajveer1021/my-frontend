// src/components/auth/SignupForm.jsx - Updated with account type selection

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Building,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../ui/Toast";
import { GoogleLogin } from "@react-oauth/google";
import AccountTypeSelectionModal from './AccountTypeSelectionModal'; // Import the modal

const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "vendor",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);

  // NEW: Account type selection state
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
  const [pendingGoogleUserInfo, setPendingGoogleUserInfo] = useState(null);

  const { signup, loading, error, clearError, googleLogin, setGoogleUserAccountType } = useAuth();
  const { addToast } = useToast();

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearError();
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });
      // Success handled by auth context and navigation
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  // UPDATED: Google signup handler with account type selection
  const handleGoogleSuccess = async (credentialResponse) => {
    if (googleLoading) return;

    setGoogleLoading(true);
    clearError();

    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Send the credential to your backend without account type
      const result = await googleLogin(credentialResponse.credential);

      // Check if account type selection is needed
      if (result.needsAccountTypeSelection) {
        console.log('🎯 Account type selection needed for signup');
        setPendingGoogleUserInfo(result.userInfo);
        setShowAccountTypeModal(true);
        return;
      }

      // Normal signup success
      if (result.success) {
        addToast(
          result.message ||
            "Account created successfully! Welcome to Multi-Vendor!",
          "success"
        );
      }
    } catch (error) {
      console.error("Google signup error:", error);

      let errorMessage = error.message;

      if (error.message.includes("popup_closed_by_user")) {
        errorMessage = "Google sign-up was cancelled. Please try again.";
      } else if (error.message.includes("popup_blocked")) {
        errorMessage =
          "Popup was blocked. Please allow popups for this site and try again.";
      } else if (error.message.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message.includes("already exists")) {
        errorMessage =
          "An account with this email already exists. Please try signing in instead.";
      }

      addToast(errorMessage, "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  // NEW: Handle account type confirmation
  const handleAccountTypeConfirm = async (accountType) => {
    if (!pendingGoogleUserInfo) {
      addToast("Error: Missing user information", "error");
      return;
    }

    try {
      console.log('🔧 Setting account type for signup:', accountType);
      
      const result = await setGoogleUserAccountType(pendingGoogleUserInfo, accountType);
      
      if (result.success) {
        setShowAccountTypeModal(false);
        setPendingGoogleUserInfo(null);
        addToast(
          result.message || "Account created successfully! Welcome to Multi-Vendor!",
          "success"
        );
      }
    } catch (error) {
      console.error('Set account type error:', error);
      addToast(error.message || "Failed to set account type", "error");
    }
  };

  // NEW: Handle account type modal close
  const handleAccountTypeModalClose = () => {
    setShowAccountTypeModal(false);
    setPendingGoogleUserInfo(null);
    setGoogleLoading(false);
  };

  const handleGoogleError = () => {
    addToast(
      "Google sign-up failed. Please try again or use the form below.",
      "error"
    );
    setGoogleLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

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

  const isFormDisabled = loading || googleLoading || showAccountTypeModal;

  return (
    <>
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name and Last Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="firstName"
                className="block text-xs font-semibold text-gray-700"
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`h-10 pl-9 text-sm border-2 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                    formErrors.firstName ? "border-red-500" : "border-gray-200"
                  }`}
                  disabled={isFormDisabled}
                  required
                />
              </div>
              {formErrors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {formErrors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="lastName"
                className="block text-xs font-semibold text-gray-700"
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`h-10 pl-9 text-sm border-2 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                    formErrors.lastName ? "border-red-500" : "border-gray-200"
                  }`}
                  disabled={isFormDisabled}
                  required
                />
              </div>
              {formErrors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

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
                value={formData.email}
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

          {/* Account Type Selection - For regular signup form */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange("userType", "vendor")}
                disabled={isFormDisabled}
                className={`relative p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                  formData.userType === "vendor"
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300"
                } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {formData.userType === "vendor" && (
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-0.5">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      formData.userType === "vendor"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-gray-100"
                    }`}
                  >
                    <Building
                      className={`w-3 h-3 ${
                        formData.userType === "vendor"
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs">
                      Vendor
                    </h4>
                    <p className="text-xs text-gray-600">Sell products</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange("userType", "buyer")}
                disabled={isFormDisabled}
                className={`relative p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                  formData.userType === "buyer"
                    ? "border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-green-300"
                } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {formData.userType === "buyer" && (
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-0.5">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      formData.userType === "buyer"
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : "bg-gray-100"
                    }`}
                  >
                    <ShoppingCart
                      className={`w-3 h-3 ${
                        formData.userType === "buyer"
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs">Buyer</h4>
                    <p className="text-xs text-gray-600">Purchase products</p>
                  </div>
                </div>
              </button>
            </div>
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
                placeholder="Create a password"
                value={formData.password}
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

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-gray-700"
            >
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
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`h-10 pl-9 pr-10 text-sm border-2 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                  formErrors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                disabled={isFormDisabled}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isFormDisabled}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {formErrors.confirmPassword}
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
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 font-medium">Or</span>
          </div>
        </div>

        {/* Google Signup Button */}
        <div className="w-full">
          {googleLoading ? (
            <Button
              variant="outline"
              className="w-full h-12 text-gray-700 border-2 border-gray-200 rounded-xl text-sm cursor-not-allowed opacity-50"
              disabled
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account with Google...</span>
              </div>
            </Button>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
              shape="rectangular"
              logo_alignment="left"
              disabled={isFormDisabled}
            />
          )}
        </div>

        {/* Switch to Login */}
        <div className="text-center">
          <span className="text-gray-600 text-sm">Already have an account? </span>
          <Button
            variant="ghost"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold p-1 rounded transition-all duration-200 text-sm"
            disabled={isFormDisabled}
          >
            Sign in
          </Button>
        </div>
      </div>

      {/* NEW: Account Type Selection Modal */}
      <AccountTypeSelectionModal
        isOpen={showAccountTypeModal}
        onConfirm={handleAccountTypeConfirm}
        userInfo={pendingGoogleUserInfo}
        loading={loading}
      />
    </>
  );
};

export default SignupForm;