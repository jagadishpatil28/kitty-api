const router = require("express").Router();
const User = require("../models/User");
const {
  verifyTokenAndAutherization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//Test GET API
// router.get("/testgetapi", (req, res) => {
//   res.send("GET request Successfull !");
// });

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...otherFields } = user._doc;

    res.status(200).json(otherFields);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE USER
router.delete("/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User Deleted Successfully...!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE USER
router.put("/:id", verifyTokenAndAutherization, async (req, res) => {
  //If the User is trying to Update the Password, Encrypt it before Updation
  if (req.body.password) {
    req.body.password = CryptoJS.AES.decrypt(
      req.body.password,
      process.env.PASSWORD_KEY
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
