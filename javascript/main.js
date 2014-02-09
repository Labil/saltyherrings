
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

		//Don't wanna click behind the panel or panel button
		if(isPanelVisible && e.clientX < panelW) return;
		else if(!isPanelVisible && e.clientX < panelButtonW + 40) return;

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
			hideInfo();
			//Only add herrings when you're allowed! TODO
			/*if(e.clientX < canvas.width 
				&& e.clientX > 0 
				&& e.clientY < canvas.height-marginY 
				&& e.clientY > marginY){
				fishbowl.addHerring(e.clientX, e.clientY);
				selectHerring(fishbowl.herrings[fishbowl.herrings.length-1]);
			}*/
		}
	}, false);
};

var selectHerring = function(herring){
	deselectHerring();
	selectedHerring = herring;
	selectedHerring.select();
	displayInfo(herring);
};

var deselectHerring = function(){
	if(selectedHerring){
		selectedHerring.deselect();
		selectedHerring = null;
	}
};

var displayInfo = function(herring){
	var popup = $('#popup');
	var searchfield = $('#searchfield');
	if(popup.is(':hidden')){
		searchfield.hide();
		popup.fadeIn(200);
	}
	popup.html("<p>Herring  #" + herring.number + "</p>"
		 + "<p>Name: " + herring.name + "</p>"
		 + "<p>Created: " + herring.date + "</p>"
		 + "<p>Country: " + herring.country + "</p>"
		 + "<p>Property: " + herring.property + "</p>");
};

var hideInfo = function(){
	var popup = $('#popup');
	var searchfield = $('#searchfield');
	popup.text("");
	popup.hide();
	searchfield.show();
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
	panelW = panel.width();
	panelButtonW = button.width();
	var xbutton = $('#x');

	button.on('click', function(){
		isPanelVisible = true;
		button.fadeOut(200);
		panel.animate({ width: 'toggle'}, 300);
	});
	xbutton.on('click', function(){
		panel.animate({ width: 'toggle'}, 300);
		button.fadeIn(300);
		isPanelVisible = false;

	});
};

var initSearchField = function(){
	var searchfield = $('#searchfield');
	searchfield.keyup(function (e) {
	    if (e.keyCode == 13) {
	        var found = fishbowl.searchHerringByName(searchfield.val());
			if(found){
				for(var i = 0; i < globalThis.herrings.length; i++){
					if(globalThis.herrings[i].name == searchfield.val()){
						selectHerring(globalThis.herrings[i]);
					}
				}
			}
	    }
	});
	/*searchfield.on('input', function(e){
		var found = fishbowl.searchHerringByName(searchfield.val());
		console.log(found);
	});*/
};

var addHerring = function(herring){
	socket.emit('addHerring', { data: herring });
};

var fishbowl;
var selectedHerring = null;
var canvas, context;
var panelW,panelButtonW;
var isPanelVisible = false;

var socket = io.connect('http://localhost:5000');
socket.on('loadHerrings', function (data) {
 
  //To prevent it from loading twice
  if(fishbowl == undefined){
  	fishbowl = new Fishbowl(data);

  	setupRenderContext();
  	fishbowl.addRenderContext(canvas.width, canvas.height, context);
  	setupEventListeners();
  	initPanel();
  	initSearchField();
  }
  
  //socket.emit('my other event', { my: 'data' });
});


/*$(function() {

	fishbowl = new Fishbowl();

	setupRenderContext();
	fishbowl.addRenderContext(canvas.width, canvas.height, context);
	setupEventListeners();
	initPanel();

});
*/

