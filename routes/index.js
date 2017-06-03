var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Monster = require('../model');

mongoose.Promise = global.Promise;
mongoose.connect('localhost');


/* GET home page. */
router.get('/', function(req, res) {
	Monster.apiQuery(req.query).exec(function(err, monsters) {
		if(err) {
			console.log(err)
		}
		res.send(monsters);
	});
});

module.exports = router;

