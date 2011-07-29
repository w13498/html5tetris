var SHAPES = {
    i: {
	spin: 'corner',
	pos: [
	    { x: -2, y: 0 },
	    { x: -1, y: 0},
	    { x: 0, y: 0 },
	    { x: 1, y: 0 }
	]
    },
    o: {
	spin: 'corner',
	pos: [
	    { x: -1, y: 0 },
	    { x: 0, y: 0},
	    { x: -1, y: -1 },
	    { x: 0, y: -1 }
	]
    },
    j: {
	spin: 'block',
	pos: [
	    { x: -1, y: -1 },
	    { x: -1, y: 0 },
	    { x: 0, y: 0 },
	    { x: 1, y: 0 }
	]
    },
    l: {
	spin: 'block',
	pos: [
	    { x: -1, y: 0 },
	    { x: 0, y: 0 },
	    { x: 1, y: 0 },
	    { x: 1, y: -1 }
	]
    },
    s: {
	spin: 'block',
	pos: [
	    { x: -1, y: 0 },
	    { x: 0, y: 0 },
	    { x: 0, y: 1 },
	    { x: 1, y: -1 }
	]
    },
    z: {
	spin: 'block',
	pos: [
	    { x: -1, y: -1 },
	    { x: 0, y: -1 },
	    { x: 0, y: 0 },
	    { x: 1, y: 0 }
	]
    },
    t: {
	spin: 'block',
	pos: [
	    { x: -1, y: 0 },
	    { x: 0, y: 0 },
	    { x: 0, y: -1 },
	    { x: 1, y: 0 }
	]
    }
    
};

/**
* The blocks that can be moved nby the user
* @param {Array} blocks - an array of [Block] of size 4 that can be operated on
* @param {Char} shape - the block type: i, o, j, l, s, z, t
* @param {function({Number}x, {Number}y)} isLegalCallback - a function that retursn true if a block can be moved
* to the new position
*/
function ControlGroup(blocks, shape, isLegalCallback) {
    var i;
    
    this.blocks = blocks;
    this.baseX = 5;
    this.baseY = -1;

    // place the blocks according to the shape
    var shapeConf = SHAPES[shape];
    this.pos = shapeConf.pos;
    this.spin = shapeConf.spin;
    
    this.isLegalCallback = isLegalCallback || function() {return true;};

    for (i = 0; i < blocks.length; i += 1) {
	this.blocks[i].setPosition(this.baseX + this.pos[i].x, this.baseY + this.pos[i].y);
    }

    this.shift = ControlGroup.shift;
    this.drop = ControlGroup.drop;
    this.turn = ControlGroup.turn;
}

/**
* Shift the block left or right
*/
ControlGroup.shift = function(left) {
    var dx = left ? -1 : 1;
    var i;
    
    this.baseX += dx;

    // TODO: only move if valid
    for (i = 0; i < this.blocks.length; i += 1) {
	this.blocks[i].moveBlock(dx, 0);
    }
};

/**
* Drop the block by one
*/
ControlGroup.drop = function() {
    var i;

    // TODO: don't drop if invalid
    // TODO: call the bottomed out block callback if it's stuck

    this.baseY += 1;

    for (i = 0; i < this.blocks.length; i += 1) {
	this.blocks[i].moveBlock(0, 1);
    }
};

/**
* Turns the block
* @param {Boolean} cw - true for clockwise, false for counter-clockwise
*/
ControlGroup.turn = function (cw) {
    var newX, newY,
    oldX, oldY,
    i;

    if (this.spin === 'block') {
	for (i = 0; i < this.blocks.length; i += 1) {
	    newX = (cw ? -1 : 1) * (this.blocks[i].blockY - this.baseY) + this.baseX;
	    newY = (cw ? 1 : -1) * (this.blocks[i].blockX - this.baseX) + this.baseY;

	    // TODO: check that it is a legal move
	    this.blocks[i].setPosition(newX, newY);
	}
    } else {
	// point turning
	for (i = 0; i < this.blocks.length; i += 1) {
	    oldX = this.blocks[i].blockX - this.baseX;
	    oldY = this.blocks[i].blockY - this.baseY;

	    if (oldX >= 0) { oldX += 1; }
	    if (oldY >= 0) { oldY += 1; }

	    newX = (cw ? -1 : 1) * oldY;
	    newY = (cw ? 1 : -1) * oldX;

	    if (newX > 0) { newX -= 1; }
	    if (newY > 0) { newY -= 1; }

	    // TODO: check that this is a legal move
	    this.blocks[i].setPosition(newX + this.baseX, newY + this.baseY);
	}
    }
}