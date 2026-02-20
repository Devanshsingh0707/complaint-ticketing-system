import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join the complaint system</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required style={styles.input} placeholder="John Doe" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required style={styles.input} placeholder="you@example.com" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required style={styles.input} placeholder="••••••••" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Register as</label>
            <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.linkText}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4f8" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "12px", width: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  title: { margin: "0 0 6px", fontSize: "24px", color: "#1a202c" },
  subtitle: { margin: "0 0 24px", color: "#718096", fontSize: "14px" },
  error: { backgroundColor: "#fff5f5", border: "1px solid #fc8181", color: "#c53030", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
  field: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#4a5568" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", backgroundColor: "#4c51bf", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", marginTop: "8px" },
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#718096" },
  linkText: { color: "#4c51bf", textDecoration: "none", fontWeight: "500" },
};

export default Register;
