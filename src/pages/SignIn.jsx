
import { RiAccountCircleLine } from "react-icons/ri";
import { useFormValidation } from "../hooks/useFormValidation";
import { formatUserInfo } from "../utils/dashboard";
import FormInput from "../components/shared/FormInput";
import PageHeader from "../components/shared/PageHeader";
import SubmitButton from "../components/shared/SubmitButton";

const SignIn = ({ onSignIn, onNavigateToLanding }) => {
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

   
    const adminName = "sarthak";
    const adminEmail = "sarthak0624@gmail.com";
    const adminPassword = "sarthak12345";

    if (formData.name.toLowerCase() !== adminName.toLowerCase()) {
      alert("Invalid admin name. Please check your name.");
      return;
    }

    if (formData.email.toLowerCase() !== adminEmail.toLowerCase()) {
      alert("Invalid admin email. Please check your email.");
      return;
    }

    if (formData.password !== adminPassword) {
      alert("Invalid admin password. Please check your password.");
      return;
    }

    const success = await validateAndSubmit(async (data) => {
      try {
        const userInfo = formatUserInfo({
          ...data,
          id: Date.now(),
        });

        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("isAuthenticated", "true");

        alert(`Welcome back, ${userInfo.name}! `);
        
        
        setTimeout(() => {
          onSignIn(userInfo);
        }, 1000);
      } catch (error) {
        alert("Failed to sign in. Please try again.");
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

              <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="Enter admin password"
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
              <SubmitButton isLoading={isSubmitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
