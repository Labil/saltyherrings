/* Takes care of querying db, on behalf of content.js */

function ContentFetcher(db){

	//The constructor needs to be called by the "new" keyword, so that "this" points to the global object
	if((this instanceof ContentFetcher === false)){
		return new ContentFetcher(db); 
	}

	var collection = db.collection("herrings");

	this.getHerrings = function(callback){

		collection.find().toArray(function(err, documents){
		
			if(err) return callback(err, null);
			console.log("Found" + documents.length + " herrings");
			callback(err, documents);
			
		});
	};
	this.saveHerring = function(herring, callback){
		collection.insert(herring, function(err, doc){
			if(err) return callback(err, null);
			console.log("Herring with name: " + doc[0].data.name +" successfully inserted in db");
			return callback(err, doc);
		});

	}
}

module.exports.ContentFetcher = ContentFetcher;