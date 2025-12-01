# Canvas Drawing App

A collaborative real-time drawing application where users can create rooms, invite others, and draw together on a shared canvas.

![Canvas App](assets/canvas_screenshot1.png)

##  Features

- **User Authentication** - Secure signup and login with JWT tokens
- **Room System** - Create private rooms with unique codes
- **Collaborative Drawing** - Share room codes to draw together
- **Persistent Storage** - All drawings are saved to database
- **Drawing Tools** - Multiple brush colors and sizes
- **Undo/Redo** - Full history support
- **Download** - Save your artwork as PNG

## ech Stack

| Category | Technology |
|----------|------------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (Prisma ORM) |
| Auth | JWT, bcrypt |
| Build | Vite |

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use [Neon](https://neon.tech))

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Ankitgkp/canvas.git
cd canvas
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your database URL:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key"
```

4. **Setup database**
```bash
npx prisma migrate dev
```

5. **Start development server**
```bash
npm run dev:full
```

This starts both the backend (port 3001) and frontend (port 5173).

## Usage

1. **Register/Login** - Create an account or sign in
2. **Create Room** - Enter a room name and click "Create"
3. **Share Code** - Share the 6-character room code with friends
4. **Join Room** - Others can join using the room code
5. **Draw Together** - Everyone in the room sees the shared canvas

## Project Structure

```
canvas/
├── src/                    # Frontend React app
│   ├── App.tsx            # Main app with room logic
│   ├── auth.ts            # Auth service & API calls
│   ├── drawingCanvas.ts   # Canvas drawing logic
│   ├── LoginForm.tsx      # Login component
│   └── RegisterForm.tsx   # Register component
├── server/                 # Backend Express server
│   ├── server.ts          # Server entry point
│   ├── routes.ts          # API routes
│   ├── middleware.ts      # Auth middleware
│   └── database.ts        # Prisma client
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
└── API_DOCS.md            # API documentation
```

## API Endpoints

See [API_DOCS.md](API_DOCS.md) for detailed documentation.

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String
  rooms     Room[]
}

model Room {
  id        Int      @id @default(autoincrement())
  roomCode  String   @unique
  name      String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  shapes    Shape[]
}

model Shape {
  id        Int      @id @default(autoincrement())
  shapeId   String
  data      String   // Base64 PNG image
  roomId    Int
  room      Room     @relation(fields: [roomId], references: [id])
}
```

## Scripts

```bash
npm run dev        # Start Vite dev server
npm run server     # Start backend server
npm run dev:full   # Start both servers
npm run build      # Build for production
npm run preview    # Preview production build
```

## Deployment

### Render
Use the included `render.yaml` for easy deployment:
```yaml
services:
  - type: web
    name: canvas-app
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start
```
Made with ❤️ by [Ankitgkp](https://github.com/Ankitgkp)

