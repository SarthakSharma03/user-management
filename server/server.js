import http from "node:http";
import { jsonResponse } from "./utility/jsonResponse.js";
import { initializeDataFile, initialiseAdmin } from "./files.js";
import dotenv from 'dotenv';
import { adminLogin, specificUser, userCreate, userDetails, userLogin,getAllUser } from "./controller.js";
import { verifyToken } from "./utility/token.js";
dotenv.config();
initializeDataFile()
initialiseAdmin()
const PORT = process.env['PORT'] 
console.log(PORT , 'port ')
const server = http.createServer(async (req, res) => {
  try {
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
    try { verifyToken(req,res); } catch (e) { return jsonResponse(res,{message:"unauthorized"},401); }
    return userCreate(req,res)
  }


  if (reqUrl.startsWith("/api/users") && method === "GET") {
    try { verifyToken(req,res); } catch (e) { return jsonResponse(res,{message:"unauthorized"},401); }
    return getAllUser(req,res)
  }

  // USER BY /MY/ should come before the generic /api/user/ route
  if (reqUrl.startsWith("/api/user/my/") && method === "GET") {
    try {
      const decodedUser = verifyToken(req,res);
      req.user = decodedUser;
    } catch (e) { return jsonResponse(res,{message:"unauthorized"}); }
    return userDetails(req,res)
  }

  // SPECIFIC USER ROUTES (GET, PUT, DELETE, PATCH)
  if (reqUrl.startsWith("/api/user/")) {
    try { const decoded = verifyToken(req,res); req.user = decoded; } catch (e) { return jsonResponse(res,{message:"unauthorized"},401); }
    return specificUser(req,res)
  }
 
  // DEFAULT RESPONSE
  return jsonResponse(res, { message: "route not found" });
   } catch (error) {
    console.error("Request handling error:", error);
    return jsonResponse(res, { message: error.message || "Internal Server Error" });
  } 
});
server.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
});
