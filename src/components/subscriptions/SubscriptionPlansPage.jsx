import React, { useState, useEffect } from "react";
import {
  Crown,
  Plus,
  Edit,
  Trash2,
  Package,
  Users,
  BarChart3,
  Star,
  Zap,
  Shield,
  CheckCircle,
  X,
  Eye,
  MoreVertical,
  Sparkles,
  Palette,
  DollarSign,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useToast } from "../ui/Toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import PlanFormModal from "./PlanFormModal";

// Mock data - replace with actual API calls
const mockPlans = [
  {
    id: "1",
    name: "Basic",
    description: "Perfect for small businesses just getting started",
    price: 999,
    originalPrice: 1299,
    billingPeriod: "month",
    isActive: true,
    isPopular: false,
    limits: {
      products: 50,
      inquiries: 100,
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-02-01",
  },
  {
    id: "2",
    name: "Professional",
    description: "Ideal for growing businesses with advanced needs",
    price: 2499,
    originalPrice: 2999,
    billingPeriod: "month",
    isActive: true,
    isPopular: true,
    limits: {
      products: 500,
      inquiries: 1000,
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-02-15",
  },
  {
    id: "3",
    name: "Enterprise",
    description: "Complete solution for large organizations",
    price: 4999,
    originalPrice: null,
    billingPeriod: "month",
    isActive: true,
    isPopular: false,
    limits: {
      products: -1,
      inquiries: -1,
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-03-01",
  },
];

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPlans(mockPlans);
    } catch (error) {
      console.error("Failed to load plans:", error);
      addToast("Failed to load subscription plans", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      setActionLoading((prev) => ({ ...prev, [planId]: true }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === planId ? { ...plan, isActive: !currentStatus } : plan
        )
      );

      addToast(
        `Plan ${!currentStatus ? "activated" : "deactivated"} successfully`,
        "success"
      );
    } catch (error) {
      addToast("Failed to update plan status", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [planId]: false }));
    }
  };

  const handleDeletePlan = async (planId) => {
    if (
      !confirm(
        "Are you sure you want to delete this plan? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [planId]: true }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
      addToast("Plan deleted successfully", "success");
    } catch (error) {
      addToast("Failed to delete plan", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [planId]: false }));
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  const handleFormSubmit = async (planData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingPlan) {
        // Update existing plan
        setPlans((prev) =>
          prev.map((plan) =>
            plan.id === editingPlan.id
              ? { ...plan, ...planData, updatedAt: new Date().toISOString() }
              : plan
          )
        );
        addToast("Plan updated successfully", "success");
      } else {
        // Add new plan
        const newPlan = {
          id: Date.now().toString(),
          ...planData,
          subscribers: 0,
          revenue: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPlans((prev) => [...prev, newPlan]);
        addToast("Plan created successfully", "success");
      }

      handleFormClose();
    } catch (error) {
      addToast("Failed to save plan", "error");
      throw error;
    }
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
        return "from-purple-500 to-purple-600";
      case "enterprise":
        return "from-yellow-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const PlanCard = ({ plan }) => {
    const IconComponent = getPlanIcon(plan.name);
    const gradient = getPlanGradient(plan.name);
    const isActionLoading = actionLoading[plan.id];

    return (
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
          plan.isPopular ? "ring-2 ring-purple-500 ring-offset-4" : ""
        }`}
      >
        {plan.isPopular && (
          <div className="absolute mt-2 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1 border-2 border-white">
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
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-2">
                  {!plan.isActive && (
                    <Badge className="bg-red-500/20 text-red-100 border-red-300/30">
                      Inactive
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                        disabled={isActionLoading}
                      >
                        {isActionLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <MoreVertical className="w-4 h-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleStatus(plan.id, plan.isActive)
                        }
                      >
                        {plan.isActive ? (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                {plan.description}
              </p>

              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-white/80 ml-2 font-medium">
                  /{plan.billingPeriod}
                </span>
              </div>

              {plan.originalPrice && plan.originalPrice > plan.price && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 line-through text-sm">
                    {formatCurrency(plan.originalPrice)}
                  </span>
                  <Badge className="bg-green-500/20 text-green-100 border-green-300/30 text-xs px-2 py-1">
                    Save{" "}
                    {Math.round(
                      ((plan.originalPrice - plan.price) / plan.originalPrice) *
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
            {/* Feature Highlight */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm mb-1">
                    Key Feature
                  </div>
                  {/* <div className="text-gray-700 text-sm">
                    {plan.features[0]?.name || "Feature details"}
                  </div> */}
                </div>
              </div>
            </div>

            {/* Usage Limits Display */}
            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {plan.limits.products === -1 ? "∞" : plan.limits.products}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Products
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {plan.limits.inquiries === -1 ? "∞" : plan.limits.inquiries}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Inquiries
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div
              className={`h-full transition-all duration-300 ${
                plan.isActive ? `bg-gradient-to-r ${gradient}` : "bg-gray-300"
              }`}
            />
          </div>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full max-w-none space-y-6">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Loading subscription plans..." />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8 lg:p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Subscription <span className="text-yellow-300">Plans</span>
              </h1>
              <p className="text-purple-100 text-lg sm:text-xl lg:text-2xl max-w-3xl">
                Manage and customize your platform's subscription offerings
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddPlan}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Plan
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{plans.length}</div>
              <div className="text-purple-100 text-sm">Total Plans</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">
                {plans.filter((p) => p.isActive).length}
              </div>
              <div className="text-purple-100 text-sm">Active Plans</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">
                {plans.reduce((sum, plan) => sum + plan.subscribers, 0)}
              </div>
              <div className="text-purple-100 text-sm">Total Subscribers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className="text-center py-12">
          <Crown className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No subscription plans yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first subscription plan to get started.
          </p>
          <Button
            onClick={handleAddPlan}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      {/* Plan Form Modal */}
      {isFormOpen && (
        <PlanFormModal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editingPlan={editingPlan}
        />
      )}
    </div>
  );
};

export default SubscriptionPlansPage;
