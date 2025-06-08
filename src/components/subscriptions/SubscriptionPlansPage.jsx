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
  RefreshCw,
  AlertTriangle,
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
import { subscriptionService } from "../../services/subscriptionService";

// Custom Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, planName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Delete Subscription Plan</h3>
              <p className="text-red-100 text-sm mt-1">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the <span className="font-semibold text-gray-900">"{planName}"</span> subscription plan?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Warning:</p>
                  <ul className="space-y-1 text-red-600">
                    <li>• All active subscriptions will be affected</li>
                    <li>• Subscriber data will be preserved</li>
                    <li>• This action is permanent and cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    planId: null,
    planName: '',
    loading: false
  });
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalSubscribers: 0,
    totalRevenue: 0,
  });
  const { addToast } = useToast();

  useEffect(() => {
    loadPlans();
    loadStats();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);

      const response = await subscriptionService.getPlans();

      if (response.success) {
        const plansData = response.data.plans || [];
        setPlans(plansData);

        // Calculate stats from plans data
        setStats({
          totalPlans: plansData.length,
          activePlans: plansData.filter((p) => p.isActive).length,
          totalSubscribers: plansData.reduce(
            (sum, plan) => sum + (plan.subscribers || 0),
            0
          ),
          totalRevenue: plansData.reduce(
            (sum, plan) => sum + (plan.subscribers || 0) * (plan.price || 0),
            0
          ),
        });
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
      addToast(error.message || "Failed to load subscription plans", "error");

      // Set empty state on error
      setPlans([]);
      setStats({
        totalPlans: 0,
        activePlans: 0,
        totalSubscribers: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await subscriptionService.getSubscriptionStats();
      if (response.success) {
        setStats((prevStats) => ({
          ...prevStats,
          ...response.data,
        }));
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
      // Don't show error toast for stats as it's secondary information
    }
  };

  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      setActionLoading((prev) => ({ ...prev, [planId]: true }));

      const response = await subscriptionService.updatePlanStatus(
        planId,
        !currentStatus
      );

      if (response.success) {
        setPlans((prev) =>
          prev.map((plan) =>
            plan.id === planId ? { ...plan, isActive: !currentStatus } : plan
          )
        );

        addToast(response.message, "success");

        // Update stats
        setStats((prev) => ({
          ...prev,
          activePlans: prev.activePlans + (!currentStatus ? 1 : -1),
        }));
      }
    } catch (error) {
      console.error("Failed to update plan status:", error);
      addToast(error.message || "Failed to update plan status", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [planId]: false }));
    }
  };

  const handleDeletePlan = async (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setDeleteDialog({
      isOpen: true,
      planId: planId,
      planName: plan.name,
      loading: false
    });
  };

  const confirmDeletePlan = async () => {
    const { planId } = deleteDialog;
    
    try {
      setDeleteDialog(prev => ({ ...prev, loading: true }));

      const response = await subscriptionService.deletePlan(planId);

      if (response.success) {
        setPlans((prev) => prev.filter((plan) => plan.id !== planId));
        addToast(response.message, "success");

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalPlans: prev.totalPlans - 1,
        }));

        // Close dialog
        setDeleteDialog({
          isOpen: false,
          planId: null,
          planName: '',
          loading: false
        });
      }
    } catch (error) {
      console.error("Failed to delete plan:", error);
      addToast(error.message || "Failed to delete plan", "error");
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const closeDeleteDialog = () => {
    if (deleteDialog.loading) return; // Prevent closing while loading
    
    setDeleteDialog({
      isOpen: false,
      planId: null,
      planName: '',
      loading: false
    });
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
      let response;

      console.log("Form submission - editingPlan:", editingPlan);
      console.log("Form submission - planData:", planData);

      if (editingPlan) {
        // Update existing plan
        console.log("Updating plan with ID:", editingPlan.id);
        response = await subscriptionService.updatePlan(
          editingPlan.id,
          planData
        );

        if (response.success) {
          console.log("Plan updated successfully:", response.data);
          setPlans((prev) =>
            prev.map((plan) =>
              plan.id === editingPlan.id
                ? {
                    ...plan,
                    ...response.data,
                    id: editingPlan.id, // Ensure ID is preserved
                    updatedAt: new Date().toISOString(),
                  }
                : plan
            )
          );

          addToast(response.message || "Plan updated successfully", "success");
        } else {
          throw new Error(response.message || "Failed to update plan");
        }
      } else {
        // Create new plan
        console.log("Creating new plan");
        response = await subscriptionService.createPlan(planData);

        if (response.success) {
          console.log("Plan created successfully:", response.data);

          // Ensure the new plan has all required fields
          const newPlan = {
            ...response.data,
            id: response.data.id || Date.now().toString(), // Fallback ID if not provided
            subscribers: response.data.subscribers || 0,
            createdAt: response.data.createdAt || new Date().toISOString(),
            updatedAt: response.data.updatedAt || new Date().toISOString(),
          };

          setPlans((prev) => [...prev, newPlan]);

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalPlans: prev.totalPlans + 1,
            activePlans: newPlan.isActive
              ? prev.activePlans + 1
              : prev.activePlans,
          }));

          addToast(response.message || "Plan created successfully", "success");
        } else {
          throw new Error(response.message || "Failed to create plan");
        }
      }

      // If we reach here, the operation was successful
      console.log("Plan operation completed successfully");
    } catch (error) {
      console.error("Failed to save plan:", error);

      // Show error message to user
      addToast(error.message || "Failed to save plan", "error");

      // Re-throw the error to prevent modal from closing
      throw error;
    }
  };

  const handleRefresh = () => {
    loadPlans();
    loadStats();
  };

  const formatCurrency = (amount) => {
    return subscriptionService.formatCurrency(amount);
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

    // Calculate discount if originalPrice exists
    const hasDiscount = plan.originalPrice && plan.originalPrice > plan.price;
    const discountPercentage = hasDiscount
      ? subscriptionService.calculateDiscount(plan.originalPrice, plan.price)
      : 0;

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
              </div>

              {hasDiscount && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 line-through text-sm">
                    {formatCurrency(plan.originalPrice)}
                  </span>
                  <Badge className="bg-green-500/20 text-green-100 border-green-300/30 text-xs px-2 py-1">
                    Save {discountPercentage}%
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Subscriber Count */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm mb-1">
                    Subscribers
                  </div>
                  <div className="text-gray-700 text-lg font-bold">
                    {plan.subscribers || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Limits Display */}
            {plan.limits && (
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  {plan.limits.products !== undefined && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {plan.limits.products || "∞"}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Products
                      </div>
                    </div>
                  )}
                  {plan.limits.inquiries !== undefined && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {plan.limits.inquiries || "∞"}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Inquiries
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Basic Features Display */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">
                Features
              </div>
              <div className="space-y-2">
                {/* Show limits as features */}
                {plan.limits?.products && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Up to {plan.limits.products} products
                    </span>
                  </div>
                )}
                {!plan.limits?.products && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Unlimited products
                    </span>
                  </div>
                )}

                {plan.limits?.inquiries && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Up to {plan.limits.inquiries} inquiries
                    </span>
                  </div>
                )}
                {!plan.limits?.inquiries && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Unlimited inquiries
                    </span>
                  </div>
                )}
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
                onClick={handleRefresh}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
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
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.totalPlans}</div>
              <div className="text-purple-100 text-sm">Total Plans</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.activePlans}</div>
              <div className="text-purple-100 text-sm">Active Plans</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
              <div className="text-purple-100 text-sm">Total Subscribers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="text-purple-100 text-sm">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {!loading && plans.length === 0 && (
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
      )}

      {/* Plans Grid */}
      {plans.length > 0 && (
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeletePlan}
        planName={deleteDialog.planName}
        loading={deleteDialog.loading}
      />
    </div>
  );
};

export default SubscriptionPlansPage;