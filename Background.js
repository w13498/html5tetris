
var Background = function (config) {
    
    config = config || {};

    this.originX = (config.x || 0) + FIELD_OFFSET_X;
    this.originY = (config.y || 0) + FIELD_OFFSET_Y;

    this.width = 10;
    this.height = 20;

    this.tile = new jaws.Sprite({image: 'media/emptyblock.png' });

    this.backdrop = new jaws.Sprite({image: 'media/background/backdrop.png'});
    this.backdrop.x = 0;
    this.backdrop.y = 0;
};


Background.prototype.draw = function () {
    var i, j;

    this.backdrop.draw();

    for (i = 0; i < this.width; i += 1) {
	for (j = 0; j < this.height; j += 1) {
	    this.tile.x = this.originX + BLOCK_WIDTH * i;
	    this.tile.y = this.originY + BLOCK_WIDTH * j;

	    this.tile.draw();
	}
    }
};