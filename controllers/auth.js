const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6;

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs", { error: "" });
});

router.post("/sign-up", async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword)
      throw new Error("Passwords Do Not Match");
    req.body.password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    const user = await User.create(req.body);
    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {

    if (err.message.includes("duplicate key"))
      err.message = "User Already Exists";
    res.render("auth/sign-up.ejs", { error: err.message });
  }
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs", { error: "" });
});

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
  
    res.redirect("/");
  } catch {
    res.render("auth/sign-in.ejs", { error: "Invalid Credentials" });
  }
});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
