var controlsLoaded = false;
var curControl = null;

function onControlsLoad() {
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

    // set the cookies
    createCookie('customControls', 'FALSE');

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

function configureCustomControls() {
    stopPollingInput();

    if (controlsLoaded) {
	// the cookies need to be created & initialized
	createCookie('c_rotateLeft', 'Z');
	createCookie('c_rotateRight', 'X');
	createCookie('c_shiftLeft', 'LEFT');
	createCookie('c_shiftRight', 'RIGHT');
	createCookie('c_softDrop', 'DOWN');
	createCookie('c_hardDrop', 'SPACE');
	createCookie('c_swapValue', 'C');

	createCookie('customControls', 'TRUE');
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
	.innerHTML = readCookie('c_swapValue');
}

function controlsUnitClicked(controlName) {
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
	containerId: controlName + 'Div',
	valueId: controlName + 'Value'
    };

    startPollingInput();
}

function startPollingInput() {
    document.getElementById(curControl.containerId).setAttribute('class', 'controlsUnit controlsUnitPending');
    
    // TODO: start the jaws backend
}

function stopPollingInput() {
    if (curControl !== null) {
	// TODO: stop the jaws backend
	
	document.getElementById(curControl.containerId).setAttribute('class', 'controlsUnit');
	curControl = null;
    }
}