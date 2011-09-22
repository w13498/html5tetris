function Game() {
    var thisObject = this,
    i;

    this.firstLoop = true;

    this.blocks = [];    
    this.controlGroup = null;

    // make the preview blocks
    this.previewBlocks = [];
    for (i = 0; i < 4; i++) {
	this.previewBlocks.push(new Block({x: -1, y: -1, preview: true}));
    }

    // TODO: should this be driven from configuration???
    this.level = 1;
    this.dropPeriod = 500;
    this.timeToNextDrop = this.dropPeriod;

    // TODO: find the official values for these constants
    this.keyChargeTime = 200;
    this.keyRepeatTime = 100;
    
    this.lastTime = null;
    
    this.input = {
	left: { 
	    autoRepeat: true,
	    handler: function () {
		thisObject.controlGroup.shift(true);
	    }
	},
	right: { 
	    autoRepeat: true,
	    handler: function() {
		thisObject.controlGroup.shift(false);
	    }
	},
	down: { handler: function() {
	    thisObject.dropBlock();
	}},
	space: { handler: function() {
	    thisObject.controlGroup.fall();
	}},
	z: { handler: function() {
	    thisObject.controlGroup.turn(false);
	}},
	x: { handler: function() {
	    thisObject.controlGroup.turn(true);
	}}
    };
}

/**
* drops a new block into the game
*/
Game.prototype.newBlock = function () {
    var thisObject = this;
    var options = ['i', 'o', 'j', 'l', 'z', 's', 't'];
    var shape = options[Math.floor(Math.random()*7)];

    // create some new blocks
    var newBlocks = [];
    for (var i = 0; i < 4; i++) {
	var curBlock = new Block({x: -1, y: -1, shape: shape});
	newBlocks.push(curBlock);
	this.blocks.push(curBlock);
    }

    this.controlGroup = new ControlGroup(newBlocks, shape, function(x, y){
	return thisObject.isLegalPosition(x, y);
    });
};

/**
* processes the input keys
* @param {Number} dTime - the time in milliseconds since the last frame
*/
Game.prototype.processInput = function(dTime) {
    var curInput;

    for (var keyName in this.input) {
	curInput = this.input[keyName];
	
	//  if the key is down
	if (jaws.pressed(keyName)) {
	    // if it is a 'press' frame
	    if (!curInput.lastState) {
		curInput.handler();
		curInput.lastState = true;
		curInput.charged = false;
		curInput.holdTime = 0;
	    }
	    // if it supports auto-repeat
	    if (curInput.autoRepeat) {
		curInput.holdTime += dTime;

		// if not charged and past the charge time
		if ((!curInput.charged) && (curInput.holdTime > this.keyChargeTime)) {
		    // call the handler, and reset the hold time
		    curInput.holdTime -= this.keyChargeTime;
		    curInput.handler();
		    curInput.charged = true;
		}
		// if charged and past the repeat time
		if (curInput.charged && (curInput.holdTime > this.keyRepeatTime)) {
		    curInput.holdTime -= this.keyRepeatTime;
		    curInput.handler();
		}
	    }
	} else {
	    // it was released
	    curInput.lastState = false
	}
    }
};

Game.prototype.update = function() {
    // if the first block needs to be made
    if (this.firstLoop) {
	this.firstLoop = false;

	this.newBlock();

	this.lastTime = (new Date()).getTime();
    }

    // TODO: is this going to be too slow???
    var curTime = (new Date()).getTime();
    var dTime = curTime - this.lastTime;
    this.lastTime = curTime;

    this.processInput(dTime);

    this.applyGravity(dTime);

    // if a new block needs to be made
    if (this.controlGroup.isBottomed()) {
	// look for rows
	var rows = this.getRows();
	if (rows.length > 0) {
	    this.removeRows(rows);
	}
	this.newBlock();
    }
}

/**
* Renders the entire game scene
*/
Game.prototype.draw = function() {
    var i;

    // update the position of the preview blocks
    if (this.controlGroup) {
	// ask the control group to move the preview blocks
	this.controlGroup.configurePreviewBlocks(this.previewBlocks);
    } else {
	// if there is no contorl group, just move them off the screen
	for (i = 0; i < 4; i++) {
	    this.previewBlocks[i].setPosition(-1, -1);
	}
    }

    // draw the preview blocks
    for (i = 0; i < 4; i++) {
	this.previewBlocks[i].draw();
    }

    for (i = 0; i < this.blocks.length; i+= 1) {
	this.blocks[i].draw();
    }
}

/**
* Returns true iff the given position can be moved into
* @param {Number} x - the x position
* @param {Number} y - the y position
* @returns {Boolean} true iff the new position is legal
*/
Game.prototype.isLegalPosition = function (x, y) {
    var i;
    // see if it overlaps with any existing blocks
    for (i = 0; i < this.blocks.length; i += 1) {
	if (this.blocks[i].getX() === x && this.blocks[i].getY() === y) {
	    return false;
	}
    }
    
    // if it's on the field
    if (x >= 10 || x < 0 || y >= 20) {
	return false;
    }
    return true;
}

/**
* drops the controlled blocks by one
*/
Game.prototype.dropBlock = function (causedByGravity) {
    if (!causedByGravity) {
	this.timeToNextDrop = this.dropPeriod;
    }

    this.controlGroup.drop();
}