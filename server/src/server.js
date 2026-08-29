require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const toolsRoutes = require("./routes/toolsRoutes");
const learningRoutes = require("./routes/learningRoutes");
const miscRoutes = require("./routes/miscRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "FacultyAI Hub API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api", miscRoutes); // updates, saved-tools, profile, announcements, admin/*

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`FacultyAI Hub API running on http://localhost:${PORT}`);
});
