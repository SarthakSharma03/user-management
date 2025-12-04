const API_BASE_URL = "https://user-manager-pn3m.onrender.com/api";

const getToken = () => {
  try {
    return localStorage.getItem('auth_token') || '';
  } catch {
    return '';
  }
};

const authHeaders = () => {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

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
        headers: authHeaders(),
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
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: authHeaders(),
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
      headers: authHeaders(),
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
      headers: authHeaders(),
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
      headers: authHeaders(),
    });
    return handleResponse(response);
  },

  // Create user
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse(response);
  },

  // Update password by ID
  updatePassword: async (id, password) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },

  // Update password by email (helper for ChangePasswordModal)
 updatePasswordByEmail: async (email, currentPassword, newPassword) => {
  try {
    await Api.login(email, currentPassword);
    const usersResponse = await Api.getAllUsers();
    const users = usersResponse.data || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !user.id) {
      throw new Error("User not found");
    }
    return await Api.updatePassword(user.id, newPassword);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Current password is incorrect");
    }
  
    throw new Error(error.message || "Failed to update password");
  }
},

 
  getPasswordById: async (id) => {
    if (!id) {
      throw new Error("User ID is required");
    }
    const response = await fetch(`${API_BASE_URL}/users/${id}/password`, {
      method: "GET",
      headers: authHeaders(),
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

