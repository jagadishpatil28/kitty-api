const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER NEW USER
router.post("/register", async (req, res) => {
  //Create new User Object
  const newUser = new User({
    userName: req.body.userName,
    googleUserId: req.body.googleUserId,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_KEY
    ).toString(),
    mobileNumber: req.body.mobileNumber,
  });

  //Save the New User to the Database
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN USER
router.post("/login", async (req, res) => {
  try {
    //Find the User with UserName
    const user = await User.findOne({ userName: req.body.userName });

    //If User Not Found, Respond back with an Error Message
    !user && res.status(401).json("Wrong User Credentials !");

    //If the User Found, Compare the Entered Password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_KEY
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    //If the Passwoed does not Match, Respond with an Error Message
    originalPassword != req.body.password &&
      res.status(401).json("Wrong Password !");

    //Create an Access token to be Returned along with the Logged User Object
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    //Remove the Password Field From the User object & Send the Remaining as a Response
    const { password, ...otherFields } = user._doc;
    res.status(200).json({ ...otherFields, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
