import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  const { _id, name, email, role, profilePicture, contactNumber, whatsapp, guardianMobile } = req.user;
  res.json({ _id, name, email, role, profilePicture, contactNumber, whatsapp, guardianMobile });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if email is taken by another user
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing && existing._id.toString() !== req.user._id.toString()) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), email: email.toLowerCase().trim() },
      { new: true, select: "-password" }
    );

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      profilePicture: updated.profilePicture,
      contactNumber: updated.contactNumber,
      whatsapp: updated.whatsapp,
      guardianMobile: updated.guardianMobile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContactDetails = async (req, res) => {
  try {
    const { contactNumber, whatsapp, guardianMobile } = req.body;

    const update = {
      contactNumber: contactNumber?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
    };

    // Only allow guardianMobile for students
    if (req.user.role === "student") {
      update.guardianMobile = guardianMobile?.trim() || null;
    }

    const updated = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      select: "-password",
    });

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      profilePicture: updated.profilePicture,
      contactNumber: updated.contactNumber,
      whatsapp: updated.whatsapp,
      guardianMobile: updated.guardianMobile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePicture = `/uploads/${req.file.filename}`;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true, select: "-password" }
    );

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      profilePicture: updated.profilePicture,
      contactNumber: updated.contactNumber,
      whatsapp: updated.whatsapp,
      guardianMobile: updated.guardianMobile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
