const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true 
	},
	rating: {
		type: Number,
		min: 0,
		max: 5,
		required: true
	},
	experience: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

const recipeSchema = new Schema({
    
	name: {
    type: String,
    required: true,
  },
	image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  directions: {
    type: String,
    required: true,
  },
	createdBy: {
    type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
  },
	yumedBy: {
    type: [Schema.Types.ObjectId],
		ref: 'User'
  },
	 favoritedBy: {
    type: [Schema.Types.ObjectId],
		ref: 'User'
  },
  	 tags: {
    type: [Schema.Types.ObjectId],
		ref: 'Tag'
  },
	reviews: [reviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model("Recipe", recipeSchema);
