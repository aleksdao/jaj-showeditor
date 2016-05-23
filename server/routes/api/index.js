var router = require('express').Router();

module.exports = router;

router.use('/shows', require('./shows'))
