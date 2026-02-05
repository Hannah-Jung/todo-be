const Task = require("../model/Task");

const taskController = {};

taskController.createTask = async (req, res) => {
  try {
    const { task, isComplete } = req.body;
    const newTask = new Task({ task, isComplete });
    await newTask.save();
    res.status(200).json({ status: "success", data: newTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

taskController.getTask = async (req, res) => {
  try {
    const taskList = await Task.find({}).sort("-createdAt").select("-__v");
    res.status(200).json({ status: "success", data: taskList });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

taskController.updateTask = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.task !== undefined) {
      updateData.lastTextEditedAt = new Date();
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found" });
    }

    res.status(200).json({ status: "success", data: updatedTask });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

taskController.deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", data: deleteTask });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports = taskController;
