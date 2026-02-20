import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const statusColor = { open: "#ed8936", "in-progress": "#4299e1", resolved: "#48bb78", closed: "#a0aec0" };
const priorityColor = { low: "#68d391", medium: "#f6ad55", high: "#fc8181", critical: "#e53e3e" };

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [agents, setAgents] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [message, setMessage] = useState("");

  const isAgent = user.role === "agent";
  const isAdmin = user.role === "admin";

  useEffect(() => {
    fetchTicket();
    if (isAdmin) fetchAgents(); // only admin needs the agents list
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
      setStatusUpdate(res.data.status);
      setAssignedTo(res.data.assignedTo?._id || "");
    } catch (err) {
      console.error("Failed to fetch ticket", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get("/users/agents");
      setAgents(res.data);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  };

  // Agent calls this — only sends status
  const handleAgentUpdate = async () => {
    try {
      await api.put(`/tickets/${id}`, { status: statusUpdate });
      setMessage("Status updated!");
      fetchTicket();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update");
    }
  };

  // Admin calls this — only sends assignedTo
  const handleAdminAssign = async () => {
    try {
      await api.put(`/tickets/${id}`, { assignedTo });
      setMessage("Ticket assigned!");
      fetchTicket();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to assign");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post(`/tickets/${id}/comment`, { text: comment });
      setComment("");
      fetchTicket();
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!ticket) return <div style={styles.center}>Ticket not found</div>;

  // Check if this ticket is assigned to the currently logged in agent
  const isMyTicket = ticket.assignedTo?._id === user.id || ticket.assignedTo?._id?.toString() === user.id;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

      <div style={styles.grid}>
        {/* Left: ticket info + comments */}
        <div style={styles.main}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.title}>{ticket.title}</h2>
              <span style={{ ...styles.badge, backgroundColor: statusColor[ticket.status] }}>
                {ticket.status}
              </span>
            </div>
            <p style={styles.description}>{ticket.description}</p>
            <div style={styles.metaRow}>
              <span>📁 {ticket.category}</span>
              <span style={{ color: priorityColor[ticket.priority] }}>⚡ {ticket.priority}</span>
              <span>👤 Raised by: {ticket.createdBy?.name}</span>
              <span>🕒 {new Date(ticket.createdAt).toLocaleString()}</span>
              <span>🧑‍💼 Assigned to: {ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}</span>
            </div>
          </div>

          {/* Comments */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Comments ({ticket.comments.length})</h3>
            {ticket.comments.length === 0 ? (
              <p style={styles.noComments}>No comments yet.</p>
            ) : (
              <div style={styles.commentsList}>
                {ticket.comments.map((c, i) => (
                  <div key={i} style={styles.comment}>
                    <div style={styles.commentHeader}>
                      <strong>{c.addedBy?.name || "Unknown"}</strong>
                      <span style={styles.commentRole}>{c.addedBy?.role}</span>
                      <span style={styles.commentDate}>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={styles.commentText}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddComment} style={styles.commentForm}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                style={styles.commentInput}
                required
              />
              <button type="submit" style={styles.commentBtn}>Add Comment</button>
            </form>
          </div>
        </div>

        {/* Right sidebar — different for agent vs admin */}
        <div style={styles.sidebar}>
          {message && <div style={styles.successMsg}>{message}</div>}

          {/* AGENT SIDEBAR — can only change status of their assigned tickets */}
          {isAgent && (
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Update Status</h3>
              {isMyTicket ? (
                <>
                  <p style={styles.hint}>This ticket is assigned to you.</p>
                  <div style={styles.field}>
                    <label style={styles.label}>Status</label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      style={styles.input}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <button onClick={handleAgentUpdate} style={styles.actionBtn}>
                    Save Status
                  </button>
                </>
              ) : (
                <p style={styles.warning}>
                  ⚠️ This ticket is not assigned to you. You can only update tickets assigned to you.
                </p>
              )}
            </div>
          )}

          {/* ADMIN SIDEBAR — can only assign tickets to agents */}
          {isAdmin && (
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Assign Ticket</h3>
              <p style={styles.hint}>Assign this ticket to an agent. The agent will then resolve it.</p>
              <div style={styles.field}>
                <label style={styles.label}>Select Agent</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  style={styles.input}
                >
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAdminAssign} style={styles.actionBtn}>
                Assign Agent
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" },
  backBtn: { marginBottom: "20px", padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "white", cursor: "pointer", fontSize: "14px" },
  grid: { display: "flex", gap: "20px", alignItems: "flex-start" },
  main: { flex: 1, display: "flex", flexDirection: "column", gap: "16px" },
  sidebar: { width: "280px", display: "flex", flexDirection: "column", gap: "12px" },
  card: { backgroundColor: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  title: { margin: 0, fontSize: "20px", color: "#1a202c", flex: 1, marginRight: "12px" },
  badge: { padding: "4px 12px", borderRadius: "12px", color: "white", fontSize: "12px", textTransform: "capitalize", whiteSpace: "nowrap" },
  description: { color: "#4a5568", lineHeight: "1.6", marginBottom: "16px" },
  metaRow: { display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "13px", color: "#718096" },
  sectionTitle: { margin: "0 0 12px", fontSize: "16px", color: "#2d3748" },
  hint: { fontSize: "13px", color: "#718096", marginBottom: "14px" },
  warning: { fontSize: "13px", color: "#c05621", backgroundColor: "#fffaf0", padding: "10px", borderRadius: "6px" },
  field: { marginBottom: "14px" },
  label: { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "#4a5568" },
  input: { width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" },
  actionBtn: { width: "100%", padding: "10px", backgroundColor: "#4c51bf", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  successMsg: { backgroundColor: "#f0fff4", border: "1px solid #9ae6b4", color: "#276749", padding: "10px", borderRadius: "6px", fontSize: "13px" },
  noComments: { color: "#a0aec0", fontSize: "14px", marginBottom: "16px" },
  commentsList: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" },
  comment: { padding: "12px", backgroundColor: "#f7fafc", borderRadius: "8px" },
  commentHeader: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" },
  commentRole: { fontSize: "11px", backgroundColor: "#e2e8f0", padding: "2px 8px", borderRadius: "10px", color: "#4a5568" },
  commentDate: { fontSize: "12px", color: "#a0aec0", marginLeft: "auto" },
  commentText: { margin: 0, fontSize: "14px", color: "#4a5568" },
  commentForm: { display: "flex", flexDirection: "column", gap: "10px" },
  commentInput: { padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", height: "80px", resize: "vertical", fontFamily: "inherit" },
  commentBtn: { alignSelf: "flex-end", padding: "8px 20px", backgroundColor: "#4c51bf", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  center: { textAlign: "center", padding: "60px", color: "#718096" },
};

export default TicketDetail;