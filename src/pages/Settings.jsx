// src/pages/Settings.jsx - Updated with proper API integration
import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Lock,
  Save,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Globe,
  Palette,
  ArrowRight,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ui/Toast";

const Settings = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      const initialData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      };
      setProfileData(initialData);
    }
  }, [user]);

  // Track changes in form data
  useEffect(() => {
    if (user) {
      const hasChanged =
        profileData.firstName !== (user.firstName || "") ||
        profileData.lastName !== (user.lastName || "") ||
        profileData.phone !== (user.phone || "") ||
        profileData.address !== (user.address || "");

      setHasChanges(hasChanged);
    }
  }, [profileData, user]);

  const validateProfile = (profile) => {
    const errors = {};

    if (!profile.firstName?.trim()) {
      errors.firstName = "First name is required";
    } else if (profile.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (profile.firstName.trim().length > 50) {
      errors.firstName = "First name must be less than 50 characters";
    }

    if (!profile.lastName?.trim()) {
      errors.lastName = "Last name is required";
    } else if (profile.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    } else if (profile.lastName.trim().length > 50) {
      errors.lastName = "Last name must be less than 50 characters";
    }

    if (!profile.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (
      profile.phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(profile.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      errors.phone = "Please enter a valid phone number";
    }

    if (profile.address && profile.address.length > 200) {
      errors.address = "Address must be less than 200 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear success message when user makes changes
    if (success) {
      setSuccess(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const validation = validateProfile(profileData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      addToast("Please fix the form errors before submitting", "error");
      return;
    }

    if (!hasChanges) {
      addToast("No changes to save", "info");
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      // Only send the fields that can be updated (not email)
      const updateData = {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        phone: profileData.phone.trim(),
        address: profileData.address.trim(),
      };

      "Updating profile with data:", updateData;

      const result = await updateUser(updateData);

      if (result.success) {
        setSuccess(true);
        setHasChanges(false);
        addToast("Profile updated successfully!", "success");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Profile update error:", error);

      // Handle validation errors from API
      if (
        error.message.includes("validation") ||
        error.message.includes("required")
      ) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: error.message || "Failed to update profile" });
      }

      addToast(error.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setErrors({});
      setSuccess(false);
    }
  };

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    gradient,
    isActive = false,
  }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 lg:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer ${gradient}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 lg:p-3 rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          {isActive && (
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </div>

        <div className="text-white">
          <p className="text-xs lg:text-sm opacity-90 mb-1">{title}</p>
          <p className="text-xl lg:text-2xl font-bold mb-1">{value}</p>
          <p className="text-xs opacity-75">{description}</p>
        </div>

        <div className="absolute top-3 right-3 opacity-20">
          <Icon className="w-8 h-8 lg:w-10 lg:h-10" />
        </div>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="w-full max-w-none space-y-6">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Loading settings..." />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 sm:p-6 lg:p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-xs lg:text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    Account Settings
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Account <span className="text-blue-200">Settings</span>
                </h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  Manage your account preferences and security
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 lg:p-6 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-green-800 font-medium">
                Profile updated successfully!
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="animate-fade-in">
            <ErrorMessage message={errors.general} type="error" />
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                <UserCheck className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-blue-600" />
                Profile Information
              </h2>
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* First Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  First Name *
                </label>
                <Input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className={`h-11 lg:h-12 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                  maxLength={50}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Last Name *
                </label>
                <Input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter your last name"
                  className={`h-11 lg:h-12 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                  maxLength={50}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Email *
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="h-11 lg:h-12 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <span className="text-sm text-amber-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    You have unsaved changes
                  </span>
                )}
              </div>

              <div className="flex space-x-3">
                {hasChanges && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                    className="px-4 py-2 lg:py-3"
                  >
                    Reset
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={loading || !hasChanges}
                  className={`flex items-center px-6 py-2 lg:py-3 ${
                    hasChanges
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
