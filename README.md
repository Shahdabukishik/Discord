# Discord Mini Clone

A modern Discord-inspired realtime chat app built with React, Vite, Express, MongoDB, Socket.io, Axios, JWT authentication, and bcryptjs password hashing.

## Features

- Register and login with JWT authentication
- Protected REST APIs
- Realtime channel messaging with Socket.io
- MongoDB persistence for chat history
- Channels for `general`, `coding`, `gaming`, and `music`
- Responsive dark Discord-inspired UI
- Loading, error, empty, typing, connected, and logout states

## Project Structure

```txt
client/
  src/
    components/
    context/
    pages/
    services/
    socket.js
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  socket/
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/discord-clone
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Example files are included at `server/.env.example` and `client/.env.example`.

## Install

```bash
cd server
npm install

cd ../client
npm install
```

## Run Locally

Start MongoDB locally or use MongoDB Atlas, then run:

```bash
cd server
npm run dev
```

In a second terminal:

```bash
cd client
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`.

## API Overview

- `POST /api/auth/register` creates a user and returns a JWT
- `POST /api/auth/login` authenticates a user and returns a JWT
- `GET /api/auth/me` returns the current authenticated user
- `GET /api/messages/:channel` returns recent messages for a channel

Protected routes require:

```txt
Authorization: Bearer <token>
```

## Socket Events

Socket connections authenticate with the JWT in the Socket.io `auth.token` handshake value.

- `join_channel` joins one of the allowed channels
- `send_message` validates, saves, and broadcasts a message
- `receive_message` delivers a realtime message to channel members
- `typing` broadcasts lightweight typing state

## Deployment Suggestions

### Frontend on Vercel

- Set project root to `client`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL` and `VITE_SOCKET_URL` pointing to the Render backend URL

### Backend on Render

- Set project root to `server`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables from `server/.env.example`
- Set `CLIENT_URL` to the deployed Vercel URL

### MongoDB Atlas

- Create a free cluster
- Add a database user
- Allow Render's outbound access or use `0.0.0.0/0` for simple demos
- Copy the connection string into `MONGO_URI`

## Production Notes

- Use a long random `JWT_SECRET`
- Keep frontend and backend URLs synchronized in CORS and Vite env vars
- Use HTTPS deployment URLs for both Vercel and Render
- Consider adding rate limiting and server-side socket authentication before exposing this as a public app
