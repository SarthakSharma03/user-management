export const validateForm = ({email, password, name}) => {
    const newErrors = {};

    // Name validation
    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (email.length > 254) {
      newErrors.email = "Email is too long";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (password.length > 128) {
      newErrors.password = "Password is too long";
    } else if (!/(?=.*[a-zA-Z])/.test(password)) {
      newErrors.password = "Password must contain at least one letter";
    }

    return {isValid: Object.keys(newErrors).length === 0, newErrors};
  };

// Additional utility functions
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const formatUserInfo = (userData) => {
  return {
    ...userData,
    name: sanitizeInput(userData.name),
    email: sanitizeInput(userData.email).toLowerCase(),
    signInTime: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
};