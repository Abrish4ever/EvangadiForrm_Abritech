import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = () => {
      const token = localStorage.getItem("token");
      console.log("🔄 UserProvider - Initializing with token:", !!token);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log("✅ UserProvider - Decoded token:", decoded);

          // ✅ FIX: Create stable user object with correct mappings
          const userData = {
            user_id: decoded.userid, // Map backend 'userid' to frontend 'user_id'
            user_name: decoded.username, // Map backend 'username' to frontend 'user_name'
            token: token,
          };

          console.log("✅ UserProvider - Setting user:", userData);
          setUser(userData);
        } catch (error) {
          console.error("❌ UserProvider - Token decode error:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        console.log("❌ UserProvider - No token available");
        setUser(null);
      }
      setIsInitialized(true);
    };

    initializeUser();
  }, []);

  // ✅ FIX: Create a stable setUser function that doesn't cause unnecessary re-renders
  const setUserStable = (newUser) => {
    console.log("🔄 UserProvider - Setting new user:", newUser);
    if (newUser === null) {
      setUser(null);
      return;
    }

    // Ensure consistent property names
    setUser({
      user_id: newUser.user_id || newUser.userid,
      user_name: newUser.user_name || newUser.username,
      token: newUser.token,
    });
  };

  console.log("🔍 UserProvider - Current user state:", user);
  console.log("🔍 UserProvider - Is initialized:", isInitialized);

  return (
    <UserContext.Provider value={[user, setUserStable]}>
      {isInitialized ? children : <div>Loading...</div>}
    </UserContext.Provider>
  );
}
