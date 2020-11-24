// All code (c) Mortimer Pavlitski 2016 (March -> May)

// I have commented out unused code for graphics, GUI, shooting and enemies 
// as I had to cut them from the game due to lag or incomplete code.
// If the game still lags you can comment out line 895 witch will remove the clouds.
// I also had to cut the tress from the game as they where laging but their is a demo in the trees folder

inlets = 1;
outlets = 2;

mgraphics.init();

var windowWidth = box.rect[2] - box.rect[0];
var windowHeight = box.rect[3] - box.rect[1];

var controls = new Dict() // Keyboard Input Dictionary
	controls.name = "keyboardControl";

var cherokee = {};
var instrument = {};

var levels = [[[50, 200, 300, 100],
			   [400, 200, 200, 101],
			   [600, 100, 100, 100],
			   [700, 200, 200, 100],
			   [750, 0, 50, 100],
			   [800, 200, 400, 100],
			   [1350, 300, 200, 100],
			   [1700, 400, 200, 100],
			   [1650, 200, 200, 100],
			   [1950, 300, 100, 100],
			   [2000, 400, 100, 101],
			   [2100, 200, 50, 100],
			   [2200, 500, 50, 100],
			   [2200, 200, 500, 100],
			   [2300, 400, 200, 100],
			   [2500, 300, 100, 100],
			   [2750, 100, 50, 100],
			   [2900, 0, 50, 100],
			   [3000, -100, 400, 50]],
		
              [[50, 200, 500, 100],
		       [610, 300, 200, 101],
	           [900, 250, 300, 100],
		       [1250, 150, 300, 101],
 		       [1600, 50, 50, 100],
 		       [1800, 0, 50, 100],
 		       [2000, 100, 100, 101],
		       [1600, 300, 400, 100],
		       [2200, 400, 600, 100],
		       [2700, 300, 80, 100],
		       [2700, 200, 80, 100],
		       [2700, 100, 80, 100],
		       [2800, 0, 800, 50]],
		
			  [[50, 200, 100, 102],
               [-100, 200, 40, 100],
		 	   [-300, 300, 40, 101],
	   	       [-400, 200, 40, 100],
			   [-600, 250, 90, 100],
			   [-800, 200, 100, 101],
			   [-900, 100, 40, 100],
			   [-720, 50, 30, 100],
			   [-600, 0, 40, 101],
			   [-500, -100, 100, 100],
   			   [-300, -150, 290, 102],
		       [200, -100, 100, 101],
		       [450, 250, 800, 50]]];									

var notes = [];

//var enemySetup = [[500, 200, "book"]];

//var enemies = [];

//var projectileDirectionRatio = [0,0];
	
var particles = [];		// Array of all particles in the game

var maxParticles = 300; // Maximun number of particles alowed in the game
	
var gravity = -0.6;

//var instrumentGUI = {};	// Insumnet GUI
	
var pause = false;		// is the main game running

var screen = {};		// Stores the screen data (size, location in level, ect.)
	
var gamestate = "start";

var currentLevel = 0;	// curent level

var startTimer = 0;		// time before you can press any key to start

init(); 				// Loads The game (sets defalts)

function paint() {
	drawGame();
}
		
// ----------------------------------------------
// -------------------- Load --------------------
// ----------------------------------------------

function init() {
	
	pause = false;
	
	gamestate = "start";
	
	cherokee = {
		position: [100, 150],
		relPosition: [0, 0],
		velocity: [0, 0],
		relSize: [40, 85],
		facing: ["right", "down"],		// no caps on the string names
		legLift: 0,						// leg lifting movement
		onPlatform: false,
		isJumping: false,
		isAlive: true,
		numLives: 5,					// number of exstra lifes
		maxHealth: 100,					// max Health
		health: 40,						// curent health
		noteScore: 0,					// game score as a number of notes collected
		maxMusic: 100,					// max amount of music you can play
		music: 80,						// curent amount of music (sudo magic)
		colour: [0.2, 0.6, 0.6, 0.5]
	};
	
	instrument = {
		name: ["Anton"],
		position: [10, 10],
		relSize: [60],	
		colour: [1, 1, 1, 1],
		speed: 0						// for creating particles
	};
	
	particles = [];
	
	//projectiles = [];				    // antons lazers
	
	instrumentGUI = {
 		position: [],					// xpos, ypos
		relSize: 0,						// size of the gui
		highlightSize: 0,				// size of the highlighta
		unlockedInstrument: ["Anton", "Rainstick"],	// list of unlocked instruments
		colour: [],						// colour of partilce
		isDisplaying: false				// is it displaying
	};
	
	screen = {
		width: windowWidth,
		heigth: windowHeight,			
		position: [0, 0]				// relative to the leval
	};
	
	//enemies = [];
	
	startTimer = 0;
	
	currentLevel = 0;
	
	resetNotes;
}

function resetNotes() {
	notes = [[[1000, -50, true],
			  [1800, 350, true],
			  [2550, 270, true]],
			
			 [[2200, 0, true],
			  [2500, 100, true],
			  [800, 100, true]],
			
		  	 [[-825, -40, true],
			  [-220, 100, true],
			  [400, 50, true]]];
			
	cherokee.noteScore = 0;
}

// ----------------------------------------------
// -------------------- Tick --------------------
// ----------------------------------------------

function tick() {
	if (gamestate == "start") {
		startScreen();
	}
	
	if (gamestate == "gameover") {
		startScreen();
	}
	
	if (gamestate == "win") {
		startScreen();
	}
	
	if (gamestate == "inlevel") {
		calculateScreen();
		//calculateInstrumentGUI();
	
		if (!pause) {
			calculateCherokee();
			calculateInstrument();
	
			calculateParticles();
			//calculateProjectiles();
			
			//calculateEnemies();
		}
	}

	mgraphics.redraw();

	outlet(0, "tick");
}

// --------------------- Start Screen -------------------------------

function startScreen() {
	
	startTimer++;
	
	if (startTimer == 1) {
		outlet(1, "intro");
	}
	
	var start = false;
	
	if (controls.get("numKeys") > 0 && startTimer > 100) {
		start = true;
		outlet(1, "select");
		outlet(1, "level1");
		cherokee.numLives = 5;
		currentLevel = 0;
	}
	
	if (start == true) {
		gamestate = "inlevel";
		resetNotes();
	}
}

// --------------------- Calculate Screen ---------------------------

function calculateScreen() {
	// save size
	screen.width = windowWidth;
	screen.heigth = windowHeight;

	// save the curent x and y
	var oldx = screen.position[0];
	var oldy = screen.position[1];
	var newx = 0; // oldx + cherokees position ish
	var newy = 0;

	if (cherokee.facing[0] == "right") {
		newx = -cherokee.position[0] + screen.width * 0.40;
	}

	if (cherokee.facing[0] == "left") {
		newx = -cherokee.position[0] + screen.width * 0.60;
	}
	
	//newx =  screen.width * 0.5 - cherokee.position[0];
	
	newy =  screen.heigth * 0.7 - cherokee.position[1];

	//laging algarythem
	screen.position[0] = newx - ((newx - oldx) * 0.91);
	screen.position[1] = newy - ((newy - oldy) * 0.7);	
}

// -------------------- Calculate Cherokee --------------------------

