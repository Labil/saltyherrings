// The Salty Herring
var Herring = function(herring, xPos, yPos, speed, w, h, canvasW) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.w = w;
    this.h = h;
    this.canvasW = canvasW;
    this.selected = false;
    this.type = 'Herring';
    this.property = herring.property;
    this.name = herring.name;
    this.number = herring.number;
    this.date = herring.date;
    this.city = herring.city;

    //Set initial flipout to 2 so that if the fish is spawned 
    //near the edge it won't flip around and swim the wrong way
    this.flipTimeout = 2;
    //Make the herring swim in the direction there is most space 
    var halfW = canvasW / 2;
    if(xPos <= halfW) this.speed = speed;
    else this.speed = -speed;
};

Herring.prototype.select = function(){
    this.selected = true;
    if(this.speed < 0) this.type = 'Herring_left_sel';
    else this.type = 'Herring_sel';
};

Herring.prototype.deselect = function(){
    this.selected = false;
    if(this.speed < 0) this.type = 'Herring_left';
    else this.type = 'Herring';
};

// draw functions
Herring.prototype.draw = function(context) {
    this.swim();
    if(this.selected){
        if(this.speed < 0){
            this.type = "Herring_left_sel";
        }
        else this.type = "Herring_sel";    
    }
    else{
        if(this.speed < 0){
            this.type = "Herring_left";
        }
        else this.type = "Herring";

    }
    
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
