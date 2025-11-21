import { useState, useEffect } from 'react';
import AddUserModal from '../components/dashboard/AddUserModel';
import UserDetailsModal from '../components/dashboard/UserDetailsModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import UserCard from '../components/dashboard/UserCard';
import UserListItem from '../components/dashboard/UserListItem';
import StatsSection from '../components/dashboard/StatsSection';
import Api from '../services/Api';

const Dashboard = ({ userInfo, onSignOut }) => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await Api.getAllUsers();
      // Filter out admin users from the list
      const allUsers = response.data || [];
      const nonAdminUsers = allUsers.filter(user => user.role !== 'admin');
      setUsers(nonAdminUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      const errorMessage = error.message || 'Failed to load users. Please try again.';
      alert(errorMessage);
      // If it's a connection error, show helpful message
      if (errorMessage.includes("Cannot connect to server")) {
        console.error("Backend server might not be running. Start it with: cd server && npm start");
      }
    } finally {
      setLoading(false);
    }
  };
  

 

  const addUser = async (user) => {
    try {
      setLoading(true);
      await Api.createUser(user);
      await loadUsers(); // Reload users from API
      setIsModalOpen(false);
      alert(`User ${user.name} has been added successfully!`);
    } catch (error) {
      console.error('Error adding user:', error);
      const errorMessage = error.message || 'Failed to add user. Please try again.';
      alert(errorMessage);
      throw error; // Re-throw to prevent modal from closing on error
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      setLoading(true);
      // Separate password if provided (it will be handled separately)
      const userData = { ...updatedUser };
      delete userData.password;
      
      await Api.updateUser(updatedUser.id, userData);
      await loadUsers(); // Reload users from API
      setIsModalOpen(false);
      setEditingUser(null);
      alert(`User ${updatedUser.name} has been updated successfully!`);
    } catch (error) {
      alert(error.message || 'Failed to update user. Please try again.');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const userToDelete = users.find(user => user.id === userId);
      if (!userToDelete) {
        alert('User not found');
        return;
      }

      if (!window.confirm(`Are you sure you want to delete user ${userToDelete.name}?`)) {
        return;
      }

      setLoading(true);
      await Api.deleteUser(userId);
      await loadUsers(); // Reload users from API
      alert(`User ${userToDelete.name} has been deleted successfully!`);
    } catch (error) {
      alert(error.message || 'Failed to delete user. Please try again.');
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    onSignOut();
  };

  const viewUserDetails = (user) => {
    setViewingUser(user);
    setIsDetailsModalOpen(true);
  };


  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      (user.department && user.department.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20">
          <DashboardHeader 
            user={userInfo}
            onSignOut={handleSignOut}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onAddUser={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
          />

          <StatsSection users={users} />

          {loading && (
            <div className="mt-8 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}
    
          {!loading && filteredUsers.length === 0 ? (
            <div className="mt-8 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 text-center border border-white/20">
              <p className="text-gray-500 text-lg">No users found. Add a new user to get started!</p>
            </div>
          ) : !loading && viewMode === 'grid' ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map(user => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onEdit={() => {
                    setEditingUser(user);
                    setIsModalOpen(true);
                  }} 
                  onDelete={() => deleteUser(user.id)}
                  onViewDetails={() => viewUserDetails(user)}
                />
              ))}
            </div>
          ) : !loading ? (
            <div className="mt-8 bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-white/20">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <UserListItem 
                    key={user.id} 
                    user={user} 
                    onEdit={() => {
                      setEditingUser(user);
                      setIsModalOpen(true);
                    }} 
                    onDelete={() => deleteUser(user.id)}
                    onViewDetails={() => viewUserDetails(user)}
                  />
                ))}
              </ul>
            </div>
          ) : null}


        </div>
      </div>

      {isModalOpen && (
        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onAddUser={addUser}
          editingUser={editingUser}
          onUpdateUser={updateUser}
        />
      )}

      {isDetailsModalOpen && (
        <UserDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setViewingUser(null);
          }}
          user={viewingUser}
        />
      )}
    </div>
  );
};

export default Dashboard;
      