function calculateCherokee () {
	
	// Work out the direction cherokee is facingd
	if (cherokee.velocity[0] > 0) {
		cherokee.facing[0] = "right";
	} 
	else if (cherokee.velocity[0] < 0) {
		cherokee.facing[0] = "left";
	}
	
	if (cherokee.velocity[1] > 0) {
		cherokee.facing[1] = "down";
	} 
	else if (cherokee.velocity[1] < 0) {
		cherokee.facing[1] = "up";
	}
	
	var xpos = cherokee.position[0];
	var ypos = cherokee.position[1];
	var width = cherokee.relSize[0];
	var height = cherokee.relSize[1];
	
	// Colition detection
	cherokee.onPlatform = false; // your falling 

	for (var i = 0; i < levels[currentLevel].length; i++) { // For every platform		
		if (xpos >= levels[currentLevel][i][0] - (width * 0.5) && xpos <= (levels[currentLevel][i][0] + levels[currentLevel][i][2] + (width * 0.5))) { // if cherokees width is within the x range of this note 
			if ((ypos >= levels[currentLevel][i][1]) && (ypos <= levels[currentLevel][i][1] + cherokee.velocity[1] + 1)) { //  with in the y range
				if (cherokee.facing[1] == "down") { // if your moving down then
					cherokee.onPlatform = true; // then your on the platform
					ypos = levels[currentLevel][i][1]; //acount for the aceliration rounding
				}
			}
		}
	}
	
	// notes
	for (var i = 0; i < notes[currentLevel].length; i++ ) {
		notex = notes[currentLevel][i][0];
		notey = notes[currentLevel][i][1];
		
		if (notex >= xpos - (width * 0.5) && notex <= xpos + (width * 0.5) && notey <= ypos && notey >= ypos - height && notes[currentLevel][i][2]) {
			post("in note", "\n");
	 		notes[currentLevel][i][2] = false;
			cherokee.noteScore++;
			outlet(1, "note"); // sound
		}
	}
	
	// Movemment
	if (controls.get("a") && !controls.get("d")) {
		cherokee.velocity[0] = -5; // move right
	}

	if (controls.get("d") && !controls.get("a")) {
		cherokee.velocity[0] = 5; // move left
	}

	if (!controls.get("a") && !controls.get("d")) {
		cherokee.velocity[0] = cherokee.velocity[0] * 0.9; // decelirate
	}
	if (controls.get("a") && controls.get("d")) {
		cherokee.velocity[0] = cherokee.velocity[0] * 0.9; // decelirate
	}
	
	// Gravaty
	if (!cherokee.onPlatform) { // if not on a platfrom 
		cherokee.velocity[1] = cherokee.velocity[1] - gravity; // calculate velocity
	} else {
		cherokee.velocity[1] = 0;
	}
	
	// Cap Terminal Velocity
	if (cherokee.velocity[1] > 11) {
		cherokee.velocity[1] = 11;
	}
	
	// Jummping
	if (controls.get("space")) {
		cherokee.isJumping = true;
	} else {
		cherokee.isJumping = false;
	}
	if (cherokee.onPlatform && cherokee.isJumping) {
		cherokee.velocity[1] = - 12; // Set jump velocity
		outlet(1, "jump"); // sound
	}
	
	// End level platform
	if (xpos > levels[currentLevel][levels[currentLevel].length - 1][0] + (levels[currentLevel][levels[currentLevel].length - 1][2] * 0.5) - 100 && ypos < levels[currentLevel][levels[currentLevel].length - 1][1]) {
		xpos = 100;
		ypos = -50;
		cherokee.velocity[0] = 0;
		cherokee.velocity[1] = 0;
		cherokee.legLift = 0;
		instrument.position = [10, 10];	
		currentLevel++;
		outlet(1, "portal");
		outlet(1, "level" + currentLevel); // music
	}
	/*
	// Shoot
	if (controls.get("l")) {
		shoot();
	}
	*/
	
	//falling off
	if (ypos > 800) {
		xpos = 100;
		ypos = -50;
		cherokee.velocity[0] = 0;
		cherokee.velocity[1] = 0;
		cherokee.legLift = 0;
		instrument.position = [10, 10];
		cherokee.numLives--;
		outlet(1, "death"); // sound
		outlet(1, "level" + (currentLevel + 1)); // music
	}
	
	// Game over state
	if (cherokee.numLives == -1) {
		gameover();
	}
	
	// Win game state
	if (currentLevel > levels.length - 1) {
		gamestate = "win";
		outlet(1, "win"); // sound
		startTimer = 0;
	}
	
	// Set xpos
	cherokee.position[0] = xpos + cherokee.velocity[0]; // apply horitontal velocity
	// Set ypos
	cherokee.position[1] = ypos + cherokee.velocity[1]; // apply vertical velocity
}

/*
function respawn() {
	cherokee.velocity[0] = 0;
	cherokee.velocity[1] = 0;
	cherokee.legLift = 0;
	instrument.position = [10, 10];
}
*/

function gameover() {
	startTimer = 0;
	gamestate = "gameover";
	cherokee.numLives = 5;
	currentLevel = 0;
	resetNotes();
}

// -------------------- Calculate Insturment --------------------------

function calculateInstrument () {
	
	var oldx = instrument.position[0]; // save the curent x and y
	var oldy = instrument.position[1];
	var newx;
	var newy;
	
 	// Create new x position
	if (cherokee.facing[0] == "right") {  // acounts for the facing dirction
		newx = cherokee.position[0] - 50;
	} else if (cherokee.facing[0] == "left") {
		newx = cherokee.position[0] + 50;
	}
	
	// Create new y position
	newy = cherokee.position[1] - 80;

	//laging algarythem
	instrument.position[0] = newx - ((newx - oldx) * 0.9);
	instrument.position[1] = newy - ((newy - oldy) * 0.9);
	
	// Calculate the absoltue speed for velocity particles
	instrument.speed = Math.abs(cherokee.velocity[0]) + Math.abs(cherokee.velocity[1]);
}

// ----------------------- Particle System -----------------------

function createParticles(x, y, chance, r, g, b) {
	// Chance to make particle
	if ((Math.random() < chance) && (particles.length < maxParticles)) {
		
		var particle = {};
		
		// Genirate Particle
		particle.position = [x, y];
		particle.velocity = [(Math.random() * 5) - 2.5, (Math.random() * 5) - 2.5];
		particle.relSize = (Math.random() * 2) + 1;	
		particle.decay = 40;
		particle.decayMax = 40;
		particle.colour = [r + (Math.random() * 0.3), g + (Math.random() * 0.3), b + (Math.random() * 0.3), 1];
		particle.isAlive = true;
		
		// Push to the array
		particles.push(particle);
	}
}

function calculateParticles() { 
	for (var i = 0; i < particles.length; i++) {
		calculateParticle(i);	
		
		if (!particles[i].isAlive) {
			particles.splice(i, 1); // delete particles
		}
	}
}

function calculateParticle(i) { 
	
	var life = (particles[i].decay / particles[i].decayMax);
	
	particles[i].colour[3] = life;
	
	// movement
	xpos = particles[i].position[0];
	ypos = particles[i].position[1];
	
	xpos = xpos + particles[i].velocity[0];
	ypos = ypos + particles[i].velocity[1];
	
	particles[i].position[0] = xpos;
	particles[i].position[1] = ypos;
	
	// decay
	if (particles[i].decay > 0) { 
		particles[i].decay--;
	}
	
	//size change
	particles[i].relSize = particles[i].relSize + 0.1;
	
	// auto delate pick up system
	if (particles[i].decay == 0) {
		particles[i].isAlive = false;
	}
}

