function $_GET(q) { 
    var s = window.location.search; 
    var re = new RegExp('&'+q+'(?:=([^&]*))?(?=&|$)','i'); 
    return (s=s.replace(/^\?/,'&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined; 
}


function loadScore() {
    var sessionRef = $_GET('tempRef');
    
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
	    var response = jsonParse(xmlhttp.responseText),
	    output = '<br/><br/><div class="resTitle">GOOD GAME!</div><br/><br/>';

	    output += '<table class="resultsTable">';

	    output += '<tr><td class="resultsLeft">Score:</td><td class="resultsRight">' + response.userScore + '</td></tr>';
	    if (response.dailyRank > 0) {
		output += '<tr><td class="resultsLeft">Daily Rank:</td><td class="resultsRight">' + response.dailyRank + '</td></tr>';
	    }
	    if (response.totalRank > 0) {
		output += '<tr><td class="resultsLeft">Total Rank:</td><td class="resultsRight">' + response.totalRank + '</td></tr>';
	    }
	    output += '</table><br/><br/><br/>';

	    // TODO: process this data
	    document.getElementById("scoreDiv").innerHTML = output;
	}
    }

    xmlhttp.open("POST", "/score/postGame?tempRef="+sessionRef, true);
    xmlhttp.send();
}
