import { useState, useEffect } from 'react';
import AddUserModal from '../components/dashboard/AddUserModel';
import UserDetailsModal from '../components/dashboard/UserDetailsModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import UserCard from '../components/dashboard/UserCard';
import UserListItem from '../components/dashboard/UserListItem';
import StatsSection from '../components/dashboard/StatsSection';

const Dashboard = ({ userInfo, onSignOut }) => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);
  

 

  const addUser = (user) => {
    try {
      // Check if user with same email already exists
      const existingUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (existingUser) {
        alert('A user with this email already exists!');
        return;
      }

      const newUser = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: userInfo?.name || 'Admin'
      };
      
      // Store password separately if provided
      if (user.password) {
        const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
        passwords[user.email] = user.password;
        localStorage.setItem('userPasswords', JSON.stringify(passwords));
        delete newUser.password;
      }
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setIsModalOpen(false);
      alert(`User ${newUser.name} has been added successfully!`);
    } catch (error) {
      alert('Failed to add user. Please try again.');
      console.error('Error adding user:', error);
    }
  };

  const updateUser = (updatedUser) => {
    try {
      // Store password separately if provided
      if (updatedUser.password) {
        const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
        passwords[updatedUser.email] = updatedUser.password;
        localStorage.setItem('userPasswords', JSON.stringify(passwords));
        delete updatedUser.password;
      }
      
      const updatedUsers = users.map(user => 
        user.id === updatedUser.id ? { ...updatedUser, updatedAt: new Date().toISOString() } : user
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setIsModalOpen(false);
      setEditingUser(null);
      alert(`User ${updatedUser.name} has been updated successfully!`);
    } catch (error) {
      alert('Failed to update user. Please try again.');
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = (userId) => {
    try {
      const userToDelete = users.find(user => user.id === userId);
      if (userToDelete) {
        // Remove password from storage
        const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
        if (passwords[userToDelete.email]) {
          delete passwords[userToDelete.email];
          localStorage.setItem('userPasswords', JSON.stringify(passwords));
        }
        
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        alert(`User ${userToDelete.name} has been deleted successfully!`);
      }
    } catch (error) {
      alert('Failed to delete user. Please try again.');
      console.error('Error deleting user:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');
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

    
          {filteredUsers.length === 0 ? (
            <div className="mt-8 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 text-center border border-white/20">
              <p className="text-gray-500 text-lg">No users found. Add a new user to get started!</p>
            </div>
          ) : viewMode === 'grid' ? (
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
          ) : (
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
          )}


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
      