// ----------------------- Enemy System -----------------------
/*
function createDomantEnemies() {
	for(var i = 0; i < enemySetup.length; i++) {
		createEnemy(enemySetup[i][0], enemySetup[i][1], enemySetup[i][2]);
	}
}

function spawnEnemy(){
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].position[0] == screen.position[0] + screen.width) {
			enemies[i].isSpawned = true;
		}
	}
}

function createEnemy(x, y, type) {
	var enemy = {};
	if (type == "book") {
		enemy.position = [x, y];
		enemy.velocity = [-4, 0];// 
		enemy.relSize = 40;	
		enemy.type = "book";
		enemy.life = 30;
		enemy.isAlive = true;
		enemy.isSpawned = false;
		enemy.colour = [1, 0, 0, 1];
	}
	enemies.push(enemy);
}

function calculateEnemies() { 
	for (var i = 0; i < enemies.length; i++) {
		calculateEnemy(i);	
		
		if (!enemies[i].isAlive) {
			enemies.splice(i, 1);
		}
	}
}

function calculateEnemy(i) { 
	
	// movement
	xpos = enemies[i].position[0];
	ypos = enemies[i].position[1];
	
	xpos = xpos + enemies[i].velocity[0];
	ypos = ypos + enemies[i].velocity[1];
	
	enemies[i].position[0] = xpos;
	enemies[i].position[1] = ypos;
	
	// auto delate pick up system
	if (enemies[i].life == 0) {
		enemies[i].isAlive = false;
	}
}
*/

// -------------------------- Shooting --------------------
/*
function shoot() {
	// Shoot
    var projectile = {};
	projectile.position = [instrument.position[0] - 10, instrument.position[1]];
	projectile.velocity = [projectileDirection[0], projectileDirection[1]];
	projectile.decay = 10;
	projectile.colour = [instrument.colour];
	projectile.isAlive = true;
	projectile.relSize = 20;
	projectiles.push(projectile);
	
	outlet(1, "shoot");
}

function calculateProjectiles() { 
	for (var i = 0; i < projectiles.length; i++) {
		calculateProjectile(i);	
		
		if (!projectiles[i].isAlive) {
			projectiles.splice(i, 1); // delete particles
		}
	}
}

function calculateProjectile(i) { 

	xpos = projectiles[i].position[0] + projectiles[i].velocity[0];
	ypos = projectiles[i].position[1] + projectiles[i].velocity[1];
	
	projectiles[i].position[0] = xpos;
	projectiles[i].position[1] = ypos;
	
	// decay
	if (projectiles[i].decay > 0) { 
		projectiles[i].decay--;
	}
	
	// auto delate pick up system
	if (projectiles[i].decay == 0) {
		projectiles[i].isAlive = false;
	}
}

function onidle(x, y) {
	
	var relx = x - (instrument.position[0] + screen.position[0]);
	var rely = y - (instrument.position[1] + screen.position[1]);
			
	projectileDirection = [relx, rely];
	
}
*/

// -------------------------- GUI -------------------------

/*
function calculateInstrumentGUI() {
	//Displaying
	if (controls.get("e")) {
		instrumentGUI.isDisplaying = true;
		pause = true;
	} else if (!controls.get("e")) { 
		instrumentGUI.isDisplaying = false;
		pause = false;
	}
	
	// calculate relSize
	instrumentGUI.relSize = windowWidth * 0.15;
	instrumentGUI.highlightSize = instrumentGUI.relSize - (windowWidth * 0.013);
}
*/

// --------------------------------------------------------
// -------------------- Graphics --------------------------
// --------------------------------------------------------

function drawGame() {
	switch (gamestate)
	{
		case 'inlevel':
			drawTheBackground("day"); // ~0ms
			drawLevel(); //~20ms
			
					//drawTrees();
					//drawPortal(80, 150, 1);
			
			drawParticles(); // < ~1ms
		
			drawCherokee(); // ~0ms
			drawInstrument(); // ~0ms
		
					// drawProjectiles();
			
					// drawEnemies();
		
					// drawGUI();
			
			drawLevelGUI(); // ~0ms
			break;

		case 'start':
			drawStart();
			break;

		case 'gameover':
			drawGameover();
			break;

		case 'win':
			drawWin();
			break;
	}
}

function onresize () {
	windowWidth = box.rect[2] - box.rect[0];
	windowHeight = box.rect[3] - box.rect[1];
	
	screen.width = box.rect[2] - box.rect[0];
	screen.height = box.rect[3] - box.rect[1];
}

// ---------------------- Start ---------------------------

function drawStart() {
	drawSky();
	
	var x = windowWidth * 0.5;
	var y = windowHeight * 0.5;
	
	drawText(x, y - 100, 36, "Arial", "Anton & Cherokee's", 1, 1, 1);
	drawText(x, y - 60, 36, "Arial", "Ex-Silent Adventure", 1, 1, 1);
	drawText(x, y - 30, 16, "Arial", "By Mortimer Pavlitski", 1, 1, 1);
	
	if (startTimer > 20) {
	drawText(x, y + 20, 16, "Arial", "A & D to move Left and Right", 1, 1, 1);
	}
	if (startTimer > 40) {
	drawText(x, y + 40, 16, "Arial", "Space to Jump", 1, 1, 1);
	}
	if (startTimer > 60) {
	drawText(x, y + 60, 16, "Arial", "Jump in the Yellow Portal", 1, 1, 1);
	}
	if (startTimer > 80) {
	drawText(x, y + 80, 16, "Arial", "Save the Music!", 1, 1, 1);
	}
	
	if (startTimer > 100) {
		drawText(x, y + 120, 20, "Arial", "Press any key to start...", 1, 1, 1);
	}
	
	drawCloud(x - 400, y - 200, 200, 110);
	drawCloud(x - 200, y - 100, 130, 110);
	
	drawRect(x - 400, y + 150, 300, h, 0.4, 0.2, 0.2, 1);			// ground
	drawRect(x - 400, y + 150, 300, h * 0.2, 0.2, 0.8, 0.4, 1);	// grass toping
}


// ------------------- Game Over -------------------------

function drawGameover() {
	drawSky();
	
	var x = windowWidth * 0.5;
	var y = windowHeight * 0.5;
	
	drawText(x, y - 100, 36, "Arial", "Game Over", 1, 1, 1);
	drawText(x, y - 60, 16, "Arial", "Thanks for playing", 1, 1, 1);
	
	if (startTimer > 100) {
		drawText(x, y + 50, 20, "Arial", "Press any key to restart...", 1, 1, 1);
	}
	
	drawCloud(x - 400, y - 200, 200, 110);
	drawCloud(x - 200, y - 100, 130, 110);
	
	drawRect(x - 400, y + 150, 300, h, 0.4, 0.2, 0.2, 1);			// ground
	drawRect(x - 400, y + 150, 300, h * 0.2, 0.2, 0.8, 0.4, 1);	// grass toping
}


// ------------------- Win game -------------------------

function drawWin() {
	drawSky();
	
	var x = windowWidth * 0.5;
	var y = windowHeight * 0.5;
	
	drawText(x, y - 100, 36, "Arial", "Congratulations", 1, 1, 1);
	drawText(x, y - 60, 36, "Arial", "You Win!", 1, 1, 1);
	drawText(x, y - 30, 16, "Arial", "You got " + cherokee.noteScore + " notes", 1, 1, 1);
	drawText(x, y - 10, 16, "Arial", "You died " + (5 - cherokee.numLives) + " times", 1, 1, 1);
	drawText(x, y + 10, 16, "Arial", "Thanks for playing", 1, 1, 1);
	
	if (startTimer > 100) {
		drawText(x, y + 50, 20, "Arial", "Press any key to restart...", 1, 1, 1);
	}
	
	drawCloud(x - 400, y - 200, 200, 110);
	drawCloud(x - 200, y - 100, 130, 110);
	
	drawRect(x - 400, y + 150, 300, h, 0.4, 0.2, 0.2, 1);			// ground
	drawRect(x - 400, y + 150, 300, h * 0.2, 0.2, 0.8, 0.4, 1);	// grass toping
}

// -------------------- Backgournds -----------------------

