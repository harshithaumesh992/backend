const TeamMember = require("../models/TeamMember");

// Get all team members
exports.getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add team member
exports.addTeamMember = async (req, res) => {
  try {
    const newMember = new TeamMember(req.body);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};