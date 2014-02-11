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

///////////////////// Fishbowl //////////////////////////////////////////
var imageMgr = new ImageManager();

//canvas w & h, context, the data from my db, a list of paths for graphics, 
//and names for graphics
var Fishbowl = function(canvasW, canvasH, ctx, data, imgPaths, imgNames){
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.context = ctx;

    this.herringNames = []; //List of names for search function
    this.herrings = []; //Herring objects
    this.loadHerrings(data.herrings);
    this.loadImages(imgPaths, imgNames);
    this.selectedHerring = null;
};

Fishbowl.prototype.searchHerringByName = function(name){
    for(var i = 0; i < this.herringNames.length; i++){
        if(this.herringNames[i] == name) return i;
    }
    return -1;
};

Fishbowl.prototype.getRandomSpawnpoint = function(multiplier){
    var min = 30;
    var max = multiplier - 30;
    var range = max - min;
    var rand = Math.floor((Math.random() * range) + min);
    return rand;
};

//After the images are fully loaded, drawing of screen can begin
Fishbowl.prototype.loadImages = function(imgPaths, imgNames){
    imageMgr.load(imgPaths, imgNames, this.startDrawing.bind(this));
};

Fishbowl.prototype.draw = function(){

    var drawElements = function(arr, context){
        for(var i = 0; i < arr.length; i++){
            arr[i].draw(context);
        }
    };
    this.context.clearRect(0, 0, this.canvasW, this.canvasH);
    drawElements(this.herrings, this.context);

    requestAnimationFrame(this.draw.bind(this)); //to avoid this being window
};

Fishbowl.prototype.startDrawing = function(){
    this.draw();
};

Fishbowl.prototype.loadHerrings = function(herrings){
    for(var i = 0; i < herrings.length; i++){
        this.addHerring(herrings[i].data);
    }
};

Fishbowl.prototype.addHerring = function(herring, xpos, ypos){
    if(xpos == undefined) xpos = this.getRandomSpawnpoint(this.canvasW);
    if(ypos == undefined) ypos = this.getRandomSpawnpoint(this.canvasH);
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
