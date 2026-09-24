import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateSession() {
  const [sports, setSports] = useState([]);
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [additionalPlayersNeeded, setAdditionalPlayersNeeded] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadSports = async () => {
      try {
        const { data } = await api.get("/sports");
        setSports(data.sports);
      } catch (error) {
        setError("Failed to load sports");
      }
    };

    loadSports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/sessions", {
        sport,
        date,
        venue,
        additionalPlayersNeeded: Number(additionalPlayersNeeded),
      });

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create session"
      );
    }
  };

  return (
    <div>
      <h1>Create Sport Session</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          required
        >
          <option value="">Select Sport</option>

          {sports.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        <br />

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <br />

        <input
          type="text"
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
        />

        <br />

        <input
          type="number"
          min="0"
          placeholder="Additional players needed"
          value={additionalPlayersNeeded}
          onChange={(e) =>
            setAdditionalPlayersNeeded(e.target.value)
          }
          required
        />

        <br />

        <button type="submit">Create Session</button>
      </form>
    </div>
  );
}

export default CreateSession;