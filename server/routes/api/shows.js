var router = require('express').Router();

var mongoose = require('mongoose');
var Show = mongoose.model('Show');

module.exports = router;

router.get('/', function (req, res, next) {
  Show.find()
    .then(function (shows) {
      res.send(shows);
    })
})

router.post('/', function (req, res, next) {
  console.log(req.body.show)
  Show.create(req.body.show)
    .then(function (show) {
      console.log(show);
      res.send(show);
    })
})
