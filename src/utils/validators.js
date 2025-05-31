// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

export const validateNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const validatePositiveNumber = (value) => {
  return validateNumeric(value) && parseFloat(value) > 0;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 999999.99;
};

export const validateStock = (stock) => {
  const numStock = parseInt(stock);
  return !isNaN(numStock) && numStock >= 0 && numStock <= 999999;
};

// Product validation
export const validateProduct = (product) => {
  const errors = {};

  if (!validateRequired(product.name)) {
    errors.name = 'Product name is required';
  } else if (!validateMaxLength(product.name, 100)) {
    errors.name = 'Product name must be less than 100 characters';
  }

  if (!validateRequired(product.description)) {
    errors.description = 'Description is required';
  } else if (!validateMaxLength(product.description, 500)) {
    errors.description = 'Description must be less than 500 characters';
  }

  if (!validateRequired(product.price)) {
    errors.price = 'Price is required';
  } else if (!validatePrice(product.price)) {
    errors.price = 'Please enter a valid price';
  }

  if (!validateRequired(product.image)) {
    errors.image = 'Image URL is required';
  } else if (!validateUrl(product.image)) {
    errors.image = 'Please enter a valid URL';
  }

  if (!product.categories || product.categories.length === 0) {
    errors.categories = 'At least one category is required';
  }

  if (product.stock && !validateStock(product.stock)) {
    errors.stock = 'Please enter a valid stock quantity';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// User profile validation
export const validateProfile = (profile) => {
  const errors = {};

  if (!validateRequired(profile.fullName)) {
    errors.fullName = 'Full name is required';
  } else if (!validateMaxLength(profile.fullName, 50)) {
    errors.fullName = 'Full name must be less than 50 characters';
  }

  if (!validateRequired(profile.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(profile.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (profile.phone && !validatePhone(profile.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (profile.address && !validateMaxLength(profile.address, 200)) {
    errors.address = 'Address must be less than 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login validation
export const validateLogin = (credentials) => {
  const errors = {};

  if (!validateRequired(credentials.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(credentials.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(credentials.password)) {
    errors.password = 'Password is required';
  } else if (!validateMinLength(credentials.password, 6)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generic form validation helper
export const createValidator = (rules) => {
  return (data) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field];
      const value = data[field];

      fieldRules.forEach(rule => {
        if (typeof rule === 'function') {
          const result = rule(value);
          if (result !== true) {
            errors[field] = result;
          }
        } else if (rule.validator) {
          const result = rule.validator(value);
          if (!result) {
            errors[field] = rule.message;
          }
        }
      });
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
};