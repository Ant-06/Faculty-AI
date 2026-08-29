const express = require("express");
const { chat } = require("../controllers/assistantController");

const router = express.Router();
router.post("/", chat);

module.exports = router;
