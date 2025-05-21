const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// Get /users
router.get('/', async (req, res) => {
  const users = await User.find({})
    res.render('users/index.ejs', { users })
})

// Show users
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  const recipes = await Recipe.find({ createdBy: user._id}) 
  res.render('users/show.ejs', { user, recipes });
})



module.exports = router;