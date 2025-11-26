const API_BASE_URL = "http://localhost:3000/api";

const handleResponse = async (response) => {
  // Check if response is ok
  if (!response.ok) {
    let errorMessage = "Something went wrong";
    try {
      const data = await response.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
       console.log("error log APIJS : ",e)
    }
;
    
    throw new Error(errorMessage);
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (e) {
    console.log("error log APIJS : ",e) 
    throw new Error("Failed to parse response");
  }
};

const Api = {
  // Admin login
  adminLogin: async (email, password, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      return handleResponse(response);
    } catch (error) {
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        throw new Error("Cannot connect to server. Please make sure the backend is running on port 3000.");
      }
      throw error;
    }
  },

  // Login (for regular users)
  login: async (email, password, name = null) => {
    const body = { email, password };
    if (name) {
      body.name = name;
    }
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return handleResponse(response);
    } catch (error) {
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        throw new Error("Cannot connect to server. Please make sure the backend is running on port 3000.");
      }
      throw error;
    }
  },

  // Get users with pagination
  getUsersPaginated: async (page = 1, limit = 3) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return handleResponse(response);
    } catch (error) {
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        throw new Error("Cannot connect to server. Please make sure the backend is running on port 3000.");
      }
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },
    
  getUserByName: async (name = '', page = 1, limit = 3) => { 
    try {
      const qs = new URLSearchParams();
      if (name !== undefined && name !== null) qs.set('name', name);
      qs.set('page', String(page));
      qs.set('limit', String(limit));
      const response = await fetch(`${API_BASE_URL}/user/search?${qs.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
    } catch (error) {
      console.log("log error  : ",error);
      
    } 
    
  },
  

  // Get user details (for user role - /my/{id})
  getUserDetails: async (id) => {
    const response = await fetch(`${API_BASE_URL}/user/my/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Create user
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Update password by ID
  updatePassword: async (id, password) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },

  // Update password by email (helper for ChangePasswordModal)
  updatePasswordByEmail: async (email, currentPassword, newPassword) => {
    try {
      // Verify current password by attempting login
      try {
        await Api.login(email, currentPassword);
      } catch (error) {
        throw new Error("Current password is incorrect");
      }

      // Get all users and find by email to get ID
      const usersResponse = await Api.getAllUsers();
      const users = usersResponse.data || [];
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user || !user.id) {
        throw new Error("User not found");
      }

      // Update password using ID
      return await Api.updatePassword(user.id, newPassword);
    } catch (error) {
      throw error;
    }
  },

 
  getPasswordById: async (id) => {
    if (!id) {
      throw new Error("User ID is required");
    }
    const response = await fetch(`${API_BASE_URL}/users/${id}/password`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  getPasswordByEmail: async (email) => {
    if (!email) {
      throw new Error("Email is required");
    }

    const usersResponse = await Api.getAllUsers();
    const users = usersResponse.data || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || !user.id) {
      throw new Error("User not found");
    }

    return Api.getPasswordById(user.id);
  },
};

export default Api;

