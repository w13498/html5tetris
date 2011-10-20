function Game() {
    var thisObject = this,
    i, j;

    this.firstLoop = true;

    this.blocks = [];    
    this.controlGroup = null;

    // make the preview blocks
    this.previewBlocks = [];
    for (i = 0; i < 4; i++) {
	this.previewBlocks.push(new Block({x: -10, y: -10, preview: true}));
    }

    this.scoreOutput = new TtyBlock("scoreDiv", 3);
    this.linesOutput = new TtyBlock("linesDiv", 3);
    this.levelOutput = new TtyBlock("levelDiv", 3);
    this.scoreTracker = new ScoreTracker(this.scoreOutput, this.linesOutput, this.levelOutput);

    this.dropPeriod = this.scoreTracker.getLevelPeriod();
    this.timeToNextDrop = this.dropPeriod;

    this.levelDisplay = new NumberDisplay({val: this.scoreTracker.getLevel(), x: -50, y: 420});
    this.linesDisplay = new NumberDisplay({val: this.scoreTracker.getLinesRemaining(), x: -50, y: 350});

    // TODO: get rid of the offsets here???
    this.levelLabel = new jaws.Sprite({image: 'media/numbers/level.png',
				       x:-120 + FIELD_OFFSET_X, y: 390 + FIELD_OFFSET_Y});
    this.linesLabel = new jaws.Sprite({image: 'media/numbers/lines.png',
				       x: -120 + FIELD_OFFSET_X, y: 320 + FIELD_OFFSET_Y});

    // TODO: find the official values for these constants
    this.keyChargeTime = 200;
    this.keyRepeatTime = 50;
    
    this.bottomTimer;
    this.bottomLockTime = 500;
    this.lastBottomedState = false;

    this.lastTime = null;
    
    this.gameLost = false;

    // evenly distributed random piece generator
    this.previewLength = 5;
    this.randBag = new RandomBag(this.previewLength);
    // make the preview blocks
    this.previewGroups = [];
    for (i = 0; i < this.previewLength; i++) {
	this.previewGroups.push(new PreviewGroup(330, 70 * i + 35));
    }

    this.swapGroup = null;
    this.swapAllowed = true;

    this.input = {
	left: { 
	    autoRepeat: true,
	    handler: function () {
		if (thisObject.controlGroup.shift(true)) {
		    thisObject.resetLockCounter(true);
		}
	    }
	},
	right: { 
	    autoRepeat: true,
	    handler: function() {
		if (thisObject.controlGroup.shift(false)) {
		    thisObject.resetLockCounter(true);
		}
	    }
	},
	down: {
	    autoRepeat: true,
	    preCharged: true,
	    handler: function() {
		thisObject.dropBlock();
		thisObject.scoreTracker.softDrop();
	    }
	},
	space: { handler: function() {
	    var dist = thisObject.controlGroup.fall();
	    thisObject.scoreTracker.hardDrop(dist);
	    thisObject.lockBlocks();
	}},
	z: { handler: function() {
	    if (thisObject.controlGroup.turn(false)) {
		thisObject.resetLockCounter(true);
	    }
	}},
	x: { handler: function() {
	    if (thisObject.controlGroup.turn(true)) {
		thisObject.resetLockCounter(true);
	    }
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
	curBlock = new Block({x: -10, y: -10, shape: shape});
	newBlocks.push(curBlock);
	this.blocks.push(curBlock);
    }

    this.controlGroup = new ControlGroup(newBlocks, shape, function(x, y){
	return thisObject.isLegalPosition(x, y);
    });
    
    if (this.controlGroup.isIllegalStart) {
	this.gameLost = true;
    }

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

Game.prototype.update = function(time) {
    // if the first block needs to be made
    if (this.firstLoop) {
	this.firstLoop = false;

	this.newBlock();

	this.lastTime = time;
    }

    var curTime = time;
    var dTime = curTime - this.lastTime;
    this.lastTime = curTime;

    this.processInput(dTime);

    if (!this.controlGroup.isBottomed()) {
	this.lastBottomedState = false;
	this.applyGravity(dTime);

    } else {
	// if it has just touched hte bottom
	if (!this.lastBottomedState) {
	    this.resetLockCounter(true);
	} else {
	    this.bottomTimer -= dTime;
	    
	    if (this.bottomTimer <= 0 || this.slideCount >= 15) {
		this.lockBlocks();
	    }
	}
	this.lastBottomedState = true;
    }
}

/**
* Renders the entire game scene
*/
Game.prototype.draw = function(dTime) {
    var i;

    
    this.scoreOutput.draw(dTime);
    this.linesOutput.draw(dTime);
    this.levelOutput.draw(dTime);

    // update the position of the preview blocks
    if (this.controlGroup) {
	// ask the control group to move the preview blocks
	this.controlGroup.configurePreviewBlocks(this.previewBlocks);
    } else {
	// if there is no contorl group, just move them off the screen
	for (i = 0; i < 4; i++) {
	    this.previewBlocks[i].setPosition(-10, -10);
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

    this.linesDisplay.setValue(this.scoreTracker.getLinesRemaining());
    this.linesDisplay.draw();

    this.levelLabel.draw();
    this.linesLabel.draw();

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