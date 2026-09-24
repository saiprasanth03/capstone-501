import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [mySessions, setMySessions] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadSessions = async () => {
    try {
      const [my, available, joined] = await Promise.all([
        api.get("/sessions/my"),
        api.get("/sessions/available"),
        api.get("/sessions/joined"),
      ]);

      setMySessions(my.data.sessions || []);
      setAvailableSessions(available.data.sessions || []);
      setJoinedSessions(joined.data.sessions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sessions");
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchSessions = async () => {
      try {
        const [my, available, joined] = await Promise.all([
          api.get("/sessions/my"),
          api.get("/sessions/available"),
          api.get("/sessions/joined"),
        ]);

        if (!ignore) {
          setMySessions(my.data.sessions || []);
          setAvailableSessions(available.data.sessions || []);
          setJoinedSessions(joined.data.sessions || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Failed to load sessions");
        }
      }
    };

    fetchSessions();
    return () => {
      ignore = true;
    };
  }, []);

  const joinSession = async (id) => {
    setActionLoading(id);
    setError("");
    try {
      await api.post(`/sessions/${id}/join`);
      await loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to join session");
    } finally {
      setActionLoading(null);
    }
  };

  const cancelSession = async (id) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason?.trim()) return;

    setActionLoading(id);
    setError("");
    try {
      await api.patch(`/sessions/${id}/cancel`, { reason });
      await loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel session");
    } finally {
      setActionLoading(null);
    }
  };

  const filterSessions = (sessions) => {
    if (!searchQuery.trim()) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.sport?.name?.toLowerCase().includes(query) ||
        s.venue?.toLowerCase().includes(query)
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "badge-scheduled";
      case "completed":
        return "badge-completed";
      case "cancelled":
        return "badge-cancelled";
      default:
        return "badge-scheduled";
    }
  };

  const SessionCard = ({ session, isCreator = false, isJoined = false }) => {
    const formattedDate = new Date(session.date).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const totalSpots = (session.players?.length || 0) + (session.additionalPlayersNeeded || 0);

    return (
      <div className="glass-card glass-card-hover" style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.sportTag}>
            <span style={{ fontSize: "1.2rem" }}>🏅</span>
            <span style={styles.sportName}>{session.sport?.name || "Sport"}</span>
          </div>
          <span className={`badge ${getStatusBadgeClass(session.status)}`}>
            {session.status}
          </span>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.infoRow}>
            <span style={styles.icon}>📅</span>
            <span>{formattedDate}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.icon}>📍</span>
            <span>{session.venue}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.icon}>👥</span>
            <span>
              <strong>{session.players?.length || 0}</strong> / {totalSpots} Players
              {session.additionalPlayersNeeded > 0 && session.status === "scheduled" && (
                <span style={{ color: "var(--accent-cyan)", marginLeft: "0.5rem", fontSize: "0.85rem" }}>
                  ({session.additionalPlayersNeeded} needed)
                </span>
              )}
            </span>
          </div>

          {!isCreator && session.creator && (
            <div style={styles.infoRow}>
              <span style={styles.icon}>👤</span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                Organized by {session.creator.name}
              </span>
            </div>
          )}

          {session.status === "cancelled" && session.cancellationReason && (
            <div style={styles.cancelBanner}>
              <strong>Cancellation Reason:</strong> {session.cancellationReason}
            </div>
          )}
        </div>

        <div style={styles.cardFooter}>
          {isCreator && session.status === "scheduled" && (
            <button
              onClick={() => cancelSession(session._id)}
              className="btn btn-danger btn-sm"
              style={{ width: "100%" }}
              disabled={actionLoading === session._id}
            >
              {actionLoading === session._id ? "Cancelling..." : "Cancel Session"}
            </button>
          )}

          {!isCreator && !isJoined && session.status === "scheduled" && (
            <button
              onClick={() => joinSession(session._id)}
              className="btn btn-emerald btn-sm"
              style={{ width: "100%" }}
              disabled={actionLoading === session._id}
            >
              {actionLoading === session._id ? "Joining..." : "Join Session →"}
            </button>
          )}

          {isJoined && !isCreator && (
            <div style={styles.joinedBadge}>
              ✓ You are attending this session
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header Banner */}
      <div style={styles.headerBanner} className="glass-card">
        <div style={styles.headerText}>
          <h1>Welcome back, <span style={styles.gradientText}>{user?.name}</span> 👋</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Explore available sports sessions, join upcoming matches, or host your own game.
          </p>
        </div>
        <Link to="/sessions/create" className="btn btn-primary" style={{ padding: "0.8rem 1.5rem" }}>
          + Create Session
        </Link>
      </div>

      {/* Stats Counter Row */}
      <div style={styles.statsGrid}>
        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statValue}>{mySessions.length}</div>
          <div style={styles.statLabel}>Sessions Created</div>
        </div>
        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statValue, color: "var(--accent-cyan)" }}>
            {availableSessions.length}
          </div>
          <div style={styles.statLabel}>Available Games</div>
        </div>
        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statValue, color: "var(--accent-emerald)" }}>
            {joinedSessions.length}
          </div>
          <div style={styles.statLabel}>Joined Matches</div>
        </div>
      </div>

      {/* Control Bar: Search & Tabs */}
      <div style={styles.controlBar}>
        <div style={styles.tabGroup}>
          <button
            onClick={() => setActiveTab("all")}
            style={activeTab === "all" ? styles.tabActive : styles.tab}
          >
            All Sessions
          </button>
          <button
            onClick={() => setActiveTab("available")}
            style={activeTab === "available" ? styles.tabActive : styles.tab}
          >
            Available ({availableSessions.length})
          </button>
          <button
            onClick={() => setActiveTab("my")}
            style={activeTab === "my" ? styles.tabActive : styles.tab}
          >
            My Created ({mySessions.length})
          </button>
          <button
            onClick={() => setActiveTab("joined")}
            style={activeTab === "joined" ? styles.tabActive : styles.tab}
          >
            Joined ({joinedSessions.length})
          </button>
        </div>

        <input
          type="text"
          className="input-field"
          placeholder="🔍 Search by sport or venue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: "280px" }}
        />
      </div>

      {error && (
        <div className="alert-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Sessions Sections */}
      {(activeTab === "all" || activeTab === "available") && (
        <section>
          <div style={styles.sectionHeader}>
            <h2>Available Sessions to Join</h2>
            <span style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
              Games needing additional players
            </span>
          </div>

          {filterSessions(availableSessions).length === 0 ? (
            <div className="glass-card" style={styles.emptyState}>
              <p>No available sessions match your filter right now.</p>
            </div>
          ) : (
            <div className="grid-cards">
              {filterSessions(availableSessions).map((session) => (
                <SessionCard key={session._id} session={session} />
              ))}
            </div>
          )}
        </section>
      )}

      {(activeTab === "all" || activeTab === "my") && (
        <section style={{ marginTop: activeTab === "all" ? "2rem" : "0" }}>
          <div style={styles.sectionHeader}>
            <h2>My Created Sessions</h2>
            <span style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
              Sessions you are hosting
            </span>
          </div>

          {filterSessions(mySessions).length === 0 ? (
            <div className="glass-card" style={styles.emptyState}>
              <p>You haven't created any sessions yet.</p>
              <Link to="/sessions/create" className="btn btn-secondary btn-sm" style={{ marginTop: "0.5rem" }}>
                Create your first session
              </Link>
            </div>
          ) : (
            <div className="grid-cards">
              {filterSessions(mySessions).map((session) => (
                <SessionCard key={session._id} session={session} isCreator />
              ))}
            </div>
          )}
        </section>
      )}

      {(activeTab === "all" || activeTab === "joined") && (
        <section style={{ marginTop: activeTab === "all" ? "2rem" : "0" }}>
          <div style={styles.sectionHeader}>
            <h2>My Joined Sessions</h2>
            <span style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
              Matches organized by others that you joined
            </span>
          </div>

          {filterSessions(joinedSessions).length === 0 ? (
            <div className="glass-card" style={styles.emptyState}>
              <p>You haven't joined any external sessions yet.</p>
            </div>
          ) : (
            <div className="grid-cards">
              {filterSessions(joinedSessions).map((session) => (
                <SessionCard key={session._id} session={session} isJoined />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

const styles = {
  headerBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
    padding: "2rem",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))",
    borderColor: "rgba(99, 102, 241, 0.25)",
  },
  headerText: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  gradientText: {
    background: "linear-gradient(135deg, #38bdf8, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.25rem",
  },
  statCard: {
    textAlign: "center",
    padding: "1.25rem",
  },
  statValue: {
    fontSize: "2.25rem",
    fontWeight: "800",
    color: "#f8fafc",
    lineHeight: 1.1,
  },
  statLabel: {
    color: "var(--text-muted)",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
  controlBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
  },
  tabGroup: {
    display: "flex",
    gap: "0.5rem",
    background: "rgba(15, 23, 42, 0.7)",
    padding: "0.35rem",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-light)",
  },
  tab: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    color: "#ffffff",
    fontSize: "0.9rem",
    fontWeight: "600",
    padding: "0.5rem 1rem",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(99, 102, 241, 0.3)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: "1rem",
    marginBottom: "1rem",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "1rem",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sportTag: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  sportName: {
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#f8fafc",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    fontSize: "0.925rem",
    color: "var(--text-muted)",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  icon: {
    fontSize: "1rem",
  },
  cancelBanner: {
    background: "rgba(244, 63, 94, 0.1)",
    border: "1px solid rgba(244, 63, 94, 0.25)",
    color: "#fca5a5",
    padding: "0.6rem 0.8rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    marginTop: "0.25rem",
  },
  cardFooter: {
    marginTop: "0.5rem",
    paddingTop: "0.75rem",
    borderTop: "1px solid var(--border-light)",
  },
  joinedBadge: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#34d399",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "0.5rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    textAlign: "center",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "2.5rem",
    color: "var(--text-muted)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default Dashboard;