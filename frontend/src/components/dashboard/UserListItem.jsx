import { FaUsersCog } from "react-icons/fa";

const UserListItem = ({ user, onEdit, onDelete, onViewDetails }) => {
  return (
    <li className="px-6 py-5 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 group">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-12 w-12">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FaUsersCog 
                className="w-8 h-8 rounded-lg object-cover text-white"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-lg font-bold text-white hidden">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="text-base font-semibold text-gray-900 mr-3">{user.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                user.role === 'admin' 
                  ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200' 
                  : user.role === 'manager'
                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200'
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{user.email}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              {user.phone && (
                <span className="flex items-center">
                  <span className="mr-1">📞</span>
                  {user.phone}
                </span>
              )}
              {user.department && (
                <span className="flex items-center">
                  <span className="mr-1">🏢</span>
                  {user.department}
                </span>
              )}
              <span className="flex items-center">
                <span className="mr-1">🕒</span>
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => onViewDetails(user)}
            className="flex-1 sm:flex-none bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200 hover:border-green-300"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(user)}
            className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold hover:from-indigo-100 hover:to-blue-100 transition-all duration-200 border border-indigo-200 hover:border-indigo-300"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="flex-1 sm:flex-none bg-gradient-to-r from-red-50 to-pink-50 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold hover:from-red-100 hover:to-pink-100 transition-all duration-200 border border-red-200 hover:border-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default UserListItem;