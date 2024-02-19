const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({});

module.exports = mongoose.model("Task", taskSchema);
