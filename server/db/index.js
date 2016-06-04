var mongoose = require('mongoose');
var Promise = require('bluebird');
var path = require('path');

require('./models/event.js');
require('./models/show.js');

var _conn;
var DATABASE_URI = require(path.join(__dirname, '../env')).DATABASE_URI;


function connect () {
	if (_conn)
		return _conn
	_conn = new Promise(function (resolve, reject) {
		mongoose.connect('mongodb://localhost/jaj-showeditor', function (err){
			if(err)
				return reject(err);
			resolve(mongoose.connection);
		});
	});
	return _conn;
}

module.exports = {
  connect: connect
}
