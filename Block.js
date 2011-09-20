
// TODO: constants file???
var BLOCK_WIDTH = 24;

var Block = function (config) {
    config = config || {};

    this.boX = config.boardOriginX || 0;
    this.boY = config.boardOriginY || 0;
    this.blockX = config.blockX;
    this.blockY = config.blockY;

    config.x = this.boX + BLOCK_WIDTH * this.blockX;
    config.y = this.boY + BLOCK_WIDTH * this.blockY;

    config.image = 'media/redblock.png';

    var parent = new jaws.Sprite(config);
    for (key in parent) {
	this[key] = parent[key];
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