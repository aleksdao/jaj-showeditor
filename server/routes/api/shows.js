var router = require('express').Router();

var mongoose = require('mongoose');
var Show = mongoose.model('Show');

module.exports = router;

router.get('/', function (req, res, next) {
  Show.find()
    .then(function (shows) {
      console.log(shows);
      res.send(shows);
    }, next);
});

router.get('/:id', function (req, res, next) {
  Show.findById(req.params.id)
    .then(function (show) {
      res.send(show);
    }, next);
});

router.post('/', function (req, res, next) {
  console.log(req.body.show)
  Show.create(req.body.show)
    .then(function (show) {
      console.log(show);
      res.send(show);
    }, next);
});
