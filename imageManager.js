
var ImageManager = function(){
	//Holds all your loaded images
	this.library = {};
}

//TODO: make it so that the names is extracted from the paths?

//Takes an array of pathnames or a single path, a name array/single 
//name and a callback fnction to run after images has loaded
ImageManager.prototype.load = function(paths, names, callback){

    /*if((typeof path) == String){
        console.log("Loading just one image.");

    }*/
    console.log("Names array length: " + names.length);

    var alreadyLoaded = function(name){
    	if(this.library[name]){
    		console.log("Image with name: " + name + " already exists.");
    		return true;
    	}
    	else{
    		return false;
    	}
    }.bind(this);

    var loadImage = function(imgPath, imgName, cb){ 
        if(!alreadyLoaded(imgName)){
        	var img = new Image();
        	img.onload = function() {
        	    console.log("Loaded image named " + imgName);
        	    cb(imgName, img);
        	};
        	img.src = imgPath;
        }
    };

    var imgLoadCount = 0;
    var thisArg = this;

    for(var i = 0; i < paths.length; i++){
        var nm = names[i];
        var pth = paths[i];
        loadImage(pth, nm, function(imgName, img){
            thisArg.library[imgName] = img;
            imgLoadCount++;

            if(imgLoadCount >= paths.length){
                console.log("Done loading images!");
                callback();
            }
        });  
    }
    
};

ImageManager.prototype.getImage = function(name){
	if(this.library[name]){
		return this.library[name];
	}
	else{
		console.log("The image of name: " + name + " doesn't exist yet.");
		return null;
	}
};
