<p align="center">
  <img src="frontend/public/assets/cadmus_light.png" alt="Cadmus" width="140" />
</p>

# Cadmus

A full-stack chat app built by a team of four: users sign in, see everyone else, and message each other one-on-one.

**Live:** [cadmus.krishnalam.com](https://cadmus.krishnalam.com)

## Stack

- **Frontend:** vanilla JavaScript + [Vite](https://vitejs.dev), with [DOMPurify](https://github.com/cure53/DOMPurify) sanitizing every message before it is rendered
- **Backend:** Node.js + Express REST API
- **Database:** SQLite through the Sequelize ORM
- **Security:** Helmet headers and a CORS allowlist

## How it works

```
frontend (Vite) ──fetch──► Express API ──Sequelize──► SQLite
                           ├─ /user  sign in, list users
                           └─ /chat  send and load messages
```

- Each conversation has a `conversationId` shared by its two participants.
- When you open a conversation, the client loads its history, then polls for new messages every 30 seconds.

## Running locally

```bash
npm start
```

This installs the dependencies and starts both apps with `concurrently`: the frontend on `http://localhost:5173` and the API on `http://localhost:8080`. The frontend reads the API URL from `VITE_BACKEND` in `frontend/.env`.

## Project layout

```
backend/
  index.js            Express app, CORS and Helmet setup
  api/models/         Sequelize models (User, Chat)
  api/controllers/    request handlers
  api/routes/         /user and /chat routers
frontend/
  src/main.js         UI, sign-in, polling, sending messages
```

## Team

Krish, Mohammad, Mridul and Dave.
