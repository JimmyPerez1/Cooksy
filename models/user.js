const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    required: true,
  },
	image: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
