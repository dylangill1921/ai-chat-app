import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import prisma from "./db.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "AI Chat server is running! 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// Socket.io
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a room
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle incoming messages
    socket.on("send_message", async (data) => {
        const { token, roomId, content } = data;

    try {
        // Verify JWT so only logged in users can send messages
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save message to database
        const message = await prisma.message.create({
            data: {
                content,
                userId: decoded.userId,
                roomId: parseInt(roomId),
            },
        include: { user: { select: { username: true } } },
    });

      // Broadcast to everyone in the room
    io.to(roomId).emit("receive_message", {
        id: message.id,
        content: message.content,
        username: message.user.username,
        createdAt: message.createdAt,
        isAI: false,
    });

      // AI response if message starts with /ai
    if (content.startsWith("/ai ")) {
        const prompt = content.slice(4);

        const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
    }),
});

    const aiData = await aiResponse.json();
    const aiText = aiData?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

        // Save AI message to database
        const aiMessage = await prisma.message.create({
            data: {
                content: aiText,
                userId: decoded.userId,
                roomId: parseInt(roomId),
                isAI: true,
            },
            include: { user: { select: { username: true } } },
        });

        // Broadcast AI response to room
        io.to(roomId).emit("receive_message", {
            id: aiMessage.id,
            content: aiText,
            username: "AI Assistant",
            createdAt: aiMessage.createdAt,
            isAI: true,
        });
    }
    } catch (err) {
        console.error("Message error:", err);
    }
});

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };