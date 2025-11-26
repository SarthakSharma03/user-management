# User Management Backend API

A backend service for managing user accounts: registration, login/authentication, profile operations (retrieve, update, delete).

## Features

## User Profile Management

The user profile management system enables users to login and view their personal details in a structured form. Key features include:

- **View Profile Details**:
    - Personal information displayed in organized form layout
      - Personal information displayed in organized form layout
      - Read-only view of sensitive data
      - Secure access to user-specific information
- **Account Access**:
    - Secure login using email/password
      - Secure login using email/password
      - Session management
      - Profile data retrieval
The system ensures data privacy and secure access to personal information through authenticated sessions.


The user profile management feature allows users to control their personal information and account settings. This includes:

- **Update Profile**: Users can modify their personal details such as:
      - Name
      - Contact information
      - Address
      - E.Mail
      - Other profile-specific data
    - Change current password
      - Change current password
      - Set up new password with validation
      - Password strength requirements enforcement
All profile operations require authentication and are secured with proper authorization checks. 


## Admin Role

The admin role provides privileged access to manage user accounts and system-wide operations. Key features include:

- **User Management**:
    - Add new users with initial credentials
      - Add new users with initial credentials
      - View comprehensive list of all registered users
      - Access detailed user information and activity logs
- **User Profile Administration**:
    - Update user account details
      - Update user account details
      - Modify user roles and permissions

- **Account Operations**:
    - Delete user accounts
      - Delete user accounts
      - Bulk user management

- **Security Controls**:
    - Role-based access control
      - Role-based access control
      - Audit logging of admin actions
      - Secure admin authentication
All admin operations are logged and require elevated permissions with proper authentication.

## User Role

The user role allows individuals to manage their personal account details and ensure the security of their credentials. Key functionalities include:

- **View Account Details**:
    - Users can access their personal information, including name, contact details, and address.
      - Users can access their personal information, including name, contact details, and address.
      - Information is displayed in a user-friendly format for easy navigation.
- **Update Password**:
    - Users can change their current password to enhance account security.
      - Users can change their current password to enhance account security.
      - The system enforces password strength requirements to ensure robust security.

All operations under the user role require authentication to protect personal information and maintain account integrity.

  
##  Authentication 

    The authentication feature allows users to securely log in to their accounts. It includes the following functionalities:  
    - **User Login**: Users can log in using their registered email and password.  
    
       
## Install dependencies

npm install

### Prerequisites

-> Node.js (version ≥ 14)  
-> npm


### End-Point 

## Admin End Point 

 POST      /api/user              → create a new user  
 GET       /api/user/{id}         → get specific user’s details
 GET       /api/users             → get all users.
 PUT       /api/user/{id}         → update a user details 
 DELETE    /api/user/{id}         → delete or disable user
 POST      /api/user/login        → Login

## User End Point

PATCH     /api/user/{id}               → Update the passwords 
GET       /api/user/my/{id}            → get  user’s details  
POST      /api/user/login              → Login

## common End Point 

GET       /api/user/{id}          → get  user’s details  
POST      /api/user/login         → Login

## user search 

GET    /api/user/{name}          → get specific user card 