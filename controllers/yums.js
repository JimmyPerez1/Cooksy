const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const ensureLoggedIn = require("../middleware/ensure-logged-in");

router.post("/recipes/:id/yums", ensureLoggedIn, async (req, res) => {
  await Recipe.findByIdAndUpdate(req.params.id, {
    $addToSet: { yumedBy: req.user._id },
  });
  res.redirect(`/recipes/${req.params.id}`);
});

router.delete("/recipes/:id/yums", ensureLoggedIn, async (req, res) => {
  await Recipe.findByIdAndUpdate(req.params.id, {
    $pull: { yumedBy: req.user._id },
  });
  res.redirect(`/recipes/${req.params.id}`);
});

module.exports = router;
