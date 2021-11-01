const router = require("express").Router();
const ExpenseCategory = require("../models/ExpenseCategory");
const { verifyToken, verifyTokenAndAutherization } = require("./verifyToken");

//ADD NEW EXPENSE CATEGORY
router.post("/add", verifyToken, async (req, res) => {
  //Create new Category Object
  const newCategory = new ExpenseCategory({
    categoryName: req.body.categoryName,
    userId: req.body.userId,
  });

  //Save the New Category to the Database
  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL EXPENSE CATEGORIES OF USER
router.get("/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    const userExpenseCategories = await ExpenseCategory.find({
      userId: req.params.id,
    });

    res.status(200).json(userExpenseCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE EXPENSE CATEGORY
router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const selCategory = await ExpenseCategory.findById(req.params.id);
    //Verify the User of the Category
    req.user.id != selCategory.userId &&
      res.status(401).json("Not Authorized to Delete this Category");
    //Else Delete the Category
    await ExpenseCategory.findByIdAndDelete(req.params.id);
    res.status(200).json("ExpenseCategory Deleted Successfully...!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE EXPENSE CATEGORY
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const selCategory = await ExpenseCategory.findById(req.params.id);
    //Verify the User of the Category
    req.user.id != selCategory.userId &&
      res.status(401).json("Not Authorized to Update this Category");

    const updatedCategory = await ExpenseCategory.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
