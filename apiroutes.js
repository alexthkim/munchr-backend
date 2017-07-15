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
        newUser.save(function(err) {
          if (err) {
            res.send({success: false});
          } else {
            res.send({success: true, id: newUser._id});
          }
        })
      } else {
        res.send({success: true, id: user._id})
      }
    }
  })
});

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

router.post('/generate/:id', function(req, res) {
  res.send({success: true, cards: genInit()})
  // var setNum = req.body.setNumber;
  // if (setNum === 1) {
  //   return generateInitial(req.query.id);
  // } else (setNum === 2) {
  //   return generateAndAnalyze(req.query.id, req.body.cards)
  // }
})

router.post('/results/:id', async (function(req, res) {
  var keywords = [];
  console.log(req.body.swipes);
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
