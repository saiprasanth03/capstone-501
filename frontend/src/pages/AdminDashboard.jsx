import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const [sports, setSports] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [report, setReport] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const loadSports = async () => {
    try {
      const { data } = await api.get("/sports");
      setSports(data.sports || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sports");
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchSports = async () => {
      try {
        const { data } = await api.get("/sports");
        if (!ignore) {
          setSports(data.sports || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Failed to load sports");
        }
      }
    };

    fetchSports();
    return () => {
      ignore = true;
    };
  }, []);

  const createSport = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/sports", {
        name,
        description,
      });

      setName("");
      setDescription("");
      await loadSports();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create sport");
    } finally {
      setLoading(false);
    }
  };

  const deleteSport = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this sport?")) return;

    setError("");
    try {
      await api.delete(`/sports/${id}`);
      await loadSports();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete sport");
    }
  };

  const loadReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both Start Date and End Date for the report.");
      return;
    }

    setError("");
    setReportLoading(true);

    try {
      const { data } = await api.get("/reports", {
        params: {
          startDate,
          endDate,
        },
      });

      setReport(data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header Banner */}
      <div className="glass-card" style={styles.headerBanner}>
        <div>
          <div style={styles.adminBadge}>👑 Admin Panel</div>
          <h1 style={{ marginTop: "0.5rem" }}>
            Welcome, <span style={styles.gradientText}>{user?.name || "Admin"}</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Manage supported sports categories and inspect activity reports.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Create Sport & Manage Sports */}
      <div style={styles.adminGrid}>
        {/* Create Sport Form */}
        <div className="glass-card" style={{ height: "fit-content" }}>
          <div style={styles.cardHeader}>
            <h3>⚽ Add New Sport</h3>
            <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>Create sports options</span>
          </div>

          <form onSubmit={createSport} style={{ marginTop: "1rem" }}>
            <div className="input-group">
              <label className="input-label">Sport Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Volleyball"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Description (Optional)</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Indoor & outdoor volleyball matches"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
              disabled={loading}
            >
              {loading ? "Adding..." : "+ Add Sport"}
            </button>
          </form>
        </div>

        {/* Sports List */}
        <div className="glass-card">
          <div style={styles.cardHeader}>
            <h3>📋 Active Sports ({sports.length})</h3>
            <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>Available for sessions</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
            {sports.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No active sports found.</p>
            ) : (
              sports.map((sportItem) => (
                <div key={sportItem._id} style={styles.sportRow}>
                  <div>
                    <strong style={{ color: "#f8fafc", fontSize: "1rem" }}>{sportItem.name}</strong>
                    {sportItem.description && (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
                        {sportItem.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteSport(sportItem._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Deactivate
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reports & Analytics Section */}
      <div className="glass-card">
        <div style={styles.cardHeader}>
          <h2>📊 Analytics & Activity Reports</h2>
          <span style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
            Filter by date range to view game completion metrics
          </span>
        </div>

        <div style={styles.filterRow}>
          <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: "200px" }}>
            <label className="input-label">Start Date</label>
            <input
              type="date"
              className="input-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: "200px" }}>
            <label className="input-label">End Date</label>
            <input
              type="date"
              className="input-field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            onClick={loadReport}
            className="btn btn-emerald"
            style={{ alignSelf: "flex-end", height: "42px" }}
            disabled={reportLoading}
          >
            {reportLoading ? "Generating..." : "📈 Generate Report"}
          </button>
        </div>

        {report && (
          <div style={styles.reportResults} className="animate-fade-in">
            <div style={styles.statMetricCard}>
              <div style={styles.metricValue}>{report.sessionsPlayed}</div>
              <div style={styles.metricLabel}>Total Completed Sessions</div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>Sport Popularity Breakdown</h3>
              
              {report.sportPopularity.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  No completed sessions found for this date range.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {report.sportPopularity.map((item) => (
                    <div key={item.sport} style={styles.popularityRow}>
                      <span style={{ fontWeight: "600", color: "#f8fafc" }}>{item.sport}</span>
                      <span className="badge badge-scheduled">{item.sessions} sessions</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  headerBanner: {
    padding: "2rem",
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.08))",
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  adminBadge: {
    display: "inline-flex",
    padding: "0.3rem 0.75rem",
    borderRadius: "9999px",
    background: "rgba(192, 132, 252, 0.15)",
    border: "1px solid rgba(192, 132, 252, 0.3)",
    color: "#c084fc",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  gradientText: {
    background: "linear-gradient(135deg, #c084fc, #38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  adminGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  sportRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.85rem 1rem",
    background: "rgba(15, 23, 42, 0.5)",
    border: "1px solid var(--border-light)",
    borderRadius: "var(--radius-md)",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "1.25rem",
  },
  reportResults: {
    marginTop: "2rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid var(--border-light)",
  },
  statMetricCard: {
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "1.5rem",
    borderRadius: "var(--radius-md)",
    textAlign: "center",
    maxWidth: "280px",
  },
  metricValue: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#34d399",
  },
  metricLabel: {
    color: "var(--text-muted)",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
  popularityRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
    background: "rgba(15, 23, 42, 0.4)",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-light)",
  },
};

export default AdminDashboard;