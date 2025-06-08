import React, { useState, useEffect, useRef } from "react";
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

  const hasLoadedProfile = useRef(false);
  const isNavigating = useRef(false);

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

  // Load profile only once
  useEffect(() => {
    const loadVendorProfile = async () => {
      if (hasLoadedProfile.current) {
        return;
      }

      try {
        setInitialLoading(true);
        hasLoadedProfile.current = true;

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
        }

        // Always start from step 1 for proper flow
        setCurrentStep(1);
      } catch (error) {
        console.error("Failed to load vendor profile:", error);
        addToast("Failed to load your profile. Starting fresh.", "warning");
        setCurrentStep(1);
      } finally {
        setInitialLoading(false);
      }
    };

    loadVendorProfile();
  }, []);

  // Monitor step changes
  useEffect(() => {}, [currentStep]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
            const cleanIdNumber = formData.idNumber.replace(/\s/g, "");

            if (formData.idType === "aadhaar") {
              if (!/^\d{12}$/.test(cleanIdNumber)) {
                newErrors.idNumber =
                  "Please enter a valid 12-digit Aadhaar number";
              }
            } else if (formData.idType === "pan") {
              if (
                !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idNumber.trim())
              ) {
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
    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("vendorOnboarded", "true");

    addToast(
      "Onboarding completed successfully! Welcome to VendorHub!",
      "success"
    );

    const redirectToHome = () => {
      try {
        if (onComplete && typeof onComplete === "function") {
          onComplete();
        } else {
          navigate("/", { replace: true });
        }
      } catch (navigationError) {
        console.error("Navigation failed:", navigationError);
        window.location.href = "/";
      }
    };

    try {
      redirectToHome();
    } catch (immediateError) {
      console.error("Immediate redirection failed:", immediateError);
      setTimeout(() => {
        redirectToHome();
      }, 1500);
    }
  };

  const handleNext = async () => {
    if (isNavigating.current) {
      return;
    }

    if (!validateStep(currentStep)) {
      return;
    }

    isNavigating.current = true;
    setLoading(true);

    try {
      let result;

      switch (currentStep) {
        case 1:
          result = await vendorService.updateStep1(formData.vendorType);
          addToast("Vendor type updated successfully!", "success");
          break;

        case 2:
          const step2Data = {
            businessName: formData.businessName,
            businessAddress1: formData.businessAddress1,
            businessAddress2: formData.businessAddress2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
          };
          result = await vendorService.updateStep2(step2Data);
          addToast("Business information updated successfully!", "success");
          break;

        case 3:
          const step3Data = {
            verificationType: formData.verificationType,
          };

          if (formData.verificationType === "gst") {
            if (!formData.gstNumber || !formData.gstNumber.trim()) {
              throw new Error("GST number is required for GST verification");
            }
            step3Data.gstNumber = formData.gstNumber.trim();
          } else if (formData.verificationType === "manual") {
            if (
              !formData.idType ||
              !formData.idNumber ||
              !formData.idNumber.trim()
            ) {
              throw new Error(
                "ID type and number are required for manual verification"
              );
            }
            step3Data.idType = formData.idType;
            step3Data.idNumber = formData.idNumber.trim();
          }

          result = await vendorService.updateStep3(step3Data);
          addToast("Verification details updated successfully!", "success");

          setLoading(false);
          isNavigating.current = false;
          handleOnboardingComplete();
          return;

        default:
          throw new Error("Invalid step");
      }

      // Update completion status without affecting navigation
      if (result && result.completion) {
        setCompletion(result.completion);
      }

      // Simple step increment after successful API call
      if (currentStep < 3) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
      }
    } catch (error) {
      console.error("❌ Failed to update step:", error);
      addToast(error.message || "Failed to update. Please try again.", "error");
    } finally {
      setLoading(false);
      isNavigating.current = false;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    let valid = false;

    switch (currentStep) {
      case 1:
        valid = formData.vendorType !== "";
        break;

      case 2:
        valid =
          formData.businessName &&
          formData.businessAddress1 &&
          formData.city &&
          formData.state &&
          formData.postalCode &&
          /^\d{6}$/.test(formData.postalCode);
        break;

      case 3:
        if (formData.verificationType === "gst") {
          valid =
            formData.gstNumber &&
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
              formData.gstNumber
            );
        } else if (formData.verificationType === "manual") {
          const hasBasicFields =
            formData.idType && formData.idNumber && formData.idNumber.trim();
          if (!hasBasicFields) {
            valid = false;
            break;
          }

          const cleanIdNumber = formData.idNumber.replace(/\s/g, "");

          if (formData.idType === "aadhaar") {
            valid = /^\d{12}$/.test(cleanIdNumber);
          } else if (formData.idType === "pan") {
            valid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idNumber.trim());
          } else {
            valid = true;
          }
        }
        break;

      default:
        valid = false;
    }

    return valid;
  };

  const progressPercentage = completion
    ? completion.completionPercentage
    : (currentStep / 3) * 100;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg">
          <LoadingSpinner size="lg" text="Loading your profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl my-4 sm:my-6 lg:my-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-4">
            <h1 className="text-md sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold mb-2">
              Join Our <span className="text-blue-200">Marketplace</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-blue-100">
              Complete your vendor profile to start selling
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-sm lg:text-base font-bold transition-all duration-300",
                      currentStep >= step.id
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-white border-2 border-gray-200 text-gray-400"
                    )}
                  >
                    {completion?.steps[`step${step.id}`] ? (
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                    ) : (
                      <step.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        "text-xs sm:text-sm lg:text-base font-semibold",
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
                      "flex-1 h-1 mx-2 sm:mx-4 lg:mx-6 rounded-full transition-all duration-500",
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
        <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 rounded-xl lg:rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 lg:p-8 text-white">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7",
                })}
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                  Step {currentStep}: {steps[currentStep - 1].title}
                </h2>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 lg:space-y-8">
            {/* Step 1: Vendor Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-4 lg:space-y-6">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    Select your vendor type
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                    Choose the option that best describes your business
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {vendorTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleVendorTypeSelect(type.value)}
                      disabled={loading}
                      className={cn(
                        "relative group cursor-pointer rounded-xl lg:rounded-2xl border-2 p-4 lg:p-6 transition-all duration-300 hover:shadow-lg",
                        formData.vendorType === type.value
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {formData.vendorType === type.value && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1">
                            <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="text-center space-y-2 lg:space-y-3">
                        <div className="text-3xl lg:text-4xl">{type.icon}</div>
                        <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                          {type.label}
                        </h4>
                        <p className="text-sm lg:text-base text-gray-600">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {errors.vendorType && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 lg:p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5 text-red-600 flex-shrink-0" />
                      <p className="text-red-800 text-sm lg:text-base">
                        {errors.vendorType}
                      </p>
                    </div>
                  </div>
                )}

                {formData.vendorType && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 lg:p-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800 text-base lg:text-lg">
                          Perfect Choice!
                        </h4>
                        <p className="text-green-700 text-sm lg:text-base">
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
              <div className="space-y-4 lg:space-y-6">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    Tell us about your business
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                    Provide your business details to complete your profile
                  </p>
                </div>

                <div className="space-y-4 lg:space-y-6">
                  <div>
                    <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                      }
                      placeholder="Enter your business name"
                      disabled={loading}
                      className={`h-10 lg:h-12 border-2 rounded-lg text-sm lg:text-base ${
                        errors.businessName
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
                      Business Address Line 1 *
                    </label>
                    <Input
                      value={formData.businessAddress1}
                      onChange={(e) =>
                        handleInputChange("businessAddress1", e.target.value)
                      }
                      placeholder="Enter your business address"
                      disabled={loading}
                      className={`h-10 lg:h-12 border-2 rounded-lg text-sm lg:text-base ${
                        errors.businessAddress1
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.businessAddress1 && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.businessAddress1}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
                      Business Address Line 2 (Optional)
                    </label>
                    <Input
                      value={formData.businessAddress2}
                      onChange={(e) =>
                        handleInputChange("businessAddress2", e.target.value)
                      }
                      placeholder="Suite, apartment, etc."
                      disabled={loading}
                      className="h-10 lg:h-12 border-2 border-gray-200 rounded-lg text-sm lg:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="City"
                        disabled={loading}
                        className={`h-10 lg:h-12 border-2 rounded-lg text-sm lg:text-base ${
                          errors.city ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <Input
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="State"
                        disabled={loading}
                        className={`h-10 lg:h-12 border-2 rounded-lg text-sm lg:text-base ${
                          errors.state ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
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
                        className={`h-10 lg:h-12 border-2 rounded-lg text-sm lg:text-base ${
                          errors.postalCode
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
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
              <div className="space-y-4 lg:space-y-6">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    Upload verification documents
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                    Please provide your verification details
                  </p>
                </div>

                {/* Radio Button Selection */}
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                  <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                    Choose Verification Method
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <label
                      className={`flex items-center space-x-3 p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-white ${
                        formData.verificationType === "gst"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="verificationType"
                        value="gst"
                        checked={formData.verificationType === "gst"}
                        onChange={() =>
                          handleInputChange("verificationType", "gst")
                        }
                        className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5"
                      />
                      <div>
                        <span className="text-gray-900 text-sm lg:text-base font-semibold block">
                          GST Verification
                        </span>
                        <span className="text-gray-600 text-xs lg:text-sm">
                          Quick verification using GST number
                        </span>
                      </div>
                    </label>
                    <label
                      className={`flex items-center space-x-3 p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-white ${
                        formData.verificationType === "manual"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="verificationType"
                        value="manual"
                        checked={formData.verificationType === "manual"}
                        onChange={() =>
                          handleInputChange("verificationType", "manual")
                        }
                        className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5"
                      />
                      <div>
                        <span className="text-gray-900 text-sm lg:text-base font-semibold block">
                          Manual Verification
                        </span>
                        <span className="text-gray-600 text-xs lg:text-sm">
                          Verify using government ID
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* GST Verification Section */}
                {formData.verificationType === "gst" && (
                  <div className="space-y-4 lg:space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 lg:p-6">
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base lg:text-lg mb-1">
                            GST Verification Required
                          </h4>
                          <p className="text-gray-700 text-sm lg:text-base">
                            Please provide your valid GST number to verify your
                            business registration. This helps us ensure the
                            authenticity of your business.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
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
                        className={`h-10 lg:h-12 border-2 rounded-lg font-mono text-sm lg:text-base ${
                          errors.gstNumber
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      />
                      {errors.gstNumber && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.gstNumber}
                        </p>
                      )}
                      <p className="text-gray-600 text-xs lg:text-sm mt-1">
                        Format: 22AAAAA0000A1Z5 (15 characters)
                      </p>
                    </div>

                    {formData.gstNumber && formData.gstNumber.length === 15 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 lg:p-6">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                          <div>
                            <h4 className="font-semibold text-green-800 text-base lg:text-lg">
                              GST Number Format Valid
                            </h4>
                            <p className="text-green-700 text-sm lg:text-base">
                              Your GST number appears to be in the correct
                              format.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Verification Section */}
                {formData.verificationType === "manual" && (
                  <div className="space-y-4 lg:space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 lg:p-6">
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base lg:text-lg mb-1">
                            Manual Verification Required
                          </h4>
                          <p className="text-gray-700 text-sm lg:text-base">
                            Please provide your valid government ID details to
                            verify your business registration. We support
                            Aadhaar and PAN card verification.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
                          Select ID Type *
                        </label>
                        <select
                          value={formData.idType}
                          onChange={(e) =>
                            handleInputChange("idType", e.target.value)
                          }
                          disabled={loading}
                          className={`w-full h-10 lg:h-12 border-2 rounded-lg text-sm lg:text-base text-gray-800 px-3 lg:px-4 bg-white ${
                            errors.idType ? "border-red-500" : "border-gray-200"
                          }`}
                        >
                          <option value="">-- Select ID Type --</option>
                          <option value="aadhaar">Aadhaar Card</option>
                          <option value="pan">PAN Card</option>
                        </select>
                        {errors.idType && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.idType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2">
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
                          className={`h-10 lg:h-12 border-2 rounded-lg font-mono text-sm lg:text-base ${
                            errors.idNumber
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                        />
                        {errors.idNumber && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.idNumber}
                          </p>
                        )}
                        {formData.idType && (
                          <p className="text-gray-600 text-xs lg:text-sm mt-1">
                            {formData.idType === "aadhaar"
                              ? "Format: 1234 5678 9012 (12 digits)"
                              : "Format: ABCDE1234F (5 letters + 4 digits + 1 letter)"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ID Validation Status */}
                    {formData.idType && formData.idNumber && (
                      <div className="space-y-3">
                        {(() => {
                          const cleanIdNumber = formData.idNumber.replace(
                            /\s/g,
                            ""
                          );
                          let isValid = false;
                          let message = "";

                          if (formData.idType === "aadhaar") {
                            isValid = /^\d{12}$/.test(cleanIdNumber);
                            message = isValid
                              ? "Aadhaar number format is valid"
                              : "Please enter a valid 12-digit Aadhaar number";
                          } else if (formData.idType === "pan") {
                            isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
                              formData.idNumber.trim()
                            );
                            message = isValid
                              ? "PAN number format is valid"
                              : "Please enter a valid PAN number (ABCDE1234F)";
                          }

                          return (
                            <div
                              className={`border rounded-xl p-4 lg:p-6 ${
                                isValid
                                  ? "bg-green-50 border-green-200"
                                  : "bg-red-50 border-red-200"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {isValid ? (
                                  <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                                )}
                                <div>
                                  <h4
                                    className={`font-semibold text-base lg:text-lg ${
                                      isValid
                                        ? "text-green-800"
                                        : "text-red-800"
                                    }`}
                                  >
                                    {isValid
                                      ? "Format Valid"
                                      : "Format Invalid"}
                                  </h4>
                                  <p
                                    className={`text-sm lg:text-base ${
                                      isValid
                                        ? "text-green-700"
                                        : "text-red-700"
                                    }`}
                                  >
                                    {message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 lg:p-6">
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <InfoIcon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-semibold text-blue-800 text-sm lg:text-base mb-1">
                            Document Upload
                          </h5>
                          <p className="text-blue-700 text-xs lg:text-sm">
                            Document upload feature will be available soon. For
                            now, verification will be done based on the ID
                            details provided above.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* General Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 lg:p-6">
                  <div className="flex items-start space-x-3 lg:space-x-4">
                    <InfoIcon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-blue-800 text-base lg:text-lg mb-2">
                        Profile Review Process
                      </h5>
                      <div className="space-y-1 text-blue-700 text-sm lg:text-base">
                        <p>
                          • Your profile will be reviewed within 24-48 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-6 lg:pt-8 border-t border-gray-100">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1 || loading}
                className={`flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold transition-all shadow-md text-sm lg:text-base order-2 sm:order-1 ${
                  currentStep === 1 || loading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                    : "bg-gray-600 text-white hover:bg-gray-700 border border-gray-600 hover:shadow-lg"
                }`}
              >
                <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className={`flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold transition-all shadow-md text-sm lg:text-base order-1 sm:order-2 ${
                  isStepValid() && !loading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : currentStep === 3 ? (
                  <>
                    <span className="hidden sm:inline">
                      Complete Onboarding
                    </span>
                    <span className="sm:hidden">Complete</span>
                    <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 ml-2" />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Next Step</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-2" />
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
