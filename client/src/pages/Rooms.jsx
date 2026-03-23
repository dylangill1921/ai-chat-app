import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchRooms = async () => {
        try {
            const res = await axios.get("http://localhost:3001/api/rooms", {
            headers: { Authorization: `Bearer ${token}` },
            });
            setRooms(res.data);
        } catch {
            setError("Failed to load rooms");
        }
        };
        fetchRooms();
    }, [token]);

    const createRoom = async (e) => {
        e.preventDefault();
        if (!newRoom.trim()) return;
        try {
        await axios.post(
            "http://localhost:3001/api/rooms",
            { name: newRoom.toLowerCase().replace(/\s+/g, "-") },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setNewRoom("");
        const res = await axios.get("http://localhost:3001/api/rooms", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to create room");
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={styles.container}>
        <div style={styles.header}>
            <h1 style={styles.title}>💬 AI Chat</h1>
            <div style={styles.userInfo}>
            <span style={styles.username}>👋 {user?.username}</span>
            <button style={styles.logoutBtn} onClick={logout}>Logout</button>
            </div>
        </div>

        <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Chat Rooms</h2>
            <p style={styles.hint}>Type <code>/ai your question</code> in any room to chat with AI</p>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={createRoom} style={styles.form}>
            <input
                style={styles.input}
                placeholder="Create a new room..."
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
            />
            <button style={styles.createBtn} type="submit">+ Create</button>
            </form>

            <div style={styles.roomList}>
            {rooms.map((room) => (
                <div
                key={room.id}
                style={styles.roomCard}
                onClick={() => navigate(`/chat/${room.id}/${room.name}`)}
                >
                <span style={styles.roomHash}>#</span>
                <span style={styles.roomName}>{room.name}</span>
                <span style={styles.roomArrow}>→</span>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}

const styles = {
    container: { minHeight: "100vh", background: "#0f0f0f" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#1a1a1a", borderBottom: "1px solid #333" },
    title: { fontSize: "1.5rem" },
    userInfo: { display: "flex", alignItems: "center", gap: "1rem" },
    username: { color: "#888" },
    logoutBtn: { padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #333", background: "transparent", color: "#fff", cursor: "pointer" },
    content: { maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" },
    sectionTitle: { marginBottom: "0.5rem" },
    hint: { color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem" },
    error: { background: "#ff000020", color: "#ff6b6b", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" },
    form: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
    input: { flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "#fff", fontSize: "1rem", outline: "none" },
    createBtn: { padding: "0.75rem 1.25rem", borderRadius: "8px", border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer", fontWeight: "bold" },
    roomList: { display: "flex", flexDirection: "column", gap: "0.75rem" },
    roomCard: { display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", background: "#1a1a1a", borderRadius: "10px", border: "1px solid #333", cursor: "pointer" },
    roomHash: { color: "#7c3aed", fontSize: "1.25rem", fontWeight: "bold" },
    roomName: { flex: 1, fontSize: "1rem" },
    roomArrow: { color: "#555" },
};