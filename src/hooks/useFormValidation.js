import { useState, useCallback } from 'react';
import { validateForm } from '../utils/dashboard';

export const useFormValidation = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const validateAndSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      const { isValid, newErrors } = validateForm(formData);
      
      if (!isValid) {
        setErrors(newErrors);
        return false;
      }

      await onSubmit(formData);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    validateAndSubmit,
    resetForm,
    setErrors
  };
};
