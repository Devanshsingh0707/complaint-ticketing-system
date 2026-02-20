# 🎫 TicketDesk — Complaint Ticketing System

A full-stack complaint ticketing system built with React, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
complaint-system/
├── backend/
│   ├── models/          → MongoDB schemas (User, Ticket)
│   ├── routes/          → API endpoints
│   ├── controllers/     → Business logic for each route
│   ├── middleware/      → JWT auth + role checks
│   ├── server.js        → Entry point
│   └── .env.example     → Environment variables template
│
└── frontend/
    └── src/
        ├── pages/       → Login, Register, Dashboard, TicketDetail, etc.
        ├── components/  → Navbar
        ├── context/     → AuthContext (global user state)
        └── utils/       → Axios instance with auto-token injection
```

---


## 🔑 Features

| Feature | Who can do it |
|---|---|
| Register / Login | Everyone |
| Create a ticket | Logged-in users |
| View own tickets | Users |
| View all tickets | Admin, Agent |
| Update ticket status | Admin, Agent |
| Assign ticket to agent | Admin, Agent |
| Add comments | Ticket owner + Staff |
| Delete ticket | Admin only |
| Manage user roles | Admin only |

---

## 🧠 Concepts Demonstrated

- REST API design with Express
- JWT Authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- MongoDB with Mongoose
- React Context API for global state
- Protected routes in React Router
- Axios interceptors for automatic token injection
- Clean separation: routes → controllers → models
