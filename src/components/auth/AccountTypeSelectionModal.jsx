import React, { useState } from 'react';
import { Building, ShoppingCart, X, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const AccountTypeSelectionModal = ({ 
  isOpen, 
  onConfirm, 
  userInfo = {},
  loading = false 
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedType) return;
    
    setConfirmLoading(true);
    try {
      await onConfirm(selectedType);
    } catch (error) {
      console.error('Error confirming account type:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const accountTypes = [
    {
      value: 'VENDOR',
      label: 'Vendor Account',
      description: 'Sell products and manage your business',
      icon: Building,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-purple-50',
      borderColor: 'border-blue-500',
      features: ['List products', 'Manage orders', 'View analytics', 'Customer inquiries']
    },
    {
      value: 'BUYER',
      label: 'Buyer Account',
      description: 'Browse and purchase products',
      icon: ShoppingCart,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-blue-50',
      borderColor: 'border-green-500',
      features: ['Browse products', 'Make purchases', 'Track orders', 'Contact vendors']
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Welcome to Multi-Vendor!</h2>
                    <p className="text-blue-100 text-sm">
                      {userInfo.name ? `Hi ${userInfo.name}!` : 'Complete your account setup'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-2">Choose Your Account Type</h3>
                <p className="text-blue-100 text-sm">
                  Select how you'd like to use our platform. You can change this later in your settings.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {accountTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedType === type.value;
                
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    disabled={loading || confirmLoading}
                    className={`relative group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl ${
                      isSelected 
                        ? `${type.borderColor} bg-gradient-to-br ${type.bgGradient} shadow-lg transform scale-105` 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    } ${(loading || confirmLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2">
                        <div className={`bg-gradient-to-r ${type.gradient} rounded-full p-1 shadow-lg`}>
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
                        isSelected 
                          ? `bg-gradient-to-br ${type.gradient}` 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      } transition-all duration-300`}>
                        <IconComponent className={`w-8 h-8 ${
                          isSelected ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div>
                        <h4 className={`text-lg font-bold mb-2 ${
                          isSelected ? 'text-gray-900' : 'text-gray-800'
                        }`}>
                          {type.label}
                        </h4>
                        <p className={`text-sm mb-4 ${
                          isSelected ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {type.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className={`text-xs font-medium ${
                          isSelected ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          Features:
                        </p>
                        <ul className="space-y-1">
                          {type.features.map((feature, index) => (
                            <li key={index} className={`text-xs flex items-center ${
                              isSelected ? 'text-gray-700' : 'text-gray-500'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                isSelected ? 'bg-blue-500' : 'bg-gray-400'
                              }`}></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-800 text-sm mb-1">
                        Good to know
                      </h5>
                      <p className="text-blue-700 text-xs">
                        You can switch between account types later in your profile settings if needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleConfirm}
                disabled={!selectedType || loading || confirmLoading}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                  selectedType && !loading && !confirmLoading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {confirmLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Setting up...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelectionModal;