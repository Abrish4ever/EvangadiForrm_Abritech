const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

// Post answer
const postAnswer = async (req, res) => {
  const userid = req.user?.userid;
  const { question_id } = req.params;
  const { answer } = req.body;

  if (!userid) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "User not authenticated",
    });
  }

  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide answer",
    });
  }

  try {
    await dbConnection.query(
      "INSERT INTO answerTable (user_id, answer, question_id) VALUES (?, ?, ?)",
      [userid, answer, question_id]
    );
    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (err) {
    console.log("Answer post error:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
    });
  }
};

// Get all answers
const allAnswers = async (req, res) => {
  try {
    const fetchAllAnswers = `SELECT 
      questionTable.title,
      questionTable.question_description,
      answerTable.user_id,
      answerTable.createdAt,
      answerTable.answer_id,
      answerTable.question_id,
      userTable.user_name,
      answerTable.answer 
      FROM answerTable 
      JOIN userTable ON userTable.user_id = answerTable.user_id 
      JOIN questionTable ON answerTable.question_id = questionTable.question_id 
      ORDER BY answerTable.createdAt DESC`;

    const [allAnswers] = await dbConnection.query(fetchAllAnswers);

    res.status(StatusCodes.OK).json({ answers: allAnswers });
  } catch (error) {
    console.log("Get answers error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Delete answer
const deleteAnswer = async (req, res) => {
  const userid = req.user?.userid;
  const { answer_id } = req.params;

  if (!userid) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "User not authenticated",
    });
  }

  try {
    // Check if answer exists and user owns it
    const [answer] = await dbConnection.query(
      "SELECT user_id FROM answerTable WHERE answer_id = ?",
      [answer_id]
    );

    if (answer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (answer[0].user_id !== userid) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Not authorized to delete this answer",
      });
    }

    await dbConnection.query("DELETE FROM answerTable WHERE answer_id = ?", [
      answer_id,
    ]);
    return res.status(StatusCodes.OK).json({
      message: "Answer deleted successfully",
    });
  } catch (error) {
    console.log("Delete answer error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Get single answer by ID
const getAnswerById = async (req, res) => {
  try {
    const { answer_id } = req.params;

    const [rows] = await dbConnection.query(
      `SELECT answer_id, answer, question_id, user_id, createdAt 
       FROM answerTable 
       WHERE answer_id = ?`,
      [answer_id]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    return res.status(StatusCodes.OK).json(rows[0]);
  } catch (error) {
    console.error("❌ Get answer by ID error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Edit answer
const editAnswer = async (req, res) => {
  try {
    const userid = req.user?.userid;
    const { answer_id } = req.params;
    const { answer } = req.body;

    // 🔒 1. Check authentication
    if (!userid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    // ✏️ 2. Validate input
    if (!answer || answer.trim() === "") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide an answer content",
      });
    }

    // 🔍 3. Verify the answer exists and belongs to the user
    const [existing] = await dbConnection.query(
      "SELECT user_id FROM answerTable WHERE answer_id = ?",
      [answer_id]
    );

    if (existing.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (existing[0].user_id !== userid) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Not authorized to edit this answer",
      });
    }

    // 🛠️ 4. Update the answer (REMOVED updatedAt = NOW())
    await dbConnection.query(
      "UPDATE answerTable SET answer = ? WHERE answer_id = ?",
      [answer.trim(), answer_id]
    );

    // ✅ 5. Return success message
    return res.status(StatusCodes.OK).json({
      message: "Answer updated successfully",
    });
  } catch (error) {
    console.error("❌ Edit answer error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  deleteAnswer,
  getAnswerById,
  editAnswer,
  postAnswer,
  allAnswers,
};
