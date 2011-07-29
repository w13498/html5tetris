
var Background = function (config) {
    
    config = config || {};

    this.originX = config.x || 0;
    this.originY = config.y || 0;

    this.width = 10;
    this.height = 20;

    this.tile = new jaws.Sprite({image: 'media/emptyblock.png' });

    this.draw = Background.draw;

};


Background.draw = function () {
    var i, j;
    for (i = 0; i < this.width; i++) {
	for (j = 0; j < this.height; j++) {
	    this.tile.x = this.originX + BLOCK_WIDTH * i;
	    this.tile.y = this.originY + BLOCK_WIDTH * j;

	    this.tile.draw();
	}
    }
};