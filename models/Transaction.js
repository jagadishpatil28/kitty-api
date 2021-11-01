const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    incomeAmount: { type: Number, required: true },
    expenseAmount: { type: Number, required: true },
    incomeCategory: { type: String, required: true },
    expenseCategory: { type: String, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    paymentType: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
