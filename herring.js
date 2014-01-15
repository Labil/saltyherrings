// The Salty Herring
var Herring = function(xPos, yPos, speed, w, h) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.type = 'Herring';
};

// draw functions
Herring.prototype.draw = function(context) {

    this.xPos += this.speed;
    context.drawImage(imageMgr.getImage(this.type), this.xPos, this.yPos, this.w, this.h);
};
