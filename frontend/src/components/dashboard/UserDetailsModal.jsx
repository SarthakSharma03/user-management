import React, { useState, useEffect } from 'react';
import { RxCross1 } from "react-icons/rx";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaBuilding, FaKey, FaCalendar } from 'react-icons/fa';
import Api from '../../services/Api';

const formatDate = (dateValue) => {
  if (!dateValue) {
    return new Date().toLocaleDateString();
  }
  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime())
    ? new Date().toLocaleDateString()
    : parsedDate.toLocaleDateString();
};

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    if (!user || !isOpen) return;
    let isActive = true;

    const fetchPassword = async () => {
      try {
        const response = await Api.getPasswordById(user.id);
        if (!isActive) return;
        setUserPassword(response?.data?.password || 'No password set');
      } catch (error) {
        console.error('Error fetching password:', error);
        if (!isActive) return;
        setUserPassword('Unable to fetch password');
      }
    };

    fetchPassword();

    return () => {
      isActive = false;
    };
  }, [user?.id, isOpen]);



  const accountCreatedDate = formatDate(user?.createdAt);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FaUser className="mr-2 text-indigo-600" />
              User Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <RxCross1 className="h-6 w-6" />
            </button>
          </div>

        
          <div className="space-y-6">
         
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-indigo-600 w-5 h-5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900">{user.name}</span>
                    
                    </div>
                  </div>
                </div>

                <div className="flex  items-center  space-x-3">
                  <FaEnvelope className="text-indigo-600 w-5 h-5 " />
                  <div className='text-left'>
                    <label className="block text-sm font-medium  text-gray-500">Email Address</label>
                    <div className="flex  space-x-2">
                      <span className="text-lg font-semibold text-gray-900">{user.email}</span>
                    
                    </div>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-indigo-600 w-5 h-5" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">{user.phone}</span>
                     
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaBuilding className="text-indigo-600 w-5 h-5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Role</label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>

                {user.department && (
                  <div className="flex items-center space-x-3">
                    <FaBuilding className="text-indigo-600 w-5 h-5" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Department</label>
                      <span className="text-lg font-semibold text-gray-900">{user.department}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-indigo-600 w-5 h-5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created</label>
                    <span className="text-lg font-semibold text-gray-900">
                      {accountCreatedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>


            {/* Password Section */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-3">
                <FaKey className="text-indigo-600 w-5 h-5" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Password</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={userPassword}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                      >
                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                      </button>
                    </div>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
