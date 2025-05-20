const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// Get users
router.get('/', async (req, res) => {
  const users = await User.find({})
    res.render('users/index.ejs', {users})
})


module.exports = router;