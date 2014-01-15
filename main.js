// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

//////////////////////////////////////////////////////////////////////////////

// SALTY HERRINGS.

//Next TODO: Make fish turn!

var globalThis; //Lol. TODO: Solve this hack
var imageMgr = new ImageManager();

var Fishbowl = function(){
	console.log("new fishbowl");
	this.herrings = [];
	this.setup();
	globalThis = this;
};

Fishbowl.prototype.setup = function(){
	this.setupRenderContext(800, 600);

	imageMgr.load("assets/salty1.png", "Herring");
	imageMgr.load("assets/salty2.png", "Herring_left");

	var waitForImagesToLoad = function(){
		if(!imageMgr.isFinishedLoading()){
			console.log("Loading images...");
		}
		else{
			clearInterval(intervalId);
			this.setupEventListeners(this);
			this.start();
		}
	};

	var boundWait = waitForImagesToLoad.bind(this);
	var intervalId = setInterval(boundWait, 500); 
};

Fishbowl.prototype.setupRenderContext = function(w, h){
	this.canvas = document.createElement("canvas");
	this.canvas.width = w;
	this.canvas.height = h;
	document.body.appendChild(this.canvas);

	this.context = this.canvas.getContext("2d");
};

Fishbowl.prototype.draw = function(){
	console.log("Drawing");
	var drawElements = function(arr, context){
		for(var i = 0; i < arr.length; i++){
			arr[i].draw(context);
		}
	};

	globalThis.context.clearRect(0, 0, globalThis.canvas.width, globalThis.canvas.height);
	drawElements(globalThis.herrings, globalThis.context);

	requestAnimationFrame(globalThis.draw);
};

Fishbowl.prototype.start = function(){
	console.log("Starting");
	//Other starting code, like connecting to db etc
	this.draw();
};

Fishbowl.prototype.setupEventListeners = function(thisref){
	window.addEventListener("mousedown", function(evt){
		thisref.addHerring(evt.clientX, evt.clientY);
	}, false);
};

Fishbowl.prototype.addHerring = function(xpos, ypos){
	var rand = Math.random();
	if(rand <= 0.4) rand += 0.5;
	this.herrings.push(new Herring(xpos, ypos, rand, 157 * rand , 60 * rand, this.canvas.width));
};
