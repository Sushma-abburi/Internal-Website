const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  addComment,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Create new task (manual id allowed)
router.post("/save", createTask);

// Get all tasks
router.get("/", getTasks);

// Add comment to task
router.post("/:id/comments", addComment);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

module.exports = router;