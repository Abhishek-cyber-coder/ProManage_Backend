const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    checklist: [
      {
        name: String,
        selected: {
          type: Boolean,
          default: false,
        },
      },
    ],
    dueDate: Date,
    status: {
      type: String,
      enum: ["todo", "backlog", "progress", "done"],
      default: "todo",
    },
    refUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
