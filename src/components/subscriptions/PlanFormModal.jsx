import React, { useState, useEffect } from "react";
import {
  X,
  Crown,
  Package,
  Star,
  Zap,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Save,
  Eye,
} from "lucide-react";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useToast } from "../ui/Toast";

const PlanFormModal = ({ isOpen, onClose, onSubmit, editingPlan = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    isActive: true,
    isPopular: false,
    limits: {
      products: "",
      inquiries: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { addToast } = useToast();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name || "",
        description: editingPlan.description || "",
        price: editingPlan.price?.toString() || "",
        originalPrice: editingPlan.originalPrice?.toString() || "",
        isActive: editingPlan.isActive ?? true,
        isPopular: editingPlan.isPopular ?? false,
        limits: {
          products: editingPlan.limits?.products?.toString() || "",
          inquiries: editingPlan.limits?.inquiries?.toString() || "",
        },
      });
    } else {
      // Reset form for new plan
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        isActive: true,
        isPopular: false,
        limits: {
          products: "",
          inquiries: "",
        },
      });
    }
    setErrors({});
  }, [editingPlan, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Plan name is required";
    } else if (formData.name.trim().length < 1) {
      newErrors.name = "Plan name must be at least 1 character";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Plan name must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required and must be positive";
    }

    if (
      formData.originalPrice &&
      (isNaN(formData.originalPrice) ||
        parseFloat(formData.originalPrice) <= 0 ||
        parseFloat(formData.originalPrice) <= parseFloat(formData.price))
    ) {
      newErrors.originalPrice =
        "Original price must be positive and higher than current price";
    }

    if (formData.limits.products && 
        (isNaN(formData.limits.products) || parseInt(formData.limits.products) <= 0)) {
      newErrors["limits.products"] = "Products limit must be a positive number";
    }

    if (formData.limits.inquiries && 
        (isNaN(formData.limits.inquiries) || parseInt(formData.limits.inquiries) <= 0)) {
      newErrors["limits.inquiries"] = "Inquiries limit must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      isActive: true,
      isPopular: false,
      limits: {
        products: "",
        inquiries: "",
      },
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast("Please fix the form errors before submitting", "error");
      return;
    }

    setLoading(true);

    try {
      // Prepare data according to backend schema
      const apiData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        isActive: formData.isActive,
        isPopular: formData.isPopular,
      };

      // Only include originalPrice if it's provided and valid
      if (formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price)) {
        apiData.originalPrice = parseFloat(formData.originalPrice);
      }

      // Only include limits if they have values
      const limits = {};
      if (formData.limits.products && parseInt(formData.limits.products) > 0) {
        limits.products = parseInt(formData.limits.products);
      }
      if (formData.limits.inquiries && parseInt(formData.limits.inquiries) > 0) {
        limits.inquiries = parseInt(formData.limits.inquiries);
      }
      
      // Only add limits if there are any
      if (Object.keys(limits).length > 0) {
        apiData.limits = limits;
      }

      console.log('Submitting plan data:', apiData);

      // Call the parent's onSubmit function
      await onSubmit(apiData);
      
      // If we reach here, submission was successful
      console.log('Plan submission successful, closing modal...');
      
      // Reset form for new plans
      if (!editingPlan) {
        resetForm();
      }
      
      // Close the modal
      onClose();
      
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done by parent component
      // Modal should stay open on error so user can fix issues
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing if it's a new plan
    if (!editingPlan) {
      resetForm();
    }
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return Package;
      case "professional":
      case "pro":
        return Zap;
      case "enterprise":
        return Crown;
      default:
        return Star;
    }
  };

  const getPlanGradient = (planName) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return "from-blue-500 to-blue-600";
      case "professional":
      case "pro":
        return "from-purple-500 to-purple-600";
      case "enterprise":
        return "from-yellow-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  // Get all features including limits for preview
  const getAllFeatures = () => {
    const features = [];

    // Add product limit if specified
    if (formData.limits.products && parseInt(formData.limits.products) > 0) {
      features.push({
        name: `Up to ${formData.limits.products} products`,
        included: true,
      });
    } else if (!formData.limits.products || formData.limits.products === "") {
      features.push({
        name: "Unlimited products",
        included: true,
      });
    }

    // Add inquiry limit if specified
    if (formData.limits.inquiries && parseInt(formData.limits.inquiries) > 0) {
      features.push({
        name: `Up to ${formData.limits.inquiries} inquiries per month`,
        included: true,
      });
    } else if (!formData.limits.inquiries || formData.limits.inquiries === "") {
      features.push({
        name: "Unlimited inquiries per month",
        included: true,
      });
    }

    return features;
  };

  const PreviewCard = () => {
    const IconComponent = getPlanIcon(formData.name);
    const gradient = getPlanGradient(formData.name);
    const allFeatures = getAllFeatures();

    return (
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] max-w-sm mx-auto ${
          formData.isPopular ? "ring-2 ring-purple-500 ring-offset-4" : ""
        }`}
      >
        {formData.isPopular && (
          <div className="absolute mt-2 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>Most Popular</span>
            </div>
          </div>
        )}

        <Card className="h-full border-0 shadow-2xl bg-white relative overflow-hidden">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${gradient} p-6 text-white relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2">
                {formData.name || "Plan Name"}
              </h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                {formData.description || "Plan description will appear here"}
              </p>

              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">
                  {formData.price
                    ? formatCurrency(parseFloat(formData.price))
                    : "₹0"}
                </span>
                <span className="text-white/80 ml-2 font-medium">
                  /month
                </span>
              </div>

              {formData.originalPrice &&
                parseFloat(formData.originalPrice) >
                  parseFloat(formData.price || 0) && (
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60 line-through text-sm">
                      {formatCurrency(parseFloat(formData.originalPrice))}
                    </span>
                    <Badge className="bg-green-500/20 text-green-100 border-green-300/30 text-xs px-2 py-1">
                      Save{" "}
                      {Math.round(
                        ((parseFloat(formData.originalPrice) -
                          parseFloat(formData.price || 0)) /
                          parseFloat(formData.originalPrice)) *
                          100
                      )}
                      %
                    </Badge>
                  </div>
                )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-900 text-sm mb-3">
                Features:
              </h4>
              <div className="space-y-3">
                {allFeatures.length > 0 ? (
                  allFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <X className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No features added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div
              className={`h-full transition-all duration-300 ${
                formData.isActive 
                  ? `bg-gradient-to-r ${gradient}` 
                  : "bg-gray-300"
              }`}
            />
          </div>
        </Card>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div>
      {/* Full Screen Backdrop */}
      <div
        className="modal-backdrop"
        onClick={handleClose}
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 50000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Modal Content */}
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "95vw",
            maxWidth: "1400px",
            height: "95vh",
            maxHeight: "95vh",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editingPlan ? "Edit Subscription Plan" : "Create New Plan"}
              </h2>
              <p className="text-gray-600 text-base lg:text-lg mt-1">
                {editingPlan
                  ? "Update the plan details and features"
                  : "Configure your new subscription plan"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex h-full" style={{ height: "calc(100% - 100px)" }}>
            {/* Form Section - Takes up more space */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="e.g., Basic, Professional, Enterprise"
                      className={`h-12 text-base ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      maxLength={100}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe what this plan offers..."
                      rows={4}
                      className={`w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.description ? "border-red-500" : ""
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Pricing
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="999"
                        min="0.01"
                        step="0.01"
                        className={`h-12 text-base ${
                          errors.price ? "border-red-500" : ""
                        }`}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (₹)
                        <span className="text-gray-500 text-xs ml-1">
                          (optional)
                        </span>
                      </label>
                      <Input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          handleInputChange("originalPrice", e.target.value)
                        }
                        placeholder="1299"
                        min="0.01"
                        step="0.01"
                        className={`h-12 text-base ${
                          errors.originalPrice ? "border-red-500" : ""
                        }`}
                      />
                      {errors.originalPrice && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Plan Settings */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Plan Settings
                  </h3>

                  <div className="flex flex-wrap gap-8">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          handleInputChange("isActive", e.target.checked)
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-base font-medium text-gray-700">
                        Active Plan
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) =>
                          handleInputChange("isPopular", e.target.checked)
                        }
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-base font-medium text-gray-700 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                        Mark as Popular
                      </span>
                    </label>
                  </div>
                </div>

                {/* Limits */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Plan Limits
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Products Limit
                        <span className="text-gray-500 text-xs ml-1">
                          (leave empty for unlimited)
                        </span>
                      </label>
                      <Input
                        type="number"
                        value={formData.limits.products}
                        onChange={(e) =>
                          handleInputChange("limits.products", e.target.value)
                        }
                        placeholder="50"
                        min="1"
                        className={`h-12 text-base ${
                          errors["limits.products"] ? "border-red-500" : ""
                        }`}
                      />
                      {errors["limits.products"] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors["limits.products"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiries Limit
                        <span className="text-gray-500 text-xs ml-1">
                          (leave empty for unlimited)
                        </span>
                      </label>
                      <Input
                        type="number"
                        value={formData.limits.inquiries}
                        onChange={(e) =>
                          handleInputChange("limits.inquiries", e.target.value)
                        }
                        placeholder="100"
                        min="1"
                        className={`h-12 text-base ${
                          errors["limits.inquiries"] ? "border-red-500" : ""
                        }`}
                      />
                      {errors["limits.inquiries"] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors["limits.inquiries"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 sm:flex-none sm:w-32 h-12"
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 sm:flex-none sm:w-40 h-12 xl:hidden"
                    disabled={loading}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? "Hide" : "Show"} Preview
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingPlan ? "Update Plan" : "Create Plan"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Preview Section - Fixed width sidebar */}
            <div
              className={`w-96 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200 p-6 overflow-y-auto ${
                showPreview ? "block xl:block" : "hidden xl:block"
              }`}
            >
              <div className="sticky top-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Live Preview
                  </h3>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    Updates in real-time
                  </Badge>
                </div>

                <PreviewCard />

                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">
                    Plan Summary
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Billing:</span>
                      <span className="text-gray-600">Monthly</span>
                    </div>
                    {formData.price && (
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="text-gray-900 font-medium">
                          {formatCurrency(parseFloat(formData.price))}
                        </span>
                      </div>
                    )}
                    {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price || 0) && (
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="text-green-600 font-medium">
                          {Math.round(
                            ((parseFloat(formData.originalPrice) -
                              parseFloat(formData.price || 0)) /
                              parseFloat(formData.originalPrice)) *
                              100
                          )}% off
                        </span>
                      </div>
                    )}
                    {formData.limits.products && (
                      <div className="flex justify-between">
                        <span>Products:</span>
                        <span className="text-gray-600">
                          {formData.limits.products} max
                        </span>
                      </div>
                    )}
                    {formData.limits.inquiries && (
                      <div className="flex justify-between">
                        <span>Inquiries:</span>
                        <span className="text-gray-600">
                          {formData.limits.inquiries}/month
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanFormModal;