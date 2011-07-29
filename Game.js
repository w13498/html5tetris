
function Game() {
    this.processInput = Game.processInput;
    this.update = Game.update;
    this.draw = Game.draw;
    this.newBlock = Game.newBlock;
    
    var thisObject = this;

    this.newBlock = Game.newBlock;
    this.processInput = Game.processInput;

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
		thisObject.controlGroup.drop();
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
    
    var options = ['i', 'o', 'j', 'l', 'z', 's', 't'];
    var shape = 'i';

    // create some new blocks
    var newBlocks = [];
    for (var i = 0; i < 4; i++) {
	var curBlock = new Block({x: -1, y: -1});
	newBlocks.push(curBlock);
	this.blocks.push(curBlock);
    }

    // TODO: add the movement validator function
    this.controlGroup = new ControlGroup(newBlocks, shape);
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