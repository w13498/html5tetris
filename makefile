
JS_SRC = \
	jawsjs.js \
	Block.js \
	Shapes.js \
	WallKicks.js \
	ControlGroup.js \
	Background.js \
	RandomBag.js \
	PreviewGroup.js \
	ScoreTracker.js \
	TtyBlock.js \
	Game.js \
	Game_Logic.js \
	Button.js \
	tetris.js

webDeployment : $(JS_SRC) index_deploy.html
	-rm -r deploy
	mkdir deploy
	cat $(JS_SRC) > deploy/tetris_main_noop.js
	java -jar yuicompressor-2.4.6.jar deploy/tetris_main_noop.js -o deploy/tetris_main.js
	mkdir deploy/media
	cp -R media/* deploy/media
	cp index_deploy.html deploy/index.html
