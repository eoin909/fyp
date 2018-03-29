var planetList = [];
var mouseX = 0;
var mouseY = 0;
var attackList = [];
var colorList = []

var Game = function() {
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext("2d");

	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.totalResources = 12;
	this.numResourcesLoaded = 0;
	this.fps = 60;
	this.totalFrames = 0;

	this.state = 'loading';

	this.context.lineWidth=1;
	this.context.fillStyle="#222";
	this.context.lineStyle="#ffff00";
	this.context.font="18px sans-serif";
	this.context.fillText("Loading", 20, 20);

	this.interval = null;
	console.log("game init function")
	this.initialize();
};

	Game.prototype.initialize = function() {

		while (planetList.length<6) {
			planetList[planetList.length] = new Planet(planetList.length);
		}

		player1 = new Player(2, "#669999");
		ai = new Computer(3, "#990099", 120);

		planetList[0].lives=50;
		planetList[0].setOwner(player1);
		planetList[planetList.length-1].lives=50;
		planetList[planetList.length-1].setOwner(ai);
		planetList[planetList.length-1].color = ai.color;

		this.state = 'playing';
		this.bindEvents();
		this.interval = setInterval(this.update, 1000 / this.fps);
	}

	Game.prototype.bindEvents = function() {

		$(document).mousedown(function (event) {
		    $(document).mousemove(function (event) {

					var mouseX = event.clientX;
					var mouseY = event.clientY;

					for (var i = 0; i < planetList.length; i++) {

						if(Math.sqrt((planetList[i].xPos-mouseX)*(planetList[i].xPos-mouseX) +
						(planetList[i].yPos-mouseY)*(planetList[i].yPos-mouseY)) < planetList[i].radius){
							if(planetList[i].owner==player1.id)
								player1.selectPlanet(planetList[i]);
						}
					}
		    });
		}).mouseup(function (event) {
		    $(document).unbind('mousemove');
				var mouseX = event.clientX;
				var mouseY = event.clientY;

				for (var i = 0; i < planetList.length; i++) {

					if(Math.sqrt((planetList[i].xPos-mouseX)*(planetList[i].xPos-mouseX) +
					(planetList[i].yPos-mouseY)*(planetList[i].yPos-mouseY)) < planetList[i].radius){
						player1.attackPlanet(planetList[i]);
					}
				}
		}).mouseout(function (event) {
		    $(document).unbind('mousemove');
		});
	};

	Game.prototype.redraw = function() {

		this.canvas.width = this.canvas.width; // clears the canvas

		for (var i = 0; i < planetList.length; i++) {
			planetList[i].draw(this.context);
		}

		this.context.fillStyle="#fff";
		this.context.lineStyle="#222";
		this.context.font="18px sans-serif";
		this.context.fillText("Score: " + this.score, 20, 600);

		this.context.fillText("Level: " + this.level, 20, 570);

	}

	Game.prototype.update = function() {
		//console.log("update function")

		// if(planetList[i])
		if (game.state === 'start') { return; }
		if (game.state === 'over') { game.updateOver() }
		if (game.state === 'playing') { game.play() }
	}

	Game.prototype.updateOver = function() {


		this.canvas.width = this.canvas.width; // clears the canvas

		this.context.fillStyle="#fff";
		this.context.lineStyle="#222";
		this.context.font="80px sans-serif";
		this.context.fillText("Gameover", 100, 150);

		this.context.font="20px sans-serif";
		this.context.fillText("Score: " + this.score, 120, 180);
		this.context.fillText("Level: " + this.level, 120, 210);

		this.context.font="30px sans-serif";
		this.context.fillText("Restart", 120, 260);

		this.stop();
	}

	Game.prototype.play = function() {

		for (var i = 0; i < planetList.length; i++) {
			planetList[i].update();
		}

		if(player1.update(planetList)<1)
		{
			console.log("dead");
			game.state = 'pause';
		}
		ai.update(planetList);
		this.redraw();
	}

	Game.prototype.reset = function() {
		clearInterval(this.interval);
		game = new Game();
	}

	Game.prototype.stop = function() {
		clearInterval(this.interval);
		game = null;
	}

$('button.start').click(function() {
	// Start game
	console.log("start game button")
	game = new Game();
});
$('button.reset').click(function() {
	// Start game
	game.reset();
});

$('button.stop').click(function() {
	// Start game
	game.stop();
});

$('button.pause').click(function() {
	console.log(this);
	if (game.state === 'pause') {
		game.state = 'playing';
		$(this).html('Pause');
	} else {
		game.state = 'pause';
		$(this).html('Resume');
	}
});

$('button.start').click();
