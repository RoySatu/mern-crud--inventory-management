const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const itemsRouter = require("./routes/items");
const authRouter = require("./routes/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Allow credentials
app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/items", itemsRouter);
app.use("/api/auth", authRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));