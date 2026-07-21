const express = require("express");
const router = express.Router();

// POST /api/auth/login ( mock login )
// No real users store / password hashing here on purpose
// Accept any no-empty email + password and return a fake token with user object
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  console.log("SSS");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const fakeToken = Buffer.from(`${email}:${Date.now()}`).toString("base64");

  res.json({
    data: {
      token: fakeToken,
      user: { email, name: email.split("@")[0] },
    },
  });
});

module.exports = router;
