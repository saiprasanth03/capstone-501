import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user, logout } = useAuth();

  const [sports, setSports] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [report, setReport] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [error, setError] = useState("");

  const loadSports = async () => {
    const { data } = await api.get("/sports");
    setSports(data.sports);
  };

  useEffect(() => {
    loadSports();
  }, []);

  const createSport = async (e) => {
    e.preventDefault();

    try {
      await api.post("/sports", {
        name,
        description,
      });

      setName("");
      setDescription("");
      loadSports();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create sport");
    }
  };

  const deleteSport = async (id) => {
    try {
      await api.delete(`/sports/${id}`);
      loadSports();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete sport");
    }
  };

  const loadReport = async () => {
    try {
      const { data } = await api.get("/reports", {
        params: {
          startDate,
          endDate,
        },
      });

      setReport(data.report);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load report");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Welcome, {user?.name}</p>

      <button onClick={logout}>Logout</button>

      {error && <p>{error}</p>}

      <hr />

      <h2>Create Sport</h2>

      <form onSubmit={createSport}>
        <input
          placeholder="Sport name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create Sport</button>
      </form>

      <h2>Manage Sports</h2>

      {sports.map((sport) => (
        <div key={sport._id}>
          <strong>{sport.name}</strong>
          <span> - {sport.description}</span>

          <button onClick={() => deleteSport(sport._id)}>
            Delete
          </button>
        </div>
      ))}

      <hr />

      <h2>Reports</h2>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button onClick={loadReport}>Generate Report</button>

      {report && (
        <div>
          <h3>Sessions Played</h3>
          <p>{report.sessionsPlayed}</p>

          <h3>Sport Popularity</h3>

          {report.sportPopularity.map((item) => (
            <p key={item.sport}>
              {item.sport}: {item.sessions} sessions
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;