function drawTheBackground(type) {
	switch(type) {
    case "level 1":
        drawBackground(0, 1, 1, 1);
        break;
    case "level 2":
        drawBackground(0, 0, 0, 1);
        break;
	case "day":
        drawSky();
        break;
    default: drawBackground(0, 0, 0, 1);
	}
}

function drawSky() {
	drawBackground(0.5, 0.8, 1, 1);
}

function drawBackground(r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		rectangle(0, 0, windowWidth, windowHeight);
		fill();
	}
}

// -------------------- Level -----------------------------

function drawLevel() 
{
	// Draws out the platforms
	for (var i = 0; i < levels[currentLevel].length; i++ ) {
		drawPlatform(i);
	}
	for (var i = 0; i < notes[currentLevel].length; i++ ) {
		drawNotes(i); // ~0ms
	}
}

function drawPlatform(i) 
{
	var x = levels[currentLevel][i][0] + screen.position[0];
	var y = levels[currentLevel][i][1] + screen.position[1];
	var w = levels[currentLevel][i][2];
	var h = 30;
	
	if (levels[currentLevel][i][3] == 100) {
		drawRect(x, y, w, h, 0.4, 0.2, 0.2, 1);			// ground
		drawRect(x, y, w, h * 0.2, 0.2, 0.8, 0.4, 1);	// grass toping
	} else if (levels[currentLevel][i][3] == 101) {
		drawRect(x, y, w, h, 0.4, 0.2, 0.2, 1);			// ground
		drawRect(x, y, w, h * 0.2, 0.2, 0.8, 0.4, 1);	// grass toping
		drawCloud(x, y - 340, w, 80);
	} else if (levels[currentLevel][i][3] == 102) {
		drawRect(x, y, w, h, 0.4, 0.2, 0.2, 1);			// ground
		drawRect(x, y, w, h * 0.2, 0.2, 0.8, 0.4, 1);	// grass toping
		drawCloud(x, y - 300, w * 0.5, 80);
	} else if (levels[currentLevel][i][3] == 50) {
		drawRect(x, y, w, h, 0.85, 0.85, 0.1, 1);		// ground
		drawRect(x, y, w, h * 0.2, 1, 1, 1, 1);			// grass toping
		createParticles(levels[currentLevel][i][0] + (w * 0.5), levels[currentLevel][i][1] - 100, 1, 0.85, 0.85, 0.1);
		drawRect(x + (w * 0.5) - 100, y - 200, 200, 200, 0, 0, 0, 1);	// back gournd	
		drawRect(x + (w * 0.5) - 135, y - 200, 35, 200, 0.85, 0.85, 0.1, 1); // left pilar
		drawRect(x + (w * 0.5) + 100, y - 200, 35, 200, 0.85, 0.85, 0.1, 1); // rigth pilar
		drawRect(x + (w * 0.5) - 135, y - 240, 270, 40, 0.85, 0.85, 0.1, 1);	// toping
		drawRect(x + (w * 0.5) - 135, y - 240, 270, 10, 1, 1, 1, 1);	// toping
		drawRect(x + (w * 0.5) - 135, y - 210, 270, 10, 1, 1, 1, 1);	// toping
	}
}

function drawNotes(i) 
{	
	var x = notes[currentLevel][i][0] + screen.position[0];
	var y = notes[currentLevel][i][1] + screen.position[1];
	
	if (notes[currentLevel][i][2] == true) {
		drawNote(x, y, 45, 0, 0.6, 0, 1);
	}
}

// Tree ------------------------------------------------------------------------------

/*
function drawTrees() {
	drawTree(200, 100, 200, 100);
}
*/

// Clouds ----------------------------------------------------------------------------
function drawCloud(x, y, NoteLenghtInPx, Velocity) {
	
	//drawFastCloud(x, y, NoteLenghtInPx, Velocity);
	//return;

	w = NoteLenghtInPx;
	n = (Velocity * 10) * (NoteLenghtInPx / 200);
	h = windowHeight / 15;
	s = 10;
	//d = 0;

	n = n * 0.12; // needed to lower number for more faster clouds 

	// fast colour and size
	a = 0.2;
	c = 1;
		
	//newSize = s * Math.random() + s + 3;
	radius = s * 3;

	mgraphics.set_source_rgba(c,c,c,a);


	for (var i = 0; i < n; i++)
	{
		//calculates a random position in a rectangle
		posx = Math.random() * w;
		posy = Math.random() * h;
		
		// adds random diplasement to make less blocky
		//posx = posx - (d / 2 ) + (Math.random() * d);
		//posy = posy - (d / 2 ) + (Math.random() * d);

		//a = Math.random()/2;
		//c = (Math.random()/0.1) + 0.97;
		
		//newSize = s * Math.random() + s + 3;
		
		//mgraphics.set_source_rgba(c,c,c,a);
		
		drawFastCircle(x + posx, y + posy, radius);
	}
}

function drawFastCloud(x, y, NoteLenghtInPx, Velocity) 
{	
	w = NoteLenghtInPx;
	h = windowHeight / 15;
	n = NoteLenghtInPx / 20;

	shape = 16;


	with (mgraphics) {
		set_source_rgba(1, 1, 1, 1);
		move_to(x,y);

		for(var i = 0; i < n; i++) 
		{
			line_to(x + ((w/n) * (i + 1)), y + (Math.random() * shape)); // line_to(x + w, y);
		}

		line_to(x + w, y + h);
		// for(var i = 0; i < n; i++) 
		// {
		// 	line_to(x + ((w/n) * (i + 1)), y + (Math.random() * shape)); // line_to(x + w, y + h);
		// }

		
		for(var i = 0; i < n; i++) 
		{
			line_to(x + ((w/n) * (n - (i + 1))), y + h + (Math.random() * shape)); // line_to(x, y + h);
		}
		
		line_to(x,y);
		close_path();
		fill();
	}

}
// ------------------------------- Draw Cherokee --------------------------------------- 

function drawCherokee() {
	x = cherokee.position[0] + screen.position[0];
	y = cherokee.position[1] + screen.position[1];
	w = cherokee.relSize[0];
	h = cherokee.relSize[1];
	r = cherokee.colour[0];
	g = cherokee.colour[1];
 	b = cherokee.colour[2];
	a = cherokee.colour[3];
	s = 1;
	
//	drawEllipse(x, y, 5, 5, 1, 0, 0, 1);
	
	// hf
	if (cherokee.facing[0] == "right") {
		hf = 1;
	}
	else if (cherokee.facing[0] == "left") {
		hf = -1;
	}
	
	// body and head
	drawCherokeeBody(x - 25, y - 115, 50, 1, 1, 1);
	
	// Arms
	drawCherokeeArmBack(x + (24 * hf), y - 115, 50, hf, 1, 0);
	drawCherokeeArmFront(x - (24 * hf), y - 115, 50, hf, 1, 0)
	// Feet
	cherokee.legLift = cherokee.legLift + 1;
	if (cherokee.legLift >= Math.abs(cherokee.velocity[0])) {
		cherokee.legLift = -Math.abs(cherokee.velocity[0]);
	}
	
	if (Math.abs(cherokee.velocity[0]) > 1) {
		legLift = Math.abs(cherokee.legLift);
	} else {
		legLift = 2.5;
		y = y + 2.5;
	}
	
	drawCherokeeBoot(x + 13 * hf, y - (23 + legLift), 50, hf, 1, 1);
	drawCherokeeBoot(x - 13 * hf, y - (27 - legLift), 50, hf, 1, 1.2);
}


