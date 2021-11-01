const mongoose = require("mongoose");

const ConsolidatedTransactionSchema = new mongoose.Schema(
  {
    totalIncome: { type: Number, required: true },
    totalExpense: { type: Number, required: true },
    balance: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ConsolidatedTransaction",
  ConsolidatedTransactionSchema
);
