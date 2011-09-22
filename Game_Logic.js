
/**
* @returns {[Number]} the line numbers of all the completed rows
*/ 
Game.prototype.getRows = function () {
    var i,
    rows = [],
    res = [],
    curRow;

    // initialize the rows to 0
    for (i = 0; i < 20; i++) {
	rows[i] = 0;
    }
    // for each block
    for (i = 0; i < this.blocks.length; i++) {
	// increment the appropriate row
	curRow = this.blocks[i].getY();
	rows[curRow] += 1;
	// if the row is full
	if (rows[curRow] === 10) {
	    res.push(curRow);
	}
    }

    return res;
}

/**
* Removes the rows and applies them to the score and row count
*/
Game.prototype.removeRows = function (rows) {
    var dropDist = [],
    i, j,
    remove = {},
    curBlock,
    curY;

    // initialize drops to 0
    for (i = 0; i < 20; i++) {
	dropDist[i] = 0;
    }

    // for each removed row
    for (i = 0; i < rows.length; i++) {
	remove[rows[i]] = true;
	
	// every row above this should be dropped another spot
	for (j = 0; j < rows[i]; j++) {
	    dropDist[j]++;
	}
    }

    // for each block
    for (i = 0; i < this.blocks.length; i++) {
	curBlock = this.blocks[i];
	curY = curBlock.getY();

	// if it is being removed
	if (remove[curY]) {
	    // remove the block
	    if (i === this.blocks.length - 1) {
		// last entry, just kill it
		this.blocks.pop();
	    } else {
		// not last entry, fill the hole and try it again
		this.blocks[i] = this.blocks.pop();
		i--;
	    }
	} else {
	    // it is being dropped
	    curBlock.setPosition(curBlock.getX(), curBlock.getY() + dropDist[curY]);
	}
    }
}

Game.prototype.applyGravity = function (dTime) {
    this.timeToNextDrop -= dTime;

    // drop until there is a positive time until the next drop time is positive, or the control group s bottomed out
    while (this.timeToNextDrop < 0 && (!this.controlGroup.isBottomed())) {
	this.dropBlock(true);
	this.timeToNextDrop += this.dropPeriod;
    }

    // if it exited through bottoming, reset the drop period
    if (this.controlGroup.isBottomed()) {
	this.timeToNextDrop = this.dropPeriod;
    }
};