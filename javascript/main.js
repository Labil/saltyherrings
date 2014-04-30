
//////////////////////////////////////////////////////////////////////////////

// SALTY HERRINGS.
// Solveig Hansen 2014

//TODO: 
//		- Make sprite sheet in stead of separate images.
//		- Add description on naming rule / some tooltip that 
//		  informs the user if they have chosen an invalid name
//		- Add cookies to remember user and prevent them from adding > 1 herring
//		- Display stats about what country the herrings are from. etc
//		- Refactor code
//		- Change graphics of selected to an outline
//		- Bug with DB on heroku. Takes forever for inserts to be registered it seems

var Main = function(){
	this.properties = ['too salty', 'happy-go-lucky', 'good lookin\'', 
	                    'on the sweet side', 'great in bed', 'moist', 'cute but stupid',
	                    'bad to the bone', 'as salty as they come'];
	this.herrings = [];
	this.selectedHerring = null;
	this.placementMarginY = 20; //Small margin on Y axis so the herrings aren't placed outside the window
};

Main.prototype.setupWindowResize = function(){
	var self = this;
	$(window).on('resize', function(){
		self.canvas.width = $(window).innerWidth();
		self.canvas.height = $(window).innerHeight() - 60;

		fishbowl.updateCanvasWidth(self.canvas.width, self.canvas.height);
	});
};

Main.prototype.init = function(config){
	this.popup = config.popup;
	//trims whitespaces
	this.template = $.trim(config.displayInfo.html());
	this.searchfield = config.searchfield;
	
	this.panel = config.panel;
	this.panelButton = config.panelButton;
	this.panelCloseButton = config.panelCloseButton;

	this.nameInput = config.nameInput;
	this.spawnButton = config.spawnButton;

	this.setupRenderContext();
	this.initPanel();
	this.setupWindowResize();
};

Main.prototype.setupRenderContext = function(){
	this.canvas = document.createElement("canvas");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight - 60; //to account for bookmarks bar
	this.canvas.setAttribute("class", "canvas");
	document.body.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
};

Main.prototype.setupEventListeners = function(herrings){
	//$(window).on('click')
	//window.addEventListener("mousedown"
	var self = this;
	$(window).on('click', function(e){
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

				self.selectHerring(herrings[i]);
				hit = true;
				break;
			}
		}
		if(hit == false){
			self.deselectHerring();
			self.hideInfo();
		}

	});
};

Main.prototype.selectHerring = function(herring){
	this.deselectHerring();
	this.selectedHerring = herring;
	this.selectedHerring.select();
	this.displayInfo(herring);
};

Main.prototype.deselectHerring = function(){
	if(this.selectedHerring){
		this.selectedHerring.deselect();
		this.selectedHerring = null;
	}
};

Main.prototype.displayInfo = function(herring){

	//i flags both upper- and lowercase, g = global, means it will continue
	//searching even if it finds one instance of the search
	//I think since I am using another templating engine (swig), it is
	//messing up when I try to use {{}} around the names. Now it's just
	//searching for /number/ and not /{{number}}/ and I removed the i to just
	//match on exact case.
	var temp = this.template.replace(/number/g, herring.number)
		               .replace(/name/g, herring.name)
		    		   .replace(/created/g, herring.date)
		    		   .replace(/city/g, herring.city)
		    		   .replace(/property/g, herring.property);
	this.popup.html(temp);

	if(this.popup.is(':hidden')){
		this.searchfield.hide();
		this.popup.fadeIn(200);
	}
};

Main.prototype.hideInfo = function(){
	this.popup.text("");
	this.popup.hide();
	this.searchfield.show();
};

Main.prototype.initPanel = function(){
	var self = this;

	this.panelButton.on('click', function(){
		self.panelButton.fadeOut(200);
		self.panel.animate({ width: 'toggle'}, 300); //Slides in horizontally
	});
	this.panelCloseButton.on('click', function(){
		self.panel.animate({ width: 'toggle'}, 300);
		self.panelButton.fadeIn(300);
	});
};

Main.prototype.initSearchField = function(fishbowl){
	var self = this;
	this.searchfield.keyup(function (e) {
	    if (e.keyCode == 13) {
	        var index = fishbowl.searchHerringByName(self.searchfield.val());
			if(index >= 0)
				self.selectHerring(fishbowl.herrings[index]);
			self.searchfield.val("");
	    }
	});
};

//M-D-Y 02-10-2014
Main.prototype.formatDate = function(d){
	var month = d.getMonth()+1,
		day = d.getDate(),
		year = d.getFullYear();
	return (month<10 ? '0' : '') + month + "-" +
		   (day < 10 ? '0' : '') + day + "-" + year;
};

Main.prototype.initAddHerring = function(fishbowl){
	var self = this;
	this.spawnButton.attr('disabled','disabled'); //Button should be disabled at start

	this.spawnButton.on('click', function(e){
		e.preventDefault();

		var name = self.nameInput.val();
		//Getting users location! Doesn't require permission
		$.get("http://ipinfo.io", function (response) {
			if(response.city == null || response.city =="") response.city = "Top Secret Location";
			var newHerring = {
				name: name,
				number: fishbowl.herrings.length,
				date: self.formatDate(new Date()),
				property: self.assignProperty(),
				city: response.city 
			};
			fishbowl.addHerring(newHerring, self.canvas.width/2, self.canvas.height/2);
			self.addHerring(newHerring);
			self.nameInput.val(""); //Empty input field
			//Updating the search auto-complete values
			$('<option></option>', {
				val: name
			}).appendTo($('#datalist1'));

			self.spawnButton.attr('disabled','disabled'); //disable button after submit
			self.selectHerring(fishbowl.herrings[fishbowl.herrings.length-1]); //select new herring

		}, "jsonp");

	});

	this.nameInput.on('input', function(e){
		var name = self.nameInput.val();
		var index = fishbowl.searchHerringByName(name);
		if(name.length >= 3 && index < 0){
			self.spawnButton.removeAttr('disabled');
		}
		else{
			self.spawnButton.attr('disabled','disabled');
		}
	});
};

Main.prototype.assignProperty = function(){
    var rand = Math.floor(Math.random() * this.properties.length);
    return this.properties[rand];
};

Main.prototype.addHerring = function(herring){
	socket.emit('addHerring', { data: herring });
};

//Fishbowl must be global atm, else the socket loads it many times. Should be fixed
var fishbowl;
//window.location.hostname finds the correct address & port
var socket = io.connect(window.location.hostname);

$(function() {
    if(main == undefined){
    	var main = new Main();
    	main.init({
    		'popup': $('#popup'),
    		'displayInfo': $('#displayInfo'),
    		'searchfield' : $('#searchfield'),
    		'panel': $('#panel'),
    		'panelButton':$('#panelbutton'),
    		'panelCloseButton': $('#x'),
    		'nameInput': $('#nameInput'),
    		'spawnButton': $('#spawnbutton')
    	});
    }

    socket.on('loadHerrings', function (data) {
     	
    	//To prevent it from loading twice
    	if(fishbowl == undefined){
    		
    		var imgPaths = ["assets/salty1.png", "assets/salty2.png", "assets/herring_right_selected.png", "assets/herring_left_selected.png"];
    		var imgNames = ["Herring", "Herring_left", "Herring_sel", "Herring_left_sel"];
    		fishbowl = new Fishbowl(main.canvas.width, main.canvas.height, main.context, data, imgPaths, imgNames);

    		main.setupEventListeners(fishbowl.herrings);
    		main.initSearchField(fishbowl);
    		main.initAddHerring(fishbowl);
    	}
    });
});
	

