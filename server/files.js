import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createUser } from "./manageUsers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, "data", "users.json");

export const initializeDataFile = () => {
  const dir = path.join(__dirname, "data");
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
  }
};

 export const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      initializeDataFile();
    }
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read data: ${error.message}`);
  }
};

 export const writeData = (data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFilePath, jsonString, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write data: ${error.message}`);
  }
};

export const initialiseAdmin = ()=>{

try {
     const admin = {
      id:1,
      name:process.env.ADMIN_NAME,
      phone:process.env.ADMIN_PHONE,
      email:process.env.ADMIN_EMAIL,
      password:process.env.ADMIN_PASS,
      role: 'admin',
     
    };
  createUser(admin);
} catch (error) {
   console.log(`${error.message} (Admin already exists)`) 
}
  
  
}