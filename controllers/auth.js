const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6;

// ALL paths start with "/auth"

// Sign Up Form
// GET /auth/sign-up
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs", { error: "" });
});

// POST /auth/sign-up
router.post("/sign-up", async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword)
      throw new Error("Passwords Do Not Match");
    req.body.password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    const user = await User.create(req.body);
    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    // This code will execute if an error happens
    // in the try block above
    if (err.message.includes("duplicate key"))
      err.message = "User Already Exists";
    res.render("auth/sign-up.ejs", { error: err.message });
  }
});

// Return Sign In Form
// GET /auth/sign-in
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs", { error: "" });
});

// POST /auth/sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error();
    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isValidPassword) throw new Error();
    req.session.userId = user._id;
    // TODO: Redirect to what you want in your app
    res.redirect("/");
  } catch {
    res.render("auth/sign-in.ejs", { error: "Invalid Credentials" });
  }
});

// GET /auth/sign-out
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
