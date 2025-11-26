import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RiUserLine } from "react-icons/ri";
import Api from "../services/Api.js";

import FormInput from "../components/shared/FormInput";
import PageHeader from "../components/shared/PageHeader";
import SubmitButton from "../components/shared/SubmitButton";

const UserLogin = ({ onUserLogin, onNavigateToLanding, onNavigateToAdmin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await Api.login(formData.email, formData.password);
      const user = response.data;
      
      if (!user) {
        alert('Login failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      alert(`Welcome back, ${user.name}!`);
      
      onUserLogin(user);

    } catch (error) {
      alert(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <PageHeader
            title="User Login"
            subtitle="Enter your credentials to access your account"
            icon={RiUserLine}
            showBackButton={!!onNavigateToLanding}
            onBackClick={onNavigateToLanding}
          />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                required
              />

              <div className="space-y-1">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 animate-pulse">{errors.password}</p>
                )}
              </div>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div>
              <SubmitButton isLoading={isSubmitting} children="Login" />
            </div>

            {/* Navigation Links */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account? Contact your administrator.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={onNavigateToAdmin}
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Admin Login
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={onNavigateToLanding}
                  className="text-sm text-gray-600 hover:text-gray-500 font-medium"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
