var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

var app = express();

var chalk = require('chalk');
var util = require('util');

var db = require('./db')

app.use(bodyParser.json());

app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));
app.use(express.static(path.join(__dirname, '../browser')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', require('./routes/api'));

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../../browser/index.html'));
})



module.exports = app;
