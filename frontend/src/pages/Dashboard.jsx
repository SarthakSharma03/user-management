import { useState, useEffect } from 'react';
import AddUserModal from '../components/dashboard/AddUserModel';
import UserDetailsModal from '../components/dashboard/UserDetailsModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import UserCard from '../components/dashboard/UserCard';
import UserListItem from '../components/dashboard/UserListItem';
import StatsSection from '../components/dashboard/StatsSection';
import Api from '../services/Api.js';

const Dashboard = ({ userInfo, onSignOut }) => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialPage = parseInt(params.get('page') || '1', 10) || 1;
    setPage(initialPage);
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await Api.getAllUsers();
        setAllUsers(response.data || []);
      } catch (error) {
        console.error('Error fetching all users for stats:', error);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  const loadUsers = async (currentPage = 1) => {
    try {
      setLoading(true);
      const response = await Api.getUserByName(searchTerm || '', currentPage, 3);
      const usersData = response.data || [];
      const pagination = response.pagination || { totalPages: 1 };
      setTotalPages(pagination.totalPages || 1);
      // Keep allUsers as the full list for stats; fetch once separately
      setUsers(usersData);
      const params = new URLSearchParams(window.location.search);
      params.set('page', String(currentPage));
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
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

  const handleSearch = async (term) => {
    // Reset to page 1 on new search
    setPage(1);
    
    setLoading(true);
    try {
      const response = await Api.getUserByName(term, 1, 3);
      setUsers(response.data || []);
      const pagination = response.pagination || { totalPages: 1 };
      setTotalPages(pagination.totalPages || 1);
      const params = new URLSearchParams(window.location.search);
      params.set('page', '1');
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    } catch (error) {
      console.error('Error searching users:', error);
      // Don't show error for empty results, just set empty array
      if (!error.response || error.response.status !== 404) {
        alert('Error searching users. Please try again.');
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search term changes with debounce
  
    const onSearchChange =(newSearchTerm)=>{
      setSearchTerm(newSearchTerm);
    
    if(searchTimeout){
      clearTimeout(searchTimeout);
    }
       const timeout = setTimeout(() => {
      handleSearch(newSearchTerm);
    }, 800);
    setSearchTimeout(timeout);
  };
  
 
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const addUser = async (user) => {
    try {
      setLoading(true);
      await Api.createUser(user);
      await loadUsers(page); 
      try {
        const resAll = await Api.getAllUsers();
        setAllUsers(resAll.data || []);
      } catch {}
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
      // Create a clean user object without any undefined or empty values
      const userData = {};
      
      // Only include fields that have values to avoid sending empty strings to the backend
      if (updatedUser.name) userData.name = updatedUser.name;
      if (updatedUser.email) userData.email = updatedUser.email;
      if (updatedUser.role) userData.role = updatedUser.role;
      if (updatedUser.phone) userData.phone = updatedUser.phone;
      if (updatedUser.department) userData.department = updatedUser.department;
      
      // Make the API call
      const response = await Api.updateUser(updatedUser.id, userData);
      
      // Update the local state immediately for better UX
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? { ...user, ...userData } : user
        )
      );
      
      // Also update the allUsers state to keep search results in sync
      setAllUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? { ...user, ...userData } : user
        )
      );
      
      setIsModalOpen(false);
      setEditingUser(null);
      
      // Show success message
      alert(`User ${updatedUser.name} has been updated successfully!`);
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error.message || 'Failed to update user. Please try again.';
      alert(errorMessage);
      throw error; // Re-throw to prevent modal from closing on error
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
      await loadUsers(page); // Reload users from API
      try {
        const resAll = await Api.getAllUsers();
        setAllUsers(resAll.data || []);
      } catch {}
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

  const filteredUsers = users; // No client-side filtering needed as it's handled server-side

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20">
          <DashboardHeader 
            user={userInfo}
            onSignOut={handleSignOut}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onAddUser={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
          />

          <StatsSection users={allUsers} />

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
            <>
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
              <div className="mt-6 flex items-center justify-center space-x-3">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 "
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Next
                </button>
              </div>
            </>
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
      
