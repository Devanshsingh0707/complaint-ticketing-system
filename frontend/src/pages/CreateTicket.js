import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const CreateTicket = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/tickets", form);
      navigate("/dashboard"); // go back to dashboard after creation
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Raise a Complaint</h2>
        <p style={styles.subtitle}>Fill in the details below and we'll look into it</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Brief summary of your issue"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              style={{ ...styles.input, height: "120px", resize: "vertical" }}
              placeholder="Describe your issue in detail..."
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} style={styles.input}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "0 20px" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  title: { margin: "0 0 6px", fontSize: "24px", color: "#1a202c" },
  subtitle: { margin: "0 0 28px", color: "#718096", fontSize: "14px" },
  error: { backgroundColor: "#fff5f5", border: "1px solid #fc8181", color: "#c53030", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
  field: { marginBottom: "18px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#4a5568" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  row: { display: "flex", gap: "16px" },
  actions: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" },
  cancelBtn: { padding: "10px 24px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "white", cursor: "pointer", fontSize: "14px" },
  submitBtn: { padding: "10px 24px", borderRadius: "8px", backgroundColor: "#4c51bf", color: "white", border: "none", cursor: "pointer", fontSize: "14px" },
};

export default CreateTicket;
