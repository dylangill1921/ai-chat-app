import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    try {
        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const payload = isLogin
            ? { email: form.email, password: form.password }
            : form;

        const res = await axios.post(`http://localhost:3001${endpoint}`, payload);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/rooms");
    } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
    }
};

return (
    <div style={styles.container}>
        <div style={styles.card}>
            <h1 style={styles.title}>💬 AI Chat</h1>
            <h2 style={styles.subtitle}>{isLogin ? "Welcome back" : "Create account"}</h2>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                {!isLogin && (
                    <input
                    style={styles.input}
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                />
            )}
            <input
                style={styles.input}
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
            />
            <input
                style={styles.input}
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
            />
            <button style={styles.button} type="submit">
                {isLogin ? "Login" : "Register"}
            </button>
            </form>

            <p style={styles.toggle}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Register" : "Login"}
                </span>
            </p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f0f0f" },
    card: { background: "#1a1a1a", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "400px", border: "1px solid #333" },
    title: { textAlign: "center", fontSize: "2rem", marginBottom: "0.5rem" },
    subtitle: { textAlign: "center", color: "#888", fontWeight: "normal", marginBottom: "1.5rem" },
    error: { background: "#ff000020", color: "#ff6b6b", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center" },
    form: { display: "flex", flexDirection: "column", gap: "1rem" },
    input: { padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #333", background: "#0f0f0f", color: "#fff", fontSize: "1rem", outline: "none" },
    button: { padding: "0.75rem", borderRadius: "8px", border: "none", background: "#7c3aed", color: "#fff", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" },
    toggle: { textAlign: "center", marginTop: "1rem", color: "#888" },
    link: { color: "#7c3aed", cursor: "pointer", fontWeight: "bold" },
};