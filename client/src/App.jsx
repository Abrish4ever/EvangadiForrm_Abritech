import { useContext, useState, useEffect } from "react";
import { UserContext } from "./context/UserProvider";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "./API/axios";
import ProtectedRoute from "./context/ProtectedRoutes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import HomePage from "./components/HomePage/Homepage";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail/QuestionDetail";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { jwtDecode } from "jwt-decode";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import EditQuestion from "./pages/EditQuestion/EditQuestion";
import EditAnswer from "./pages/EditAnswer/EditAnswer";
import AIAssistant from "./components/AiAssistance/AIAssistance";

function App() {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  }

  async function checkUser() {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.get("/users/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ FIX: Ensure user data is properly set with correct property names
      const decoded = jwtDecode(token);
      setUser({
        user_id: decoded.userid, // Map to user_id
        user_name: decoded.username, // Map to user_name
        token: token,
      });
    } catch (error) {
      console.error("Authentication error:", error.message);
      localStorage.removeItem("token");
      setUser(null);
      setError("Failed to authenticate. Please log in again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      checkUser();
    } else {
      setLoading(false);
      setUser(null); // Ensure user is null when no token
    }
  }, [token]);

  // ✅ FIX: Add useEffect to persist user data
  useEffect(() => {
    if (user) {
      console.log("🔄 App - User context updated:", user);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loader">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <div className="app-content">
        <Routes>
          {/* Public Routes - Redirect to home if logged in */}
          <Route
            path="/"
            element={token ? <Navigate to="/home" /> : <LandingPage />}
          />
          <Route
            path="/users/login"
            element={token ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/users/register"
            element={token ? <Navigate to="/home" /> : <SignUp />}
          />
          <Route
            path="/forget-password"
            element={token ? <Navigate to="/home" /> : <ForgetPassword />}
          />
          <Route path="/how-it-works" element={<HowItWorks />} />

          {/* Protected Routes - Require authentication */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions/:question_id"
            element={
              <ProtectedRoute>
                <QuestionDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <AskQuestion />
              </ProtectedRoute>
            }
          />
          {/* Add Edit Routes */}
          <Route
            path="/edit-question/:question_id"
            element={
              <ProtectedRoute>
                <EditQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-answer/:answer_id"
            element={
              <ProtectedRoute>
                <EditAnswer />
              </ProtectedRoute>
            }
          />
        </Routes>
        <AIAssistant />
      </div>
      <Footer />
    </div>
  );
}

export default App;
