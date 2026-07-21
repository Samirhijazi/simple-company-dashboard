const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
