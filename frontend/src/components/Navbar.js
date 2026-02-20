import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠", roles: ["user", "agent", "admin"] },
    { label: "New Ticket", path: "/create-ticket", icon: "➕", roles: ["user", "agent", "admin"] },
    { label: "Admin Panel", path: "/admin", icon: "⚙️", roles: ["admin"] }, // admin only
  ];

  return (
    <div style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <span style={styles.brandIcon}>🎫</span>
        <span style={styles.brandText}>TicketDesk</span>
      </div>

      {/* Nav Links */}
      <nav style={styles.nav}>
        {navItems
          .filter((item) => item.roles.includes(user.role)) // only show links for this role
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(isActive(item.path) ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
      </nav>

      {/* Bottom — user info + logout */}
      <div style={styles.bottom}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>{user.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
           Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "240px",
    minHeight: "100vh",
    backgroundColor: "#1a1a2e",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "24px 20px",
    borderBottom: "1px solid #2d3748",
  },
  brandIcon: { fontSize: "22px" },
  brandText: { fontSize: "18px", fontWeight: "bold", color: "white" },
  nav: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 12px",
    gap: "4px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "8px",
    color: "#a0aec0",
    textDecoration: "none",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  navItemActive: {
    backgroundColor: "#4c51bf",
    color: "white",
    fontWeight: "600",
  },
  navIcon: { fontSize: "16px" },
  bottom: {
    padding: "16px 12px",
    borderTop: "1px solid #2d3748",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#4c51bf",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    flexShrink: 0,
  },
  userName: { fontSize: "13px", color: "white", fontWeight: "500" },
  userRole: { fontSize: "11px", color: "#718096", textTransform: "capitalize" },
  logoutBtn: {
    width: "100%",
    padding: "8px",
    backgroundColor: "#e53e3e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default Sidebar;