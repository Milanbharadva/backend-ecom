const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./routes/userRoutes");
const PORT = 5000;

require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "https://ecommerce-node-jbt5.vercel.app" }));
app.use(bodyParser.json({ limit: "100mb" }));

// Connect to DB
connectDB();

app.use((req, res, next) => {
  let timeoutId = setTimeout(() => {
    res.status(500).send("Request Timeout");
  }, 60000);

  res.on("finish", () => {
    clearTimeout(timeoutId);
  });

  next();
});
// Routes
app.get("/", (req, res) => {
  res.end("HELLO");
});
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
