// src/components/onboarding/VendorOnboarding.jsx - Complete Responsive Version with Redirection Fix

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    verificationType: "gst",
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
    const stringValue = typeof value === 'string' ? value : String(value || '');
    
    setFormData((prev) => ({ 
      ...prev, 
      [field]: stringValue 
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

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

  // FIXED: Enhanced validation for manual verification
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
          // FIXED: Enhanced manual verification validation
          if (!formData.idType) {
            newErrors.idType = "Please select an ID type";
          }
          if (!formData.idNumber.trim()) {
            newErrors.idNumber = "ID number is required";
          } else {
            // FIXED: Better validation logic for manual verification
            const cleanIdNumber = formData.idNumber.replace(/\s/g, "");
            
            if (formData.idType === "aadhaar") {
              if (!/^\d{12}$/.test(cleanIdNumber)) {
                newErrors.idNumber = "Please enter a valid 12-digit Aadhaar number";
              }
            } else if (formData.idType === "pan") {
              if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idNumber.trim())) {
                newErrors.idNumber = "Please enter a valid PAN number (e.g., ABCDE1234F)";
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

  // PATCH: Enhanced completion handler with multiple fallback strategies
  const handleOnboardingComplete = () => {
    
    // Set completion flag immediately
    localStorage.setItem("vendorOnboarded", "true");
    
    // Show success message
    addToast(
      "Onboarding completed successfully! Welcome to VendorHub!",
      "success"
    );
    
    // FIXED: Multiple redirection strategies with error handling
    const redirectToHome = () => {
      try {
        
        // Strategy 1: Try onComplete callback first
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        } else {
          // Strategy 2: Direct navigation
          navigate("/", { replace: true });
        }
      } catch (navigationError) {
        console.error("Navigation failed:", navigationError);
        
        // Strategy 3: Force page reload as ultimate fallback
        window.location.href = "/";
      }
    };

    // FIXED: Immediate redirection for better UX, with fallback timeout
    try {
      redirectToHome();
    } catch (immediateError) {
      console.error("Immediate redirection failed:", immediateError);
      
      // Fallback with timeout
      setTimeout(() => {
        redirectToHome();
      }, 1500);
    }
  };

  // PATCH: Fixed handleNext function with enhanced manual verification support
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
          // FIXED: Enhanced step 3 data preparation with better error handling
          const step3Data = {
            verificationType: formData.verificationType,
          };

          // Add verification-specific data with validation
          if (formData.verificationType === "gst") {
            if (!formData.gstNumber || !formData.gstNumber.trim()) {
              throw new Error("GST number is required for GST verification");
            }
            step3Data.gstNumber = formData.gstNumber.trim();
          } else if (formData.verificationType === "manual") {
            // FIXED: Ensure all manual verification fields are properly included
            if (!formData.idType || !formData.idNumber || !formData.idNumber.trim()) {
              throw new Error("ID type and number are required for manual verification");
            }
            
            step3Data.idType = formData.idType;
            step3Data.idNumber = formData.idNumber.trim();
            
            // Optional: Add any additional manual verification fields if needed
            // step3Data.documentFile = formData.documentFile; // Uncomment if document upload is implemented
          }


          try {
            result = await vendorService.updateStep3(step3Data);
            addToast("Verification details updated successfully!", "success");
          } catch (serviceError) {
            console.error("Service error in step 3:", serviceError);
            throw new Error(serviceError.message || "Failed to update verification details");
          }
          break;

        default:
          throw new Error("Invalid step");
      }


      // Check if result exists and has completion data
      if (result && result.completion) {
        setCompletion(result.completion);

        // FIXED: More robust completion check
        if (result.completion.isComplete === true || 
            result.completion.completionPercentage >= 100 ||
            (currentStep === 3 && result.completion.steps && result.completion.steps.step3)) {
          
          handleOnboardingComplete();
          return;
        }
      } else {
        // FIXED: Fallback for when service doesn't return completion data
        console.warn("No completion data returned from service"); // Debug log
        
        // If we're on step 3 and the service call succeeded, assume completion
        if (currentStep === 3) {
          handleOnboardingComplete();
          return;
        }
      }

      // Move to next step only if not completed
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // FIXED: If we reach here on step 3, something went wrong
        console.error("Step 3 completed but not marked as complete");
        // Force completion as fallback
        handleOnboardingComplete();
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

  // PATCH: Enhanced step validation for manual verification
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
          // FIXED: Proper validation for manual verification
          const hasBasicFields = formData.idType && formData.idNumber && formData.idNumber.trim();
          if (!hasBasicFields) return false;

          const cleanIdNumber = formData.idNumber.replace(/\s/g, "");
          
          if (formData.idType === "aadhaar") {
            return /^\d{12}$/.test(cleanIdNumber);
          } else if (formData.idType === "pan") {
            return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idNumber.trim());
          }
          
          return true; // Allow other ID types if added in future
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg">
          <LoadingSpinner size="lg" text="Loading your profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl my-4 sm:my-0">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
              Join Our <span className="text-blue-200">Marketplace</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100">
              Complete your vendor profile to start selling
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300",
                      currentStep >= step.id
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-white border-2 border-gray-200 text-gray-400"
                    )}
                  >
                    {completion?.steps[`step${step.id}`] ? (
                      <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5" />
                    ) : (
                      <step.icon className="h-3 w-3 sm:h-5 sm:w-5" />
                    )}
                  </div>
                  <div className="mt-1 sm:mt-2 text-center">
                    <p
                      className={cn(
                        "text-xs sm:text-sm font-semibold",
                        currentStep >= step.id
                          ? "text-blue-600"
                          : "text-gray-500"
                      )}
                    >
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">{step.id}</span>
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-500",
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
        <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: "w-4 h-4 sm:w-5 sm:h-5",
                })}
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold">
                  Step {currentStep}: {steps[currentStep - 1].title}
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            {/* Step 1: Vendor Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Select your vendor type
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Choose the option that best describes your business
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {vendorTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleVendorTypeSelect(type.value)}
                      disabled={loading}
                      className={cn(
                        "relative group cursor-pointer rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 transition-all duration-300 hover:shadow-lg",
                        formData.vendorType === type.value
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {formData.vendorType === type.value && (
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-0.5 sm:p-1">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="text-center space-y-1 sm:space-y-2">
                        <div className="text-2xl sm:text-3xl">{type.icon}</div>
                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                          {type.label}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {errors.vendorType && (
                  <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                      <p className="text-red-800 text-xs sm:text-sm">
                        {errors.vendorType}
                      </p>
                    </div>
                  </div>
                )}

                {formData.vendorType && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800 text-sm sm:text-base">
                          Perfect Choice!
                        </h4>
                        <p className="text-green-700 text-xs sm:text-sm">
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
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Tell us about your business
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Provide your business details to complete your profile
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                      }
                      placeholder="Enter your business name"
                      disabled={loading}
                      className={`h-8 sm:h-10 border-2 rounded-md sm:rounded-lg text-sm ${
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
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Business Address Line 1 *
                    </label>
                    <Input
                      value={formData.businessAddress1}
                      onChange={(e) =>
                        handleInputChange("businessAddress1", e.target.value)
                      }
                      placeholder="Enter your business address"
                      disabled={loading}
                      className={`h-8 sm:h-10 border-2 rounded-md sm:rounded-lg text-sm ${
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
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Business Address Line 2 (Optional)
                    </label>
                    <Input
                      value={formData.businessAddress2}
                      onChange={(e) =>
                        handleInputChange("businessAddress2", e.target.value)
                      }
                      placeholder="Suite, apartment, etc."
                      disabled={loading}
                      className="h-8 sm:h-10 border-2 border-gray-200 rounded-md sm:rounded-lg text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        City *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="City"
                        disabled={loading}
                        className={`h-8 sm:h-10 border-2 rounded-md sm:rounded-lg text-sm ${
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
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        State *
                      </label>
                      <Input
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="State"
                        disabled={loading}
                        className={`h-8 sm:h-10 border-2 rounded-md sm:rounded-lg text-sm ${
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

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
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
                        className={`h-8 sm:h-10 border-2 rounded-md sm:rounded-lg text-sm ${
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
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Upload verification documents
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Please provide your verification details
                  </p>
                </div>

                {/* Radio Button Selection */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
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
                    <span className="text-gray-700 text-xs sm:text-sm font-medium">
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
                    <span className="text-gray-700 text-xs sm:text-sm font-medium">
                      Manual Verification
                    </span>
                  </label>
                </div>

                {/* GST Input */}
                {formData.verificationType === "gst" && (
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            GST Verification Required
                          </h4>
                          <p className="text-gray-700 text-xs sm:text-sm">
                            Please provide your valid GST number to verify your
                            business registration.
                          </p>
                        </div>
                      </div>
                    </div>

                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mt-3 sm:mt-4">
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
                      className={`h-8 sm:h-10 border-2 rounded-md sm:rounded-lg font-mono text-sm ${
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
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            Manual Verification Required
                          </h4>
                          <p className="text-gray-700 text-xs sm:text-sm">
                            Please provide your valid ID details to verify your business registration.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Select ID Type *
                      </label>
                      <select
                        value={formData.idType}
                        onChange={(e) =>
                          handleInputChange("idType", e.target.value)
                        }
                        disabled={loading}
                        className={`w-full h-8 sm:h-10 border-2 rounded-md sm:rounded-lg text-xs sm:text-sm text-gray-800 px-2 sm:px-3 ${
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
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
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
                        className={`h-8 sm:h-10 border-2 rounded-md sm:rounded-lg font-mono text-sm ${
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

                    <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <InfoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-blue-800 text-xs sm:text-sm mb-1">
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

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <InfoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-blue-800 text-xs sm:text-sm mb-1">
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
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-100">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1 || loading}
                className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold transition-all shadow-md text-sm sm:text-base order-2 sm:order-1 ${
                  currentStep === 1 || loading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                    : "bg-gray-600 text-white hover:bg-gray-700 border border-gray-600 hover:shadow-lg"
                }`}
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold transition-all shadow-md text-sm sm:text-base order-1 sm:order-2 ${
                  isStepValid() && !loading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2"></div>
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : currentStep === 3 ? (
                  <>
                    <span className="hidden sm:inline">Submit for Verification</span>
                    <span className="sm:hidden">Submit</span>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Next Step</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
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