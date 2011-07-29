
function Tetris() {
    var border;
    var background;
    var game;


    this.setup = function () {
	game = new Game();
	
	background = new Background();
	jaws.preventDefaultKeys(['up', 'down', 'left', 'right', 'space', 'z', 'x']);
    }

    this.update = function() {
	game.update();
    }

    this.draw = function() {
	jaws.context.clearRect(0, 0, jaws.width, jaws.height);
	background.draw();
	game.draw();
    }

}

window.onload = function () {
    jaws.assets.add('media/redblock.png');
    jaws.assets.add('media/emptyblock.png');
    jaws.start(Tetris);
};