# Canvas Drawing Application

A full-stack web-based drawing application built with React, TypeScript, and Express. This application allows users to create drawings using various tools and colors with a user authentication system.

## Features

- 🎨 **Interactive Drawing Canvas**: HTML5 Canvas-based drawing interface
- 🖌️ **Multiple Brush Colors**: Choose from 6 different colors (Black, Blue, Yellow, Green, Purple, Red)
- 📏 **Adjustable Brush Size**: Control brush size with a slider (1-20 pixels)
- ↩️ **Undo/Redo Functionality**: Step backward or forward through your drawing history
- 🗑️ **Clear Canvas**: Reset the canvas to start fresh
- 💾 **Download Drawings**: Save your artwork as an image
- 🔐 **User Authentication**: Secure login and registration system
- 👤 **User Management**: PostgreSQL database with Prisma ORM

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- HTML5 Canvas API

### Backend
- Node.js
- Express 5
- TypeScript (tsx)
- JWT for authentication
- bcryptjs for password hashing

### Database
- PostgreSQL
- Prisma ORM

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ankitgkp/canvas.git
cd canvas
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL='postgresql://username:password@host:port/database?sslmode=require'
JWT_SECRET='your-secret-key'
PORT=3001
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

## Running the Application

### Development Mode

To run both the frontend and backend concurrently:
```bash
npm run dev:full
```

Or run them separately:

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

### Production Mode

1. Build the application:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

3. Preview the built application:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start Vite development server (frontend)
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run server` - Start the Express server (backend)
- `npm run dev:full` - Run both frontend and backend concurrently
- `npm start` - Start the production server

## Project Structure

```
canvas/
├── src/                      # Frontend source files
│   ├── App.tsx              # Main React component
│   ├── AuthContainer.tsx    # Authentication container
│   ├── LoginForm.tsx        # Login form component
│   ├── RegisterForm.tsx     # Registration form component
│   ├── auth.ts              # Authentication service
│   ├── authUI.ts            # Authentication UI utilities
│   ├── drawingCanvas.ts     # Canvas drawing logic
│   ├── constants.ts         # Application constants
│   ├── main.tsx             # React entry point
│   └── style.css/scss       # Stylesheets
├── server/                   # Backend source files
│   ├── server.ts            # Express server setup
│   ├── routes.ts            # API routes
│   ├── middleware.ts        # Express middleware
│   ├── database.ts          # Database connection
│   └── config.ts            # Server configuration
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── migrations/          # Database migrations
├── assets/                   # Static assets
├── index.html               # HTML entry point
├── package.json             # Project dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── .env                     # Environment variables (not in git)
```

## Database Schema

The application uses a simple user model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login existing user
- `POST /api/verify` - Verify JWT token

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Select Color**: Click on any of the colored buttons to change the brush color
3. **Adjust Brush Size**: Use the slider to change the brush thickness
4. **Draw**: Click and drag on the canvas to draw
5. **Undo/Redo**: Use the buttons to navigate through your drawing history
6. **Clear**: Remove all drawings from the canvas
7. **Download**: Save your artwork as an image file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Created by [Ankitgkp](https://github.com/Ankitgkp)
