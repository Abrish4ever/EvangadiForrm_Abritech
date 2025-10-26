import React, { useState, useContext } from "react";
// import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import axiosInstance from "../../API/axios";
import { ClipLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // State for individual field errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email validation function
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "Email is required";
    }
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Password validation function
  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation if field has been touched
    if (name === "email" && emailTouched) {
      setEmailError(validateEmail(value));
    }
    if (name === "password" && passwordTouched) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(formData.email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(formData.password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Mark all fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);

    // Validate all fields
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    // Stop submission if there are validation errors
    if (emailErr || passwordErr) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/login", formData);
      setSuccessMessage(response.data.msg);

      const token = response.data.token;
      localStorage.setItem("token", token);

      // Decode and set user with proper mapping
      const decoded = jwtDecode(token);
      console.log("🔍 Login - Decoded token:", decoded);

      // Set user with correct property mapping
      setUser({
        user_id: decoded.userid,
        user_name: decoded.username,
        token: token,
      });

      // Add small delay to ensure context is updated
      setTimeout(() => {
        navigate("/home");
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.msg || "Something went wrong! Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your Email Address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  emailError && emailTouched
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500"
                }`}
              />
              {emailError && emailTouched && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handlePasswordBlur}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 ${
                    passwordError && passwordTouched
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && passwordTouched && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            {/* General Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forget-password"
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <ClipLoader size={20} color="#ffffff" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/users/register"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Hero Section with Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"  >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-left max-w-lg">
            {/* Star Icon */}
            <div className="mb-6">
              <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 40C25.4247 40 40 25.4247 40 0C40 25.4247 54.5753 40 80 40C54.5753 40 40 54.5753 40 80C40 54.5753 25.4247 40 0 40Z"
                  fill="#F39228"
                ></path>
              </svg>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold text-white mb-8 leading-tight">
              <span className="text-orange-400">5 Stage</span> Unique
              <br />
              Learning Method
            </h1>

            {/* User Avatars */}
            <div className="flex items-center gap-4" >
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 border-2 border-white"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 border-2 border-white"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white"></div>
              </div>
              <p className="text-white text-base font-medium">
                Join 40,000+ users
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
