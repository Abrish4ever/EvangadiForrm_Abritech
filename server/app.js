const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./db/dbConfig");
const createTables = require("./db/dbSchema");

const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoute");

const app = express();
const port = process.env.PORT;

// Middleware

// Option 1: Allow specific origin (most secure)
app.use(
  cors({
    origin: "https://evangadihub.abri-tech.com",
    credentials: true,
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Route for AI chat
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to connect to Groq API" });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answers", answerRoutes);

// Endpoint to create tables
app.get("/create-table", createTables);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Evangadi Forum backend" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await dbConnection.execute("select 'test'");
    console.log("Database connection established");
  } catch (error) {
    console.log("Database connection failed:", error.message);
  } finally {
    // Always start the server to avoid Render killing the process
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

startServer();
