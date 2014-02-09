/* Takes care of what happens when user accesses different pages*/

var ContentHandler = require('./content');

module.exports = exports = function(app, db, io){


	var contentHandler = new ContentHandler(db, io);
	
	app.get('/', contentHandler.displayMainPage);

}