import { CiGrid41 } from "react-icons/ci";
import { FaListUl } from "react-icons/fa6";


const DashboardHeader = ({
  user,
  onSignOut,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  onAddUser,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex justify-between items-center py-6">
          {/* Logo and Welcome Text */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">U</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 font-medium">
                Welcome back,{" "}
                <span className="text-indigo-600 font-semibold">
                  {user?.name || "User"}
                </span>
                !
              </p>
            </div>
          </div>

          {/* Role & Sign Out */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-200">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm font-medium text-indigo-700 capitalize">
                {user?.role || "guest"}
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-pink-50 px-4 py-2 rounded-full border border-red-200 shadow-sm hover:shadow-md transition-all duration-200 text-red-600 hover:text-red-700 hover:from-red-100 hover:to-pink-100 hover:border-red-300 hover:scale-105 transform"
            >
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Search + View Mode + Add User */}
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search users by name, email, or role..."
            />
          </div>

          {/* View Mode + Add Button */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
              <CiGrid41 />

              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
               <FaListUl />

              </button>
            </div>

            <button
              onClick={onAddUser}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transform hover:scale-105 transition-all duration-200"
            >
              <span className="mr-2">+</span>
              Add New User
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
