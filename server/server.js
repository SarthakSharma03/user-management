import http from "http";
import { jsonResponse } from "./utility/jsonResponse.js";
import { initializeDataFile, readData, initialiseAdmin } from "./files.js";
import { createUser, getAllUsers,getuserById,updateUser,deleteUser,updatePassword,loginUser,updatePasswordByEmail,getUserByEmail,loginAdmin } from "./manageUsers.js";
import { extractData } from "./utility/extractData.js";
import * as dotenv from 'dotenv';
dotenv.config();


initializeDataFile()

initialiseAdmin()


const PORT = process.env.PORT ;
console.log(PORT , 'port ')
const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

 
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const method = req.method;
  const reqUrl = req.url;

  const isStartingWithAPI = reqUrl.startsWith("/api");

  if (!isStartingWithAPI) {
    return jsonResponse(res, { message: "Unknown Error Occurred" });
  }

  // ADMIN LOGIN
  if (reqUrl === "/api/admin/login" && method === "POST") {
    try {
      const dataFromReq = await extractData(req);
      const {email, password, name} = dataFromReq;
      
      if(!email || !password || !name){
        return jsonResponse(res, { message: "email, password, and name are required" },400);
      }
      
      const admin = loginAdmin(email, password, name);
      return jsonResponse(res, { message: "admin login successful", data: admin });
    } catch (error) {
      return jsonResponse(res, { message: "admin login failed", error:error.message },400);
    }
  }

  // LOGIN (only for regular users)
  if (reqUrl === "/api/user/login" && method === "POST") {
    try {
      const dataFromReq = await extractData(req);
      const {email,password}=dataFromReq
      if(!email || !password){
        return jsonResponse(res, { message: "email and password are required" },400);
      }
      
      const user = loginUser(email,password)
      return jsonResponse(res, { message: "login successful", data:user });
    } catch (error) {
      return jsonResponse(res, { message: "login failed", error:error.message },400);
    }
  }

  // CREATE USER
  if (reqUrl === "/api/user" && method === "POST") {
    try {
      const dataFromReq = await extractData(req);
      createUser(dataFromReq);
      return jsonResponse(res, { message: "User created successfully", data: dataFromReq }, 201);
    } catch (error) {
      return jsonResponse(res, { message: "Error creating user", error: error.message }, 400);
    }
  }

  // GET ALL USERS
  if (reqUrl === "/api/users" && method === "GET") {
    const data=getAllUsers()
    return jsonResponse(res, { message: "get all users",data });
  }

  // GET USER PASSWORD BY ID
  if (reqUrl.startsWith("/api/users/") && method === "GET") {
    const segments = reqUrl.split("/").filter(Boolean);
    const isPasswordRoute = segments.length === 4 && segments[3] === "password";
    
    if (isPasswordRoute) {
      const idValue = segments[2];
      try {
        const user = getuserById(idValue);
        return jsonResponse(res, { 
          message: "user password retrieved successfully",
          data: { password: user.password || "" }
        });
      } catch (error) {
        return jsonResponse(res,{message:"failed to fetch password",error :error.message },400)
      }
    }
  }

  // SPECIFIC USER ROUTES (GET, PUT, DELETE, PATCH)
  if (reqUrl.startsWith("/api/user/")) {
    const Id = reqUrl.split("/");
    const idValue = Id[Id.length - 1];

   

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
        const updatedUser = updateUser(idValue,dataFromReq)
        return jsonResponse(res, {
          message: "user updated successfully",
          data:updatedUser
        });
      } catch (error) {
        return jsonResponse(res,{message:"failed to update user",error :error.message },400)
      }
    }

    if (method === "DELETE") {
      try {
        deleteUser(idValue)
        return jsonResponse(res, {
          message: "user deleted successfully"
        });
      } catch (error) {
        return jsonResponse(res,{message:"failed to delete user",error :error.message },400)
      }
    }

    if (method === "PATCH") {
      try {
        const dataFromReq = await extractData(req);
        const {password}=dataFromReq
        if(!password){
          return jsonResponse(res,{message:"password is required"},400)
        }
        const updatedUser = updatePassword(idValue,password)
        return jsonResponse(res, {
          message: "password updated successfully",
          data:updatedUser
        });
      } catch (error) {
        return jsonResponse(res,{message:"failed to update password",error :error.message },400)
      }
    }
  }

  // USER BY /MY/
  if (reqUrl.startsWith("/api/user/my/") && method === "GET") {
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
      return jsonResponse(res,{message:"user is not found",error :error.message },400)
    }
  }

  // DEFAULT RESPONSE
  return jsonResponse(res, { message: "route not found" });
});

server.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
});
