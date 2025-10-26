import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserProvider.jsx";
import { QuestionProvider } from "./context/QuestionProvider.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <QuestionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QuestionProvider>
    </UserProvider>
  </StrictMode>
);
