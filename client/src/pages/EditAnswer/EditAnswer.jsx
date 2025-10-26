import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import axiosInstance from "../../API/axios";
import styles from "./EditAnswer.module.css";

function EditAnswer() {
  const params = useParams();
  const { answer_id } = params;
  const navigate = useNavigate();
  const [user] = useContext(UserContext);

  const [answer, setAnswer] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch the answer by ID
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAnswer = async () => {
      try {
        // 🔧 DEBUG: Log what we're receiving
        console.log("Raw answer_id from params:", answer_id);
        console.log("Full params:", params);

        // 🔧 FIX: Ensure answer_id is clean (no extra characters)
        const cleanAnswerId = String(answer_id).split(":")[0].trim();

        console.log("Cleaned answer_id:", cleanAnswerId); // Debug log
        console.log("Full URL will be:", `/answers/${cleanAnswerId}`);

        const { data } = await axiosInstance.get(`/answers/${cleanAnswerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Fetched data successfully:", data); // Debug log

        // ✅ Backend returns the answer object directly
        setAnswer(data.answer || "");
        setOriginalAnswer(data.answer || "");
        setLoading(false);
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error("Fetch error:", err);
        console.error("Error response:", err.response?.data);

        // Better error handling
        if (err.response?.status === 404) {
          setError("Answer not found.");
        } else if (err.response?.status === 401) {
          setError("You must be logged in to edit answers.");
        } else {
          setError(
            err.response?.data?.message || "Failed to load answer data."
          );
        }
        setLoading(false);
      }
    };

    if (token && answer_id) {
      fetchAnswer();
    } else {
      setError("You must be logged in to edit your answer.");
      setLoading(false);
    }
  }, [answer_id]);

  // ✅ Handle save/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!answer.trim()) {
      setError("Answer cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      // 🔧 FIX: Clean the answer_id before sending
      const cleanAnswerId = answer_id?.split(":")[0];

      await axiosInstance.put(
        `/answers/${cleanAnswerId}`,
        { answer: answer.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Success - navigate back
      navigate(-1);
    } catch (err) {
      console.error("Update error:", err);
      console.error("Error response:", err.response?.data);

      // Better error messages
      if (err.response?.status === 403) {
        setError("You are not authorized to edit this answer.");
      } else if (err.response?.status === 404) {
        setError("Answer not found.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to update answer. Please try again."
        );
      }
      setLoading(false);
    }
  };

  // ✅ Handle discard changes
  const handleDiscard = () => {
    setAnswer(originalAnswer);
    navigate(-1);
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your answer...</p>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className={styles.container}>
      <h2>Edit Your Answer</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="answer" className={styles.label}>
            Your Answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={styles.textarea}
            placeholder="Edit your answer here..."
            rows="10"
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className={styles.discardButton}
            onClick={handleDiscard}
            disabled={loading}
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAnswer;
