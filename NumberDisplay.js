function NumberDisplay (config) {
    var i;
    
    this.val = config.val;
    this.x = config.x;
    this.y = config.y;

    // if the sprites have not been initialized yet
    if (NumberDisplay.charSprites === null) {
	NumberDisplay.charSprites = [];
	for (i = 0; i < 10; i++) {
	    NumberDisplay.charSprites.push(new jaws.Sprite({image: 'media/numbers/' + i + '.png'}));
	}
    }
}

NumberDisplay.charSprites = null;
NumberDisplay.CHAR_WIDTH = 10;

NumberDisplay.prototype.draw = function() {
    // break the value down into a backwards list of base-10
    var nums = [],
    curVal = this.val,
    i;
    
    while (curVal > 0) {
	nums.push(curVal % 10);
	curVal = Math.floor(curVal / 10);
    }

    if (nums.length === 0) {
	nums.push(0);
    }

    // draw the sprites
    for (i = 0; i < nums.length; i++) {
	curChar = NumberDisplay.charSprites[nums[i]];
	curChar.moveTo(this.x - i*NumberDisplay.CHAR_WIDTH + FIELD_OFFSET_X, this.y + FIELD_OFFSET_Y);
	curChar.draw();
    }
}

NumberDisplay.prototype.setValue = function(val) {
    this.val = val;
}