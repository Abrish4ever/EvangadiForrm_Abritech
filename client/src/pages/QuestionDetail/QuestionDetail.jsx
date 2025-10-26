import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { QuestionContext } from "../../context/QuestionProvider";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import DOMPurify from "dompurify";
import axiosInstance from "../../API/axios";

const QuestionDetail = () => {
  const { question_id } = useParams();
  const [user] = useContext(UserContext);
  const { questions, setQuestions } = useContext(QuestionContext);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [answerLoading, setAnswerLoading] = useState(false);
  const navigate = useNavigate();
  const [isUserStable, setIsUserStable] = useState(false);

  // Vote states for question and answers
  const [questionVote, setQuestionVote] = useState({
    likes: 0,
    dislikes: 0,
    userVote: null,
  });
  const [answerVotes, setAnswerVotes] = useState({});

  useEffect(() => {
    if (user) {
      console.log("✅ QuestionDetail - User is stable:", user);
      setIsUserStable(true);
    }
  }, [user]);

  // Fetch question and answers
  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);

        // Fetch question details
        const questionResponse = await axiosInstance.get(
          `/question/${question_id}`
        );

        // Add question to context if not already there
        if (!questions.find((q) => q.question_id == question_id)) {
          setQuestions((prev) => [...prev, questionResponse.data]);
        }

        // Initialize question votes (you can fetch from backend if stored)
        setQuestionVote({
          likes: questionResponse.data.likes || 0,
          dislikes: questionResponse.data.dislikes || 0,
          userVote: null,
        });

        // Fetch all answers
        const answersResponse = await axiosInstance.get("/answers/");

        // Filter answers for this specific question
        const questionAnswers =
          answersResponse.data.answers?.filter(
            (answer) => answer.question_id == question_id
          ) || [];

        // Sort answers by likes (most liked first)
        const sortedAnswers = questionAnswers.sort(
          (a, b) => (b.likes || 0) - (a.likes || 0)
        );
        setAnswers(sortedAnswers);

        // Initialize answer votes
        const votes = {};
        sortedAnswers.forEach((answer) => {
          votes[answer.answer_id] = {
            likes: answer.likes || 0,
            dislikes: answer.dislikes || 0,
            userVote: null,
          };
        });
        setAnswerVotes(votes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isUserStable) {
      fetchQuestionAndAnswers();
    }
  }, [question_id, setQuestions, questions, isUserStable]);

  // Get current question
  const question = questions.find((q) => q.question_id == question_id);

  const canEditQuestion = () => {
    if (!user || !question) return false;
    const userId = user.user_id || user.userid;
    const questionUserId = question.user_id;
    return userId == questionUserId;
  };

  const canEditAnswer = (answerUserId) => {
    if (!user) return false;
    const userId = user.user_id || user.userid;
    return userId == answerUserId;
  };

  // Handle question vote
  const handleQuestionVote = (voteType) => {
    setQuestionVote((prev) => {
      const wasLiked = prev.userVote === "like";
      const wasDisliked = prev.userVote === "dislike";

      let newLikes = prev.likes;
      let newDislikes = prev.dislikes;
      let newVote = voteType;

      if (wasLiked) newLikes--;
      if (wasDisliked) newDislikes--;

      if (voteType === "like") {
        if (wasLiked) {
          newVote = null;
        } else {
          newLikes++;
        }
      } else if (voteType === "dislike") {
        if (wasDisliked) {
          newVote = null;
        } else {
          newDislikes++;
        }
      }

      return { likes: newLikes, dislikes: newDislikes, userVote: newVote };
    });
  };

  // Handle answer vote
  const handleAnswerVote = (answerId, voteType) => {
    setAnswerVotes((prev) => {
      const currentVote = prev[answerId] || {
        likes: 0,
        dislikes: 0,
        userVote: null,
      };
      const wasLiked = currentVote.userVote === "like";
      const wasDisliked = currentVote.userVote === "dislike";

      let newLikes = currentVote.likes;
      let newDislikes = currentVote.dislikes;
      let newVote = voteType;

      if (wasLiked) newLikes--;
      if (wasDisliked) newDislikes--;

      if (voteType === "like") {
        if (wasLiked) {
          newVote = null;
        } else {
          newLikes++;
        }
      } else if (voteType === "dislike") {
        if (wasDisliked) {
          newVote = null;
        } else {
          newDislikes++;
        }
      }

      return {
        ...prev,
        [answerId]: {
          likes: newLikes,
          dislikes: newDislikes,
          userVote: newVote,
        },
      };
    });

    // Re-sort answers by likes
    setAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      return updated.sort((a, b) => {
        const aLikes = answerVotes[a.answer_id]?.likes || 0;
        const bLikes = answerVotes[b.answer_id]?.likes || 0;
        return bLikes - aLikes;
      });
    });
  };

  // Post new answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!newAnswer.trim()) {
      alert("Please write an answer before submitting.");
      return;
    }

    setAnswerLoading(true);

    try {
      const response = await axiosInstance.post(`/answers/${question_id}`, {
        answer: newAnswer,
      });

      if (response.status === 201) {
        const answersResponse = await axiosInstance.get("/answers/");
        const questionAnswers =
          answersResponse.data.answers?.filter(
            (answer) => answer.question_id == question_id
          ) || [];

        const sortedAnswers = questionAnswers.sort(
          (a, b) => (b.likes || 0) - (a.likes || 0)
        );
        setAnswers(sortedAnswers);
        setNewAnswer("");
        alert("Answer posted successfully!");
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      alert("Failed to post answer. Please try again.");
    } finally {
      setAnswerLoading(false);
    }
  };

  // Delete answer
  const handleDeleteAnswer = async (answer_id, e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this answer?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/answers/${answer_id}`);
      setAnswers((prev) =>
        prev.filter((answer) => answer.answer_id !== answer_id)
      );
      alert("Answer deleted successfully!");
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("Failed to delete answer. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClipLoader size={50} color="#FF8500" />
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Question not found
          </h2>
          <p className="text-gray-600 mb-4">
            The question you're looking for doesn't exist.
          </p>
          <Link
            to="/home"
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/home"
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Questions
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="p-6">
            <div className="flex gap-6">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                <button
                  onClick={() => handleQuestionVote("like")}
                  className={`p-2 rounded-lg transition-colors ${
                    questionVote.userVote === "like"
                      ? "bg-green-100 text-green-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <span className="font-bold text-xl text-gray-900">
                  {questionVote.likes - questionVote.dislikes}
                </span>
                <button
                  onClick={() => handleQuestionVote("dislike")}
                  className={`p-2 rounded-lg transition-colors ${
                    questionVote.userVote === "dislike"
                      ? "bg-red-100 text-red-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {question.title}
                  </h1>
                  {canEditQuestion() && (
                    <button
                      onClick={() => navigate(`/edit-question/${question_id}`)}
                      className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                <div
                  className="prose max-w-none text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      question.question_description || ""
                    ),
                  }}
                />

                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">
                      Asked by: {question.user_name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {question.tag && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                      {question.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-orange-500" />
            {answers.length} Answer{answers.length !== 1 ? "s" : ""} From The
            Community
          </h3>
          <p className="text-sm text-gray-600 mt-1">Sorted by most helpful</p>
        </div>

        {/* Answers List */}
        {answers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center mb-6">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              No answers yet
            </h4>
            <p className="text-gray-600">
              Be the first to answer this question!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {answers.map((answer, index) => {
              const vote = answerVotes[answer.answer_id] || {
                likes: 0,
                dislikes: 0,
                userVote: null,
              };

              return (
                <div
                  key={answer.answer_id || index}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center gap-2 min-w-[60px]">
                        <button
                          onClick={() =>
                            handleAnswerVote(answer.answer_id, "like")
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            vote.userVote === "like"
                              ? "bg-green-100 text-green-600"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          <ThumbsUp className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-lg text-gray-900">
                          {vote.likes - vote.dislikes}
                        </span>
                        <button
                          onClick={() =>
                            handleAnswerVote(answer.answer_id, "dislike")
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            vote.userVote === "dislike"
                              ? "bg-red-100 text-red-600"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          <ThumbsDown className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {answer.user_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Answered on{" "}
                              {new Date(answer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{answer.answer}</p>

                        {canEditAnswer(answer.user_id) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/edit-answer/${answer.answer_id}`)
                              }
                              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={(e) =>
                                handleDeleteAnswer(answer.answer_id, e)
                              }
                              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Answer Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="6"
              required
            />
            <button
              type="submit"
              disabled={answerLoading}
              className="mt-4 w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {answerLoading ? (
                <>
                  <ClipLoader size={20} color="#fff" />
                  <span>Posting Answer...</span>
                </>
              ) : (
                "Post Your Answer"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
