// The Salty Herring
var Herring = function(xPos, yPos, w, h) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.w = w;
    this.h = h;
    this.type = 'Herring';
};

// draw functions
Herring.prototype.draw = function(context) {
    context.drawImage(imageMgr.getImage(this.type), this.xPos, this.yPos, this.w, this.h);
};
