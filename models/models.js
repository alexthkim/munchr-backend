"use strict";

var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
  url: String,
  timeOfDay: {
    type: String,
    enum: ["b", "l", "d", "s"]
  }
})

var userSchema = mongoose.Schema({
  fname: String,
  lname: String,
  photoUrl: String,
  email: String,
  mainPref: Array,
  sessionPref: Array,
  explorePref: {
    type: String,
    enum: ["comfort","exploring"]
  }
})

var restCategorySchema = mongoose.Schema({
  restCateogry: String,
  foods: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Food' }]
})

var cuisineSchema = mongoose.Schema({
  cuisine: String,
  foods: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Food' }]
})

var Food = mongoose.model('Food', foodSchema);
var User = mongoose.model('User', userSchema);
var restCategory = mongoose.model('RestCategory', restCategorySchema);
var Cuisine = mongoose.model('FoodCategory', cuisineSchema);

module.exports = {
  Food: Food,
  User: User,
  restCategory: restCategory,
  Cuisine: Cuisine
}
