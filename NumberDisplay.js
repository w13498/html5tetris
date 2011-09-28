// TODOL move this to a proper def
var CHAR_WIDTH = 25;

function NumberDisplay (config) {
    this.val = config.val;
    this.x = config.x;
    this.y = config.y;
}

NumberDisplay.prototype.draw = function() {
    // break the value down into a backwards list of base-10
    var nums = [],
    curVal = this.val,
    i;
    
    while (curVal > 0) {
	nums.push(nums % 10);
	curVal = floor(curVal / 10);
    }

    if (nums.length === 0) {
	nums.push(0);
    }

    // draw the sprites
    for (i = 0; i < nums.length; i++) {
	curChar = NumberDisplay.charSprites[nums[i]];
	curChar.moveTo(this.x - i*CHAR_WIDTH, this.y);
	// TODO: figure out if this is allowed
	curChar.draw();
    }
}