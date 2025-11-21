import { useState } from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormValidation } from "../hooks/useFormValidation";
import { formatUserInfo } from "../utils/dashboard";
import FormInput from "../components/shared/FormInput";
import PageHeader from "../components/shared/PageHeader";
import SubmitButton from "../components/shared/SubmitButton";
import Api from "../services/Api";

const SignIn = ({ onSignIn, onNavigateToLanding }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    validateAndSubmit,
  
  } = useFormValidation({
    email: "",
    password: "",
    name: "",
    role: "admin",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await validateAndSubmit(async (data) => {
      try {
        // Call backend API for admin login
        const response = await Api.adminLogin(data.email, data.password, data.name);
        const adminUser = response.data;

        if (!adminUser) {
          alert("Admin login failed. Please check your credentials.");
          throw new Error("Admin login failed");
        }

        const userInfo = formatUserInfo(adminUser);

        alert(`Welcome back, ${userInfo.name}!`);
        
        onSignIn(userInfo);
      } catch (error) {
        console.error("Sign in error:", error);
        const errorMessage = error.message || "Failed to sign in. Please try again.";
        alert(errorMessage);
        throw error;
      }
    });

    if (!success) {
      alert("Please check your information and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <PageHeader
            title="Admin Login"
            subtitle="Enter admin credentials to access dashboard"
            icon={RiAccountCircleLine}
            showBackButton={!!onNavigateToLanding}
            onBackClick={onNavigateToLanding}
          />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormInput
                id="name"
                name="name"
                type="text"
                placeholder="Enter admin name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder="Enter admin email"
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                      errors.password ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
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
              <SubmitButton isLoading={isSubmitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
