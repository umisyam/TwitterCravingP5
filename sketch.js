//Making the entire sketch as var so we can instantiate it as object later
var sketch = function(p) {
	var img;
	var pos = p.createVector();
	var vel = p.createVector();
	var rad = 5;
	var balls = [];
	var table;

	// Initial P5 preload
	p.preload = function() {
		img = p.loadImage("images/pizza.png");
	};

	// Initial P5 setup
	p.setup = function() {
		var canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    table = p.loadTable("data/TAGS v6.0ns_THESIS - Archive_24-26Nov.csv", "header", p.gotData);
    
    
		// Apply a force each time the mouse is pressed inside the canvas
		// canvas.mousePressed(applyForce);

		p.ellipseMode(p.RADIUS);
		// p.noStroke();
		img.loadPixels();
	};
	
	p.gotData = function(table) {
	  console.log(table.getRowCount());
  // console.log(table);
  
    for (var i = 0; i < table.getRowCount(); i++) {
      var row = table.getRow(i);
      console.log(row);
      
      var tweet = row.get("text");
      var username = row.get("from_user");
      var timestamp = row.get("time");
      
      // Add a new ball in each frame up to certain limit
  		if (balls.length < img.width) {
  		// while (i != balls.length) {
  			var r = 30 * p.random();
  			var alpha = p.TWO_PI * p.random();
  			pos.set(0.55 * img.width + r * p.cos(alpha), 0.4 * img.height + r * p.sin(alpha), 0);
  			vel.set(0, 0, 0);
  			rad = p.map(rad, 0, table.getRowCount(), 6, 45);
  			balls[balls.length] = new Ball(pos, vel, rad, tweet, username, timestamp);
  		// 	balls[i] = new Ball(pos, vel, rad, tweet, username, timestamp);
  		}
    }
	}

	// P5 draw function
	p.draw = function() {
		p.background(255);
		// p.colorMode(p.HSB, 255);
		// p.blendMode(p.LIGHTEST);
		// p.tint(200,200,200,100);
    p.image(img, 0, 0);
    
		// Update the balls positions
		for (var i = 0; i < balls.length; i++) {
			balls[i].update();
			balls[i].display();
		}

		// Check if the balls are in contact and move them in that case
		for (var i = 0; i < balls.length; i++) {
			for (var j = 0; j < balls.length; j++) {
				if (j != i) {
					balls[i].checkCollision(balls[j]);
				}
			}
		}
	};

  // This function applies a force to those balls that are near the cursor
	function applyForce() {
		for (var i = 0; i < balls.length; i++) {
			balls[i].force(p.mouseX, p.mouseY);
		}
	}
	
	function mousePressed() {
    // for (Ball b in balls) {
    for (var i = 0; i < balls.length; i++) {
      if (balls[i].isHovering()) {
        // when you click on each bubble, it will open up the link on browser
        // link(balls[i].placesUrl, "_new");
        console.log("Ball #" + i + "is clicked");
      }
    }
  }

	/*
	 * ===================== The Ball class ===================== 
	 */
	function Ball(initPos, initVel, rad, tweet, username, timestamp) {
		// Ball constructor
		this.pos = initPos.copy();
		this.vel = initVel.copy();
		this.col = p.color(0);
		// this.rad = 3;
		this.rad = rad;
		this.tweet = tweet;
		this.username = username;
		this.timestamp = timestamp;
	}

	Ball.prototype.update = function() {
		// Update ball position and velocity
		this.pos.add(this.vel);
		this.vel.mult(0.999);

		// Boundary/wall checking - if the ball exceeds the image size
		if (this.pos.x > img.width - this.rad) {
			this.pos.x = img.width - this.rad;
			this.vel.x *= -1;
		} else if (this.pos.x < this.rad) {
			this.pos.x = this.rad;
			this.vel.x *= -1;
		}

		if (this.pos.y > img.height - this.rad) {
			this.pos.y = img.height - this.rad;
			this.vel.y *= -1;
		} else if (this.pos.y < this.rad) {
			this.pos.y = this.rad;
			this.vel.y *= -1;
		}

		// Update new ball color and radius
		var pixel = 4 * (p.round(this.pos.x) + p.round(this.pos.y) * img.width);
		this.col = p.color(img.pixels[pixel], img.pixels[pixel + 1], img.pixels[pixel + 2]);
		// this.rad = p.map(p.brightness(this.col), 0, 255, 3, 7);
	};
	
	Ball.prototype.display = function() {
		p.fill(this.col);
		p.ellipse(this.pos.x, this.pos.y, this.rad - 0.5, this.rad - 0.5);
		
		//when you hover, show the label
    if (this.isHovering()) {
      // var div = createDiv(n);
      // div.position(0, y);
      // div.style('padding','20px');
      // div.style('background-color','#CCC');
      
      p.fill(128);
      p.rectMode(p.CENTER);
      p.rect(this.pos.x, this.pos.y , this.tweet.length + 250, this.tweet.length + 30);
      p.fill(0);
      
      p.textSize(14);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(this.tweet, this.pos.x, this.pos.y);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.fill(220,255,255);
      p.text(this.username + ",  \t" + this.timestamp, this.pos.x, this.pos.y);
    }
	};

	// Checks if the ball is in contact with another ball
	Ball.prototype.checkCollision = function(b) {
		var contactDist = this.rad + b.rad;
		var xDiff = b.pos.x - this.pos.x;
		var yDiff = b.pos.y - this.pos.y;
		var diffSq = p.sq(xDiff) + p.sq(yDiff);

		if (diffSq < p.sq(contactDist - 1)) {
			var c = contactDist / (2 * p.sqrt(diffSq));
			b.pos.set(this.pos.x + xDiff * (0.5 + c), this.pos.y + yDiff * (0.5 + c), 0);
			this.pos.set(this.pos.x + xDiff * (0.5 - c), this.pos.y + yDiff * (0.5 - c), 0);
			b.vel.set(0, 0, 0);
			this.vel.set(0, 0, 0);
		}
	};

	// This method applies a repulsive force at the given position
	Ball.prototype.force = function(x, y) {
		var xDiff = x - this.pos.x;
		var yDiff = y - this.pos.y;
		var diffSq = p.sq(xDiff) + p.sq(yDiff);
		
		if (diffSq < 1000) {
			var diff = p.sqrt(diffSq);
			var deltaVel = 15 * p.min(p.abs(this.rad / diff), 1);
			this.vel.add(-deltaVel * xDiff / diff, -deltaVel * yDiff / diff);
		}
	};
	
	Ball.prototype.isHovering = function() {
    // var distance = p.dist(p.mouseX, p.mouseY, this.pos.x +  p.width/2, this.pos.y + p.height/2);
    var distance = p.dist(p.mouseX, p.mouseY, this.pos.x, this.pos.y); 
    if(distance < this.rad/2) {
      console.log('hover!');
      return true;
    } else {
      return false;
    }
  };
  
};

var myp5 = new p5(sketch);
