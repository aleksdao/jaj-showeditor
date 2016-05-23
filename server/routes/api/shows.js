var router = require('express').Router();

var mongoose = require('mongoose');
var Show = mongoose.model('Show');

module.exports = router;

router.post('/', function (req, res, next) {
  console.log(req.body.show)
  Show.create(req.body.show)
    .then(function (show) {
      console.log(show);
      res.send(show);
    })
})
