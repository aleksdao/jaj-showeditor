var mongoose = require('mongoose');
var Promise = require('bluebird');

require('./models/event.js');
require('./models/show.js');

var _conn;
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
