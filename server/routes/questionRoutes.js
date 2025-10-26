const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

// Question Controller
const {
  createQuestion,
  getAllQuestion,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controller/questionController");

// Question Endpoints
// Create a new question
router.post("/", authMiddleware, createQuestion);

// Get all questions (with pagination, filters, search)
router.get("/", authMiddleware, getAllQuestion);

// Get a single question by ID
router.get("/:question_id", authMiddleware, getSingleQuestion);

// Update a question by ID
router.put("/:question_id", authMiddleware, updateQuestion);

// Delete a question by ID
router.delete("/:question_id", authMiddleware, deleteQuestion);


module.exports = router;
