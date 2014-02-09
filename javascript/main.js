
//////////////////////////////////////////////////////////////////////////////

// SALTY HERRINGS.

//TODO: 
//		- Add resize window event so fishbowl and interface scales
//		- Make sprite sheet in stead of separate images.
//		- Make the size fit all screen types. On resize event too.
//		- Add description on naming rule / some tooltip that 
//		  informs the user if they have chosen an invalid name
//		- Add cookies to remember user and prevent them from adding > 1 herring
//		- Display stats about what country the herrings are from. etc
//		- Add more properties fro the herrings
//		- Remake design of popup info
//		- Refactor code quite a bit... and remove some (all) of the globals
//		- Change graphics on select

var setupRenderContext = function(){
	canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	//making it slightly shorter than the windowheight to account for bookmarks bar
	canvas.height = window.innerHeight - 60;
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
		 + "<p>City of origin: " + herring.city + "</p>"
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
			searchfield.val("");
	    }
	});
};

var initAddHerring = function(){
	var nameInput = $('#nameInput');
	var spawnButton = $('#spawnbutton');
	spawnButton.attr('disabled','disabled');

	spawnButton.on('click', function(){
		var name = nameInput.val();
		var d = new Date();
		var month = d.getMonth()+1;
		var day = d.getDate();
		var year = d.getFullYear();
		var formatted = (month<10 ? '0' : '') + month + "-" +
			(day < 10 ? '0' : '') + day + "-" + year;

		var newHerring = {};

		//Getting users location! Doesn't require permission
		$.get("http://ipinfo.io", function (response) {
			newHerring = {
				name: name,
				number: fishbowl.herrings.length,
				date: formatted,
				property: assignProperty(),
				city: response.city 
			};
			fishbowl.addHerring(newHerring, canvas.width/2, canvas.height/2);
			addHerring(newHerring);
			console.log(response.city);
			nameInput.val("");
			//Updating the search auto-complete values
			$('<option></option>', {
				val: name
			}).appendTo($('#datalist1'));

			spawnButton.attr('disabled','disabled');
			selectHerring(fishbowl.herrings[fishbowl.herrings.length-1]);

		}, "jsonp");

	});

	nameInput.on('input', function(e){
		var name = nameInput.val();
		var found = fishbowl.searchHerringByName(name);
		if(name.length >= 2 && !found){
			spawnButton.removeAttr('disabled');
		}
		else{
			spawnButton.attr('disabled','disabled');
		}
	});
};

var assignProperty = function(){
    var properties = ['too salty', 'happy-go-lucky', 'good lookin\'', 
                        'on the sweet side', 'great in bed', 'moist'];
    var rand = Math.floor(Math.random() * properties.length);
    return properties[rand];
};

var addHerring = function(herring){
	socket.emit('addHerring', { data: herring });
};

var fishbowl;
var selectedHerring = null;
var canvas, context;
var panelW,panelButtonW;
var isPanelVisible = false;

var socket = io.connect('http://saltyherrings.herokuapp.com:5000');
socket.on('loadHerrings', function (data) {
 
	//To prevent it from loading twice
	if(fishbowl == undefined){
		fishbowl = new Fishbowl(data);

		setupRenderContext();
		fishbowl.addRenderContext(canvas.width, canvas.height, context);
		setupEventListeners();
		initPanel();
		initSearchField();
		initAddHerring();
	}
});


/*$(function() {

	fishbowl = new Fishbowl();

	setupRenderContext();
	fishbowl.addRenderContext(canvas.width, canvas.height, context);
	setupEventListeners();
	initPanel();

});
*/

