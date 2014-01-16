
//////////////////////////////////////////////////////////////////////////////

// SALTY HERRINGS.

//TODO: 
//      - When click on herring, display name / info (Herring class)
//		- Add resize window event so fishbowl and interface scales
//		- Angular for the app
//		- Make fishbowl canvas 100% with panel displaying on top, with possibility of closing/minimizing
//		- Add side panel to site for info display and name choice & search
//		- Make sprite sheet in stead of separate images.

var app = angular.module('app', []);

app.controller('AppCtrl', function(){
	
	this.defaultMsg = "Use the search bar to lookup a salty herring by name, or click on the ones swimming around in the tank!";
	//The info message changes, default set to defaultMsg:
	this.info = this.defaultMsg;
	this.searchDefault = "Search for herring";
	this.name = "Name"; //Make sure valid name can't be "Name"

});

var setupRenderContext = function(){
	var chopOff = 50;
	canvas = document.createElement("canvas");
	canvas.width = pageW - panelW - chopOff;
	canvas.height = pageH;
	canvas.setAttribute("class", "canvas");
	document.body.appendChild(canvas);

	context = canvas.getContext("2d");
};

var setupEventListeners = function(){
	var marginY = 20;
	window.addEventListener("mousedown", function(e){
		var hit = false;
		for(var i = 0; i < fishbowl.herrings.length; i++){
			var hW = fishbowl.herrings[i].w;
			var hH = fishbowl.herrings[i].h;
			var hX = fishbowl.herrings[i].xPos;
			var hY = fishbowl.herrings[i].yPos;

			if(e.clientX > hX + canvasZeroPos 
				&& e.clientX < hX + canvasZeroPos + hW 
				&& e.clientY > hY 
				&& e.clientY < hY + hH){

				selectHerring(fishbowl.herrings[i]);
				hit = true;
				break;
			}
		}
		if(hit == false){
			deselectHerring();

			if(e.clientX < canvasZeroPos + canvas.width 
				&& e.clientX > canvasZeroPos 
				&& e.clientY < canvas.height-marginY 
				&& e.clientY > marginY){
				fishbowl.addHerring(e.clientX - canvasZeroPos, e.clientY);
				selectHerring(fishbowl.herrings[fishbowl.herrings.length-1]);
			}
		}
	}, false);
};

var selectHerring = function(herring){
	deselectHerring();
	selectedHerring = herring;
	selectedHerring.select();
	//console.log(info.getElementsByTagName('p'));
	info.innerHTML = "<p>Hi my property is: " + selectedHerring.property + "</p>"; 
	//app.info = "Hi my property is: " + selectedHerring.property;
};

var deselectHerring = function(){
	if(selectedHerring){
		selectedHerring.deselect();
		selectedHerring = null;
		info.innerHTML = "<p>Use the search bar to lookup a salty herring by name, or click on the ones swimming around in the tank!</p>";
	}
};

var setupSidePanel = function(){
	//Init some variables
	panel = document.getElementById('panel');
	panelW = getElementAttr(panel, "width");
	canvasZeroPos = panelW;
	info = document.getElementById("info");
};

//elem is a DOM element, attr is a string attribute
var getElementAttr = function(elem, attr){
	var style = window.getComputedStyle(elem);
	var value = style.getPropertyValue(attr);
	return parseInt(value);
};

var fishbowl;
var selectedHerring = null;
var canvas, context, panel, info;
//window.innerWidth/Height is the most agreed upon (by the different browsers) 
//way of getting the actual window size
var pageW = window.innerWidth;
var pageH = window.innerHeight;
var panelW;
var canvasZeroPos;

$(function() {
	fishbowl = new Fishbowl();

	setupSidePanel();
	setupRenderContext();
	fishbowl.addRenderContext(canvas.width, canvas.height, context);
	setupEventListeners();
});


