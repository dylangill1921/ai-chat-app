import express from "express";
import prisma from "../db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET all rooms (protected)
router.get("/", protect, async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
        orderBy: { createdAt: "asc" },
    });
    res.json(rooms);
    } catch (err) {
    res.status(500).json({ error: "Server error" });
    }
});

// CREATE a room (protected)
router.post("/", protect, async (req, res) => {
    try {
        const { name } = req.body;
        const room = await prisma.room.create({
        data: { name },
    });
    res.status(201).json(room);
    } catch (err) {
    res.status(500).json({ error: "Server error" });
    }
});

export default router;