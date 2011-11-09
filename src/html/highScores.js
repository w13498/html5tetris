function getXmlHttp() {
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	return new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function highScoresOnLoad() {
    // div called id=highScoreDiv
    var xmlhttp = getXmlHttp();
    xmlhttp.onreadystatechange=function()
    {
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
	    var response = jsonParse(xmlhttp.responseText),
	    highScoreList = response.topScores,
	    dailyScoreList = response.dailyScores,
	    highOutput,
	    dailyOutput,
	    i;

	    highOutput = '<table class="highScoreTable"><tr class="highScoreTableHeader"><td>#</td><td>Name</td><td>Date</td><td>Score</td></tr>';
	    dailyOutput= '<table class="highScoreTable"><tr class="highScoreTableHeader"><td>#</td><td>Name</td><td>Score</td></tr>';

	    for (i = 0; i < highScoreList.length; i += 1) {
		curScore = highScoreList[i];
		highOutput += '<tr><td>' + (i+1) + '</td><td>' + curScore.name + '</td><td>' + curScore.date + '</td><td>' + curScore.score + '</td></tr>';
	    }

	    for (i = 0; i < dailyScoreList.length; i += 1) {
		curScore = dailyScoreList[i];
		dailyOutput += '<tr><td>' + (i+1) + '</td><td>' + curScore.name + '</td><td>' + curScore.score + '</td></tr>';
	    }

	    highOutput += '</table>';
	    dailyOutput += '</table>';

	    document.getElementById("dailyScoreDiv").innerHTML = dailyOutput;
	    document.getElementById("highScoreDiv").innerHTML = highOutput;
	}
    }

    xmlhttp.open("POST", "/score/tables", true);
    xmlhttp.send();
}
