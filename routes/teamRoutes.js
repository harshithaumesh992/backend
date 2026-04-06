const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// GET team members
router.get("/team", teamController.getTeamMembers);

// POST new member
router.post("/team", teamController.addTeamMember);

module.exports = router;