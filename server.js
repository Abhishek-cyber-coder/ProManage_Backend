const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
// Health API
app.get("/health", (req, res) => {
  return res.json({
    message: "Your API is running successfully!",
  });
});

// Connect DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to the DB");
  })
  .catch((err) => {
    console.log("Some error occured while connecting to the DB", err);
  });

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

const PORT = process.env.PORT;
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running at the port ${PORT}`);
  }
});
