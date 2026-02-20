const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This middleware checks if the user has a valid token before letting them access a route
const protect = async (req, res, next) => {
  let token;

  // JWT token is usually sent in the Authorization header as "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // extract just the token part
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // verify() decodes the token and checks if it was signed with our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach the user info to the request so the next function can use it
    req.user = await User.findById(decoded.id).select("-password");
    next(); // move on to the actual route handler
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

// Middleware to check if user has the right role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
