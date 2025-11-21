import { readData, writeData } from "./files.js";
 
const createRandomId = (length = 8) => {
  const chars = "0123456789";
  let randomPart = "";
  for (let i = 0; i < length; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EMP-${randomPart}-LM`;
};

const validateUser = (user) => {
  const { name, email, role, phone } = user;
  const errors = [];
  if (!name || name.length < 2)
    errors.push("name is required and must have 2 letter");
  if (!role || !["user", "admin", "manager"].includes(role))
    errors.push("invalid role ");
  if (phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length !== 10 || !/^\d+$/.test(cleanPhone)) {
      errors.push("phone number must have 10 digits");
    }
  }
  if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    errors.push("email is not valid ");

  return errors;
};

export const createUser = (userData) => {
  const oldData = readData();
 
  // if (userData.role === "admin") {
  //   throw new Error("Admin role cannot be created. Admin is managed separately.");
  // }

  const validationErrors = validateUser(userData);
 
  
  if (validationErrors.length > 0) {
    throw new Error(validationErrors[0]);
  }

  // Check for duplicate email 
  const emailExists = oldData.some((user) => 
    user.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (emailExists) {
    throw new Error("User with this email already exists");
  }

  // Create new user
  const id = createRandomId();
  const cleanPhone = userData.phone ? userData.phone.replace(/[\s\-\(\)]/g, '') : '';
  const newUser = { 
    ...userData,
    phone: cleanPhone || userData.phone || '',
    id, 
    createdAt: new Date().toISOString() 
  };
  
 
  
  oldData.push(newUser);

  
  // Write data to file
  try {
    writeData(oldData);
   
  } catch (error) {
    throw new Error(`Failed to save user: ${error.message}`);
  }
};

export const getAllUsers = () => {
  const data = readData();
  return data;
};

export const getuserById = (id) => {
  const currentData = readData();

  for (let i = 0; i < currentData.length; i++) {
    const user = currentData[i];
    if (user.id === id) return user;
  }

  throw new Error("user not found");
};

export const updateUser = (id, userData) => {
  const currentData = readData();
  let userFound = false;

  // Prevent changing role to admin
  if (userData.role === "admin") {
    throw new Error("Admin role cannot be assigned. Admin is managed separately.");
  }

  for (let i = 0; i < currentData.length; i++) {
    if (currentData[i].id === id) {
      const currentUser = currentData[i];
      
      // Prevent updating admin users
      if (currentUser.role === "admin") {
        throw new Error("Admin users cannot be updated through this function.");
      }
      
      // Check for duplicate email - exclude current user
      if (userData.email && userData.email.toLowerCase() !== currentUser.email.toLowerCase()) {
        const emailExists = currentData.some((user) => 
          user.id !== id && user.email.toLowerCase() === userData.email.toLowerCase()
        );
        
        if (emailExists) {
          throw new Error("User with this email already exists");
        }
      }

      // Validate updated user data
      if (userData.name || userData.email || userData.role || userData.phone) {
        const updatedUser = { ...currentUser, ...userData };
        const validationErrors = validateUser(updatedUser);
        if (validationErrors.length > 0) throw new Error(validationErrors[0]);
      }

      // Update user data
      currentData[i] = { ...currentUser, ...userData };
      userFound = true;
      break;
    }
  }

  if (!userFound) throw new Error("user not found");

  writeData(currentData);
  return currentData.find((user) => user.id === id);
};

export const deleteUser = (id) => {
  const currentData = readData();
  const initialLength = currentData.length;
  const updatedData = currentData.filter((user) => user.id !== id);

  if (updatedData.length === initialLength) {
    throw new Error("user not found");
  }

  writeData(updatedData);
  return true;
};

export const updatePassword = (id, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("password must be at least 6 characters");
  }

  const currentData = readData();
  let userFound = false;

  for (let i = 0; i < currentData.length; i++) {
    if (currentData[i].id === id) {
      currentData[i].password = newPassword;
      userFound = true;
      break;
    }
  }

  if (!userFound) throw new Error("user not found");

  writeData(currentData);
  const updatedUser = currentData.find((user) => user.id === id);
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const loginUser = (email, password) => {
  if (!email || !password) {
    throw new Error("email and password are required");
  }

  const currentData = readData();

  for (let i = 0; i < currentData.length; i++) {
    const user = currentData[i];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      if (user.password === password) {
        // Return user without password for security
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      } else {
        throw new Error("invalid password");
      }
    }
  }

  throw new Error("user not found");
};

export const updatePasswordByEmail = (email, newPassword) => {
  if (!email || !newPassword) {
    throw new Error("email and password are required");
  }

  if (newPassword.length < 6) {
    throw new Error("password must be at least 6 characters");
  }

  const currentData = readData();
  let userFound = false;

  for (let i = 0; i < currentData.length; i++) {
    if (currentData[i].email.toLowerCase() === email.toLowerCase()) {
      currentData[i].password = newPassword;
      userFound = true;
      break;
    }
  }

  if (!userFound) throw new Error("user not found");

  writeData(currentData);
  const updatedUser = currentData.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const getUserByEmail = (email) => {
  const currentData = readData();

  for (let i = 0; i < currentData.length; i++) {
    const user = currentData[i];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }

  throw new Error("user not found");
};

export const loginAdmin = (email, password, name) => {
  if (!email || !password || !name) {
    throw new Error("email, password, and name are required");
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASS;
  const adminName = process.env.ADMIN_NAME;


  if (!adminEmail || !adminPassword || !adminName) {
    
    throw new Error("Admin credentials not configured in environment variables");
  }

  const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatch = password === adminPassword;
  const nameMatch = name.toLowerCase() === adminName.toLowerCase();

 

  if (!emailMatch || !passwordMatch || !nameMatch) {
    throw new Error("Invalid admin credentials");
  }

  const currentData = readData();
  const adminUser = currentData.find((user) => user.role === "admin");

  if (!adminUser) {
    throw new Error("Admin user not found in database");
  }

  const { password: _, ...adminWithoutPassword } = adminUser;
  return adminWithoutPassword;
};
