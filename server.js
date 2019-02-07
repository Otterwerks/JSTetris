var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var leaderBoard = express();

leaderBoard.db = mongojs('JSTetris_server', ['scores']);

leaderBoard.use(bodyParser.urlencoded({extended:false}));
leaderBoard.use(bodyParser.json());

leaderBoard.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "application/json; charset=UTF-8");
  next();
});

leaderBoard.post("/submitScore", function(req, res, next) {
	console.log("Score submitted");
	console.log(req.body);
	if(!req.body.name || !req.body.score) {
		res.send({error:"No name or score submitted"});
		return;
	}
	var name = req.body.name;
	var score = parseInt(req.body.score);
	leaderBoard.db.scores.insert({name:name, score:score}, function(err) {
		if (err) {
			console.log("Could not insert score: " + err);
			res.send({error:"Internal database error"});
			return;
		}
		console.log("Successfully written to database");
		res.send({success:true});
	});
});

leaderBoard.post("/leaderboard", function(req, res, next) {
	console.log("Leaderboard requested");
	leaderBoard.db.scores.find({}, {_id:0}).sort({score:-1}).limit(5, function(err, result) {
		if (err) {
			console.log("Failed to load scores: " + err);
			res.send({error:"Internal database error"});
			return;
		}
		res.json({success:true, "leaderboard": result});
	});
});

var server = leaderBoard.listen(2222, function() {
	console.log('Listening on port %d', server.address().port);
});