function drawCherokeeBody(x, y, s, hf, vf, state) {
	xi = s * 0.1 * hf;
	yi = s * 0.1 * vf;
	l = Math.abs(xi) * 0.5;
	a = 1;
	
	//Head
	drawGridSetup(l, "butt", 1, 0.74, 0.5, a);
	drawGridMove(1, 5, x, y, xi, yi);
	drawGridLine(9, 0, x, y, xi, yi);
	drawGridLine(9, -8, x, y, xi, yi);
	drawGridLine(1, -8, x, y, xi, yi);
	drawGridLine(1, 0, x, y, xi, yi);
	mgraphics.fill();
	
	//Cap
	drawGridSetup(l, "butt", cherokee.colour[0], cherokee.colour[1], cherokee.colour[2], a);
	drawGridMove(0, -7, x, y, xi, yi);
	drawGridLine(10, -7, x, y, xi, yi);
	drawGridLine(10, -9, x, y, xi, yi);
	drawGridLine(0, -9, x, y, xi, yi);
	drawGridLine(0, -7, x, y, xi, yi);
	mgraphics.fill();
	
	// Under Tee
	drawGridSetup(l, "butt", 0.9, 0.9, 0.9, a);
	drawGridMove(0, 0, x, y, xi, yi);
	drawGridLine(0, 16, x, y, xi, yi);
	drawGridLine(10, 16, x, y, xi, yi);
	drawGridLine(10, 0, x, y, xi, yi);
	drawGridLine(7, 0, x, y, xi, yi);
	drawGridCurve(7, 0, 5, 3, 3, 0, x, y, xi, yi);
	drawGridLine(0, 0, x, y, xi, yi);
	mgraphics.fill();
	
	// Tunic
	drawGridSetup(l, "butt", cherokee.colour[0], cherokee.colour[1], cherokee.colour[2], a);
	drawGridMove(0, 0, x, y, xi, yi);
	drawGridLine(0, 16, x, y, xi, yi);
	drawGridLine(10, 16, x, y, xi, yi);
	drawGridLine(10, 0, x, y, xi, yi);
	drawGridLine(8.5, 0, x, y, xi, yi);
	drawGridLine(5, 5, x, y, xi, yi);
	drawGridLine(1.5, 0, x, y, xi, yi);
	drawGridLine(0, 0, x, y, xi, yi);
	mgraphics.fill();
	
	// Tunic
	drawGridSetup(l, "butt", 0.5, 0.3, 0.2, a);
	drawGridMove(0, 10, x, y, xi, yi);
	drawGridLine(0, 12, x, y, xi, yi);
	drawGridLine(10, 12, x, y, xi, yi);
	drawGridLine(10, 10, x, y, xi, yi);
	drawGridLine(0, 10, x, y, xi, yi);
	mgraphics.fill();
	
	
	//Left Leg
	drawGridSetup(l, "butt", 0.9, 0.9, 0.9, a);
	drawGridMove(1, 16, x, y, xi, yi);
	drawGridLine(1, 20, x, y, xi, yi);
	drawGridLine(4, 20, x, y, xi, yi);
	drawGridLine(4, 16, x, y, xi, yi);
	drawGridLine(1, 16, x, y, xi, yi);
	mgraphics.fill();
	
	//Left Leg
	drawGridSetup(l, "butt", 0.9, 0.9, 0.9, a);
	drawGridMove(6, 16, x, y, xi, yi);
	drawGridLine(6, 20, x, y, xi, yi);
	drawGridLine(9, 20, x, y, xi, yi);
	drawGridLine(9, 16, x, y, xi, yi);
	drawGridLine(6, 16, x, y, xi, yi);
	mgraphics.fill();
	
	var l = (s * 0.05);
	
	// Mouth
	drawLine(x + 15, y - 8, x + 35, y - 8, l, 0, 0, 0, 1);
	
	// Eyes
	var x = x + 25;
	var y = y -50;
	var l = (s * 0.04);
	var s = s * 1.5;

	drawCurvedLine(x - (s * 0.05), y + s - (s * 0.6), x - (s * 0.05), y + s - (s * 0.7), x - (s * 0.18), y + s - (s * 0.7), l, 0.3, 0.3, 0.3, a);
	drawCurvedLine(x + (s * 0.05), y + s - (s * 0.6), x + (s * 0.05), y + s - (s * 0.7), x + (s * 0.18), y + s - (s * 0.7), l, 0.3, 0.3, 0.3, a);
}

function drawCherokeeArmBack(x, y, s, hf, vf, state) {
	xi = s * 0.2 * hf;
	yi = s * 0.2 * vf;
	l = Math.abs(xi) * 0.5;
	a = 1

	// Hand
	drawGridSetup(l, "butt", 1, 0.8, 0.5, a);
	drawGridMove(2, 4, x, y, xi, yi);
	drawGridLine(3, 4, x, y, xi, yi);
	drawGridCurve(4, 4, 5.4, 5.1, 3.7, 4.4, x, y, xi, yi);
	drawGridCurve(3.7, 4.4, 5.2, 5.4, 3.7, 5, x, y, xi, yi);
	drawGridCurve(3.7, 5, 5, 5.8, 3.5, 5.5, x, y, xi, yi);
	mgraphics.fill();
	
	// Under tee
	drawGridSetup(l, "butt", 0.9, 0.9, 0.9, a);
	drawGridMove(2.5, 3, x, y, xi, yi);
	drawGridLine(3, 4, x, y, xi, yi);
	drawGridCurve(3, 4, 2, 4, 2.5, 5.5, x, y, xi, yi);
	drawGridLine(1, 3.5, x, y, xi, yi);
	drawGridLine(0, 0, x, y, xi, yi);
	mgraphics.fill();
	
	// Tunic
	drawGridSetup(l, "butt", cherokee.colour[0], cherokee.colour[1], cherokee.colour[2], a);
	drawGridMove(0, 0, x, y, xi, yi);
	drawGridLine(2.5, 3, x, y, xi, yi);
	drawGridLine(1.3, 4, x, y, xi, yi);
	drawGridLine(0, 2.5, x, y, xi, yi);
	drawGridLine(0, 0, x, y, xi, yi);
	mgraphics.fill();
}

function drawCherokeeArmFront(x, y, s, hf, vf, state) {
	xi = s * 0.2 * hf;
	yi = s * 0.2 * vf;
	l = Math.abs(xi) * 0.5;
	a = 1

	// Hand
	drawGridSetup(l, "butt", 1, 0.8, 0.5, a);
	drawGridMove(2, 4, x, y, xi, yi);
	drawGridLine(3, 4, x, y, xi, yi);
	drawGridCurve(4, 4, 5.4, 5.1, 3.7, 4.4, x, y, xi, yi);
	drawGridCurve(3.7, 4.4, 5.2, 5.4, 3.7, 5, x, y, xi, yi);
	drawGridCurve(3.7, 5, 5, 5.8, 3.5, 5.5, x, y, xi, yi);
	mgraphics.fill();
	
	// Under tee
	drawGridSetup(l, "butt", 0.9, 0.9, 0.9, a);
	drawGridMove(2.5, 3, x, y, xi, yi);
	drawGridLine(3, 4, x, y, xi, yi);
	drawGridCurve(3, 4, 2, 4, 2.5, 5.5, x, y, xi, yi);
	drawGridLine(1, 3.5, x, y, xi, yi);
	drawGridLine(0, 0, x, y, xi, yi);
	mgraphics.fill();
	
	// Tunic
	drawGridSetup(l, "butt", cherokee.colour[0], cherokee.colour[1], cherokee.colour[2], a);
	drawGridMove(0, 0, x, y, xi, yi);
	drawGridLine(2.5, 3, x, y, xi, yi);
	drawGridLine(1.3, 4, x, y, xi, yi);
	drawGridLine(0, 2.5, x, y, xi, yi);
	drawGridLine(0, 0, x, y, xi, yi);
	mgraphics.fill();
}

