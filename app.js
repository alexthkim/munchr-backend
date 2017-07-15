"use strict";

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
//var User = require('./models/models.js');

mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var apiroutes = require('./apiroutes');
app.use('/api', apiroutes);

var port = process.env.PORT || 3000
app.listen(port);
