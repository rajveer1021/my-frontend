import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Building, Upload, CheckCircle, Clock, ArrowRight, ArrowLeft, Sparkles, FileText, Shield, Star } from 'lucide-react';
import { cn } from '../../utils/helpers';

const VendorOnboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    vendorType: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessWebsite: '',
    businessLogo: '',
    documents: [],
    description: ''
  });

  const steps = [
    { id: 1, title: 'Vendor Type', description: 'Select your business type', icon: Building },
    { id: 2, title: 'Business Info', description: 'Enter your business details', icon: FileText },
    { id: 3, title: 'Documents', description: 'Upload verification documents', icon: Shield }
  ];

  const vendorTypes = [
    { 
      value: 'manufacturer', 
      label: 'Manufacturer', 
      description: 'I manufacture products',
      icon: '🏭',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      value: 'dealer', 
      label: 'Dealer', 
      description: 'I sell products from manufacturers',
      icon: '🏪',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      value: 'broker', 
      label: 'Broker', 
      description: 'I connect buyers and sellers',
      icon: '🤝',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  const documentTypes = [
    'Business Registration Certificate',
    'Tax Identification Number',
    'Trade License',
    'GST Registration',
    'Bank Statement'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVendorTypeSelect = (vendorType) => {
    handleInputChange('vendorType', vendorType);
  };

  const handleFileUpload = (documentType) => {
    // Mock file upload
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, documentType]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('vendorOnboarded', 'true');
      onComplete();
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
        return formData.vendorType !== '';
      case 2:
        return formData.businessName && formData.businessAddress && formData.businessPhone;
      case 3:
        return formData.documents.length >= 2;
      default:
        return false;
    }
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 lg:p-12 text-white mb-8">            
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    Welcome to VendorHub
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                  Join Our <span className="text-blue-200">Marketplace</span>
                </h1>
                <p className="text-blue-100 text-lg">
                  Complete your vendor profile to start selling on our platform
                </p>
              </div>
              
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center">
                    <Building className="w-32 h-32 text-white/30" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg">
                    <Star className="w-8 h-8 text-yellow-800" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-green-400 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-8 h-8 text-green-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="mb-8 lg:mb-12">
          <div className="flex justify-between items-center mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div className={cn(
                    "w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-sm lg:text-base font-bold transition-all duration-300 shadow-lg",
                    currentStep >= step.id 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white transform scale-110' 
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  )}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8" />
                    ) : (
                      <step.icon className="h-6 w-6 lg:h-8 lg:w-8" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p className={cn(
                      "text-sm lg:text-base font-semibold",
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                    )}>
                      {step.title}
                    </p>
                    <p className={cn(
                      "text-xs lg:text-sm mt-1",
                      currentStep >= step.id ? 'text-blue-500' : 'text-gray-400'
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-2 mx-4 lg:mx-8 rounded-full transition-all duration-500",
                    currentStep > step.id 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gray-200'
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-3 bg-gray-200" />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl border border-white/20 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 lg:p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6 lg:w-8 lg:h-8" })}
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold">Step {currentStep}: {steps[currentStep - 1].title}</h2>
                <p className="text-blue-100 text-lg">{steps[currentStep - 1].description}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 lg:p-10 space-y-8">
            {/* Step 1: Vendor Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Select your vendor type
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Choose the option that best describes your business model
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {vendorTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleVendorTypeSelect(type.value)}
                      className={cn(
                        "relative group cursor-pointer rounded-3xl border-3 p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105",
                        formData.vendorType === type.value
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl ring-4 ring-blue-200'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
                      )}
                    >
                      {formData.vendorType === type.value && (
                        <div className="absolute -top-3 -right-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 shadow-lg">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center space-y-4">
                        <div className="text-6xl lg:text-7xl">{type.icon}</div>
                        <div className={cn(
                          "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300",
                          formData.vendorType === type.value
                            ? `bg-gradient-to-br ${type.gradient}`
                            : 'bg-gray-100 group-hover:bg-blue-100'
                        )}>
                          <Building className={cn(
                            "w-8 h-8",
                            formData.vendorType === type.value ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                          )} />
                        </div>
                        <h4 className="text-xl lg:text-2xl font-bold text-gray-900">
                          {type.label}
                        </h4>
                        <p className="text-gray-600 text-lg">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {formData.vendorType && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 animate-fade-in">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-800">
                          Perfect Choice!
                        </h4>
                        <p className="text-green-700">
                          You selected: <strong>{vendorTypes.find(t => t.value === formData.vendorType)?.label}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Tell us about your business
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Provide your business details to complete your profile
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        Business Name *
                      </label>
                      <Input
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Enter your business name"
                        className="h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        Business Phone *
                      </label>
                      <Input
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                        placeholder="Enter your business phone"
                        className="h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Business Address *
                    </label>
                    <textarea
                      value={formData.businessAddress}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      placeholder="Enter your complete business address"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-lg"
                      rows={4}
                    />
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Business Website (Optional)
                    </label>
                    <Input
                      value={formData.businessWebsite}
                      onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                      placeholder="https://your-website.com"
                      className="h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Business Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Tell us about your business..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-lg"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Upload verification documents
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Please upload at least 2 documents for account verification
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      Required: {Math.max(0, 2 - formData.documents.length)} more document(s)
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    Upload business documents to verify your account. This helps build trust with potential buyers.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                  {documentTypes.map((docType, index) => (
                    <div 
                      key={docType} 
                      className={`group bg-white border-2 rounded-2xl p-4 lg:p-6 transition-all duration-300 hover:shadow-lg ${
                        formData.documents.includes(docType)
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            formData.documents.includes(docType)
                              ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg'
                              : 'bg-gray-100 group-hover:bg-blue-100'
                          }`}>
                            {formData.documents.includes(docType) ? (
                              <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                            ) : (
                              <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400 group-hover:text-blue-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-lg mb-1">{docType}</h4>
                            <p className="text-gray-600">Required for account verification</p>
                            {formData.documents.includes(docType) && (
                              <div className="flex items-center space-x-2 mt-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-green-700 text-sm font-medium">Document uploaded</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {formData.documents.includes(docType) ? (
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Uploaded
                            </Badge>
                          ) : (
                            <Button 
                              onClick={() => handleFileUpload(docType)}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {formData.documents.length >= 2 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 animate-fade-in">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-green-800 mb-2">
                          🎉 Excellent! You're ready to proceed
                        </h4>
                        <p className="text-green-700 text-lg mb-3">
                          You've uploaded the minimum required documents for verification.
                        </p>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                          <h5 className="font-semibold text-green-800 mb-2">What happens next?</h5>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Your profile will be reviewed within 24-48 hours</li>
                            <li>• You'll receive an email confirmation once approved</li>
                            <li>• You can start listing products immediately after approval</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formData.documents.length < 2 && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                        <Clock className="h-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800 text-lg">
                          Almost there! Upload {2 - formData.documents.length} more document(s)
                        </h4>
                        <p className="text-blue-700">
                          Complete your document upload to proceed with account setup.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Navigation */}
            <div className="flex flex-col sm:flex-row justify-between pt-8 lg:pt-12 border-t-2 border-gray-100 space-y-4 sm:space-y-0">
              <Button 
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center justify-center px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Previous Step
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center justify-center px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isStepValid() 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed transform-none shadow-none"
                }`}
              >
                {currentStep === 3 ? (
                  <>
                    Complete Setup
                    <CheckCircle className="h-5 w-5 ml-2" />
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure & Encrypted</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>24/7 Support Available</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Quick Approval Process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;