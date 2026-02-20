# 🎫 TicketDesk — Complaint Ticketing System

A full-stack complaint/support ticketing system built with React, Node.js, Express, and MongoDB.

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

## 🚀 How to Run

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env    # then edit .env with your MongoDB URI
npm run dev             # runs on http://localhost:5000
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm start               # runs on http://localhost:3000
```

### 3. MongoDB
Make sure MongoDB is running locally:
```bash
mongod
```
Or use MongoDB Atlas (free cloud DB) and update the MONGO_URI in .env.

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

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login, returns JWT token

### Tickets
- `GET /api/tickets` — Get tickets (filtered by role)
- `POST /api/tickets` — Create ticket
- `GET /api/tickets/:id` — Get single ticket
- `PUT /api/tickets/:id` — Update status/assign agent
- `POST /api/tickets/:id/comment` — Add comment
- `DELETE /api/tickets/:id` — Delete (admin only)

### Users
- `GET /api/users` — All users (admin only)
- `PUT /api/users/:id/role` — Change user role (admin only)
- `GET /api/users/agents` — Get all agents

---

## 🎤 Interview Q&A

**Q: Why did you use JWT for authentication?**
> JWT is stateless — the server doesn't need to store sessions in a database. The token itself contains the user info (encoded), so every request is self-contained. It's great for REST APIs.

**Q: What is middleware?**
> Middleware is a function that runs between the request and the route handler. In this project, `protect` middleware checks if the JWT token is valid before letting the user access protected routes.

**Q: How does role-based access control work here?**
> Each user has a `role` field in the database (user, agent, admin). The `authorizeRoles` middleware checks `req.user.role` and either allows or blocks access. For example, only admins can delete tickets.

**Q: Why did you use Context API for state management?**
> React Context lets us share state (like the logged-in user) across all components without passing props manually through every level. It's simpler than Redux for a project of this size.

**Q: What is populate() in Mongoose?**
> MongoDB stores references as IDs (like foreign keys). `populate()` replaces those IDs with the actual document data. For example, `ticket.createdBy` is stored as an ID, but after `populate()` it becomes `{ name: "John", email: "john@..." }`.

**Q: How do you prevent users from seeing other people's tickets?**
> In the `getTickets` controller, we check `req.user.role`. If the role is "user", we filter tickets with `{ createdBy: req.user._id }` so they only see their own tickets.

**Q: What is bcrypt?**
> bcrypt is a password hashing library. We never store plain passwords. When a user registers, we hash their password. When they log in, we compare the entered password with the stored hash using `bcrypt.compare()`.

**Q: What's the difference between .env and .env.example?**
> `.env` contains actual secret values (never commit to Git). `.env.example` is a template that shows what variables are needed, with no real values — safe to commit.

---

## 🧠 Concepts Demonstrated

- REST API design with Express
- JWT Authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- MongoDB with Mongoose (schemas, populate, relationships)
- React Context API for global state
- Protected routes in React Router
- Axios interceptors for automatic token injection
- Clean separation: routes → controllers → models
