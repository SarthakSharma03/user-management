import { jsonResponse } from "./utility/jsonResponse.js";
import { createUser, getAllUsers,getuserById,updateUser,deleteUser,updatePassword,loginUser,updatePasswordByEmail,getUserByEmail,loginAdmin } from "./manageUsers.js";
import { extractData } from "./utility/extractData.js";
import { decrypt } from "./utility/encryptDecrypt.js";

 
 // ADMIN LOGIN


export const adminLogin = async (req, res) => {
  try {
    const dataFromReq = await extractData(req);
    const { email, password, name } = dataFromReq;
    
    if (!email || !password || !name) {
      return jsonResponse(res, { 
        message: "Email, password, and name are required",
        success: false 
      }, 400);
    }
    
    const admin = await loginAdmin(email, password, name);
    return jsonResponse(res, { 
      message: "Admin login successful", 
      data: admin,
      success: true 
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return jsonResponse(res, { 
      message: error.message || "Admin login failed",
      success: false 
    }, 401);
  }
}

 // LOGIN (only for regular users)
export const userLogin = async (req,res)=>{
    try {
          const dataFromReq = await extractData(req);
          const {email,password}=dataFromReq
          if(!email || !password){
            return jsonResponse(res, { message: "email and password are required" });
          }
          
          const user = loginUser(email,password)
          return jsonResponse(res, { message: "login successful", data:user });
        } catch (error) {
          return jsonResponse(res, { message: "login failed", error:error.message });
        }
}

// CREATE USER 
export const userCreate = async (req,res)=>{
     try {
          const dataFromReq = await extractData(req);
          createUser(dataFromReq);
          return jsonResponse(res, { message: "User created successfully", data: dataFromReq }, 201);
        } catch (error) {
          return jsonResponse(res, { message: "Error creating user", error: error.message }, 400);
        }
}

// GET ALL USER 
export const getAllUser = (req, res) => {
  const reqUrl = req.url;
  const [_, queryString = ""] = reqUrl.split("?");
  const queryParams = {};
  if (queryString) {
    for (const part of queryString.split("&")) {
      const [k, v] = part.split("=");
      if (k) queryParams[k] = v;
    }
  }

  const all = getAllUsers();

  if (!queryString) {
    return jsonResponse(res, { message: "get all users", data: all });
  }

  const page = Math.max(parseInt(queryParams.page || "1", 10) || 1, 1);
  const limit = Math.max(parseInt(queryParams.limit || "3", 10) || 3, 1);
  const total = all.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const data = all.slice(start, end);

  return jsonResponse(res, { message: "get users (paginated)", data, pagination: { total, page: currentPage, limit, totalPages } });
}

//GET USER PASSWORD BY ID 
export const getUserPasswordbyId =(req,res)=>{
      const method = req.method;
  const reqUrl = req.url;
     const segments = reqUrl.split("/").filter(Boolean);
        const isPasswordRoute = segments.length === 4 && segments[3] === "password";
        
        if (isPasswordRoute) {
          const idValue = segments[2];
          try {
            const user = getuserById(idValue);
            let plainPassword = decrypt(user.password || "");
            if (!plainPassword) {
              const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>/?";
              let generated = "";
              for (let i = 0; i < 12; i++) {
                const idx = Math.floor(Math.random() * charset.length);
                generated += charset[idx];
              }
              const updatedUser = updatePassword(idValue, generated);
              plainPassword = generated;
            }
            return jsonResponse(res, { 
              message: "user password retrieved successfully",
              data: { password: plainPassword }
            });
          } catch (error) {
            return jsonResponse(res,{message:"failed to fetch password",error :error.message })
          }
        }
}

// SPECIFIC USER BY ROUTE
export const specificUser = async (req, res) => {
      const method = req.method;
  const reqUrl = req.url;
  const segments = reqUrl.split('/').filter(Boolean); // Remove empty segments
  const idValue = segments[segments.length - 1];
  
  // Check if this is a valid ID (starts with EMP- and ends with -LM)
  const isValidId = /^EMP-\d+-LM$/.test(idValue);
  
  if (isValidId) {
    if (method === "GET") {
     try {
       const user =  getuserById(idValue)
      // Return user without password for security
      const {password,...userWithoutPassword}=user
       return jsonResponse(res, {
         message: `user retrived sucesfully`, data :userWithoutPassword 
       });
      
     } catch (error) {
       return jsonResponse(res,{message:"user is not found " ,error :error.message })
     } 
     
    }

    if (method === "PUT") {
      try {
        const dataFromReq = await extractData(req);
        console.log('Updating user with data:', { id: idValue, data: dataFromReq });
        
        // Make sure we have data to update
        if (!dataFromReq || Object.keys(dataFromReq).length === 0) {
          return jsonResponse(res, { 
            message: "No data provided for update" 
          }, 400);
        }
        
        try {
          const updatedUser = updateUser(idValue, dataFromReq);
          console.log('User updated successfully:', updatedUser);
          
        return jsonResponse(res, {
            message: "User updated successfully",
            data: updatedUser
        });
        } catch (error) {
          console.error('Error in updateUser:', error);
          return jsonResponse(res, {
            message: error.message || "Failed to update user",
            error: error.message
          }, 400);
        }
      } catch (error) {
        return jsonResponse(res,{message:"failed to update user",error :error.message })
      }
    }

    if (method === "DELETE") {
      try {
        deleteUser(idValue)
        return jsonResponse(res, {
          message: "user deleted successfully"
        });
      } catch (error) {
        return jsonResponse(res,{message:"failed to delete user",error :error.message })
      }
    }

    if (method === "PATCH") {
      try {
        const dataFromReq = await extractData(req);
        const {password}=dataFromReq
        if(!password){
          return jsonResponse(res,{message:"password is required"})
        }
        const updatedUser = updatePassword(idValue,password)
        return jsonResponse(res, {
          message: "password updated successfully",
          data:updatedUser
        });
      } catch (error) {
        return jsonResponse(res,{message:"failed to update password",error :error.message })
      }
    }
    } else {
      const searchQuery = segments[segments.length - 1];
      const queryParts = searchQuery.split('?');
      const queryString = queryParts[queryParts.length - 1];

      const querySearchObject = queryString ? queryString.split('&') : [];
      const processQuery = {};
      for (let i = 0; i < querySearchObject.length; i++) {
        const element = querySearchObject[i];
        const [key, val] = element.split('=');
        if (key) processQuery[key] = val;
      }

      if (method === 'GET') {
        try {
          const rawName = processQuery.name || '';
          const searchName = String(rawName).trim().toLowerCase();
          const page = Math.max(parseInt(processQuery.page || '1', 10) || 1, 1);
          const limit = Math.max(parseInt(processQuery.limit || '3', 10) || 3, 1);

          const users = getAllUsers();
          const filtered = searchName
            ? users.filter(u => {
                if (!u || !u.name) return false;
                return String(u.name).trim().toLowerCase() === searchName;
              })
            : users;

          const total = filtered.length;
          if (total === 0) {
            return jsonResponse(res, { message: searchName ? `no users found with name "${searchName}"` : 'no users found' });
          }

          const totalPages = Math.max(Math.ceil(total / limit), 1);
          const currentPage = Math.min(page, totalPages);
          const start = (currentPage - 1) * limit;
          const end = start + limit;
          const data = filtered.slice(start, end);

          return jsonResponse(res, { 
            message: 'users retrieved successfully', 
            data, 
            pagination: { total, page: currentPage, limit, totalPages }
          });
        } catch (error) {
          return jsonResponse(res, { message: 'search failed', error: error.message });
        }
      }
    }
    
   
}

//  GET SPECIFIC USER DETAILS
export const userDetails =(req,res)=>{
      const method = req.method;
  const reqUrl = req.url;
     const Id = reqUrl.split("/");
        const idValue = Id[Id.length - 1];
        try {
          const user = getuserById(idValue)
          // Return user without password for security
          const {password,...userWithoutPassword}=user
          return jsonResponse(res, { 
            message: "user retrieved successfully", 
            data:userWithoutPassword 
          });
        } catch (error) {
          return jsonResponse(res,{message:"user is not found",error :error.message })
        }
} 
