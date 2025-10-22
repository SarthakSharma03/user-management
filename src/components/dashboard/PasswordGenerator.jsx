import { useState } from "react";
import { FaKey, FaCopy } from "react-icons/fa";

const PasswordGenerator = ({ onPasswordGenerate }) => {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = (length = 12) => {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "abcdefghijklmnopqrstuvwxyz" +
      "0123456789" +
      "!@#$%^&*()-_=+[]{};:,.<>/?";

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    return newPassword;
  };

  const handleGenerate = () => {
    const pwd = generatePassword(12);
    setPassword(pwd);
    if (onPasswordGenerate) {
      onPasswordGenerate(pwd);
    }
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Generated password will appear here"
          />
          {password && (
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              title="Copy to clipboard"
            >
              <FaCopy className={copied ? "text-green-500" : ""} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FaKey className="mr-2" /> Generate
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
