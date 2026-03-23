# 💬 AI Chat App

A full-stack real-time chat application with AI integration, built with React, Node.js, PostgreSQL, and Socket.io.

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing
- 💬 **Real-time Messaging** — Instant messaging powered by Socket.io WebSockets
- 🤖 **AI Integration** — Type `/ai your question` in any room to get an AI response
- 🏠 **Chat Rooms** — Create and join topic-based chat rooms
- 🗄️ **Persistent Storage** — All messages and users stored in PostgreSQL via Prisma ORM

## 🛠 Tech Stack

**Frontend**
- React + Vite
- React Router DOM
- Socket.io Client
- Axios

**Backend**
- Node.js + Express
- Socket.io
- JSON Web Tokens (JWT)
- bcryptjs

**Database**
- PostgreSQL (hosted on Neon)
- Prisma ORM

**AI**
- Groq API (Llama 3.1)

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database (or free Neon.tech account)
- Groq API key (free at console.groq.com)

### Installation

1. Clone the repo
\```bash
git clone https://github.com/yourusername/ai-chat-app.git
cd ai-chat-app
\```

2. Setup the server
\```bash
cd server
npm install
\```

3. Create `server/.env`
\```
DATABASE_URL="your-neon-connection-string"
JWT_SECRET="your-jwt-secret"
PORT=3001
GROQ_API_KEY="your-groq-api-key"
\```

4. Push database schema
\```bash
npx prisma db push
npx prisma generate
\```

5. Start the server
\```bash
npm run dev
\```

6. Setup the client
\```bash
cd ../client
npm install
npm run dev
\```

7. Open http://localhost:5173

## 📸 Usage

1. Register an account or login
2. Join a chat room
3. Send messages in real-time
4. Type `/ai your question` to get an AI response in the chat

## 📁 Project Structure

\```
ai-chat-app/
├── client/                 # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Auth.jsx    # Login/Register
│       │   ├── Rooms.jsx   # Room selection
│       │   └── Chat.jsx    # Real-time chat
│       └── App.jsx
└── server/                 # Node.js backend
    ├── routes/
    │   ├── auth.js         # Auth endpoints
    │   └── rooms.js        # Room endpoints
    ├── middleware/
    │   └── auth.js         # JWT middleware
    ├── prisma/
    │   └── schema.prisma   # Database schema
    ├── db.js               # Prisma client
    └── index.js            # Server entry point
\```