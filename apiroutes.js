var mongoose = require('mongoose')
;var express = require('express');
var router = express.Router();
var models = require('./models/models');
var User = models.User;
var Photo = models.Photo

router.post('/login') {
  // Not sure if necessary b/c of facebook Authentication, but we should Check
  // whether or not a user is logged in so that we can create a login wall?
  // Maybe not necessary since this is a mobile app and its actually not possible to
  // bypass the login screen without logging in
}

router.post('/generate/:id', function(req, res) {
  // Input: req.body.setNumber, req.body.cards
  // On set 1 -> generate 5 images
  // On set 2 -> read the first 4 cards, generate the next 5 images
  // On potential set 3 -> read the first 5 cards, generate the next 5 images
  // On potential set 4 -> read the first 5 cards, generate the next 5 images
  // Generate the first 5 pictures based on some heuristic (max of 15 or 20)
  // Set number 1 = random, 2 = based on 1 [mandatory],
  // Set number 3 = based on 2, 4 = based on 3 [optional if our heuristic is unclear]
  // Return either an object containing two things either:
  // {finished: false, images: []} or {finished: true, keywords: []}
})

router.post('/results/:id', function(req, res) {
  // Input: req.body.keywords
  // Generate information about the results based on a search of all the keywords
  // Check if a restaurant is open or closed
  // Multi-language platform (feature)
  // Return all the restaurant information?
})

router.get('/profile/:id', function(req, res) {
  // Data heuristics about their profile
  // Returns user info from mongoose
})

router.get('/logout', function(req,res) {
  // Logout user based on token information?
})

// router.post('/users/register', function(req,res) {
//   var newUser = new User ({
//     fname: req.body.fname,
//     lname: req.body.lname,
//     email: req.body.email,
//     password: req.body.password
//   })
//   newUser.save(function(err, usr) {
//     if (err) {
//       res.json({failure: "database erorr"});
//     } else {
//       res.json({success: true});
//     }
//   })
// });

module.exports = router
