
function Game() {
    this.processInput = Game.processInput;
    this.update = Game.update;
    this.draw = Game.draw;
    this.newBlock = Game.newBlock;
    this.isLegalPosition = Game.isLegalPosition
    this.newBlock = Game.newBlock;
    this.dropBlock = Game.dropBlock;
    
    var thisObject = this;

    this.blocks = [];
    
    this.controlGroup = null;
    
    this.input = {
	left: {
	    handler: function () {
		thisObject.controlGroup.shift(true);
	    }
	},
	right: {
	    handler: function() {
		thisObject.controlGroup.shift(false);
	    }
	},
	down: {
	    handler: function() {
		thisObject.dropBlock();
	    }
	},
	z: {
	    handler: function() {
		thisObject.controlGroup.turn(false);
	    }
	},
	x: {
	    handler: function() {
		thisObject.controlGroup.turn(true);
	    }
	}
    };
}

/**
* drops a new block into the game
*/
Game.newBlock = function () {
    var thisObject = this;
    var options = ['i', 'o', 'j', 'l', 'z', 's', 't'];
    var shape = 'i';

    // create some new blocks
    var newBlocks = [];
    for (var i = 0; i < 4; i++) {
	var curBlock = new Block({x: -1, y: -1});
	newBlocks.push(curBlock);
	this.blocks.push(curBlock);
    }

    this.controlGroup = new ControlGroup(newBlocks, shape, function(x, y){
	return thisObject.isLegalPosition(x, y);
    });
};

/**
* processes the input keys
*/
Game.processInput = function() {
    for (var keyName in this.input) {
	//  if the key is down
	if (jaws.pressed(keyName)) {
	    // if it is a 'press' frame
	    if (!this.input[keyName].lastState) {
		this.input[keyName].handler();
		this.input[keyName].lastState = true;
	    }
	} else {
	    // it was released
	    this.input[keyName].lastState = false
	}
    }
};

Game.update = function() {
    if (!this.controlGroup) {
	this.newBlock();
    }

    this.processInput();
}

Game.draw = function() {
    for (var i = 0; i < this.blocks.length; i+= 1) {
	this.blocks[i].draw();
    }
}

/**
* Returns true iff the given position can be moved into
* @param {Number} x - the x position
* @param {Number} y - the y position
* @returns {Boolean} true iff the new position is legal
*/
Game.isLegalPosition = function (x, y) {
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

Game.dropBlock = function () {
    if (!this.controlGroup.drop()) {
	this.newBlock();
    }
}