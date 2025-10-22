import React from 'react';
import { RiAccountCircleLine } from 'react-icons/ri';

const PageHeader = ({ 
  title, 
  subtitle, 
  icon: Icon = RiAccountCircleLine, 
  showBackButton = false, 
  onBackClick 
}) => {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      {showBackButton && onBackClick && (
        <div className="flex justify-start">
          <button
            onClick={onBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      )}
      
      {/* Header Content */}
      <div className="text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
