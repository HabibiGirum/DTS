const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken } = require("../utils/authUtils");

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logoutUser = (req, res) => {
  // Clear user session or JWT token
  res.json({ message: "Logout successful" });
};

// Register user
const registerUser = async (req, res, next) => {
  try {
    const { name, college, department, role, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      college,
      department,
      role,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  loginUser,
  logoutUser,
  registerUser,
};