function drawCherokeeBoot(x, y, s, hf, vf, state) {
	xi = s * 0.111 * hf;
	yi = s * 0.111 * vf;
	l = Math.abs(xi) * 0.5;
	a = 1;
	
	//Boot
	drawGridSetup(l, "round", 0.3 * state, 0.3 * state, 0.2 * state, a);
	drawGridMove(2, 4, x, y, xi, yi);
	drawGridLine(1, 4, x, y, xi, yi);
	drawGridLine(1, 3, x, y, xi, yi);
	drawGridLine(3, 4, x, y, xi, yi);
	drawGridLine(6, 4, x, y, xi, yi);
	drawGridCurve(6, 4, 7, 2, 4, 2, x, y, xi, yi);
	drawGridLine(3, 1, x, y, xi, yi);
	drawGridLine(2, -1, x, y, xi, yi);
	drawGridLine(1, -1, x, y, xi, yi);
	drawGridLine(1, 2, x, y, xi, yi);
	drawGridLine(-1, 1, x, y, xi, yi);
	drawGridLine(-1, -1, x, y, xi, yi);
	drawGridLine(-2, -1, x, y, xi, yi);
	drawGridLine(-2, 4, x, y, xi, yi);
	mgraphics.fill();
	
	//Heal
	drawGridSetup(l, "round", 0.3 * state, 0.2 * state, 0.2 * state, a);
	drawGridMove(-2, 4, x, y, xi, yi);
	drawGridLine(1, 4, x, y, xi, yi);
	drawGridLine(1, 3, x, y, xi, yi);
	drawGridLine(-2, 3, x, y, xi, yi);
	drawGridLine(-2, 3, x, y, xi, yi);
	drawGridLine(-2, 4, x, y, xi, yi);
	mgraphics.fill();
	
	//Sole
	drawGridSetup(l, "butt", 0.3 * state, 0.2 * state, 0.2 * state, a);
	drawGridMove(-2, 3, x, y, xi, yi);
	drawGridLine(1, 3, x, y, xi, yi);
	drawGridLine(3, 4, x, y, xi, yi);
	drawGridLine(6, 4, x, y, xi, yi);
	mgraphics.stroke();
	
	//Elastic
	drawGridSetup(l, "round", 0.6 * state, 0.6 * state, 0.4 * state, a);
	drawGridMove(-1, -0.5, x, y, xi, yi);
	drawGridLine(-1, 1, x, y, xi, yi);
	drawGridLine(1, 2, x, y, xi, yi);
	drawGridLine(1, 0.5, x, y, xi, yi);
	drawGridLine(1, -0.5, x, y, xi, yi);
	drawGridLine(-1, -0.5, x, y, xi, yi);
	mgraphics.fill();
}

// ------------------------------- Draw Instrument --------------------------------------- 

function drawInstrument() {
	s = instrument.relSize[0];
	x = instrument.position[0] + screen.position[0];
	y = instrument.position[1] + screen.position[1];
	r = instrument.colour[0];
	g = instrument.colour[1];
 	b = instrument.colour[2];
	a = instrument.colour[3];
	
	if (instrument.name == "Anton") {
		drawAnton(x, y, s, r, g, b, a);
	} else if (instrument.name == "Rainstick") {
		drawRainstick(x, y, s);
	} else if (instrument.name == "Blp512") {
		drawBlp512(x, y, s);
	} else {
		drawEllipse(x, y, 5, 5, 1, 0, 0, 1);
	}
}

function drawAnton(x, y, s, r, g, b, a) {
	
	// Velocity Particles
	createParticles(instrument.position[0], instrument.position[1], instrument.speed * 0.1, r, g, b);
	
	var x = x + 2;
	var y = y - 35;
	
	l = (s * 0.03);
	
	drawLine(x, y, x, y + s, l, r, g, b, a);
	
	drawCurvedLine(x, y + s, x, y + s - (s * 0.1), x + (s * 0.05), y + s - (s * 0.1), l, r, g, b, a);
	drawCurvedLine(x, y + s, x, y + s - (s * 0.1), x - (s * 0.05), y + s - (s * 0.1), l, r, g, b, a);
	
	drawCurvedLine(x - (s * 0.05), y + s - (s * 0.1), x + (s * 0.05), y + s - (s * 0.15), x - (s * 0.08), y + s - (s * 0.2), l, r, g, b, a);
	drawCurvedLine(x + (s * 0.05), y + s - (s * 0.1), x - (s * 0.05), y + s - (s * 0.15), x + (s * 0.08), y + s - (s * 0.2), l, r, g, b, a);
	
	drawCurvedLine(x + (s * 0.08), y + s - (s * 0.2), x + (s * 0.2), y + s - (s * 0.23), x + (s * 0.2), y + s - (s * 0.38), l, r, g, b, a);
	drawCurvedLine(x - (s * 0.08), y + s - (s * 0.2), x - (s * 0.2), y + s - (s * 0.23), x - (s * 0.2), y + s - (s * 0.38), l, r, g, b, a);

	drawCurvedLine(x, y + s - (s * 0.9), x , y + s - (s * 0.8), x - (s * 0.06), y + s - (s * 0.75), l, r, g, b, a);

	drawCurvedLine(x - (s * 0.06), y + s - (s * 0.75), x - (s * 0.12), y + s - (s * 0.72), x - (s * 0.1), y + s - (s * 0.63), l, r, g, b, a);
	
	drawCurvedLine(x - (s * 0.1), y + s - (s * 0.63), x - (s * 0.08), y + s - (s * 0.55), x - (s * 0.13), y + s - (s * 0.49), l, r, g, b, a);
	
	// Eyes
	
	l = (s * 0.04);
	
	drawCurvedLine(x - (s * 0.05), y + s - (s * 0.6), x - (s * 0.05), y + s - (s * 0.7), x - (s * 0.15), y + s - (s * 0.7), l, 0.3, 0.3, 0.3, a);
	drawCurvedLine(x + (s * 0.05), y + s - (s * 0.6), x + (s * 0.05), y + s - (s * 0.7), x + (s * 0.15), y + s - (s * 0.7), l, 0.3, 0.3, 0.3, a);
}

function drawBlp512(x, y, s) {
	var r = 0.9;
	var g = 0.9;
	var b = 0;
	var a = 1;
	
	// Velocity Particles
	createParticles(instrument.position[0], instrument.position[1], instrument.speed * 0.1, r, g, b);
	
	var s = s * 0.7;
	var x = x - 8;
	
	//Body
	var l = (s * 0.05);
	var w = s * 0.5;
	var h = s * 0.2;
	
	drawEmptyRoundRect(x, y, w, h, l, s * 0.001, r, g, b, a);

	// Eyes
	 l = (s * 0.04);
	s = s * 1.5;
	x = x + (s * 0.17);
	y = y - (s * 0.37);

	drawCurvedLine(x - (s * 0.05), y + s - (s * 0.6), x - (s * 0.05), y + s - (s * 0.7), x - (s * 0.18), y + s - (s * 0.7), l, 0.3, 0.3, 0.3, a);
	drawCurvedLine(x + (s * 0.05), y + s - (s * 0.6), x + (s * 0.05), y + s - (s * 0.7), x + (s * 0.18), y + s - (s * 0.7), l, 0.3, 0.3, 0.3, a);
}

