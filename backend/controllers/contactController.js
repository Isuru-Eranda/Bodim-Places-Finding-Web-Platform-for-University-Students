import Contact from "../models/Contact.js";

// POST /api/contact  — public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const contact = await Contact.create({ name, email, subject, message });

    res.status(201).json({
      message: "Your message has been received. We'll get back to you soon!",
      id: contact._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/contact  — admin only
export const getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);

    res.json({ contacts, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/contact/:id/status  — admin only
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!contact)
      return res.status(404).json({ message: "Message not found." });

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/contact/:id  — admin only
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact)
      return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Message deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
