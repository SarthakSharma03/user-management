import React, { useState } from "react";
import { RiUserLine } from "react-icons/ri";

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
   
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');

    
      const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (!user) {
        alert('User not found. Please check your email or contact admin.');
        setIsSubmitting(false);
        return;
      }

   
      const storedPassword = passwords[user.email];
      if (!storedPassword || storedPassword !== formData.password) {
        alert('Invalid password. Please try again.');
        setIsSubmitting(false);
        return;
      }

     
      alert(`Welcome back, ${user.name}!`);
      
    
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userAuthenticated', 'true');
      
     
      onUserLogin(user);

    } catch (error) {
      alert('Login failed. Please try again.');
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

              <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="current-password"
                required
              />
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
