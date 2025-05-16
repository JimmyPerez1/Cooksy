const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['diet', 'mealType', 'pricePoint', 'difficulty'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Tag", tagSchema);
