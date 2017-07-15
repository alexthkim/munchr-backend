var mongoose = require('mongoose');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var fetch = require('node-fetch');
var math = require('mathjs')
var express = require('express');
var router = express.Router();
var models = require('./models/models');
var genInit = require('./algo/generateInitial')
var genResult = require('./algo/generateResult')
var User = models.User;
var Photo = models.Photo;

// Route to login and returns a mongo_db ID for the user
router.post('/login', function(req,res) {
  User.find({fbID: req.body.fbID}, function(err, user) {
    if (err) {
      res.send({success: false});
    } else {
      if (user.length === 0) {
        var params = req.body;
        params.explorePref = 'comfort';
        params.mainPref = [];
        params.sessionPref = [];
        var newUser = new User(params);
        newUser.save(function(err, savedUser) {
          if (err) {
            res.send({success: false});
          } else {
            res.send({success: true, id: savedUser._id});
          }
        })
      } else {
        console.log(user[0]._id);
        res.send({success: true, id: user[0]._id})
      }
    }
  })
});

// Route to generate pictures for the user
// To-do: generate pictures based on past search histories
router.post('/generate/:id', function(req, res) {
  res.send({success: true, cards: genInit()})
})

// Route to get results of swipes for the user
router.post('/results/:id', async (function(req, res) {
  var keywords = [];
  var arrKeys = genResult(req.params.id, req.body.swipes);

  for (var i = 0; i < arrKeys.length; i++) {
    var temp = await (fetch('https://api.yelp.com/v3/businesses/search?latitude=' + req.body.lat + '&longitude=' + req.body.long + '&term=' + arrKeys[i], {
      method: 'GET',
      mode: 'no-cors',
      headers: new fetch.Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Bearer ' + process.env.YELP_AUTH
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      for (var i = 0; i < 3; i++) {
        if (responseJson.businesses[i] !== undefined) {
          keywords.push(responseJson.businesses[i])
        }
      }
    }).catch(function(error) {
      res.send({success:false})
    }));
  }
  if (keywords.length === 0) {
    res.send("No restaurants found")
  } else {
    var rand = math.floor(math.random(keywords.length));
    User.findByIdAndUpdate(req.params.id, {$push: {mainPref: keywords[rand].id}}, function(err, user) {
      if (err) {
        res.send({success: false})
      } else {
        res.send({success: true, restaurant: keywords[rand]});
      }
    })
  }
}))

// Route to obtain pictures for a particular business
router.get('/pictures/:businessid', function(req,res) {
  fetch('https://api.yelp.com/v3/businesses/' + req.params.businessid, {
      method: 'GET',
      mode: 'no-cors',
      headers: new fetch.Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Bearer ' + process.env.YELP_AUTH
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      res.send({success:true, pictures:responseJson.photos})
    }).catch(function(error) {
      console.log("error", error);
    })
})

// Route to obtain profile information for a user
router.get('/profile/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send({success: false})
    } else {
      res.send({success: true, user: user})
    }
  })
})

module.exports = router
