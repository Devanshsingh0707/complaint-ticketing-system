const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
  deleteTicket,
} = require("../controllers/ticketController");

// All routes below require the user to be logged in (protect middleware)
router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicketById);
router.put("/:id", protect, updateTicket);
router.post("/:id/comment", protect, addComment);

// Only admins can delete tickets
router.delete("/:id", protect, authorizeRoles("admin"), deleteTicket);

module.exports = router;
