import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash the password (never store plain text!)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword },
        });

        // Create and send JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
    res.status(500).json({ error: "Server error" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare password with stored hash
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Create and send JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        } catch (err) {
        res.status(500).json({ error: "Server error" });
        }
});

export default router;