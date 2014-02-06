
//////////////////////////////////////////////////////////////////////////////

// SALTY HERRINGS.

//TODO: 
//      - When click on herring, display name / info (Herring class)
//		- Add resize window event so fishbowl and interface scales
//		- Add side panel to site for info display and name choice & search
//		- Make sprite sheet in stead of separate images.

var setupRenderContext = function(){
	canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//canvas.width = $(window).width();
	//canvas.height = $(window).height();
	canvas.setAttribute("class", "canvas");
	document.body.appendChild(canvas);

	context = canvas.getContext("2d");
};

var setupEventListeners = function(){
	//Slight margin on Y axis so the herrings aren't placed outside the window
	var marginY = 20;
	window.addEventListener("mousedown", function(e){

		var hit = false;
		for(var i = 0; i < fishbowl.herrings.length; i++){
			var hW = fishbowl.herrings[i].w;
			var hH = fishbowl.herrings[i].h;
			var hX = fishbowl.herrings[i].xPos;
			var hY = fishbowl.herrings[i].yPos;

			if(e.clientX > hX 
				&& e.clientX < hX + hW 
				&& e.clientY > hY 
				&& e.clientY < hY + hH){

				selectHerring(fishbowl.herrings[i]);
				hit = true;
				break;
			}
		}
		if(hit == false){
			deselectHerring();

			if(e.clientX < canvas.width 
				&& e.clientX > 0 
				&& e.clientY < canvas.height-marginY 
				&& e.clientY > marginY){
				fishbowl.addHerring(e.clientX, e.clientY);
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
	//info.innerHTML = "<p>Hi my property is: " + selectedHerring.property + "</p>"; 
	//app.info = "Hi my property is: " + selectedHerring.property;
};

var deselectHerring = function(){
	if(selectedHerring){
		selectedHerring.deselect();
		selectedHerring = null;
		//info.innerHTML = "<p>Use the search bar to lookup a salty herring by name, or click on the ones swimming around in the tank!</p>";
	}
};

//elem is a DOM element, attr is a string attribute
var getElementAttr = function(elem, attr){
	var style = window.getComputedStyle(elem);
	var value = style.getPropertyValue(attr);
	return parseInt(value);
};

var initPanel = function(){
	var button = $('#panelbutton');
	var panel = $('#panel');
	var xbutton = $('#x');
	button.on('click', function(){
		button.fadeOut(200);
		panel.animate({ width: 'toggle'}, 300);
	});
	xbutton.on('click', function(){
		panel.animate({ width: 'toggle'}, 300);
		button.fadeIn(300);

	});
};

var initPopup = function(){

};

var fishbowl;
var selectedHerring = null;
var canvas, context;
var panelW, panelH;

$(function() {
	fishbowl = new Fishbowl();

	setupRenderContext();
	fishbowl.addRenderContext(canvas.width, canvas.height, context);
	setupEventListeners();
	initPanel();

});


