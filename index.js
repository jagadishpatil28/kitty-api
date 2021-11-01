const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const incomeCategoryRoute = require("./routes/incomeCategory");
const expenseCategoryRoute = require("./routes/expenseCategory");
const transactionRoute = require("./routes/transaction");
const authRoute = require("./routes/auth");
const app = express();

//Configure the .env file to the application
dotenv.config();

//Database Connection with mongoose library
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database Connection Successfull !");
  })
  .catch((err) => {
    console.log(err);
  });

//Start listening to the Requests at some PORT using express Server
app.listen(process.env.PORT || 5000, () => {
  console.log("Backend Server Started Successfully !");
});

//Test the GET Request directly
// app.get("/testapi", (req, res) => {
//   res.send("Test API Connection Successfull");
// });

//Make the Server to Accept the JSON Body content
app.use(express.json());

//Register the different Routes with BasePath
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/incomeCategories", incomeCategoryRoute);
app.use("/api/expenseCategories", expenseCategoryRoute);
app.use("/api/transactions", transactionRoute);
