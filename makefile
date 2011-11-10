
JS_SRC = \
	src/game/jawsjs.js \
	src/game/Block.js \
	src/game/Shapes.js \
	src/game/WallKicks.js \
	src/game/ControlGroup.js \
	src/game/Background.js \
	src/game/RandomBag.js \
	src/game/PreviewGroup.js \
	src/game/ScoreTracker.js \
	src/game/TtyBlock.js \
	src/game/Game.js \
	src/game/Game_Logic.js \
	src/game/Button.js \
	src/game/tetris.js

DEBUG_HTML_SRC = \
	src/html/index.htm \
	src/html/styles.css \
	src/html/about.htm \
	src/html/scoreScreen.htm \
	src/html/scoreScreen.js \
	src/html/highScores.htm \
	src/html/highScores.js \
	src/html/json-minified.js \
	src/html/excanvas.compiled.js

DEPLOY_HTML_SRC = \
	src/html/index_deploy.html \
	src/html/styles.css \
	src/html/about.htm \
	src/html/scoreScreen.htm \
	src/html/scoreScreen.js \
	src/html/highScores.htm \
	src/html/highScores.js \
	src/html/json-minified.js \
	src/html/excanvas.compiled.js

WEB_APP_SRC = \
	src/webapp/app.yaml \
	src/webapp/tetris.py \
	src/webapp/highscore.py \
	src/webapp/index.yaml

debug : $(JS_SRC) $(DEBUG_HTML_SRC) $(WEB_APP_SRC) favicon.ico
	-rm -r debug
	mkdir debug
	mkdir debug/tetris
	cp $(JS_SRC) debug/tetris
	mkdir debug/tetris/media
	cp -R media/* debug/tetris/media
	cp favicon.ico debug
	cp src/html/index.htm debug/tetris/index.html
	cp src/html/about.htm debug/tetris/about.html
	cp src/html/scoreScreen.htm debug/tetris/scoreScreen.html
	cp src/html/scoreScreen.js debug/tetris/scoreScreen.js
	cp src/html/highScores.htm debug/tetris/highScores.html
	cp src/html/highScores.js debug/tetris/highScores.js
	cp src/html/styles.css debug/tetris/
	cp src/html/json-minified.js debug/tetris/
	cp src/html/excanvas.compiled.js debug/tetris/
	cp $(WEB_APP_SRC) debug


webDeployment : $(JS_SRC) $(DEPLOY_HTML_SRC) $(WEB_APP_SRC) favicon.ico
	-rm -r deploy
	mkdir deploy
	mkdir deploy/tetris
	cat $(JS_SRC) > deploy/tetris/tetris_main_noop.js
	java -jar build/yuicompressor-2.4.6.jar deploy/tetris/tetris_main_noop.js -o deploy/tetris/tetris_main.js
	rm deploy/tetris/tetris_main_noop.js
	mkdir deploy/tetris/media
	cp -R media/* deploy/tetris/media
	cp favicon.ico deploy
	cp src/html/index_deploy.html deploy/tetris/index.html
	cp src/html/about.htm deploy/tetris/about.html
	cp src/html/scoreScreen.htm deploy/tetris/scoreScreen.html
	cp src/html/scoreScreen.js deploy/tetris/scoreScreen.js
	cp src/html/highScores.htm deploy/tetris/highScores.html
	cp src/html/highScores.js deploy/tetris/highScores.js
	cp src/html/styles.css deploy/tetris/
	cp src/html/json-minified.js deploy/tetris/
	cp src/html/excanvas.compiled.js deploy/tetris/
	cp $(WEB_APP_SRC) deploy
