const Ticket = require("../models/Ticket");

// POST /api/tickets — Create a new ticket (users only)
const createTicket = async (req, res) => {
  const { title, description, category, priority } = req.body;

  try {
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Ticket created", ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/tickets — Get tickets (filtered by role)
const getTickets = async (req, res) => {
  try {
    let tickets;

    if (req.user.role === "user") {
      // Users only see their own tickets
      tickets = await Ticket.find({ createdBy: req.user._id })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    } else {
      // Admins and agents see all tickets
      tickets = await Ticket.find()
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/tickets/:id — Get single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("comments.addedBy", "name role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Users can only view their own tickets
    if (
      req.user.role === "user" &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/tickets/:id — Update ticket
// Agent → can only change STATUS, and only on tickets assigned to them
// Admin → can only ASSIGN ticket to an agent, cannot change status
const updateTicket = async (req, res) => {
  const { status, assignedTo } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Users cannot update tickets at all
    if (req.user.role === "user") {
      return res.status(403).json({ message: "Not allowed to update tickets" });
    }

    if (req.user.role === "agent") {
      // Agent can ONLY change status
      // And ONLY if the ticket is assigned to them
      const isAssignedToMe =
        ticket.assignedTo?.toString() === req.user._id.toString();

      if (!isAssignedToMe) {
        return res.status(403).json({
          message: "You can only update tickets that are assigned to you",
        });
      }

      if (assignedTo) {
        return res.status(403).json({
          message: "Agents cannot assign tickets, only admins can",
        });
      }

      if (status) ticket.status = status;
    }

    if (req.user.role === "admin") {
      // Admin can ONLY assign tickets to agents
      // Admin cannot change the status — that's the agent's job
      if (status) {
        return res.status(403).json({
          message: "Admins cannot change ticket status, assign it to an agent first",
        });
      }

      if (assignedTo) ticket.assignedTo = assignedTo;
    }

    await ticket.save();
    res.json({ message: "Ticket updated", ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/tickets/:id/comment — Add a comment to a ticket
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isStaff = ["admin", "agent"].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: "Not allowed to comment on this ticket" });
    }

    ticket.comments.push({ text, addedBy: req.user._id });
    await ticket.save();

    res.json({ message: "Comment added", ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/tickets/:id — Delete ticket (admin only)
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
  deleteTicket,
};