var controlsLoaded = false;
var curControl = null;

function onControlsLoad() {
    jaws.start(InputMonitor);
    // check for an existing controls cookie
    var customControls = readCookie('customControls');

    // these actions will trigger the controls configurations
    if (customControls === 'TRUE') {
	// if there is a cookie, set up the controls for it
	document.getElementById('customRadio').checked = true;
	configureCustomControls();
    } else {
	// if no cookie, assign defaults, create the cookie
	document.getElementById('defaultRadio').checked = true;
	setDefaultControls();
    }

    controlsLoaded = true;
}

function setDefaultControls() {
    stopPollingInput();

    document.getElementById('instructionsDefault').setAttribute('class', 'withDisplay');
    document.getElementById('instructionsCustom').setAttribute('class', 'noDisplay');
    document.getElementById('instructionsPending').setAttribute('class', 'noDisplay');

    // set the cookies
    createCookie('customControls', 'FALSE', 1000);

    // configure the gui to the default text
    document.getElementById('rotateLeftValue')
	.innerHTML = 'Z';
    document.getElementById('rotateRightValue')
	.innerHTML = 'X, UP';
    document.getElementById('shiftLeftValue')
	.innerHTML = 'LEFT';
    document.getElementById('shiftRightValue')
	.innerHTML = 'RIGHT';
    document.getElementById('softDropValue')
	.innerHTML = 'DOWN';
    document.getElementById('hardDropValue')
	.innerHTML = 'SPACE';
    document.getElementById('swapValue')
	.innerHTML = 'SHIFT, C';
}

function configureCustomControls(fromCookie) {
    stopPollingInput();

    document.getElementById('instructionsDefault').setAttribute('class', 'noDisplay');
    document.getElementById('instructionsCustom').setAttribute('class', 'withDisplay');
    document.getElementById('instructionsPending').setAttribute('class', 'noDisplay');

    if (controlsLoaded && !fromCookie) {
	// the cookies need to be created & initialized
	createCookie('c_rotateLeft', 'Z', 1000);
	createCookie('c_rotateRight', 'X', 1000);
	createCookie('c_shiftLeft', 'LEFT', 1000);
	createCookie('c_shiftRight', 'RIGHT', 1000);
	createCookie('c_softDrop', 'DOWN', 1000);
	createCookie('c_hardDrop', 'SPACE', 1000);
	createCookie('c_swap', 'C', 1000);

	createCookie('customControls', 'TRUE', 1000);
    }
    
    // assign all of the GUI elements based on the cookie
    document.getElementById('rotateLeftValue')
	.innerHTML = readCookie('c_rotateLeft');
    document.getElementById('rotateRightValue')
	.innerHTML = readCookie('c_rotateRight');
    document.getElementById('shiftLeftValue')
	.innerHTML = readCookie('c_shiftLeft');
    document.getElementById('shiftRightValue')
	.innerHTML = readCookie('c_shiftRight');
    document.getElementById('softDropValue')
	.innerHTML = readCookie('c_softDrop');
    document.getElementById('hardDropValue')
	.innerHTML = readCookie('c_hardDrop');
    document.getElementById('swapValue')
	.innerHTML = readCookie('c_swap');
}

function controlsUnitClicked(controlName) {
    document.getElementById('instructionsDefault').setAttribute('class', 'noDisplay');
    document.getElementById('instructionsCustom').setAttribute('class', 'noDisplay');
    document.getElementById('instructionsPending').setAttribute('class', 'withDisplay');

    // if default controls, switch to custom
    if (readCookie('customControls') !== 'TRUE') {
	// if no cookie, assign defaults, create the cookie
	document.getElementById('customRadio').checked = true;
	configureCustomControls();
    }

    if (curControl !== null) {
	stopPollingInput();
    }
    curControl = {
	name: 'c_' + controlName,
	containerId: controlName + 'Div'
    };

    startPollingInput();
}

function startPollingInput() {
    document.getElementById(curControl.containerId).setAttribute('class', 'controlsUnit controlsUnitPending');
    
    inputPolling = true;
}

function stopPollingInput() {
    if (curControl !== null) {
	inputPolling = false;
	
	document.getElementById(curControl.containerId).setAttribute('class', 'controlsUnit');
	curControl = null;
    }
}

function findWhereKeyUsed(key) {
    var cookies = ['c_rotateLeft',
		   'c_rotateRight',
		   'c_shiftLeft',
		   'c_shiftRight',
		   'c_softDrop',
		   'c_hardDrop',
		   'c_swap'],
    i;

    for (i = 0; i < cookies.length; i += 1) {
	if (readCookie(cookies[i]) === key) {
	    return cookies[i];
	}
    }

    return null;
}

function reportKeyPressed(keyLower) {
    // should never fail this case...
    if (curControl !== null) {
	var key = keyLower.toUpperCase();

	// if this key is used anywhere else
	var controlUsed = findWhereKeyUsed(key);
	if (controlUsed !== null) {
	    // swap the two controls
	    createCookie(controlUsed, readCookie(curControl.name), 1000);
	    createCookie(curControl.name, key, 1000);
	} else {
	    // set this key to the new value
	    createCookie(curControl.name, key, 1000);
	}

	configureCustomControls(true);

	stopPollingInput();
    }
}

