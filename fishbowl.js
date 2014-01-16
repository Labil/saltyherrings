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
    //this.setupRenderContext(800, 400);

    imageMgr.load("assets/salty1.png", "Herring");
    imageMgr.load("assets/salty2.png", "Herring_left");
    imageMgr.load("assets/salty1_selected.png", "Herring_sel");
    imageMgr.load("assets/salty2_selected.png", "Herring_left_sel");


    var waitForImagesToLoad = function(){
        //Waits for images to finish loading and for the context being passed from the main app
        if(!imageMgr.isFinishedLoading() || !this.context){
            console.log("Loading images...");
        }
        else{
            clearInterval(intervalId);
            this.start();
        }
    };

    var boundWait = waitForImagesToLoad.bind(this);
    var intervalId = setInterval(boundWait, 500); 
};

Fishbowl.prototype.addRenderContext = function(w, h, ctx){
    this.canvasW = w;
    this.canvasH = h;
    this.context = ctx;
};

Fishbowl.prototype.draw = function(){
    var drawElements = function(arr, context){
        for(var i = 0; i < arr.length; i++){
            arr[i].draw(context);
        }
    };

    globalThis.context.clearRect(0, 0, globalThis.canvasW, globalThis.canvasH);
    drawElements(globalThis.herrings, globalThis.context);

    requestAnimationFrame(globalThis.draw);
};

Fishbowl.prototype.start = function(){
    this.draw();
};

Fishbowl.prototype.addHerring = function(xpos, ypos){
    var rand = Math.random();
    if(rand <= 0.4) rand += 0.5;
    //157 and 60 is w & h of png. CBA to make varables.
    var hW = 157 * rand;
    var hH = 60 * rand;
    var hX = xpos - hW / 2;
    var hY = ypos - hH / 2; 
    this.herrings.push(new Herring(hX, hY, rand, hW, hH, this.canvasW));
};
