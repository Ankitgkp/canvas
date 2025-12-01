# Canvas Drawing App - API Documentation

## Base URL
```
http://localhost:3001/api
```

---

## Auth Routes

### 1. Register
- **Method:** `POST`
- **URL:** `/register`
- **Body:**
```json
{
  "email": "test@example.com",
  "username": "testuser",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

---

### 2. Login
- **Method:** `POST`
- **URL:** `/login`
- **Body:**
```json
{
  "identifier": "test@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

---

### 3. Verify Token
- **Method:** `POST`
- **URL:** `/verify-token`
- **Body:**
```json
{
  "token": "jwt_token_here"
}
```
- **Response:**
```json
{
  "valid": true,
  "user": {
    "userId": 1,
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

---

### 4. Get Profile
- **Method:** `GET`
- **URL:** `/profile`
- **Headers:**
```
Authorization: Bearer <token>
```
- **Response:**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "createdAt": "2025-12-01T00:00:00.000Z"
  }
}
```

---

### 5. Health Check
- **Method:** `GET`
- **URL:** `/health`
- **Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T00:00:00.000Z",
  "message": "API is running"
}
```

---

## Room Routes (Protected)

All room routes require the Authorization header:
```
Authorization: Bearer <token>
```

### 6. Create Room
- **Method:** `POST`
- **URL:** `/rooms`
- **Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body:**
```json
{
  "name": "My Drawing Room"
}
```
- **Response:**
```json
{
  "room": {
    "id": 1,
    "roomCode": "ABC123",
    "name": "My Drawing Room",
    "userId": 1,
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-01T00:00:00.000Z"
  }
}
```

---

### 7. Get My Rooms
- **Method:** `GET`
- **URL:** `/rooms`
- **Headers:**
```
Authorization: Bearer <token>
```
- **Response:**
```json
{
  "rooms": [
    {
      "id": 1,
      "roomCode": "ABC123",
      "name": "My Drawing Room",
      "userId": 1,
      "createdAt": "2025-12-01T00:00:00.000Z",
      "updatedAt": "2025-12-01T00:00:00.000Z"
    }
  ]
}
```

---

### 8. Join Room (Get Room by Code)
- **Method:** `GET`
- **URL:** `/rooms/:roomCode`
- **Example:** `/rooms/ABC123`
- **Headers:**
```
Authorization: Bearer <token>
```
- **Response:**
```json
{
  "room": {
    "id": 1,
    "roomCode": "ABC123",
    "name": "My Drawing Room",
    "userId": 1,
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-01T00:00:00.000Z"
  }
}
```

---

## Shape Routes (Protected)

All shape routes require the Authorization header:
```
Authorization: Bearer <token>
```

### 9. Get Shapes in Room
- **Method:** `GET`
- **URL:** `/rooms/:roomCode/shapes`
- **Example:** `/rooms/ABC123/shapes`
- **Headers:**
```
Authorization: Bearer <token>
```
- **Response:**
```json
{
  "shapes": [
    {
      "id": 1,
      "shapeId": "uuid-here",
      "data": "data:image/png;base64,...",
      "roomId": 1,
      "createdAt": "2025-12-01T00:00:00.000Z",
      "updatedAt": "2025-12-01T00:00:00.000Z"
    }
  ]
}
```

---

### 10. Save Shape to Room
- **Method:** `POST`
- **URL:** `/rooms/:roomCode/shapes`
- **Example:** `/rooms/ABC123/shapes`
- **Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body:**
```json
{
  "shapeId": "unique-shape-id-123",
  "data": "data:image/png;base64,iVBORw0KGgo..."
}
```
- **Response:**
```json
{
  "shape": {
    "id": 1,
    "shapeId": "unique-shape-id-123",
    "data": "data:image/png;base64,...",
    "roomId": 1,
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-01T00:00:00.000Z"
  }
}
```

---

### 11. Delete One Shape
- **Method:** `DELETE`
- **URL:** `/rooms/:roomCode/shapes/:id`
- **Example:** `/rooms/ABC123/shapes/1`
- **Headers:**
```
Authorization: Bearer <token>
```
- **Response:**
```json
{
  "message": "Shape deleted"
}
```

---

### 12. Delete All Shapes in Room
- **Method:** `DELETE`
- **URL:** `/rooms/:roomCode/shapes`
- **Example:** `/rooms/ABC123/shapes`
- **Headers:**
```
Authorization: Bearer <token>
```
- **Response:**
```json
{
  "message": "All shapes deleted"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email, username and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Room not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Postman Setup

1. Create an environment with variable `token`
2. After login, copy the token from response
3. Set the token in your environment
4. Use `{{token}}` in Authorization header for protected routes

**Example:**
```
Authorization: Bearer {{token}}
```