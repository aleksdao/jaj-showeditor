var http = require('http');
var db = require('./server/db');
var chalk = require('chalk');

var server = http.createServer(require('./server/app'));

db.connect()
  .then(function (conn){
    console.log(chalk.green(conn.name));
    var port = process.env.PORT || 1337;
    server.listen(port, function (){
      console.log(`listening on ${port}`);
    });
  }, function (err){
    console.log(chalk.red(err));
  });

var request = require('request');
var cheerio = require('cheerio');
var url = 'https://songbpm.com/x-ambassadors/renegades';

request(url, function (error, response, body) {
  if (!error) {
    var $ = cheerio.load(body);
    var bpm = $("#search-results .number").html()
    console.log(bpm);
  }
  else {
    console.log('error');
  }
})
