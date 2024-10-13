# API Documentation

This document provides an overview of the IT Inventory Management System API endpoints.

## Base URL

All API requests should be made to: `http://your-domain.com/api`

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Authentication

#### POST /auth/login
Login and receive a JWT token.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123456",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Assets

#### GET /assets
Retrieve a list of assets.

Query parameters:
- page (optional): Page number for pagination
- limit (optional): Number of items per page

Response:
```json
{
  "assets": [
    {
      "id": "1",
      "name": "Laptop 1",
      "type": "Hardware",
      "status": "Active"
    },
    ...
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

#### POST /assets
Create a new asset.

Request body:
```json
{
  "name": "New Laptop",
  "type": "Hardware",
  "status": "Active",
  "assignedTo": "John Doe"
}
```

Response:
```json
{
  "id": "2",
  "name": "New Laptop",
  "type": "Hardware",
  "status": "Active",
  "assignedTo": "John Doe"
}
```

### Software Subscriptions

#### GET /software-subscriptions
Retrieve a list of software subscriptions.

#### POST /software-subscriptions
Create a new software subscription.

### Users

#### GET /users
Retrieve a list of users (admin only).

#### POST /users
Create a new user (admin only).

## Error Responses

The API uses conventional HTTP response codes to indicate the success or failure of an API request. In general:

- 2xx: Success
- 4xx: Error that failed given the information provided (e.g., bad request, unauthorized)
- 5xx: Error that is not your fault (e.g., internal server error)

Error response body:
```json
{
  "error": "Error message here"
}
```

For more detailed information about specific endpoints, please refer to the source code or contact the development team.
