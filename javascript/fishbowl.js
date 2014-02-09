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

var Fishbowl = function(data){
    console.log("new fishbowl");
    this.herringNames = [];
    this.herrings = [];

    for(var i = 0; i < data.herrings.length; i++){
        this.addHerring(data.herrings[i], 300, 300);
    }
    this.selectedHerring = null;
    this.setup();
    globalThis = this;
};

Fishbowl.prototype.searchHerringByName = function(name){
    for(var i = 0; i < this.herringNames.length; i++){
        console.log("Looking for: " + this.herringNames[i]);
        if(this.herringNames[i] == name){
            console.log("Found name: " + name);
            return true;
        }
    }
    return false;
};

Fishbowl.prototype.setup = function(){
    var imgPaths = ["assets/salty1.png", "assets/salty2.png", "assets/salty1_selected.png", "assets/salty2_selected.png"];
    var imgNames = ["Herring", "Herring_left", "Herring_sel", "Herring_left_sel"];
    var thisArg = this;
    imageMgr.load(imgPaths, imgNames, function(){
        thisArg.start();        
    }); 
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

    this.context.clearRect(0, 0, globalThis.canvasW, globalThis.canvasH);
    drawElements(globalThis.herrings, globalThis.context);

    requestAnimationFrame(globalThis.draw);
};

Fishbowl.prototype.start = function(){
    console.log("Starting");
    this.draw();
};

Fishbowl.prototype.addHerring = function(herring, xpos, ypos){
    var rand = Math.random();
    if(rand <= 0.4) rand += 0.5;
    //157 and 60 is w & h of png. CBA to make variables.
    var hW = 157 * rand;
    var hH = 60 * rand;
    var hX = xpos - hW / 2;
    var hY = ypos - hH / 2; 
    //Saves an array of the herring names to be used for searching
    this.herringNames.push(herring.name);
    this.herrings.push(new Herring(herring, hX, hY, rand, hW, hH, this.canvasW));
};
