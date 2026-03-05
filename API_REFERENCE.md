# SkillMatrix Pro - API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "profile_completion": 0
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "profile_completion": 75
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "profile_completion": 75
  }
}
```

### Logout
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Endpoints (Admin Only)

### Get All Users
**GET** `/users`

**Query Parameters:**
- `role` (optional): Filter by role (admin/employee)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "employee",
      "profile_completion": 75,
      "created_at": "2026-02-20T10:00:00Z"
    }
  ]
}
```

### Update User Profile (Employee)
**PUT** `/users/profile`

**Request Body:**
```json
{
  "full_name": "John Updated",
  "profile_completion": 85
}
```

---

## Skill Endpoints

### Get All Skills
**GET** `/skills`

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": 1,
      "name": "JavaScript",
      "category": "Programming",
      "created_at": "2026-02-20T10:00:00Z"
    }
  ]
}
```

### Create Skill (Admin)
**POST** `/skills`

**Request Body:**
```json
{
  "name": "TypeScript",
  "category": "Programming"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skill created successfully",
  "data": {
    "id": 21,
    "name": "TypeScript",
    "category": "Programming"
  }
}
```

### Get My Skills (Employee)
**GET** `/skills/employee/my-skills`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "skill_id": 1,
      "name": "JavaScript",
      "category": "Programming",
      "proficiency_level": 4,
      "created_at": "2026-02-20T10:00:00Z"
    }
  ]
}
```

### Add Skill to Employee
**POST** `/skills/employee/add`

**Request Body:**
```json
{
  "skill_id": 1,
  "proficiency_level": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skill added successfully",
  "data": {
    "id": 1,
    "user_id": 2,
    "skill_id": 1,
    "proficiency_level": 4
  }
}
```

### Update Employee Skill
**PUT** `/skills/employee/:id`

**Request Body:**
```json
{
  "proficiency_level": 5
}
```

### Get Top Skills (Admin)
**GET** `/skills/analytics/top?limit=20`

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": 1,
      "name": "JavaScript",
      "category": "Programming",
      "employee_count": 10,
      "avg_proficiency": 4.2
    }
  ]
}
```

### Get Skill Distribution (Admin)
**GET** `/skills/analytics/distribution`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category": "Programming",
      "employee_count": 15
    },
    {
      "category": "Frontend",
      "employee_count": 12
    }
  ]
}
```

---

## Project Endpoints

### Get All Projects
**GET** `/projects`

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "name": "E-Commerce Platform",
      "description": "Full-stack e-commerce solution",
      "creator_name": "Admin User",
      "team_size": 3,
      "created_at": "2026-02-20T10:00:00Z"
    }
  ]
}
```

### Create Project (Admin)
**POST** `/projects`

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": 5,
    "name": "New Project",
    "description": "Project description",
    "created_by": 1
  }
}
```

### Get My Projects (Employee)
**GET** `/projects/my-projects`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "E-Commerce Platform",
      "description": "Full-stack e-commerce solution",
      "creator_name": "Admin User",
      "assigned_at": "2026-02-20T10:00:00Z"
    }
  ]
}
```

### Assign User to Project (Admin)
**POST** `/projects/:id/assign`

**Request Body:**
```json
{
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "User assigned to project successfully",
  "data": {
    "id": 1,
    "project_id": 1,
    "user_id": 2
  }
}
```

### Get Top Projects (Admin)
**GET** `/projects/analytics/top?limit=10`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "E-Commerce Platform",
      "team_size": 5
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'employee' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
