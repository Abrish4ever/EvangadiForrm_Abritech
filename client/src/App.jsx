import { useContext, useState, useEffect, useCallback } from "react";
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

  function isValidToken(token) {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired && decoded.userid && decoded.username;
    } catch (e) {
      return false;
    }
  }

  const checkUser = useCallback(async () => {
    if (!token || !isValidToken(token)) {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/users/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const decoded = jwtDecode(token);
        setUser({
          user_id: decoded.userid,
          user_name: decoded.username,
          token: token,
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);

      if (error.response?.status === 401 || error.response?.status === 500) {
        localStorage.removeItem("token");
        setUser(null);
        setError("Session expired. Please log in again.");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, setUser]);

  useEffect(() => {
    if (token) {
      checkUser();
    } else {
      setLoading(false);
      setUser(null);
    }
  }, [token, checkUser, setUser]);

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
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        <Routes>
          {/* Public Routes */}
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

          {/* Protected Routes */}
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
        {user && <AIAssistant />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
