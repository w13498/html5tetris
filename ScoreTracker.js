function ScoreTracker() {
    this.level = 1;
    this.score = 0;
    this.linesRemaining = ScoreTracker.levelLines(this.level); // TODO: drive this value
    
}

ScoreTracker.levelLines = function (level) {
    var levels = [
	10
    ];
    if (level <= levels.length) {
	return levels[level-1];
    }
    return levels[levels.length - 1];
}
    

ScoreTracker.prototype.updateScore = function(config) {
    if (config.lines) {
	this.linesRemaining -= config.lines;
	// keep going up levels until the lines remaining is positive
	while (this.linesRemaining <= 0) {
	    this.level += 1;
	    this.linesRemaining += ScoreTracker.levelLines(this.level);
	}
	
    }
}


ScoreTracker.prototype.getLinesRemaining = function() { return this.linesRemaining; }
ScoreTracker.prototype.getScore = function() { return this.score; }
ScoreTracker.prototype.getLevel = function() { return this.level; }
ScoreTracker.prototype.getLevelPeriod = function() {
    // TODO: get a better level speed estimation
    var res = 500 - 30 * this.level;
    if (res < 5) {
	res = 5;
    }
    return res;
}