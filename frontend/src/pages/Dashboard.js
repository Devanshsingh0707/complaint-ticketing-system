import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

// Helper to pick a color based on status
const statusColor = {
  open: "#ed8936",
  "in-progress": "#4299e1",
  resolved: "#48bb78",
  closed: "#a0aec0",
};

const priorityColor = {
  low: "#68d391",
  medium: "#f6ad55",
  high: "#fc8181",
  critical: "#e53e3e",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // filter by status

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on selected status
  const filteredTickets = filter === "all"
    ? tickets
    : tickets.filter((t) => t.status === filter);

  if (loading) return <div style={styles.center}>Loading tickets...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            {user.role === "user" ? "My Tickets" : "All Tickets"}
          </h1>
          <p style={styles.subtitle}>{tickets.length} total tickets</p>
        </div>
        <Link to="/create-ticket" style={styles.newBtn}>+ New Ticket</Link>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {["open", "in-progress", "resolved", "closed"].map((s) => (
          <div key={s} style={styles.statCard}>
            <span style={{ ...styles.statDot, backgroundColor: statusColor[s] }}></span>
            <span style={styles.statLabel}>{s}</span>
            <span style={styles.statCount}>{tickets.filter((t) => t.status === s).length}</span>
          </div>
        ))}
      </div>

      {/* Filter buttons */}
      <div style={styles.filters}>
        {["all", "open", "in-progress", "resolved", "closed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              ...(filter === f ? styles.filterBtnActive : {}),
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      {filteredTickets.length === 0 ? (
        <div style={styles.empty}>
          <p>No tickets found. <Link to="/create-ticket">Create your first ticket</Link></p>
        </div>
      ) : (
        <div style={styles.ticketList}>
          {filteredTickets.map((ticket) => (
            <Link to={`/ticket/${ticket._id}`} key={ticket._id} style={styles.ticketCard}>
              <div style={styles.cardTop}>
                <h3 style={styles.ticketTitle}>{ticket.title}</h3>
                <span style={{ ...styles.badge, backgroundColor: statusColor[ticket.status] }}>
                  {ticket.status}
                </span>
              </div>

              <p style={styles.ticketDesc}>{ticket.description.slice(0, 100)}...</p>

              <div style={styles.cardBottom}>
                <span style={styles.meta}>📁 {ticket.category}</span>
                <span style={{ ...styles.priority, color: priorityColor[ticket.priority] }}>
                  ⚡ {ticket.priority}
                </span>
                <span style={styles.meta}>👤 {ticket.createdBy?.name}</span>
                <span style={styles.meta}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "30px 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { margin: 0, fontSize: "28px", color: "#1a202c" },
  subtitle: { margin: "4px 0 0", color: "#718096", fontSize: "14px" },
  newBtn: { padding: "10px 20px", backgroundColor: "#4c51bf", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px" },
  statsRow: { display: "flex", gap: "12px", marginBottom: "20px" },
  statCard: { flex: 1, backgroundColor: "white", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "8px" },
  statDot: { width: "10px", height: "10px", borderRadius: "50%" },
  statLabel: { flex: 1, fontSize: "13px", color: "#718096", textTransform: "capitalize" },
  statCount: { fontSize: "20px", fontWeight: "bold", color: "#1a202c" },
  filters: { display: "flex", gap: "8px", marginBottom: "20px" },
  filterBtn: { padding: "6px 16px", borderRadius: "20px", border: "1px solid #e2e8f0", cursor: "pointer", backgroundColor: "white", textTransform: "capitalize", fontSize: "13px" },
  filterBtnActive: { backgroundColor: "#4c51bf", color: "white", border: "1px solid #4c51bf" },
  ticketList: { display: "flex", flexDirection: "column", gap: "12px" },
  ticketCard: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", textDecoration: "none", color: "inherit", display: "block", transition: "box-shadow 0.2s" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  ticketTitle: { margin: 0, fontSize: "16px", color: "#2d3748" },
  badge: { padding: "3px 10px", borderRadius: "12px", color: "white", fontSize: "12px", textTransform: "capitalize" },
  ticketDesc: { color: "#718096", fontSize: "14px", margin: "0 0 12px" },
  cardBottom: { display: "flex", gap: "16px", fontSize: "12px" },
  meta: { color: "#a0aec0" },
  priority: { fontWeight: "600", textTransform: "capitalize" },
  center: { textAlign: "center", padding: "60px", color: "#718096" },
  empty: { textAlign: "center", padding: "60px", color: "#718096" },
};

export default Dashboard;
