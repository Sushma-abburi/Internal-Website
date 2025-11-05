const Task = require("../models/Task");

// ✅ Create new task (manual task id allowed)
const createTask = async (req, res) => {
  try {
    const {
      id,
      employeeId,
      fy,
      text,
      assigned,
      assignedDate,
      dueDate,
      rating,
      score,
    } = req.body;

    if (!id || !employeeId || !fy || !text) {
      return res
        .status(400)
        .json({ message: "id, employeeId, fy, and text are required" });
    }

    // Check if task ID already exists
    const existing = await Task.findOne({ id });
    if (existing) {
      return res.status(400).json({ message: "Task with this ID already exists" });
    }

    const task = new Task({
      id,
      employeeId,
      fy,
      text,
      assigned,
      assignedDate: assignedDate ? new Date(assignedDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      rating: rating || 0,
      score: score || 0,
    });

    await task.save();

    // Fetch updated task list for same employee & FY
    const tasks = await Task.find({ employeeId, fy }).sort({ createdAt: 1 }).lean();

    res.status(201).json({ message: "Task created", task, tasks });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all tasks (optional filters)
const getTasks = async (req, res) => {
  try {
    const { employeeId, fy } = req.query;

    let filter = {};
    if (employeeId) filter.employeeId = employeeId;
    if (fy) filter.fy = fy;

    const tasks = await Task.find(filter).sort({ createdAt: 1 }).lean();
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add comment to a specific task
const addComment = async (req, res) => {
  try {
    const { id } = req.params; // task id
    const { authorId, authorName, role, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Comment message is required" });
    }

    const task = await Task.findOne({ id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = {
      authorId,
      authorName,
      role,
      message,
      createdAt: new Date(),
    };

    task.comments.push(comment);
    await task.save();

    res.json({ message: "Comment added", comments: task.comments });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update task (status, rating, score, etc.)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate({ id }, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated", task });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete task by ID
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted", id });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getTasks,
  addComment,
  updateTask,
  deleteTask,
};