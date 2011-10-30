
// TODO: constants file???
var BLOCK_WIDTH = 24;

var Block = function (config) {
    var parent, key;

    config = config || {};

    this.boX = (config.boardOriginX || 0) + FIELD_OFFSET_X;
    this.boY = (config.boardOriginY || 0) + FIELD_OFFSET_Y;
    this.blockX = config.blockX;
    this.blockY = config.blockY;

    config.x = this.boX + BLOCK_WIDTH * this.blockX;
    config.y = this.boY + BLOCK_WIDTH * this.blockY;

    if (config.preview) {
	config.image = 'media/greyblock.png';
    } else {
	config.image = SHAPES[config.shape].image;
    }

    parent = new jaws.Sprite(config);
    for (key in parent) {
	this[key] = parent[key];
    }
};

Block.prototype.setColor = function(shape, preview) {
    if (preview) {
	this.setImage('media/greyblock.png');
    } else {
	this.setImage(SHAPES[shape].image);
    }
};

Block.prototype.moveBlock = function(dx, dy) {
    this.blockX += dx;
    this.blockY += dy;
    this.x += dx * BLOCK_WIDTH;
    this.y += dy * BLOCK_WIDTH;
};

Block.prototype.setPosition = function(blockX, blockY) {
    this.blockX = blockX;
    this.blockY = blockY;
    this.x = this.boX + blockX * BLOCK_WIDTH;
    this.y = this.boY + blockY * BLOCK_WIDTH;
};

Block.prototype.getX = function() { return this.blockX; };
Block.prototype.getY = function() { return this.blockY; };