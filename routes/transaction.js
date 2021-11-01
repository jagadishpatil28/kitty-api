const router = require("express").Router();
const Transaction = require("../models/Transaction");
const IncomeCategory = require("../models/IncomeCategory");
const ExpenseCategory = require("../models/ExpenseCategory");

const { verifyToken, verifyTokenAndAutherization } = require("./verifyToken");

//ADD NEW TRANSACTION
router.post("/add", verifyToken, async (req, res) => {
  //Retrieve the Income & Expense Categories from the Database
  const incomeCategory = await IncomeCategory.findById(req.body.categoryId);
  const expenseCategory = await ExpenseCategory.findById(req.body.categoryId);

  const incomeCategoryName = incomeCategory ? incomeCategory.categoryName : "-";
  const expenseCategoryName = expenseCategory
    ? expenseCategory.categoryName
    : "-";

  const enteredIncomeAmount =
    incomeCategoryName != "-" ? req.body.transactionAmount : 0;
  const enteredExpenseAmount =
    expenseCategoryName != "-" ? req.body.transactionAmount : 0;

  //Create new Transaction Object
  const newTransaction = new Transaction({
    description: req.body.description,
    incomeAmount: enteredIncomeAmount,
    expenseAmount: enteredExpenseAmount,
    incomeCategory: incomeCategoryName,
    expenseCategory: expenseCategoryName,
    year: req.body.year,
    month: req.body.month,
    day: req.body.day,
    paymentType: req.body.paymentType,
    userId: req.body.userId,
  });

  //Save the New Transaction to the Database
  try {
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL TRANSACTIONS OF USER
router.get("/:id", verifyTokenAndAutherization, async (req, res) => {
  const type = req.query.type;
  const month = req.query.month;
  const day = req.query.day;

  const transactionTypes =
    type == "income"
      ? await IncomeCategory.find()
      : await ExpenseCategory.find();

  try {
    const userTransactions =
      type == "income"
        ? await Transaction.find({
            userId: req.params.id,
            incomeCategory: {
              $in: transactionTypes.map((item) => item.categoryName),
            },
            year: req.query.year,
          })
        : await Transaction.find({
            userId: req.params.id,
            expenseCategory: {
              $in: transactionTypes.map((item) => item.categoryName),
            },
            year: req.query.year,
          });

    //Filter based on the Month
    const userMonthlyTransactions =
      month != null
        ? userTransactions.filter((item) => item.month == month)
        : null;

    //Filter based on the day
    const userDailyTransactions =
      day != null
        ? userMonthlyTransactions.filter((item) => item.day == day)
        : null;

    //Prepare the Final List of Transactions Based on all the Filters
    const filteredTransactions =
      month != null
        ? day != null
          ? userDailyTransactions
          : userMonthlyTransactions
        : userTransactions;

    res.status(200).json(filteredTransactions);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE TRANSACTION
router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const selTransaction = await Transaction.findById(req.params.id);
    //Verify the User of the Transaction
    req.user.id != selTransaction.userId &&
      res.status(401).json("Not Authorized to Delete this Transaction");
    //Else Delete the Transaction
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json("Transaction Deleted Successfully...!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE TRANSACTION
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const selTransaction = await Transaction.findById(req.params.id);
    const isIncomeTransaction = selTransaction.incomeAmount != 0 ? true : false;
    const objTransaction = isIncomeTransaction
      ? {
          incomeAmount: req.body.transactionAmount,
          expenseAmount: 0,
          paymentType: req.body.paymentType,
        }
      : {
          incomeAmount: 0,
          expenseAmount: req.body.transactionAmount,
          paymentType: req.body.paymentType,
        };
    //Verify the User of the Transaction
    req.user.id != selTransaction.userId &&
      res.status(401).json("Not Authorized to Update this Transaction");

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        $set: objTransaction,
      },
      { new: true }
    );
    res.status(200).json(updatedTransaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
