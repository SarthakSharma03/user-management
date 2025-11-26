import http from "http";
import { jsonResponse } from "./utility/jsonResponse.js";
import { initializeDataFile, readData, initialiseAdmin } from "./files.js";
import { createUser, getAllUsers,getuserById,updateUser,deleteUser,updatePassword,loginUser,updatePasswordByEmail,getUserByEmail,loginAdmin } from "./manageUsers.js";
import dotenv from 'dotenv';
import { adminLogin, getUserPasswordbyId, specificUser, userCreate, userDetails, userLogin,getAllUser } from "./controller.js";
dotenv.config();


initializeDataFile()

initialiseAdmin()


const PORT = process.env['PORT'] 
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
  return adminLogin(req,res)
  }

  // LOGIN (only for regular users)
  if (reqUrl === "/api/user/login" && method === "POST") {
   return userLogin(req,res)
  }

  // CREATE USER
  if (reqUrl === "/api/user" && method === "POST") {
   return userCreate(req,res)
  }

  // GET USER PASSWORD BY ID  
  if (reqUrl.startsWith("/api/users/") && method === "GET") {
   return getUserPasswordbyId(req,res)
  }

  if (reqUrl.startsWith("/api/users") && method === "GET") {
   return getAllUser(req,res)
  }

  // SPECIFIC USER ROUTES (GET, PUT, DELETE, PATCH)
  if (reqUrl.startsWith("/api/user/")) {
   return specificUser(req,res)
  }

  // USER BY /MY/
  if (reqUrl.startsWith("/api/user/my/") && method === "GET") {
    return userDetails(req,res)
  }
 
  // DEFAULT RESPONSE
  return jsonResponse(res, { message: "route not found" });
});

server.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
});
