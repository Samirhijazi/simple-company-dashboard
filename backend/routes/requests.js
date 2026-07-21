const express = require("express");
const router = express.Router();
const RequestModel = require("../models/requestModel");

// GET /api/requests fetch all client requests
router.get("/", (req, res) => {
  try {
    const requests = RequestModel.getAllRequests();
    res.json({ data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// POST /api/requests create a new client request
router.post("/", (req, res) => {
  const { client_name, description } = req.body;

  if (
    !client_name ||
    !client_name.trim() ||
    !description ||
    !description.trim()
  ) {
    return res
      .status(400)
      .json({ error: "client_name and description are required" });
  }

  try {
    const created = RequestModel.createRequest({
      client_name: client_name.trim(),
      description: description.trim(),
    });
    res.status(201).json({ data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create request" });
  }
});

// PATCH /api/requests/:id/status advance status (New -> In Progress -> Done)
// Accepts an optional { status: "..." } body to jump to a specific status;
// otherwise advances one step in the flow.
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  try {
    const updated = status
      ? RequestModel.setStatus(id, status)
      : RequestModel.advanceStatus(id);

    if (!updated) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json({ data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
