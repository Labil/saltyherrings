
//////////////////////////////////////////////////////////////////////////////

// SALTY HERRINGS.
// Solveig Hanse 2014

//TODO: 
//		- Add resize window event so fishbowl and interface scales
//		- Make sprite sheet in stead of separate images.
//		- Add description on naming rule / some tooltip that 
//		  informs the user if they have chosen an invalid name
//		- Add cookies to remember user and prevent them from adding > 1 herring
//		- Display stats about what country the herrings are from. etc
//		- Add more properties fro the herrings
//		- Remake design of popup info
//		- Refactor code
//		- Change graphics of selected to an outline

var setupRenderContext = function(){
	canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	//making it slightly shorter than the windowheight to account for bookmarks bar
	canvas.height = window.innerHeight - 60;
	canvas.setAttribute("class", "canvas");
	document.body.appendChild(canvas);

	context = canvas.getContext("2d");
};

var setupEventListeners = function(herrings){
	//Slight margin on Y axis so the herrings aren't placed outside the window
	var marginY = 20;
	window.addEventListener("mousedown", function(e){

		//Don't wanna click behind the panel or panel button
		if(isPanelVisible && e.clientX < panelW) return;
		else if(!isPanelVisible && e.clientX < panelButtonW + 40) return;

		var hit = false;
		for(var i = 0; i < herrings.length; i++){
			var hW = herrings[i].w;
			var hH = herrings[i].h;
			var hX = herrings[i].xPos;
			var hY = herrings[i].yPos;

			if(e.clientX > hX 
				&& e.clientX < hX + hW 
				&& e.clientY > hY 
				&& e.clientY < hY + hH){

				selectHerring(herrings[i]);
				hit = true;
				break;
			}
		}
		if(hit == false){
			deselectHerring();
			hideInfo();
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

var initPanel = function(panel, button, xbutton){
	
	panelW = panel.width();
	panelButtonW = button.width();

	button.on('click', function(){
		isPanelVisible = true;
		button.fadeOut(200);
		panel.animate({ width: 'toggle'}, 300); //Slides in horizontally
	});
	xbutton.on('click', function(){
		panel.animate({ width: 'toggle'}, 300);
		button.fadeIn(300);
		isPanelVisible = false;
	});
};

var initSearchField = function(searchfield, fishbowl){
	searchfield.keyup(function (e) {
	    if (e.keyCode == 13) {
	        var index = fishbowl.searchHerringByName(searchfield.val());
			if(index >= 0)
				selectHerring(fishbowl.herrings[index]);
			searchfield.val("");
	    }
	});
};
//M-D-Y 02-10-2014
var formatDate = function(d){
	var month = d.getMonth()+1,
		day = d.getDate(),
		year = d.getFullYear();
	return (month<10 ? '0' : '') + month + "-" +
		(day < 10 ? '0' : '') + day + "-" + year;
};

var initAddHerring = function(nameInput, spawnButton, fishbowl){
	
	spawnButton.attr('disabled','disabled'); //Button should be disabled at start

	spawnButton.on('click', function(){
		
		var name = nameInput.val();
		//Getting users location! Doesn't require permission
		$.get("http://ipinfo.io", function (response) {
			var newHerring = {
				name: name,
				number: fishbowl.herrings.length,
				date: formatDate(new Date()),
				property: assignProperty(),
				city: response.city 
			};
			fishbowl.addHerring(newHerring, canvas.width/2, canvas.height/2);
			addHerring(newHerring);
			nameInput.val(""); //Empty input field
			//Updating the search auto-complete values
			$('<option></option>', {
				val: name
			}).appendTo($('#datalist1'));

			spawnButton.attr('disabled','disabled'); //disable button after submit
			selectHerring(fishbowl.herrings[fishbowl.herrings.length-1]); //select new herring

		}, "jsonp");

	});

	nameInput.on('input', function(e){
		var name = nameInput.val();
		var index = fishbowl.searchHerringByName(name);
		if(name.length >= 3 && index < 0){
			spawnButton.removeAttr('disabled');
		}
		else{
			spawnButton.attr('disabled','disabled');
		}
	});
};

var assignProperty = function(){
    var properties = ['too salty', 'happy-go-lucky', 'good lookin\'', 
                        'on the sweet side', 'great in bed', 'moist', 'cute but stupid'];
    var rand = Math.floor(Math.random() * properties.length);
    return properties[rand];
};

var addHerring = function(herring){
	socket.emit('addHerring', { data: herring });
};

var selectedHerring = null;
var canvas, context;
var panelW,panelButtonW;
var isPanelVisible = false;

//window.location.hostname finds the correct address & port
var socket = io.connect(window.location.hostname);
socket.on('loadHerrings', function (data) {
 	
 	var fishbowl;
	//To prevent it from loading twice
	if(fishbowl == undefined){
		//Must make context first, to send in to fishbowl
		setupRenderContext();
		var imgPaths = ["assets/salty1.png", "assets/salty2.png", "assets/salty1_selected.png", "assets/salty2_selected.png"];
		var imgNames = ["Herring", "Herring_left", "Herring_sel", "Herring_left_sel"];
		fishbowl = new Fishbowl(canvas.width, canvas.height, context, data, imgPaths, imgNames);

		setupEventListeners(fishbowl.herrings);
		initPanel($('#panel'), $('#panelbutton'), $('#x'));
		initSearchField($('#searchfield'), fishbowl);
		initAddHerring($('#nameInput'), $('#spawnbutton'), fishbowl);
	}
});

