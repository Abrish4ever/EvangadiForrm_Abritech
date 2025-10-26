import { createContext, useState, useContext } from "react";

export const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch all questions
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // You'll implement the API call here later
      // const response = await axios.get("/api/question");
      // setQuestions(response.data);
    } catch (err) {
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch single question
  const fetchQuestionById = async (questionId) => {
    setLoading(true);
    setError(null);
    try {
      // You'll implement the API call here later
      // const response = await axios.get(`/api/question/${questionId}`);
      // setCurrentQuestion(response.data);
    } catch (err) {
      setError("Failed to fetch question");
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new question
  const addQuestion = (newQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const value = {
    questions,
    currentQuestion,
    loading,
    error,
    fetchQuestions,
    fetchQuestionById,
    addQuestion,
    setQuestions,
    setCurrentQuestion,
  };
  

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}
