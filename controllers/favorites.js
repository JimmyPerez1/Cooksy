const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const ensureLoggedIn = require("../middleware/ensure-logged-in");

router.get("/favorites", ensureLoggedIn, async (req, res) => {
  const recipes = await Recipe.find({ favoritedBy: req.user._id }).sort(
    "-createdAt"
  );
  res.render("recipes/index.ejs", { recipes, title: "My Favs" });
});

router.post("/recipes/:id/favs", ensureLoggedIn, async (req, res) => {
  await Recipe.findByIdAndUpdate(req.params.id, {
    $addToSet: { favoritedBy: req.user._id },
  });
  res.redirect(`/recipes/${req.params.id}`);
});

router.delete("/recipes/:id/favs", ensureLoggedIn, async (req, res) => {
  await Recipe.findByIdAndUpdate(req.params.id, {
    $pull: { favoritedBy: req.user._id },
  });
  res.redirect(`/recipes/${req.params.id}`);
});

module.exports = router;
