import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateSession from "./pages/CreateSession";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function Home() {
  return (
    <div style={homeStyles.heroContainer} className="animate-fade-in">
      <div style={homeStyles.badge}>
        <span>🏆 Community Sports Network</span>
      </div>
      
      <h1 style={homeStyles.title}>
        Schedule & Join <span style={homeStyles.gradientText}>Local Sports Matches</span>
      </h1>
      
      <p style={homeStyles.subtitle}>
        Connect with local players, organize matches for football, basketball, badminton and more, and build your active community.
      </p>

      <div style={homeStyles.ctaGroup}>
        <Link to="/register" className="btn btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1.1rem" }}>
          Get Started Free →
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ padding: "0.9rem 2rem", fontSize: "1.1rem" }}>
          Log In
        </Link>
      </div>

      <div style={homeStyles.featureGrid}>
        <div className="glass-card glass-card-hover" style={homeStyles.featureCard}>
          <div style={homeStyles.featureIcon}>⚽</div>
          <h3>Create Sessions</h3>
          <p style={homeStyles.featureDesc}>Set up matches at your local venue, specify players needed, and manage schedules seamlessly.</p>
        </div>
        <div className="glass-card glass-card-hover" style={homeStyles.featureCard}>
          <div style={homeStyles.featureIcon}>🏀</div>
          <h3>Join Matches</h3>
          <p style={homeStyles.featureDesc}>Browse active games looking for players near you and join with one click.</p>
        </div>
        <div className="glass-card glass-card-hover" style={homeStyles.featureCard}>
          <div style={homeStyles.featureIcon}>📊</div>
          <h3>Track Stats</h3>
          <p style={homeStyles.featureDesc}>Admin analytics report session counts, popular sports, and community engagement over time.</p>
        </div>
      </div>
    </div>
  );
}

const homeStyles = {
  heroContainer: {
    maxWidth: "960px",
    margin: "3rem auto 0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  badge: {
    display: "inline-flex",
    padding: "0.4rem 1rem",
    borderRadius: "9999px",
    background: "rgba(99, 102, 241, 0.12)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    color: "#a5b4fc",
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "3.25rem",
    fontWeight: "800",
    lineHeight: 1.15,
    marginBottom: "1.25rem",
    color: "#f8fafc",
  },
  gradientText: {
    background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#94a3b8",
    maxWidth: "650px",
    marginBottom: "2.5rem",
  },
  ctaGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginBottom: "4rem",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
    width: "100%",
  },
  featureCard: {
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  featureIcon: {
    fontSize: "2.2rem",
    marginBottom: "0.25rem",
  },
  featureDesc: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
};

function App() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%", flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions/create"
            element={
              <ProtectedRoute>
                <CreateSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;