# User Management System

A complete User Management System with secure authentication, role-based access control, and profile management.
It includes both Backend API and Frontend Web Application for Admins and Users.

## TECH STACK

- **Backend:**            Node.js, Express.js
- **Frontend:**           React.js (Vite), Tailwind CSS
- **Authentication:**      JWT (JSON Web Token)
- **State Management:**    React Hooks
- **Database:**            File-based/User Data Store (can be extended to MongoDB later)

## ROLE AND PERMISSIONS

| Feature         | Admin | User |

| Login           |   ✔️  |  ✔️  |
| View Profile    |   ✔️  |  ✔️  |
| Update Profile  |   ✔️  |  ✔️  |
| Change Password |   ✔️  |  ✔️  |
| Add User        |   ✔️  |  ❌  |
| View All Users  |   ✔️  |  ❌  |
| Delete User     |   ✔️  |  ❌  |
| Manage Roles    |   ✔️  |  ❌  |

## FEATURE

👤 User Features-

- Secure login with JWT
- View personal details in a protected dashboard
- Update profile information (Name, Email, Contact, etc.)
- Change password with validation
- Secure session management

🛠 Admin Features-

- Create new user accounts with initial credentials
- View all registered users in an interactive dashboard
- Update user information & permissions
- Soft delete or disable accounts
- Search users by name for quick access
- All actions protected via role-based authentication

🔒 Authentication System

- Login with Email + Password
- Token-based authorization for protected routes
- Sensitive data hidden in responses
- Strong password rules enforced
