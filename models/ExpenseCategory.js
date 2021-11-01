const mongoose = require("mongoose");

const ExpenseCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("ExpenseCategory", ExpenseCategorySchema);
