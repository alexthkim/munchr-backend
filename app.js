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

var apiroutes = require('./apiroutes');
app.use('/api', apiroutes);

app.listen(3000);
