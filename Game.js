function Game() {
    var thisObject = this,
    i, j;

    this.firstLoop = true;

    this.blocks = [];    
    this.controlGroup = null;

    // make the preview blocks
    this.previewBlocks = [];
    for (i = 0; i < 4; i++) {
	this.previewBlocks.push(new Block({x: -1, y: -1, preview: true}));
    }

    this.scoreTracker = new ScoreTracker();
    this.dropPeriod = this.scoreTracker.getLevelPeriod();
    this.timeToNextDrop = this.dropPeriod;
    this.levelDisplay = new NumberDisplay({val: this.scoreTracker.getLevel(), x: 350, y: 430});

    // TODO: find the official values for these constants
    this.keyChargeTime = 200;
    this.keyRepeatTime = 50;
    
    this.lastTime = null;
    
    // evenly distributed random piece generator
    this.previewLength = 5;
    this.randBag = new RandomBag(this.previewLength);
    // make the preview blocks
    this.previewGroups = [];
    for (i = 0; i < this.previewLength; i++) {
	this.previewGroups.push(new PreviewGroup(340, 75 * i + 50));
    }

    this.swapGroup = null;
    this.swapAllowed = true;

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
	down: {
	    autoRepeat: true,
	    preCharged: true,
	    handler: function() {
		thisObject.dropBlock();
	    }
	},
	space: { handler: function() {
	    thisObject.controlGroup.fall();
	}},
	z: { handler: function() {
	    thisObject.controlGroup.turn(false);
	}},
	x: { handler: function() {
	    thisObject.controlGroup.turn(true);
	}},
	c: { handler: function() {
	    thisObject.swap();
	}}
    };
}

/**
* drops a new block into the game
*/
Game.prototype.newBlock = function (calledBySwap) {
    var thisObject = this,
    shape = this.randBag.popQueue(),
    newBlocks = [],
    curBlock;

    this.dropPeriod = this.scoreTracker.getLevelPeriod();

    // create some new blocks
    for (var i = 0; i < 4; i++) {
	curBlock = new Block({x: -1, y: -1, shape: shape});
	newBlocks.push(curBlock);
	this.blocks.push(curBlock);
    }

    this.controlGroup = new ControlGroup(newBlocks, shape, function(x, y){
	return thisObject.isLegalPosition(x, y);
    });

    if (!calledBySwap) {
	// the user is allowed to swap blocks again
	this.swapAllowed = true;
    }

    this.updatePreviews(this.randBag.getQueue());
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
		curInput.charged = (curInput.preCharged ? true : false);
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

    // draw the swap block
    if (this.swapGroup) {
	this.swapGroup.draw();
    }

    // draw the queue
    for (i = 0; i < this.previewGroups.length; i++) {
	this.previewGroups[i].draw();
    }

    for (i = 0; i < this.blocks.length; i+= 1) {
	this.blocks[i].draw();
    }

    this.levelDisplay.setValue(this.scoreTracker.getLevel());
    this.levelDisplay.draw();

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