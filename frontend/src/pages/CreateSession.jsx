import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function CreateSession() {
  const [sports, setSports] = useState([]);
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [additionalPlayersNeeded, setAdditionalPlayersNeeded] = useState(2);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const loadSports = async () => {
      try {
        const { data } = await api.get("/sports");
        if (!ignore) {
          setSports(data.sports || []);
          if (data.sports && data.sports.length > 0) {
            setSport(data.sports[0]._id);
          }
        }
      } catch {
        if (!ignore) {
          setError("Failed to load active sports list");
        }
      }
    };

    loadSports();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/sessions", {
        sport,
        date,
        venue,
        additionalPlayersNeeded: Number(additionalPlayersNeeded),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <Link to="/dashboard" style={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: "1.75rem", marginTop: "0.5rem" }}>Organize a Game</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Schedule a new match and invite local players to join
          </p>
        </div>

        {error && (
          <div className="alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Select Sport</label>
            <select
              className="input-field"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              required
            >
              <option value="" disabled>-- Choose a Sport --</option>
              {sports.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Date & Time</label>
            <input
              type="datetime-local"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Venue / Location</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Central Turf Stadium, Pitch #2"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Additional Players Needed</label>
            <input
              type="number"
              className="input-field"
              min="0"
              placeholder="Number of extra players"
              value={additionalPlayersNeeded}
              onChange={(e) => setAdditionalPlayersNeeded(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem", padding: "0.85rem" }}
            disabled={loading}
          >
            {loading ? "Publishing Session..." : "⚡ Publish Session"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem 0",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
  },
  header: {
    marginBottom: "1.5rem",
  },
  backLink: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "var(--accent-cyan)",
  },
};

export default CreateSession;