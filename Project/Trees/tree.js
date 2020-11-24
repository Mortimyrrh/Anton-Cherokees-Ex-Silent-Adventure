mgraphics.init()

var windowHight;
var windowWidth;

windowWidth = box.rect[2] - box.rect[0];
windowHight = box.rect[3] - box.rect[1];

var groundHight = windowHight - 100;

function paint() { 
	drawForest();
	// genirate sence -args Foresit
	// draw a seane -draw it
	
}

function onresize() {
	windowWidth = box.rect[2] - box.rect[0];
	windowHight = box.rect[3] - box.rect[1];
	mgraphics.redraw();
}

function drawBackground() {
	with (mgraphics) {
		set_source_rgba(1, 1, 1, 1);
		rectangle(0, 0, windowWidth, windowHight);
		fill();
	}
}	

function drawForestBackground() {
	with (mgraphics) {		
		var twilight = pattern_create_linear(0, groundHight - 40, 0, windowHight);
		
		twilight.add_color_stop_rgba(0, 0.1, 0.085, 0, 1);
		twilight.add_color_stop_rgba(1, 0.05, 0.6, 0.4, 1);
		
		set_source(twilight);
		
		rectangle(0, 0, windowWidth, windowHight);
		fill();
	}
}

function drawForest() { 
	drawForestBackground();
	drawTree(150, 100, 8, 60);
	drawTree(400, 0, 12, 90);
	drawTree(700, 0, 7, 60);
	drawTree(1000, 0, 12, 30);
	drawTree(1200, 0, 5, 70);
	
}

function drawTree(x, NoteLenghtInPx, Pitch, Velocity) {	
	
	var numHeads = Velocity/7;
	var treeHeads = [];
	var xpos = x;
	var ypos = groundHight - 140 - (Pitch * 10);
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
		drawEmptyRectangleParticle (x - (w / 2), y - (h / 2), w, h, l, r, g, b, a);
		drawRectangleParticle (x - (w / 2), y - (h / 2), w, h, r, g, b, a -0.2);
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
		drawLine(xendpoint, xendpoint, treeHeads[i][1] - yrandoffset, groundHight, l, r, g, b, a);
			
		// center the baise lines
		// move the y offest to start beloew the sqaure

	}
}

//Main Particles
function drawEllipseParticle (x, y, w, h, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		ellipse(x, y, w, h);
		fill();
		stroke();
	}
}

function drawRectangleParticle (x, y, w, h, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		rectangle(x, y, w, h);
		fill();
	}
}

function drawEmptyRectangleParticle (x, y, w, h, l, r, g, b, a) {
	with (mgraphics) {
		set_source_rgba(r, g, b, a);
		set_line_width(l);
		set_line_cap('round');
		set_line_join('round');
		rectangle(x, y, w, h);
		stroke();
	}
}

function drawLine (startx, endx, starty, endy, l, r, g, b, a) {
	with (mgraphics) {
		set_line_cap('round');
		set_line_join('round');
		set_source_rgba(r, g, b, a);
		set_line_width(l);
		move_to(startx, starty);
		line_to(endx, endy);
		stroke();
	}
}