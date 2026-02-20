const User = require("../models/User");

// GET /api/users — Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // .select("-password") means return everything EXCEPT the password field
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/users/:id/role — Change a user's role (admin only)
const updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true } // return the updated document, not the old one
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/users/agents — Get all agents (to assign to tickets)
const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password");
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllUsers, updateUserRole, getAgents };
