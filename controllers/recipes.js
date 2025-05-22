const express = require("express");
const router = express.Router();
const Recipes = require("../models/recipe");
const ensureLoggedIn = require("../middleware/ensure-logged-in");
const reviewRoutes = require("./reviews");
const recipe = require("../models/recipe");

router.get("/", async (req, res) => {
  const recipes = await Recipes.find({}).sort("-createdAt");

  const updatedRecipes = recipes.map((recipe) => {
    const totalReviews = recipe.reviews.length;
    const totalRating = recipe.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating = totalReviews
      ? (totalRating / totalReviews).toFixed(1)
      : null;

    return {
      ...recipe.toObject(),
      avgRating,
      totalReviews,
    };
  });

  res.render("recipes/index.ejs", {
    recipes: updatedRecipes,
    title: "GLOBAL COOKBOOK",
  });
});

router.get("/new", ensureLoggedIn, (req, res) => {
  res.render("recipes/new.ejs");
});

router.post("/", ensureLoggedIn, async (req, res) => {
  try {
    req.body.createdBy = req.user._id;

    req.body.ingredients = req.body.ingredients
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    req.body.directions = req.body.directions
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    await Recipes.create(req.body);
    res.redirect("/recipes");
  } catch (err) {
    console.log(err);
    res.redirect("/recipes/new");
  }
});

router.get("/:id", async (req, res) => {
  const recipe = await Recipes.findById(req.params.id)
    .populate("createdBy")
    .populate("yumedBy.user")
    .populate("favoritedBy.user")
    .populate("reviews.user");
  const isYumed = recipe.yumedBy.some((id) => id.equals(req.user?._id));
  const isFavored = recipe.favoritedBy.some((id) => id.equals(req.user?._id));
  res.render("recipes/show.ejs", {
    recipe,
    isYumed,
    isFavored,
    currentUser: req.user,
  });
});

router.delete("/:id", ensureLoggedIn, async (req, res) => {
  await Recipes.findByIdAndDelete(req.params.id);
  res.redirect("/recipes");
});

router.get("/:id/edit", ensureLoggedIn, async (req, res) => {
  const recipe = await Recipes.findById(req.params.id);
  res.render("recipes/edit.ejs", { recipe });
});

router.put("/:id", async (req, res) => {
  const recipe = await Recipes.findById(req.params.id);
  Object.assign(recipe, req.body);
  await recipe.save();
  res.redirect(`/recipes/${recipe._id}`);
});

module.exports = router;
