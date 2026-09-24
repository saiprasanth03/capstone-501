import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      if (loggedUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>🔐</div>
          <h2>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to manage your sessions & matches</p>
        </div>

        {error && (
          <div className="alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.75rem", padding: "0.85rem" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ fontWeight: "600" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(80vh - 100px)",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
  },
  header: {
    textAlign: "center",
    marginBottom: "1.75rem",
  },
  iconCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "16px",
    background: "rgba(99, 102, 241, 0.15)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    margin: "0 auto 1rem",
  },
  subtitle: {
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    marginTop: "0.25rem",
  },
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    paddingTop: "1.25rem",
    borderTop: "1px solid var(--border-light)",
  },
};

export default Login;
