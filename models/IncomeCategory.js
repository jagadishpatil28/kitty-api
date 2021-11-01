const mongoose = require("mongoose");

const IncomeCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("IncomeCategory", IncomeCategorySchema);
