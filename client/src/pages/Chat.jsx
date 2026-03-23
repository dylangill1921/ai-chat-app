import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function Chat() {
    const { roomId, roomName } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // Connect to socket server
        socketRef.current = io("http://localhost:3001");

        socketRef.current.on("connect", () => {
        setConnected(true);
        socketRef.current.emit("join_room", roomId);
        });

        // Listen for incoming messages
        socketRef.current.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
        });

        socketRef.current.on("disconnect", () => setConnected(false));

        // Cleanup on unmount
        return () => socketRef.current.disconnect();
    }, [roomId]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !connected) return;

        socketRef.current.emit("send_message", {
        token,
        roomId,
        content: input,
        });

        setInput("");
    };

    return (
        <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate("/rooms")}>← Back</button>
            <h2 style={styles.roomTitle}># {roomName}</h2>
            <span style={{ ...styles.status, color: connected ? "#4ade80" : "#f87171" }}>
            {connected ? "● Connected" : "○ Disconnected"}
            </span>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
            {messages.length === 0 && (
            <div style={styles.empty}>
                <p>No messages yet. Say hi! 👋</p>
                <p style={styles.aiHint}>Type <code>/ai your question</code> to talk to AI</p>
            </div>
            )}
            {messages.map((msg, i) => (
            <div
                key={i}
                style={{
                ...styles.message,
                alignSelf: msg.username === user?.username ? "flex-end" : "flex-start",
                }}
            >
                <div style={styles.messageMeta}>
                <span style={{ ...styles.username, color: msg.isAI ? "#f59e0b" : "#7c3aed" }}>
                    {msg.isAI ? "🤖 AI Assistant" : msg.username}
                </span>
                <span style={styles.time}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                </div>
                <div style={{
                ...styles.bubble,
                background: msg.isAI ? "#1e1a0e" : msg.username === user?.username ? "#3b1d8a" : "#1a1a1a",
                border: msg.isAI ? "1px solid #f59e0b44" : "1px solid #333",
                }}>
                {msg.content}
                </div>
            </div>
            ))}
            <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} style={styles.inputArea}>
            <input
            style={styles.input}
            placeholder={`Message #${roomName} — or type /ai to ask AI...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!connected}
            />
            <button style={styles.sendBtn} type="submit" disabled={!connected}>Send</button>
        </form>
        </div>
    );
}

const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh", background: "#0f0f0f" },
    header: { display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", background: "#1a1a1a", borderBottom: "1px solid #333" },
    backBtn: { padding: "0.4rem 0.8rem", borderRadius: "6px", border: "1px solid #333", background: "transparent", color: "#fff", cursor: "pointer" },
    roomTitle: { flex: 1, fontSize: "1.1rem" },
    status: { fontSize: "0.8rem" },
    messages: { flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" },
    empty: { textAlign: "center", color: "#555", marginTop: "4rem" },
    aiHint: { marginTop: "0.5rem", fontSize: "0.85rem" },
    message: { display: "flex", flexDirection: "column", gap: "0.25rem", maxWidth: "70%" },
    messageMeta: { display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "0.25rem" },
    username: { fontSize: "0.8rem", fontWeight: "bold" },
    time: { fontSize: "0.7rem", color: "#555" },
    bubble: { padding: "0.75rem 1rem", borderRadius: "12px", lineHeight: "1.5", wordBreak: "break-word" },
    inputArea: { display: "flex", gap: "0.75rem", padding: "1rem 1.5rem", background: "#1a1a1a", borderTop: "1px solid #333" },
    input: { flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #333", background: "#0f0f0f", color: "#fff", fontSize: "1rem", outline: "none" },
    sendBtn: { padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer", fontWeight: "bold" },
};