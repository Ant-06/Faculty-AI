require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const toolsRoutes = require("./routes/toolsRoutes");
const learningRoutes = require("./routes/learningRoutes");
const miscRoutes = require("./routes/miscRoutes");
const assistantRoutes = require("./routes/assistantRoutes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorHandler");

const app = express();

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const PORT = Number(process.env.PORT) || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as health checks/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "FacultyAI Hub API",
    environment: process.env.NODE_ENV || "development",
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/assistant", assistantRoutes);

// updates, saved-tools, profile, announcements, admin/*
app.use("/api", miscRoutes);

/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
*/

app.use(notFound);
app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
|
| 0.0.0.0 is important when running on Render or another
| container/cloud hosting provider.
|
*/

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FacultyAI Hub API running on port ${PORT}`);
});