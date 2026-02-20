const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllUsers, updateUserRole, getAgents } = require("../controllers/userController");

// Only admins can see and manage all users
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.put("/:id/role", protect, authorizeRoles("admin"), updateUserRole);

// Admins and agents can see who the agents are (for assignment)
router.get("/agents", protect, authorizeRoles("admin", "agent"), getAgents);

module.exports = router;
