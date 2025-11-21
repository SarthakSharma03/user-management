import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";

const StatsSection = ({ users }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-2xl rounded-2xl border border-white/20 group hover:scale-105 transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300">
                <span className="text-white text-xl  font-bold"><MdAdminPanelSettings />
</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Admins</dt>
                <dd className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {users.filter(user => user.role === 'admin').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-2xl rounded-2xl border border-white/20 group hover:scale-105 transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300">
                <span className="text-white text-xl font-bold"><GrUserManager />
  </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Managers</dt>
                <dd className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {users.filter(user => user.role === 'manager').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-2xl rounded-2xl border border-white/20 group hover:scale-105 transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300">
                <span className="text-white text-xl font-bold"><FaUsers />
</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Regular Users</dt>
                <dd className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {users.filter(user => user.role === 'user').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;