import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDropright } from "react-icons/io";
import { QuestionContext } from "../../context/QuestionProvider";
import { UserContext } from "../../context/UserProvider";
import DOMPurify from "dompurify";
import styles from "./HomePage.module.css";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../../API/axios";
import AIAssistant from "../AiAssistance/AIAssistance";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const { questions, setQuestions } = useContext(QuestionContext);
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching questions...");
        const response = await axiosInstance.get("/question", {
          // Fixed endpoint
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Questions data:", response.data);
        setQuestions(response.data); // ✅ Direct array, no .questions property
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.response?.data?.msg ||
            "Failed to load questions. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchQuestions();
    } else {
      setLoading(false);
      setError("No authentication token found");
    }
  }, [token, setQuestions]);

  const handleDelete = async (question_id, e) => {
    e.stopPropagation();

    if (!user?.user_id) {
      console.error("User not logged in.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/question/${question_id}`, {
        data: { user_id: user.user_id },
      });

      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.question_id !== question_id)
      );
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question. Please try again.");
    }
  };

  // Filter questions based on search
  const filteredQuestions = questions.filter(
    (question) =>
      question.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.question_description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // Date formatting helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.homeContainer}>
      {/* Header Section */}
      <header className={styles.homeHeader}>
        <div className={styles.welcomeUser}>
          <h1>Welcome, {user?.user_name}!</h1>
          <p>Engage, Ask, and Share Knowledge</p>
        </div>
        <button
          className={styles.askQuestionBtn}
          onClick={() => navigate("/ask")}
        >
          Ask a Question
        </button>
      </header>

      {/* Search Section */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer}>
          <ClipLoader size={40} color="#f48024" />
          <p>Loading questions...</p>
        </div>
      )}

      {/* Error State */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Empty State */}
      {!loading && !error && filteredQuestions.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No questions found</h3>
          <p>
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "Be the first to ask a question!"}
          </p>
          {!searchQuery && (
            <button
              className={styles.askQuestionBtn}
              onClick={() => navigate("/ask")}
            >
              Ask First Question
            </button>
          )}
        </div>
      )}

      {/* Questions List */}
      {!loading && !error && filteredQuestions.length > 0 && (
        <div className={styles.questionsList}>
          {currentQuestions.map((question) => (
            <div
              key={question.question_id}
              className={styles.cardWrapper}
              onClick={() => navigate(`/questions/${question.question_id}`)}
            >
              <div className={styles.questionCard}>
                {/* User Profile */}
                <div className={styles.profileSection}>
                  <FaUserCircle className={styles.profileIcon} />
                  <span className={styles.username}>{question?.user_name}</span>
                </div>

                {/* Question Content */}
                <div className={styles.content}>
                  <h3 className={styles.contentTitle}>
                    <Link to={`/questions/${question.question_id}`}>
                      {question.title}
                    </Link>
                  </h3>

                  <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        question?.question_description || ""
                      ),
                    }}
                  />

                  {/* Meta Information */}
                  <div className={styles.meta}>
                    {/* Tags */}
                    {question.tag && (
                      <div className={styles.tags}>
                        <span className={styles.tag}>{question.tag}</span>
                      </div>
                    )}

                    {/* Date */}
                    <div className={styles.date}>
                      Asked {formatDate(question.createdAt)}
                    </div>
                  </div>

                  {/* ✅ FIXED: Action Buttons - MOVED OUTSIDE meta section */}
                  {user?.user_id === question.user_id && (
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => handleDelete(question.question_id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow Navigation */}
              <Link
                to={`/questions/${question.question_id}`}
                className={styles.arrow}
              >
                <IoIosArrowDropright className={styles.arrowIcon} />
              </Link>
            </div>
          ))}
        </div>
      )}


      {/* Pagination */}
      {!loading && filteredQuestions.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
