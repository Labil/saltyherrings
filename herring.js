// The Salty Herring
var Herring = function(xPos, yPos, speed, w, h, canvasW) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.w = w;
    this.h = h;
    this.canvasW = canvasW;
    this.type = 'Herring';
    //Set initial flipout to 2 so that if the fish is spawned 
    //near the edge it won't flip around and swim the wrong way
    this.flipTimeout = 2;
    var halfW = canvasW / 2;
    //Make the herring swim in the direction there is most space 
    if(xPos <= halfW) this.speed = speed;
    else this.speed = -speed;
};

// draw functions
Herring.prototype.draw = function(context) {
    this.swim();
    if(this.speed < 0){
        this.type = "Herring_left";
    }
    else this.type = "Herring";
    context.drawImage(imageMgr.getImage(this.type), this.xPos, this.yPos, this.w, this.h);
};

Herring.prototype.swim = function(){
    var movement = this.xPos + this.speed;
    if(this.flipTimeout <= 0){
        if(movement + this.w >= this.canvasW || movement <= 0){
            this.flipTimeout = 5;
            this.speed = -this.speed;
        }
    }
    else this.flipTimeout -= 0.01;
    this.xPos += this.speed;
};
