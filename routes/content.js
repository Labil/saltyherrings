var ContentFetcher = require('../contentFetcher').ContentFetcher;

function ContentHandler(db, io){
	
	var contentFetcher = new ContentFetcher(db);

	this.displayMainPage = function(req, res, next){


		contentFetcher.getHerrings(function(err, result){

			if(err) return next(err);

			 io.sockets.on('connection', function (socket) {
			 	console.log('A client is connected!');
			   socket.emit('loadHerrings', { herrings: result });

			   socket.on('addHerring', function(data){
			   		contentFetcher.saveHerring(data, function(err, result){
			   			if(err) return next(err);
			   		});
			   });
			 });

			return res.render('index', {
				title: 'Salty Herrings',
				herrings: result
			});
		});
		

	};

}

module.exports = ContentHandler;