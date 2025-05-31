import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Building, Upload, CheckCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
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
    { id: 1, title: 'Vendor Type', description: 'Select your business type' },
    { id: 2, title: 'Business Info', description: 'Enter your business details' },
    { id: 3, title: 'Documents', description: 'Upload verification documents' }
  ];

  const vendorTypes = [
    { 
      value: 'manufacturer', 
      label: 'Manufacturer', 
      description: 'I manufacture products',
      icon: '🏭'
    },
    { 
      value: 'dealer', 
      label: 'Dealer', 
      description: 'I sell products from manufacturers',
      icon: '🏪'
    },
    { 
      value: 'broker', 
      label: 'Broker', 
      description: 'I connect buyers and sellers',
      icon: '🤝'
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
    console.log('Updated formData:', { ...formData, [field]: value }); // Debug log
  };

  const handleVendorTypeSelect = (vendorType) => {
    console.log('Selecting vendor type:', vendorType); // Debug log
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome to MarketPlace</h1>
          <p className="text-gray-600">Complete your vendor profile to start selling</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                  )}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-xs font-medium",
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                    )}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-1 mx-4 rounded-full transition-all duration-200",
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-6 w-6" />
              <span>Step {currentStep}: {steps[currentStep - 1].title}</span>
            </CardTitle>
            <p className="text-blue-100">{steps[currentStep - 1].description}</p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
            {/* Step 1: Vendor Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select your vendor type
                  </h3>
                  <p className="text-gray-600">
                    Choose the option that best describes your business
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {vendorTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => handleVendorTypeSelect(type.value)}
                      className={cn(
                        "relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg hover:scale-105",
                        formData.vendorType === type.value
                          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      {formData.vendorType === type.value && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-blue-500 rounded-full p-1">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center space-y-3">
                        <div className="text-3xl">{type.icon}</div>
                        <h4 className="font-semibold text-lg text-gray-900">
                          {type.label}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.vendorType && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        Great choice! You selected: {vendorTypes.find(t => t.value === formData.vendorType)?.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Business Information
                  </h3>
                  <p className="text-gray-600">
                    Tell us about your business
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                      Business Name *
                    </label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Enter your business name"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="businessPhone" className="text-sm font-medium text-gray-700">
                      Business Phone *
                    </label>
                    <Input
                      id="businessPhone"
                      value={formData.businessPhone}
                      onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                      placeholder="Enter your business phone"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="businessAddress" className="text-sm font-medium text-gray-700">
                    Business Address *
                  </label>
                  <textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    placeholder="Enter your complete business address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="businessWebsite" className="text-sm font-medium text-gray-700">
                    Business Website (Optional)
                  </label>
                  <Input
                    id="businessWebsite"
                    value={formData.businessWebsite}
                    onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                    placeholder="https://your-website.com"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell us about your business..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Business Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-3">
                      Click to upload your business logo
                    </p>
                    <Button variant="outline" size="sm" type="button">
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Required Documents
                  </h3>
                  <p className="text-gray-600">
                    Please upload at least 2 documents for verification
                  </p>
                </div>
                
                <div className="space-y-4">
                  {documentTypes.map((docType) => (
                    <div 
                      key={docType} 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          formData.documents.includes(docType)
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        )}>
                          {formData.documents.includes(docType) ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{docType}</span>
                          <p className="text-sm text-gray-500">Required for verification</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {formData.documents.includes(docType) ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            ✓ Uploaded
                          </Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleFileUpload(docType)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {formData.documents.length >= 2 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-medium">
                          Excellent! You've uploaded the minimum required documents.
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          Your profile will be reviewed within 24-48 hours and you'll receive an email confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.documents.length < 2 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <p className="text-blue-800 text-sm">
                        You need to upload at least {2 - formData.documents.length} more document(s) to proceed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className={cn(
                  "flex items-center",
                  isStepValid() 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-gray-300 cursor-not-allowed"
                )}
              >
                {currentStep === 3 ? (
                  <>
                    Complete Setup
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorOnboarding;