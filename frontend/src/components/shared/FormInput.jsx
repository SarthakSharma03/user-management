import React from 'react';

const FormInput = ({ 
  id, 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false, 
  autoComplete,
  className = ''
}) => {
  return (
    <div className="space-y-1">
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${className} ${
          error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && (
        <p className="text-sm text-red-600 animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
