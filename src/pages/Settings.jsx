import React, { useState } from "react";
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
} from "lucide-react";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { useAuth } from "../contexts/AuthContext";
import { validateProfile } from "../utils/validators";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleUpdateProfile = async () => {
    const validation = validateProfile(profileData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      await updateUser(profileData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ general: "Failed to update profile" });
    } finally {
      setLoading(false);
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

  const SettingCard = ({
    title,
    description,
    icon: Icon,
    color,
    onClick,
    buttonText = "Configure",
  }) => (
    <button
      onClick={onClick}
      className={`p-4 lg:p-6 rounded-2xl border-2 border-dashed ${color} bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 group text-left w-full`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div
            className={`p-2 lg:p-3 rounded-xl ${color
              .replace("border-", "bg-")
              .replace("-300", "-100")}`}
          >
            <Icon
              className={`w-5 h-5 lg:w-6 lg:h-6 ${color
                .replace("border-", "text-")
                .replace("-300", "-600")}`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm lg:text-base">
              {title}
            </h3>
            <p className="text-xs lg:text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
          <span className="text-xs lg:text-sm mr-2 hidden sm:block">
            {buttonText}
          </span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 sm:p-6 lg:p-8 text-white">
          {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"3\"/%3E%3Ccircle cx=\"27\" cy=\"7\" r=\"3\"/%3E%3Ccircle cx=\"47\" cy=\"7\" r=\"3\"/%3E%3Ccircle cx=\"7\" cy=\"27\" r=\"3\"/%3E%3Ccircle cx=\"27\" cy=\"27\" r=\"3\"/%3E%3Ccircle cx=\"47\" cy=\"27\" r=\"3\"/%3E%3Ccircle cx=\"7\" cy=\"47\" r=\"3\"/%3E%3Ccircle cx=\"27\" cy=\"47\" r=\"3\"/%3E%3Ccircle cx=\"47\" cy=\"47\" r=\"3\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" /> */}

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

          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  Contact Number
                </label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className={`h-11 lg:h-12 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Address
                </label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  placeholder="Enter your address"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-2 lg:py-3"
              >
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
