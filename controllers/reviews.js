const express= require('express');
const router = express.Router({mergeParams: true});
const Recipe = require('../models/recipe');
const ensureLoggedIn = require('../middleware/ensure-logged-in');


//Post a review
router.post('/', ensureLoggedIn, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    const review = {
      user: req.user._id,
      rating: req.body.rating,
      experience: req.body.experience,
    };
    recipe.reviews.push(review);
    await recipe.save();
    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
      console.log(err);
      res.redirect(`/recipes/${req.params.id}`)
  }
});

module.exports = router;