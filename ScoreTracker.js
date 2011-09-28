function ScoreTracker() {
    this.level = 1;
    this.score = 0;
    this.linesRemaining = ScoreTracker.levelLines(this.level); // TODO: drive this value
    
}

ScoreTracker.levelLines = function (level) {
    var levels = [
	5,
	10,
	15,
	20,
	25
    ];
    if (level < level.length) {
	return levels[level];
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
