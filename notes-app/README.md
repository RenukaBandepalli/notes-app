# Personal Notes App

A full-stack notes application where each user registers, logs in, and manages their own private notes.
Built with the MERN stack (MongoDB, Express, React, Node.js).

**Live demo:** <your Vercel link>
**API:** <your Render link>

## Features

- Register and log in (passwords hashed with bcrypt, sessions via JWT)
- Create, edit, and delete notes
- Pin important notes (pinned notes appear first)
- Add tags and filter by tag
- Search notes by title or content (debounced)
- Each user sees only their own notes (data isolation)
- Created/updated timestamps on every note
- Responsive layout with light and dark mode

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens, bcryptjs |

## Project structure

```
notes-app/
├── server/
│   ├── models/        User.js, Note.js
│   ├── routes/        auth.js, notes.js
│   ├── middleware/    auth.js
│   └── server.js
└── client/
    └── src/
        ├── pages/       AuthPage.jsx, NotesPage.jsx
        ├── components/  NoteForm.jsx, NoteCard.jsx, ProtectedRoute.jsx
        ├── hooks/       useDebounce.js
        └── api.js
```

## API endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Log in, returns a token | No |
| GET | `/api/notes?search=&tag=` | List my notes (pinned first) | Yes |
| POST | `/api/notes` | Create a note | Yes |
| PUT | `/api/notes/:id` | Update a note or toggle pin | Yes |
| DELETE | `/api/notes/:id` | Delete a note | Yes |

Protected routes expect the header `Authorization: Bearer <token>`.

## Run locally

Requirements: Node.js, and MongoDB running locally (or an Atlas connection string).

**1. Backend**

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notesapp
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

**2. Frontend**

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Security notes

- Passwords are hashed with bcrypt and never returned by the API
- Every notes query includes the logged-in user's id, so users cannot read or change each other's notes
- The note owner is taken from the verified token, never from the request body
- Secrets live in environment variables and are excluded from Git

## Possible improvements

- Pagination for large note collections
- Refresh tokens and httpOnly cookies
- Rich-text notes and note colours
- Rate limiting on login

## Author

Renuka
