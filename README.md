# TodoApp — Full-Stack Todo Management

A full-stack todo management application with authentication, protected routes, and complete CRUD operations.

## Live Demo
- Frontend: (Vercel URL)
- Backend: (Render URL)

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite + Tailwind CSS v4
- Zustand (auth state)
- TanStack Query (server state)
- React Router DOM
- Framer Motion
- Lucide React
- React Hot Toast

### Backend
- Node.js + Express
- PostgreSQL + Prisma
- JWT Authentication
- Zod Validation
- Jest + Supertest (tests)

## Project Structure
todo-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    # auth, todo
│   │   ├── routes/         # auth, todos
│   │   ├── middleware/      # JWT auth
│   │   ├── validators/      # zod schemas
│   │   ├── utils/           # jwt helpers
│   │   ├── config/          # prisma client
│   │   └── tests/           # jest + supertest
│   └── prisma/
│       └── schema.prisma
└── frontend/
└── src/
├── pages/           # Login, Register, Dashboard, Todos, Profile
├── components/      # Layout
├── hooks/           # useTodos
├── store/           # auth (zustand)
├── lib/             # axios
└── types/           # TypeScript types

## Local Setup

### Backend

```bash
cd backend
npm install
```

Create `.env`:
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://your_user@localhost:5432/todoapp"
JWT_SECRET="your-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret"
CLIENT_URL="http://localhost:5173"

```bash
createdb todoapp
npx prisma migrate dev --name init
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:
VITE_API_URL=http://localhost:4000/api

```bash
npm run dev
```

## API Endpoints

### Auth
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login
POST   /api/auth/logout      Logout
POST   /api/auth/refresh     Refresh token
GET    /api/auth/me          Get current user
PATCH  /api/auth/me          Update profile

### Todos (all protected)
GET    /api/todos            List todos (filter/search/sort)
POST   /api/todos            Create todo
GET    /api/todos/stats      Get stats
GET    /api/todos/:id        Get single todo
PATCH  /api/todos/:id        Update todo
DELETE /api/todos/:id        Delete todo

### Query Parameters (GET /api/todos)
status   PENDING | IN_PROGRESS | COMPLETED
priority LOW | MEDIUM | HIGH
search   string (searches title)
sortBy   createdAt | dueDate
order    asc | desc

## Running Tests

```bash
cd backend
npm test
```

Tests cover:
- User registration and login
- Duplicate email validation
- Invalid credentials
- Protected route access
- Todo CRUD operations
- User ownership (User B cannot access User A's todos)

## Features
- JWT authentication with refresh tokens
- Protected routes (frontend + backend)
- Todo CRUD with ownership checks
- Filter by status and priority
- Search by title
- Sort by created date or due date
- Status and priority badges
- Delete confirmation dialog
- Loading skeletons
- Empty states
- Form validation feedback
- Responsive design
- Profile page with stats

## Author
Gaga Chituashvili
GitHub: https://github.com/gaga-chituashvili
