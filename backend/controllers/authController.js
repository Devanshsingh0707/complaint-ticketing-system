const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to create a JWT token for a user
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token expires in 7 days
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists with same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before saving - never store plain text passwords!
    const salt = await bcrypt.genSalt(10); // 10 rounds of hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default to "user" if no role provided
    });

    // Send back token and basic user info
    res.status(201).json({
      message: "Registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error); // change this line
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare entered password with the hashed one in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Logged in successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, login };
