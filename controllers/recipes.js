const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipe')

const ensureLoggedIn = require('../middleware/ensure-logged-in');

// router.use(ensureLoggedIn);

// ALL paths start with '/recipes'

// index action /recipes
router.get('/', async (req, res) => {
  const recipes = await Recipes.find({}).sort('-createdAt');
  res.render('recipes/index.ejs', { recipes, title : 'GLOBAL COOKBOOK'})
});

// new action GET /recipes/new
router.get('/new', ensureLoggedIn, (req, res) => {
  res.render('recipes/new.ejs');
});

// create action POST /recipes
router.post('/', ensureLoggedIn, async (req, res) => {
  try {
  req.body.createdBy = req.user._id;

  req.body.ingredients = req.body.ingredients
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  req.body.directions = req.body.directions
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

    await Recipes.create(req.body);
    res.redirect('/recipes');
  } catch (err) {
    console.log(err);
    res.redirect('/recipes/new')
  }
});

// show GET /recipes/:id
router.get('/:id', async (req, res) => {
  const recipe = await Recipes.findById(req.params.id)
    .populate('createdBy')
    .populate('yumedBy.user')
    .populate('favoritedBy.user')
    .populate('reviews')
  const isYumed = recipe.yumedBy.some((id) => id.equals(req.user?._id));
  const isFavored = recipe.favoritedBy.some((id) => id.equals(req.user?._id));
  res.render('recipes/show.ejs', { recipe, isYumed, isFavored })
})














module.exports = router;