function drawRainstick(x, y, s) {
	
	// neagtive 1/4 pi raditons of rotation
	
	var r = 0.5;
	var g = 0.4;
	var b = 0.2;
	var a = 1;
	
	// Velocity Particles
	createParticles(instrument.position[0], instrument.position[1], instrument.speed * 0.1, r, g, b);
	
	//Body
	var l = (s * 0.03);
	var w = s * 0.25;
	var h = s * 1;
	var x = x - 6;
	var y = y - 35;
	
	drawEmptyRoundRect(x, y, w, h, l, s * 0.001, r, g, b, a);
	
	// Lines
	var l = (s * 0.02);
	drawLine(x + (s * 0.06), y + (s * 0.1), x + (s * 0.06), y + (s * 0.7), l, r, g, b, a);
	drawLine(x + (s * 0.06), y + (s * 0.8), x + (s * 0.06), y + (s * 0.9), l, r, g, b, a);
	drawLine(x + (s * 0.12), y + (s * 0.2), x + (s * 0.12), y + (s * 0.8), l, r, g, b, a);
	drawLine(x + (s * 0.18), y + (s * 0.1), x + (s * 0.18), y + (s * 0.4), l, r, g, b, a);
	drawLine(x + (s * 0.18), y + (s * 0.6), x + (s * 0.18), y + (s * 0.9), l, r, g, b, a);

	// Eyes
	var l = (s * 0.04);
	var s = s * 1.5;
	var x = x + (s * 0.084);
	var y = y - (s * 0.2);

	drawCurvedLine(x - (s * 0.05), y + s - (s * 0.6), x - (s * 0.05), y + s - (s * 0.7), x - (s * 0.18), y + s - (s * 0.7), l, 0.3, 0.3, 0.3, a);
	drawCurvedLine(x + (s * 0.05), y + s - (s * 0.6), x + (s * 0.05), y + s - (s * 0.7), x + (s * 0.18), y + s - (s * 0.7), l, 0.3, 0.3, 0.3, a);
}

// -- Portal ---

function drawPortal(x, y, active) {
	// draw pillars
	drawPillar(x, y);
	drawPillar(x + 230, y);

	
	// if active draw portal
	if (active) {
		
		drawRect(x, y, s, s, 1, 0, 1, 1);
	}
}

function drawPillar(x, y) {
	drawRect(x, y, 30, 150, 0.2, 0.2, 0.2, 0.8);
}

// ---------------------- Particle -----------------------

function drawParticles() { 
	for (var i = 0; i < particles.length; i++) {
		drawParticle(i);
	}
}

function drawParticle(i) {
	
	x = particles[i].position[0] + screen.position[0];
	y = particles[i].position[1] + screen.position[1];
	s = particles[i].relSize;
	r = particles[i].colour[0];
	g = particles[i].colour[1];
 	b = particles[i].colour[2];
	a = particles[i].colour[3];
	
	drawEllipse(x, y, s, s, r, g, b, a);
}

// Enemies ----------------------------------------------------------------
/*
function drawEnemies() {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i]) {
			drawEnemy(i);
		}
	}
}

function drawEnemy(i) {
	x = enemies[i].position[0] + screen.position[0];
	y = enemies[i].position[1] + screen.position[1];
	s = enemies[i].relSize;
	r = enemies[i].colour[0];
	g = enemies[i].colour[1];
 	b = enemies[i].colour[2];
	a = enemies[i].colour[3];
	
	drawEllipse(x, y, s, s, r, g, b, a);
}
*/
// ---------------------- Projectile ------------------
/*
function drawProjectiles() { 
	for (var i = 0; i < projectiles.length; i++) {
		drawProjectile(i);
	}
}

function drawProjectile(i) {
	
	x = projectiles[i].position[0] + screen.position[0];
	y = projectiles[i].position[1] + screen.position[1];
	s = projectiles[i].relSize;
	r = projectiles[i].colour[0];
	g = projectiles[i].colour[1];
 	b = projectiles[i].colour[2];
	a = 1;
	
	// type depemntst draw and calulation
	
	//drawHeart(x, y, s, 1, a);
	drawLine(x, y, x + 30, y, 10, 0, 1, 1, 1);

}
*/
// ---------------------- GUI's -----------------------

function drawGUI() { 
	
	if (instrumentGUI.isDisplaying) {
		
		// Dim BackGround
		drawRect(0, 0, windowWidth, windowHeight, 0, 0, 0, 0.8);
		
		// Draw Menu
		var x = windowWidth * 0.5;
		var y = windowHeight * 0.5; 
		var w = instrumentGUI.unlockedInstrument.length * instrumentGUI.relSize;
		var h = instrumentGUI.relSize;
		
		drawRoundRect(x - (w * 0.5), y - (h * 0.5), w, h, 0.1 / instrumentGUI.unlockedInstrument.length, 1, 1, 1, 0.5);
		
		// Draw Highlight
		x = windowWidth * 0.5;
		y = windowHeight * 0.5; 
		w = 1 * instrumentGUI.highlightSize;
		h = instrumentGUI.highlightSize;
		
		drawRoundRect(x - (w * 0.5), y - (h * 0.5), w, h, 0.1, 0, 0, 0, 0.9); 
		
		// Draw Caricters
		r = instrument.colour[0];
		g = instrument.colour[1];
 		b = instrument.colour[2];
		a = instrument.colour[3];
		
		// Anton
		if (isInstrumentUnlocked("Anton")) {
			var x = windowWidth * 0.5; //(instrumentGUI.unlockedInstrument.indexof("Anton"));
			var s = instrumentGUI.relSize * 0.6;	
			drawAnton(x, y - (s * 0.55) - (s * 0.06), s, r, g, b, a); // Draw Anton
			drawText(x - (s * 0.34), y + (s * 0.66), s * 0.25, "Comic Sans MS", "Anton", 1, 1, 1);
		}
		
		// Title
		var x = windowWidth * 0.5;
		var y = windowHeight * 0.1; 
		var s = instrumentGUI.relSize * 0.6;
		drawText(x - s, y, s * 0.35, "Comic Sans MS", "Instruments", 1, 1, 1);
	} 
}

function isInstrumentUnlocked(string) {
	for (var i = 0; i < instrumentGUI.unlockedInstrument.length; i++) {
		if (instrumentGUI.unlockedInstrument[i] == (string)) {
			return true;
		} else {
			return false;
		}
	}
}

// ------------------ Level GUI ---------------------

function drawLevelGUI() {
	var x = windowWidth;
	var y = windowHeight * 0.12;
	var h = windowHeight * 0.05;
	var a = 1;
	
	drawHeart(x * 0.1, y * 0.5, h, 1, a);
	drawText(x * 0.13, y * 0.72, h, "arial", "x " + cherokee.numLives, 0, 0, 0);
	//drawHealthBar(x * 0.2, y * 0.5, x * 0.29, h, a);
	//drawMusicBar(x * 0.51, y * 0.5, x * 0.3, h, a);
	drawNote(x * 0.85, y * 0.5, h, 0, 0.6, 0, a);
	drawText(x * 0.865, y * 0.72, h, "arial", "x " + cherokee.noteScore, 0, 0, 0);
}

// ------------------- Music Bar -------------------
/*
function drawMusicBar(x, y, w, h, a) {
	var music = w * (cherokee.music / cherokee.maxMusic);
	drawRect(x, y - (h * 0.5), w, h, 0.9, 1, 0.9, a);
	drawRect(x, y - (h * 0.5), music, h, 0, 0.6, 0, a);
}
*/
// -------------------- Note -----------------------

