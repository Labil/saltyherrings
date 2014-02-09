//var apptitle = 'Salty Herrings';
var port = '5000';
var express = require('express');
var app = express();
var cons = require('consolidate');
var MongoClient = require('mongodb').MongoClient; //driver
var routes = require('./routes'); //index.js takes care of routing
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
	'mongodb://localhost:27017/salty';

MongoClient.connect(mongoUri, function(err, db){
	if(err) throw err;

	app.engine('html', cons.swig);
	app.set('port', process.env.PORT || port); //NEW idag
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');

	//app.use(express.bodyParser());
	app.use('/css', express.static(__dirname + "/css"));
	app.use('/javascript', express.static(__dirname + "/javascript"));
	app.use('/assets', express.static(__dirname + "/assets"));
	//app.use(express.static(__dirname + '/public'));

	routes(app, db, io);
	

	server.listen(app.get('port'), function(){
		console.log("Express server up and running");
	});
	//app.listen(process.env.PORT || port);

	//console.log('Express server up and running');

});
