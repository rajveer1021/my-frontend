// src/pages/SubscriptionPlans.jsx
import React, { useState, useEffect } from 'react';
import {
  Crown,
  Check,
  X,
  Star,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Package,
  Users,
  BarChart3,
  Headphones,
  Clock,
  Globe
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/helpers';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState({});
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/subscriptions/plans');
      
      if (response.success && response.data) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
      addToast('Failed to load subscription plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await apiService.get('/subscriptions/current');
      
      if (response.success && response.data) {
        setCurrentSubscription(response.data.subscription);
      }
    } catch (error) {
      // It's okay if no subscription exists
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      setSubscribing(prev => ({ ...prev, [planId]: true }));
      
      const response = await apiService.post('/subscriptions/subscribe', {
        planId
      });

      if (response.success) {
        addToast('Subscription activated successfully!', 'success');
        loadCurrentSubscription();
        
        // Redirect to payment if needed
        if (response.data.paymentUrl) {
          window.open(response.data.paymentUrl, '_blank');
        }
      }
    } catch (error) {
      addToast(error.message || 'Failed to subscribe', 'error');
    } finally {
      setSubscribing(prev => ({ ...prev, [planId]: false }));
    }
  };

  const getPlanIcon = (planType) => {
    switch (planType?.toLowerCase()) {
      case 'basic':
        return Package;
      case 'pro':
        return Zap;
      case 'enterprise':
        return Crown;
      default:
        return Star;
    }
  };

  const getPlanGradient = (planType) => {
    switch (planType?.toLowerCase()) {
      case 'basic':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'enterprise':
        return 'from-gold-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const isCurrentPlan = (planId) => {
    return currentSubscription && currentSubscription.planId === planId;
  };

  const isUpgrade = (planPrice) => {
    if (!currentSubscription) return true;
    return planPrice > currentSubscription.plan.price;
  };

  const PlanCard = ({ plan }) => {
    const IconComponent = getPlanIcon(plan.type);
    const gradient = getPlanGradient(plan.type);
    const isCurrent = isCurrentPlan(plan.id);
    const canSubscribe = !isCurrent && plan.isActive;
    const isPopular = plan.isPopular;

    return (
      <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
        isPopular ? 'ring-2 ring-purple-500 ring-offset-4' : ''
      }`}>
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </Badge>
          </div>
        )}

        <Card className="h-full border-0 shadow-2xl bg-white">
          {/* Header */}
          <div className={`bg-gradient-to-r ${gradient} p-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
                {isCurrent && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    Current Plan
                  </Badge>
                )}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-white/90 text-sm mb-4">{plan.description}</p>
              
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-white/80 ml-2">
                  /{plan.billingPeriod}
                </span>
              </div>
              
              {plan.originalPrice && plan.originalPrice > plan.price && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 line-through text-sm">
                    {formatCurrency(plan.originalPrice)}
                  </span>
                  <Badge className="bg-green-500/20 text-green-100 text-xs">
                    Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <CardContent className="p-6 flex-1">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
              
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                          <X className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      feature.included ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {feature.name}
                      {feature.limit && (
                        <span className="text-gray-500 ml-1">
                          ({feature.limit})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Limits */}
              {plan.limits && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2 text-sm">Plan Limits:</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {plan.limits.products && (
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {plan.limits.products === -1 ? 'Unlimited' : plan.limits.products} Products
                        </span>
                      </div>
                    )}
                    {plan.limits.inquiries && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {plan.limits.inquiries === -1 ? 'Unlimited' : plan.limits.inquiries} Inquiries/month
                        </span>
                      </div>
                    )}
                    {plan.limits.analytics && (
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {plan.limits.analytics ? 'Advanced' : 'Basic'} Analytics
                        </span>
                      </div>
                    )}
                    {plan.limits.support && (
                      <div className="flex items-center space-x-2">
                        <Headphones className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {plan.limits.support} Support
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Action Button */}
          <div className="p-6 pt-0">
            {isCurrent ? (
              <Button 
                className="w-full h-12 bg-gray-100 text-gray-600 cursor-not-allowed"
                disabled
              >
                Current Plan
              </Button>
            ) : canSubscribe ? (
              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing[plan.id]}
                className={`w-full h-12 bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-semibold transition-all duration-300 transform hover:scale-105`}
              >
                {subscribing[plan.id] ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <>
                    <span>
                      {currentSubscription ? 
                        (isUpgrade(plan.price) ? 'Upgrade' : 'Switch') : 
                        'Get Started'
                      }
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button 
                className="w-full h-12 bg-gray-100 text-gray-400 cursor-not-allowed"
                disabled
              >
                Not Available
              </Button>
            )}
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
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <Crown className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your <span className="text-yellow-300">Perfect Plan</span>
          </h1>
          <p className="text-purple-100 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto">
            Unlock powerful features and grow your business with our flexible subscription plans
          </p>
          
          {currentSubscription && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-sm">
                Current: {currentSubscription.plan.name} Plan
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className="text-center py-12">
          <Crown className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No plans available
          </h3>
          <p className="text-gray-500">
            Subscription plans will be available soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      {/* Benefits Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Subscription Plans?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get access to premium features and grow your business faster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Features</h3>
            <p className="text-gray-600 text-sm">
              Access advanced tools and features to boost your sales
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Global Reach</h3>
            <p className="text-gray-600 text-sm">
              Expand your business globally with our platform
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">
              Get dedicated support whenever you need help
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Commitment</h3>
            <p className="text-gray-600 text-sm">
              Cancel or change your plan anytime with no penalties
            </p>
          </div>
        </div>
      </div>

      {/* FAQ or Additional Info */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 lg:p-8">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you find the perfect plan for your business needs.
          </p>
          <Button 
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            Contact Sales Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;