import { FaUsersCog } from "react-icons/fa";


const UserCard = ({ user, onEdit, onDelete, onViewDetails }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
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
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2 text-gray-400">📞</span>
            {user.phone || 'No phone number'}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2 text-gray-400">🏢</span>
            {user.department || 'No department'}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2 text-gray-400">🕒</span>
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onViewDetails(user)}
            className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(user)}
            className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;