// src/utils/profileCompletion.js - Updated to handle manual verification

const checkProfileCompletion = (vendor) => {
  const steps = {
    step1: !!vendor.vendorType,
    step2: !!(
      vendor.businessName &&
      vendor.businessAddress1 &&
      vendor.city &&
      vendor.state &&
      vendor.postalCode
    ),
    step3: false, // Will be calculated below
  };

  // Check step 3 completion based on verification type
  if (vendor.verificationType === 'gst') {
    steps.step3 = !!(vendor.gstNumber);
  } else if (vendor.verificationType === 'manual') {
    steps.step3 = !!(vendor.idType && vendor.idNumber);
  } else {
    // Fallback to old logic for backward compatibility
    steps.step3 = !!(vendor.gstNumber || vendor.gstDocument);
  }

  const completedSteps = Object.values(steps).filter(Boolean).length;
  const totalSteps = Object.keys(steps).length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  return {
    steps,
    completedSteps,
    totalSteps,
    completionPercentage,
    isComplete: completedSteps === totalSteps,
    currentStep: completedSteps + 1 > totalSteps ? totalSteps : completedSteps + 1,
  };
};

module.exports = { checkProfileCompletion };