function drawNote(x, y, s, r, g, b, a) {
	var i = s * 0.2;
	var l = i * 0.35;
	
	mgraphics.move_to(x, y + 2 * i);
	drawCurvedLineSegment(x, y + 2 * i, x, y + 3 * i, x - i, y + 3 * i, l, r, g, b, a);
	drawCurvedLineSegment(x - i, y + 3 * i, x - 2 * i, y + 3 * i, x - 2 * i, y + 2 * i, l, r, g, b, a);
	drawCurvedLineSegment(x - 2 * i, y + 2 * i, x - 2 * i, y + 1 * i, x - i, y + i, l, r, g, b, a);
	drawCurvedLineSegment(x - i, y + i, x, y + i, x, y + 2 * i, l, r, g, b, a);
	mgraphics.stroke();

	mgraphics.move_to(x, y + 2 * i);
	drawLineSegment(x, y -3 * i, l, r, g, b, a);
	drawLineSegment(x + 1.3 * i, y - 1.5 * i, l, r, g, b, a);
	mgraphics.stroke();
	
	drawCurvedLine(x + i * 0.5, y - i * 1, x + i * 0.5, y - i * 2, x + i * 1.5, y - i * 2, l, 0.3, 0.3, 0.3, a);
	drawCurvedLine(x - i * 0.5, y - i * 1, x - i * 0.5, y - i * 2, x - i * 1.5, y - i * 2, l, 0.3, 0.3, 0.3, a); 
}

// ------------------- Health Bar -------------------
/*
function drawHealthBar(x, y, w, h, a) {
	var life = w * (cherokee.health / cherokee.maxHealth);
	drawRect(x, y - (h * 0.5), w, h, 1, 0.9, 0.9, a);
	drawRect(x, y - (h * 0.5), life, h, 0.95, 0, 0, a);
}
*/
// -------------------- Heart -----------------------

function drawHeart(x, y, s, state, a) {
	var i = s * 0.25;
	var l = i * 0.5;
	
	// body
	if (state == 1) {
		drawHeartLineSegment(x, y, i, l, 1, 0.6, 0.6, a);
		mgraphics.fill();
	}
	
	// outline
	drawHeartLineSegment(x, y, i, l, 0.95, 0, 0, a);
	mgraphics.stroke();
}

function drawHeartLineSegment(x, y, i, l, r, g, b, a) {
	mgraphics.move_to(x - 2 * i, y - i);
	drawLineSegment(x, y + 1.5 * i, l, r, g, b, a);
	drawLineSegment(x + 2 * i, y - i, l, r, g, b, a);
	drawCurvedLineSegment(x + 2 * i, y - i, x + i, y - 3 * i, x, y - i, l, r, g, b, a);
	drawCurvedLineSegment(x, y - i, x - i, y - 3 * i, x - 2 * i, y - i, l, r, g, b, a);
}

function drawTree(x, NoteLenghtInPx, y, Velocity) {	
	
	var numHeads = Velocity/7;
	var treeHeads = [];
	var xpos = x;
	var ypos = y;
	var d = 180;
	var l = 2;
	
	// Heads
	a = 0.3;
	for (var i = 0; i < numHeads; i++)
	{
		//clear array
		if (i == 0)
		{
			treeHeads = [];
		}

		// pick random points around a point
		var x = xpos + (Math.random() * d) - (d * 0.5);
		var y = ypos + (Math.random() * d) - (d * 0.5);
		var w = (Math.random() * 40) + 20;
		var h = (Math.random() * 40) + 20;
		
		// random colour 
		var r = Math.random();
		var g = Math.random();
		var b = Math.random();
		
		// store the points and colours in an array
		treeHeads.push([x, y + (h / 2), w, h, l, r, g, b]);
	
		// genarate a sqaure for each
		drawEmptyRect(x - (w / 2), y - (h / 2), w, h, l, r, g, b, a);
		drawRect(x - (w / 2), y - (h / 2), w, h, r, g, b, a -0.2);
	}

	// sort the array for small x to bigest x
	treeHeads.sort();

	// Stems
	for (var i = 0; i < numHeads; i++)
	{
		// draw a square path with minimal overlaps from x y in the array to the ground 

		// callback corect colour 
		var r = treeHeads[i][5];
		var g = treeHeads[i][6];
		var b = treeHeads[i][7];
		
		// callback corect colour 
		var w = treeHeads[i][2];
		var h = treeHeads[i][3];
		
		// draw a sqaure path from x y in the array to the ground 
		
		var lineSpace = 3;
		
		yrandoffset = 0 - (Math.random() * 40);
		xendpoint = xpos - (numHeads * 0.5 * lineSpace) + (i * lineSpace);
		
		// alternate first 2 lines form taking effect
	 	drawLine(treeHeads[i][0], treeHeads[i][0], treeHeads[i][1], treeHeads[i][1] - yrandoffset, l, r, g, b, a);
		drawLine(treeHeads[i][0], xendpoint, treeHeads[i][1] - yrandoffset, treeHeads[i][1] - yrandoffset, l, r, g, b, a);
		drawLine(xendpoint, xendpoint, treeHeads[i][1] - yrandoffset, y, l, r, g, b, a);
			
		// center the baise lines
		// move the y offest to start beloew the sqaure

	}
}


// -------------------------------------------------------------------------------------
// -------------------- Basic Graphics Calls -------------------------------------------
// -------------------------------------------------------------------------------------

function drawRect(x, y, w, h, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		rectangle(x, y, w, h);
		fill();
	}
}

function drawEmptyRect(x, y, w, h, l, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		set_line_width(l);
		set_line_cap("round");
		rectangle(x, y, w, h);
		stroke();
	}
}

function drawRoundRect(x, y, w, h, roundness, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		rectangle_rounded(x, y, w, h, w * roundness, h * roundness);
		fill();
	}
}

function drawEmptyRoundRect(x, y, w, h, l, roundness, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		set_line_width(l);
		rectangle_rounded(x, y, w, h, w * roundness, h * roundness);
		stroke();
	}
}

function drawEllipse(x, y, w, h, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		ellipse(x, y, w, h);
		fill();
	}
}

function drawFastCircle(x, y, r) {
	with (mgraphics) {
		arc(x, y, r, 0, 6.2);
		fill();
	}
}

function drawLine(x1, y1, x2, y2, l, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		set_line_width(l);
		set_line_cap("round");
		move_to(x1, y1);
		line_to(x2, y2);
		stroke();
	}
}

function drawLineSegment(x1, y1, l, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		set_line_width(l);
		set_line_cap("round");
		line_to(x1, y1);
	}
}

function drawCurvedLine(x1, y1, x2, y2, x3, y3, l, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		set_line_width(l);
		set_line_cap("round");
		move_to(x1, y1);
		curve_to(x1, y1, x2, y2, x3, y3);
		stroke();
	}
}

function drawCurvedLineSegment(x1, y1, x2, y2, x3, y3, l, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		set_line_width(l);
		set_line_cap("round");
		move_to(x1, y1);
		curve_to(x1, y1, x2, y2, x3, y3);
	}
}

function drawText(x, y, s, font, string, r, g, b) {
		with (mgraphics) {
		select_font_face(font);
		set_font_size(s);
		set_source_rgb(r, g, b);
		move_to(x, y);
		text_path(string);
		fill();
	}
} 

// GRID DRAWING
function drawGridSetup(l, lineCap, r, g, b, a) {
	with(mgraphics) {
		set_line_width(l);
		set_source_rgba(r, g, b, a);
		set_line_cap(lineCap);
	}
}

function drawGridMove(xcord, ycord, x, y, xi, yi) {	
	newx = x + (xcord * xi);
	newy = y + (ycord * yi);
	mgraphics.move_to(newx, newy);
}

function drawGridLine(xcord, ycord, x, y, xi, yi) {	
	newx = x + (xcord * xi);
	newy = y + (ycord * yi);
	mgraphics.line_to(newx, newy);
}

function drawGridCurve(xcord1, ycord1, xcord2, ycord2, xcord3, ycord3, x, y, xi, yi) {	
	x1 = x + (xcord1 * xi);
	y1 = y + (ycord1 * yi);
	x2 = x + (xcord2 * xi);
	y2 = y + (ycord2 * yi);
	x3 = x + (xcord3 * xi);
	y3 = y + (ycord3 * yi);
	mgraphics.curve_to(x1, y1, x2, y2, x3, y3);
}