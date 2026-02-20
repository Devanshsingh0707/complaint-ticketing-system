const mongoose = require("mongoose");

// This defines the shape of a user document in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can have same email
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // role decides what the user can do in the app
    role: {
      type: String,
      enum: ["user", "agent", "admin"], // only these 3 values allowed
      default: "user",
    },
  },
  { timestamps: true } // auto adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", userSchema);
