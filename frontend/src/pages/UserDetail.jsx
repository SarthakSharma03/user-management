import React, { useState, useEffect } from "react";
import ChangePasswordModal from "../components/dashboard/ChangePasswordModal";
import Api from "../services/Api.js";
import {
  FaUser,FaEnvelope,FaPhone,FaBuilding,FaKey,FaCalendar,FaSignOutAlt,FaEye,FaEyeSlash,} from "react-icons/fa";
import { FaUsersCog } from "react-icons/fa";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return new Date().toLocaleDateString();
  }
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toLocaleDateString();
  }
  return parsedDate.toLocaleDateString();
};

const UserDetail = ({ user: initialUser, onSignOut }) => {
  const [user, setUser] = useState(initialUser);
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user details from API if user ID is available
    const loadUserDetails = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await Api.getUserDetails(user.id);
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error loading user details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [user?.id]);

  useEffect(() => {
    let isActive = true;
    async function loadPassword() {
      if (!user?.id) return;
      try {
        const res = await Api.getPasswordById(user.id);
        if (!isActive) return;
        setUserPassword(res?.data?.password || "Not available");
      } catch (e) {
        if (!isActive) return;
        setUserPassword("Unable to fetch password");
      }
    }
    loadPassword();
    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const accountCreatedDate = formatDate(user?.createdAt);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            User Not Found
          </h1>
          <p className="text-gray-600">Please login again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaUsersCog
                  className="w-12 h-12 rounded-lg object-cover text-white"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <span className="text-2xl font-bold text-white hidden">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, {user.name}!
                </h1>
                <p className="text-gray-600">Your Account Details</p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-pink-50 px-4 py-2 rounded-full border border-red-200 shadow-sm hover:shadow-md transition-all duration-200 text-red-600 hover:text-red-700 hover:from-red-100 hover:to-pink-100 hover:border-red-300 hover:scale-105 transform"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
          <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FaUser className="text-indigo-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <span className="text-xl font-semibold text-gray-900">
                    {user.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-indigo-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <span className="text-xl font-semibold text-gray-900">
                    {user.email}
                  </span>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaPhone className="text-indigo-600 w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <span className="text-xl font-semibold text-gray-900">
                      {user.phone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-indigo-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              {user.department && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaBuilding className="text-indigo-600 w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Department
                    </label>
                    <span className="text-xl font-semibold text-gray-900">
                      {user.department}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FaCalendar className="text-indigo-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Account Created
                  </label>
                  <span className="text-xl font-semibold text-gray-900">
                    {accountCreatedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="border-t pt-8 mt-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaKey className="text-indigo-600 w-6 h-6" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Your Password
                </label>
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={userPassword}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
            {/* change-Password Section */}
          <div className="flex justify-end pt-1.5" >
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transform hover:scale-105 transition-all duration-200">
              change password
            </button>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userEmail={user?.email}
        onPasswordChange={(newPwd) => {
          setUserPassword(newPwd);
          // Optionally reload user details after password change
        }}
      />
    </div>
  );
};

export default UserDetail;
