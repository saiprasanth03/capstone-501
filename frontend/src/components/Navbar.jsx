import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/"} style={styles.brand}>
          <div style={styles.logoIcon}>⚡</div>
          <span style={styles.brandText}>Sports<span style={styles.brandAccent}>Hub</span></span>
        </Link>

        {user && (
          <div style={styles.navContent}>
            <nav style={styles.navLinks}>
              <Link to="/dashboard" style={styles.navLink}>
                Dashboard
              </Link>
              <Link to="/sessions/create" style={styles.navLink}>
                + Create Session
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" style={styles.navLinkAdmin}>
                  👑 Admin Panel
                </Link>
              )}
            </nav>

            <div style={styles.userSection}>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user.name}</span>
                <span className="badge badge-role">{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div style={styles.authButtons}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0.85rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#f8fafc",
    textDecoration: "none",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
  },
  brandText: {
    letterSpacing: "-0.03em",
  },
  brandAccent: {
    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navContent: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  navLink: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    fontWeight: "500",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  navLinkAdmin: {
    color: "#c084fc",
    fontSize: "0.95rem",
    fontWeight: "600",
    textDecoration: "none",
    padding: "0.3rem 0.75rem",
    borderRadius: "8px",
    background: "rgba(192, 132, 252, 0.12)",
    border: "1px solid rgba(192, 132, 252, 0.25)",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  userName: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  authButtons: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
};

export default Navbar;
