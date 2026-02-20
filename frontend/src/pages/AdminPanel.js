import { useState, useEffect } from "react";
import api from "../utils/api";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setMessage("Role updated successfully!");
      fetchUsers(); // refresh list
      setTimeout(() => setMessage(""), 3000); // clear message after 3 seconds
    } catch (err) {
      setMessage("Failed to update role");
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>
      <p style={styles.subtitle}>Manage users and their roles</p>

      {message && <div style={styles.success}>{message}</div>}

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>All Users ({users.length})</h2>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Current Role</th>
              <th style={styles.th}>Change Role</th>
              <th style={styles.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={styles.tableRow}>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.roleBadge, ...roleStyle(u.role) }}>{u.role}</span>
                </td>
                <td style={styles.td}>
                  {/* Dropdown to change role */}
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="user">user</option>
                    <option value="agent">agent</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Returns color styles based on role
const roleStyle = (role) => {
  if (role === "admin") return { backgroundColor: "#fbb6ce", color: "#702459" };
  if (role === "agent") return { backgroundColor: "#bee3f8", color: "#2a69ac" };
  return { backgroundColor: "#e2e8f0", color: "#4a5568" };
};

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "30px 20px" },
  title: { margin: "0 0 6px", fontSize: "28px", color: "#1a202c" },
  subtitle: { margin: "0 0 24px", color: "#718096" },
  success: { backgroundColor: "#f0fff4", border: "1px solid #9ae6b4", color: "#276749", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px" },
  card: { backgroundColor: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  sectionTitle: { margin: "0 0 20px", fontSize: "18px", color: "#2d3748" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { backgroundColor: "#f7fafc" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#4a5568", borderBottom: "1px solid #e2e8f0" },
  tableRow: { borderBottom: "1px solid #f0f4f8" },
  td: { padding: "14px 16px", fontSize: "14px", color: "#4a5568" },
  roleBadge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
  select: { padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  center: { textAlign: "center", padding: "60px", color: "#718096" },
};

export default AdminPanel;
