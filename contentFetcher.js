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
}

module.exports.ContentFetcher = ContentFetcher;