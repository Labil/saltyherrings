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

//TODO: - Sort herrings array by size of herrings, so the smaller gets drawn first(behind) ?
//      - When click on herring, display name / info (Herring class)
//		- Random name generator (Herring class)
// 		- Random quality assignement (Herring class)
//		- Limit spawn points to canvas V
//		- Add side panel to site for info display and name choice & search
//		- Scale fishbowl to certain percent of screen, with panel on side
//		- Make sprite sheet in stead of separate images.

var globalThis; //Lol. TODO: Solve this hack
var imageMgr = new ImageManager();

var Fishbowl = function(){
	console.log("new fishbowl");
	this.herrings = [];
	this.selectedHerring = null;
	this.setup();
	globalThis = this;
};

Fishbowl.prototype.setup = function(){
	this.setupRenderContext(800, 400);

	imageMgr.load("assets/salty1.png", "Herring");
	imageMgr.load("assets/salty2.png", "Herring_left");
	imageMgr.load("assets/salty1_selected.png", "Herring_sel");
	imageMgr.load("assets/salty2_selected.png", "Herring_left_sel");


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
	//Other starting code, like connecting to db etc
	this.draw();
};

Fishbowl.prototype.setupEventListeners = function(thisref){
	var margin = 20;
	window.addEventListener("mousedown", function(evt){
		var hit = false;
		for(var i = 0; i < thisref.herrings.length; i++){
			var hW = thisref.herrings[i].w;
			var hH = thisref.herrings[i].h;
			var hX = thisref.herrings[i].xPos;
			var hY = thisref.herrings[i].yPos;

			if(evt.clientX > hX && evt.clientX < hX + hW && evt.clientY > hY && evt.clientY < hY + hH){
				if(thisref.selectedHerring){
					thisref.selectedHerring.deselect();
					thisref.selectedHerring = null;
				}
				thisref.herrings[i].select();
				thisref.selectedHerring = thisref.herrings[i];
				hit = true;
				break;
			}
		}
		if(hit == false){
			if(thisref.selectedHerring){
				thisref.selectedHerring.deselect();
				thisref.selectedHerring = null;
			}
			if(evt.clientX < thisref.canvas.width-margin && evt.clientX > margin && evt.clientY < thisref.canvas.height-margin && evt.clientY > margin){
				console.log("Inside canvas click");
				thisref.addHerring(evt.clientX, evt.clientY);
			}
		}
	}, false);
};

Fishbowl.prototype.addHerring = function(xpos, ypos){
	var rand = Math.random();
	if(rand <= 0.4) rand += 0.5;
	//157 and 60 is w & h of png. CBA to make varables.
	var hW = 157 * rand;
	var hH = 60 * rand;
	var hX = xpos - hW / 2;
	var hY = ypos - hH / 2; 
	this.herrings.push(new Herring(hX, hY, rand, hW, hH, this.canvas.width));
};
