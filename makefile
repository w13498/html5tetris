
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

debug : $(JS_SRC) index.htm tetris.py app.yaml
	-rm -r debug
	mkdir debug
	mkdir debug/tetris
	cp $(JS_SRC) debug/tetris
	mkdir debug/tetris/media
	cp -R media/* debug/tetris/media
	cp index.htm debug/tetris/index.html
	cp tetris.py debug/
	cp app.yaml debug/


webDeployment : $(JS_SRC) index_deploy.html tetris.py app.yaml
	-rm -r deploy
	mkdir deploy
	mkdir deploy/tetris
	cat $(JS_SRC) > deploy/tetris/tetris_main_noop.js
	java -jar yuicompressor-2.4.6.jar deploy/tetris/tetris_main_noop.js -o deploy/tetris/tetris_main.js
	rm deploy/tetris/tetris_main_noop.js
	mkdir deploy/tetris/media
	cp -R media/* deploy/tetris/media
	cp index_deploy.html deploy/tetris/index.html
	cp tetris.py deploy/
	cp app.yaml deploy/
