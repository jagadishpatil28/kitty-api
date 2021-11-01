const router = require("express").Router();
const IncomeCategory = require("../models/IncomeCategory");
const { verifyToken, verifyTokenAndAutherization } = require("./verifyToken");

//ADD NEW INCOME CATEGORY
router.post("/add", verifyToken, async (req, res) => {
  //Create new Category Object
  const newCategory = new IncomeCategory({
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

//GET ALL INCOME CATEGORIES OF USER
router.get("/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    const userIncomeCategories = await IncomeCategory.find({
      userId: req.params.id,
    });

    res.status(200).json(userIncomeCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE INCOME CATEGORY
router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const selCategory = await IncomeCategory.findById(req.params.id);
    //Verify the User of the Category
    req.user.id != selCategory.userId &&
      res.status(401).json("Not Authorized to Delete this Category");
    //Else Delete the Category
    await IncomeCategory.findByIdAndDelete(req.params.id);
    res.status(200).json("IncomeCategory Deleted Successfully...!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE INCOME CATEGORY
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const selCategory = await IncomeCategory.findById(req.params.id);
    //Verify the User of the Category
    req.user.id != selCategory.userId &&
      res.status(401).json("Not Authorized to Update this Category");

    const updatedCategory = await IncomeCategory.findByIdAndUpdate(
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
