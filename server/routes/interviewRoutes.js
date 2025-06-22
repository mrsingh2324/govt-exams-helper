const express = require("express");
const router = express.Router();

const { generateInterview } = require("../controllers/interviewController");

router.post("/generate", generateInterview);

module.exports = router;