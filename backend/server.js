const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
