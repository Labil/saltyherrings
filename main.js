
//////////////////////////////////////////////////////////////////////////////

// SALTY HERRINGS.

//TODO: 
//      - When click on herring, display name / info (Herring class)
//		- Add resize window event so fishbowl and interface scales
//		- Angular for the app
//		- Make fishbowl canvas 100% with panel displaying on top, with possibility of closing/minimizing
//		- Add side panel to site for info display and name choice & search
//		- Make sprite sheet in stead of separate images.

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

				if(selectedHerring){
					selectedHerring.deselect();
				}
				selectedHerring = fishbowl.herrings[i];
				selectedHerring.select();
				hit = true;
				break;
			}
		}
		if(hit == false){
			if(selectedHerring){
				selectedHerring.deselect();
				selectedHerring = null;
			}
			if(e.clientX < canvasZeroPos + canvas.width 
				&& e.clientX > canvasZeroPos 
				&& e.clientY < canvas.height-marginY 
				&& e.clientY > marginY){
				fishbowl.addHerring(e.clientX - canvasZeroPos, e.clientY);
			}
		}
	}, false);
};

var setupSidePanel = function(){
	panel = document.createElement("div")
	//Attributes for panel set in "saltystyles.css"
	panel.setAttribute("id", "panel");
	document.body.appendChild(panel);
	//Init some variables
	panelW = getElementAttr(panel, "width");
	canvasZeroPos = panelW;
};

//elem is the DOM element, attr is a string attribute
var getElementAttr = function(elem, attr){
	var style = window.getComputedStyle(elem);
	var value = style.getPropertyValue(attr);
	return parseInt(value);
};

var fishbowl = new Fishbowl();
var selectedHerring = null;
var canvas, context, panel;
//window.innerWidth/Height is the most agreed upon (by the different browsers) 
//way of getting the actual window size
var pageW = window.innerWidth;
var pageH = window.innerHeight;
var panelW;
var canvasZeroPos;

setupSidePanel();
setupRenderContext();
fishbowl.addRenderContext(canvas.width, canvas.height, context);
setupEventListeners();
