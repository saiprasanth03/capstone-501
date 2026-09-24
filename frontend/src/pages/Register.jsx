import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>⚽</div>
          <h2>Create Account</h2>
          <p style={styles.subtitle}>Join local sports matches in your area</p>
        </div>

        {error && (
          <div className="alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password (min 6 characters)</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.75rem", padding: "0.85rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: "600" }}>
              Log In
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
    maxWidth: "440px",
  },
  header: {
    textAlign: "center",
    marginBottom: "1.75rem",
  },
  iconCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "16px",
    background: "rgba(6, 182, 212, 0.15)",
    border: "1px solid rgba(6, 182, 212, 0.3)",
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

export default Register;