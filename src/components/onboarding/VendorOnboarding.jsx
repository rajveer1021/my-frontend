// src/components/onboarding/VendorOnboarding.jsx - Fixed version with proper redirection

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import {
  Building,
  Upload,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Shield,
  Star,
  AlertCircle,
  InfoIcon,
} from "lucide-react";
import { cn } from "../../utils/helpers";
import { vendorService } from "../../services/vendorService";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useToast } from "../ui/Toast";

const VendorOnboarding = ({ onComplete }) => {
  const navigate = useNavigate(); // Add navigation hook
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [completion, setCompletion] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    // Step 1
    vendorType: "",

    // Step 2
    businessName: "",
    businessAddress1: "",
    businessAddress2: "",
    city: "",
    state: "",
    postalCode: "",

    // Step 3
    verificationType: "gst", // Default to GST
    gstNumber: "",
    idType: "",
    idNumber: "",
    documentFile: null,
  });

  const [errors, setErrors] = useState({});

  const steps = [
    {
      id: 1,
      title: "Vendor Type",
      description: "Select your business type",
      icon: Building,
    },
    {
      id: 2,
      title: "Business Info",
      description: "Enter your business details",
      icon: FileText,
    },
    {
      id: 3,
      title: "Documents",
      description: "Upload verification documents",
      icon: Shield,
    },
  ];

  const vendorTypes = [
    {
      value: "MANUFACTURER",
      label: "Manufacturer",
      description: "I manufacture products",
      icon: "🏭",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      value: "WHOLESALER",
      label: "Wholesaler",
      description: "I sell products from manufacturers",
      icon: "🏪",
      gradient: "from-green-500 to-green-600",
    },
    {
      value: "RETAILER",
      label: "Retailer",
      description: "I connect buyers and sellers",
      icon: "🤝",
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  // Load existing vendor profile on component mount
  useEffect(() => {
    const loadVendorProfile = async () => {
      try {
        setInitialLoading(true);
        const { vendor, completion } = await vendorService.getVendorProfile();

        if (vendor) {
          setFormData({
            vendorType: vendor.vendorType || "",
            businessName: vendor.businessName || "",
            businessAddress1: vendor.businessAddress1 || "",
            businessAddress2: vendor.businessAddress2 || "",
            city: vendor.city || "",
            state: vendor.state || "",
            postalCode: vendor.postalCode || "",
            verificationType: vendor.verificationType || "gst",
            gstNumber: vendor.gstNumber || "",
            idType: vendor.idType || "",
            idNumber: vendor.idNumber || "",
            documentFile: vendor.documentFile || null,
          });
        }

        if (completion) {
          setCompletion(completion);
          setCurrentStep(completion.currentStep || 1);
        }
      } catch (error) {
        console.error("Failed to load vendor profile:", error);
        addToast("Failed to load your profile. Starting fresh.", "warning");
      } finally {
        setInitialLoading(false);
      }
    };

    loadVendorProfile();
  }, [addToast]);

  const handleInputChange = (field, value) => {
    // Ensure all values are stored as strings
    const stringValue = typeof value === 'string' ? value : String(value || '');
    
    setFormData((prev) => ({ 
      ...prev, 
      [field]: stringValue 
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear related errors when verification type changes
    if (field === "verificationType") {
      setErrors((prev) => ({
        ...prev,
        gstNumber: "",
        idType: "",
        idNumber: "",
        documentFile: "",
      }));
    }
  };

  const handleVendorTypeSelect = (vendorType) => {
    handleInputChange("vendorType", vendorType);
  };

  const handleFileUpload = (file) => {
    setFormData((prev) => ({ ...prev, documentFile: file }));

    if (errors.documentFile) {
      setErrors((prev) => ({
        ...prev,
        documentFile: "",
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.vendorType) {
          newErrors.vendorType = "Please select a vendor type";
        }
        break;

      case 2:
        if (!formData.businessName.trim()) {
          newErrors.businessName = "Business name is required";
        }
        if (!formData.businessAddress1.trim()) {
          newErrors.businessAddress1 = "Business address is required";
        }
        if (!formData.city.trim()) {
          newErrors.city = "City is required";
        }
        if (!formData.state.trim()) {
          newErrors.state = "State is required";
        }
        if (!formData.postalCode.trim()) {
          newErrors.postalCode = "Postal code is required";
        } else if (!/^\d{6}$/.test(formData.postalCode)) {
          newErrors.postalCode = "Please enter a valid 6-digit postal code";
        }
        break;

      case 3:
        if (formData.verificationType === "gst") {
          if (!formData.gstNumber.trim()) {
            newErrors.gstNumber = "GST number is required";
          } else if (
            !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
              formData.gstNumber
            )
          ) {
            newErrors.gstNumber = "Please enter a valid GST number";
          }
        } else if (formData.verificationType === "manual") {
          if (!formData.idType) {
            newErrors.idType = "Please select an ID type";
          }
          if (!formData.idNumber.trim()) {
            newErrors.idNumber = "ID number is required";
          } else {
            if (formData.idType === "aadhaar") {
              if (!/^\d{12}$/.test(formData.idNumber.replace(/\s/g, ""))) {
                newErrors.idNumber =
                  "Please enter a valid 12-digit Aadhaar number";
              }
            } else if (formData.idType === "pan") {
              if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idNumber)) {
                newErrors.idNumber =
                  "Please enter a valid PAN number (e.g., ABCDE1234F)";
              }
            }
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle successful completion and redirection
  const handleOnboardingComplete = () => {
    localStorage.setItem("vendorOnboarded", "true");
    addToast(
      "Onboarding completed successfully! Welcome to VendorHub!",
      "success"
    );
    
    // Multiple redirection strategies to ensure it works
    setTimeout(() => {
      // Try the onComplete callback first
      if (onComplete && typeof onComplete === 'function') {
        try {
          onComplete();
        } catch (error) {
          console.error("onComplete callback failed:", error);
          // Fallback to navigate
          navigate("/", { replace: true });
        }
      } else {
        // Direct navigation if no callback
        navigate("/", { replace: true });
      }
    }, 1500);
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    try {
      let result;

      switch (currentStep) {
        case 1:
          result = await vendorService.updateStep1(formData.vendorType);
          addToast("Vendor type updated successfully!", "success");
          break;

        case 2:
          result = await vendorService.updateStep2({
            businessName: formData.businessName,
            businessAddress1: formData.businessAddress1,
            businessAddress2: formData.businessAddress2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
          });
          addToast("Business information updated successfully!", "success");
          break;

        case 3:
          // FIXED: Create clean data object
          const step3Data = {
            verificationType: formData.verificationType, // Already a string
          };

          if (formData.verificationType === "gst") {
            step3Data.gstNumber = formData.gstNumber;
          } else if (formData.verificationType === "manual") {
            step3Data.idType = formData.idType;
            step3Data.idNumber = formData.idNumber;
          }

          result = await vendorService.updateStep3(step3Data);
          addToast("Verification details updated successfully!", "success");
          break;

        default:
          break;
      }

      // Update completion status
      if (result && result.completion) {
        setCompletion(result.completion);

        if (result.completion.isComplete) {
          // Handle completion and redirection
          handleOnboardingComplete();
          return;
        }
      }

      // Move to next step
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Failed to update step:", error);
      addToast(error.message || "Failed to update. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.vendorType !== "";
      case 2:
        return (
          formData.businessName &&
          formData.businessAddress1 &&
          formData.city &&
          formData.state &&
          formData.postalCode &&
          /^\d{6}$/.test(formData.postalCode)
        );
      case 3:
        if (formData.verificationType === "gst") {
          return (
            formData.gstNumber &&
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
              formData.gstNumber
            )
          );
        } else if (formData.verificationType === "manual") {
          const isIdValid = formData.idType && formData.idNumber;
          if (!isIdValid) return false;

          if (formData.idType === "aadhaar") {
            return /^\d{12}$/.test(formData.idNumber.replace(/\s/g, ""));
          } else if (formData.idType === "pan") {
            return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idNumber);
          }
        }
        return false;
      default:
        return false;
    }
  };

  const progressPercentage = completion
    ? completion.completionPercentage
    : (currentStep / 3) * 100;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <LoadingSpinner size="lg" text="Loading your profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Join Our <span className="text-blue-200">Marketplace</span>
            </h1>
            <p className="text-blue-100">
              Complete your vendor profile to start selling
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300",
                      currentStep >= step.id
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-white border-2 border-gray-200 text-gray-400"
                    )}
                  >
                    {completion?.steps[`step${step.id}`] ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        currentStep >= step.id
                          ? "text-blue-600"
                          : "text-gray-500"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-4 rounded-full transition-all duration-500",
                      completion?.steps[`step${step.id}`]
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : "bg-gray-200"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: "w-5 h-5",
                })}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Step {currentStep}: {steps[currentStep - 1].title}
                </h2>
                <p className="text-blue-100 text-sm">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Step 1: Vendor Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Select your vendor type
                  </h3>
                  <p className="text-gray-600">
                    Choose the option that best describes your business
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vendorTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleVendorTypeSelect(type.value)}
                      disabled={loading}
                      className={cn(
                        "relative group cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-lg",
                        formData.vendorType === type.value
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {formData.vendorType === type.value && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="text-center space-y-2">
                        <div className="text-3xl">{type.icon}</div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {type.label}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {errors.vendorType && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <p className="text-red-800 text-sm">
                        {errors.vendorType}
                      </p>
                    </div>
                  </div>
                )}

                {formData.vendorType && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Perfect Choice!
                        </h4>
                        <p className="text-green-700 text-sm">
                          You selected:{" "}
                          <strong>
                            {
                              vendorTypes.find(
                                (t) => t.value === formData.vendorType
                              )?.label
                            }
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Tell us about your business
                  </h3>
                  <p className="text-gray-600">
                    Provide your business details to complete your profile
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                      }
                      placeholder="Enter your business name"
                      disabled={loading}
                      className={`h-10 border-2 rounded-lg ${
                        errors.businessName
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Business Address Line 1 *
                    </label>
                    <Input
                      value={formData.businessAddress1}
                      onChange={(e) =>
                        handleInputChange("businessAddress1", e.target.value)
                      }
                      placeholder="Enter your business address"
                      disabled={loading}
                      className={`h-10 border-2 rounded-lg ${
                        errors.businessAddress1
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.businessAddress1 && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.businessAddress1}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Business Address Line 2 (Optional)
                    </label>
                    <Input
                      value={formData.businessAddress2}
                      onChange={(e) =>
                        handleInputChange("businessAddress2", e.target.value)
                      }
                      placeholder="Suite, apartment, etc."
                      disabled={loading}
                      className="h-10 border-2 border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        City *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="City"
                        disabled={loading}
                        className={`h-10 border-2 rounded-lg ${
                          errors.city ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        State *
                      </label>
                      <Input
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="State"
                        disabled={loading}
                        className={`h-10 border-2 rounded-lg ${
                          errors.state ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) =>
                          handleInputChange("postalCode", e.target.value)
                        }
                        placeholder="000000"
                        maxLength={6}
                        disabled={loading}
                        className={`h-10 border-2 rounded-lg ${
                          errors.postalCode
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Upload verification documents
                  </h3>
                  <p className="text-gray-600">
                    Please provide your verification details
                  </p>
                </div>

                {/* Radio Button Selection */}
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="verificationType"
                      value="gst"
                      checked={formData.verificationType === "gst"}
                      onChange={() =>
                        handleInputChange("verificationType", "gst")
                      }
                      className="text-blue-600"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                      Verification via GST
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="verificationType"
                      value="manual"
                      checked={formData.verificationType === "manual"}
                      onChange={() =>
                        handleInputChange("verificationType", "manual")
                      }
                      className="text-blue-600"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                      Manual Verification
                    </span>
                  </label>
                </div>

                {/* GST Input */}
                {formData.verificationType === "gst" && (
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            GST Verification Required
                          </h4>
                          <p className="text-gray-700 text-sm">
                            Please provide your valid GST number to verify your
                            business registration.
                          </p>
                        </div>
                      </div>
                    </div>

                    <label className="block text-sm font-semibold text-gray-700 mt-4">
                      GST Number *
                    </label>

                    <Input
                      value={formData.gstNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "gstNumber",
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="22AAAAA0000A1Z5"
                      maxLength={15}
                      disabled={loading}
                      className={`h-10 border-2 rounded-lg font-mono ${
                        errors.gstNumber ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.gstNumber && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.gstNumber}
                      </p>
                    )}
                    <p className="text-gray-600 text-xs mt-1">
                      Format: 22AAAAA0000A1Z5 (15 characters)
                    </p>
                  </div>
                )}

                {/* Manual Verification */}
                {formData.verificationType === "manual" && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Manual Verification Required
                          </h4>
                          <p className="text-gray-700 text-sm">
                            Please provide your valid ID details to verify your business registration.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Select ID Type *
                      </label>
                      <select
                        value={formData.idType}
                        onChange={(e) =>
                          handleInputChange("idType", e.target.value)
                        }
                        disabled={loading}
                        className={`w-full h-10 border-2 rounded-lg text-sm text-gray-800 px-3 ${
                          errors.idType ? "border-red-500" : "border-gray-200"
                        }`}
                      >
                        <option value="">-- Select ID Type --</option>
                        <option value="aadhaar">Aadhaar Card</option>
                        <option value="pan">PAN Card</option>
                      </select>
                      {errors.idType && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.idType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {formData.idType === "aadhaar"
                          ? "Aadhaar Number"
                          : formData.idType === "pan"
                          ? "PAN Number"
                          : "ID Number"}{" "}
                        *
                      </label>
                      <Input
                        value={formData.idNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "idNumber",
                            formData.idType === "pan"
                              ? e.target.value.toUpperCase()
                              : e.target.value
                          )
                        }
                        placeholder={
                          formData.idType === "aadhaar"
                            ? "1234 5678 9012"
                            : formData.idType === "pan"
                            ? "ABCDE1234F"
                            : "Enter your ID number"
                        }
                        maxLength={
                          formData.idType === "aadhaar"
                            ? 14
                            : formData.idType === "pan"
                            ? 10
                            : 20
                        }
                        disabled={loading}
                        className={`h-10 border-2 rounded-lg font-mono ${
                          errors.idNumber ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.idNumber && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.idNumber}
                        </p>
                      )}
                      {formData.idType && (
                        <p className="text-gray-600 text-xs mt-1">
                          {formData.idType === "aadhaar"
                            ? "Format: 1234 5678 9012 (12 digits)"
                            : "Format: ABCDE1234F (5 letters + 4 digits + 1 letter)"}
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-blue-800 text-sm mb-1">
                            Document Upload
                          </h5>
                          <p className="text-blue-700 text-xs">
                            Document upload feature will be available soon. For now, verification will be done based on the ID details provided.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-3">
                  <div className="flex items-start space-x-3">
                    <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-blue-800 text-sm mb-1">
                        Profile Review Process
                      </h5>
                      <p className="text-blue-700 text-xs">
                        Your profile will be reviewed within 24-48 hours. You'll
                        receive an email notification once approved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1 || loading}
                className={`flex items-center px-6 py-2 rounded-xl font-semibold transition-all shadow-md ${
                  currentStep === 1 || loading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                    : "bg-gray-600 text-white hover:bg-gray-700 border border-gray-600 hover:shadow-lg"
                }`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className={`flex items-center px-6 py-2 rounded-xl font-semibold transition-all shadow-md ${
                  isStepValid() && !loading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : currentStep === 3 ? (
                  <>
                    Submit for Verification
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;