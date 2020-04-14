var isMobile = false;

function SwitchToMobileMode() {
    isMobile = true;
    var touchButtons = document.getElementsByClassName('touchButton');
    for (var i = 0; i < touchButtons.length; i++) {
        touchButtons[i].classList.remove('hidden');
    }
}

function InitializeTableControls() {
    var leftButton = document.getElementById('touchLeftButton');
    var rightButton = document.getElementById('touchRightButton');
    var jumpButton = document.getElementById('touchJumpButton');

    leftButton.addEventListener("touchstart", OnTouchStartLeftButton, false);
    leftButton.addEventListener("touchend", OnTouchEndLeftButton, false);
    rightButton.addEventListener("touchstart", OnTouchStartRightButton, false);
    rightButton.addEventListener("touchend", OnTouchEndRightButton, false);
    jumpButton.addEventListener("touchstart", OnTouchStartJumpButton, false);
    jumpButton.addEventListener("touchend", OnTouchEndJumpButton, false);
}

function OnTouchStartLeftButton() { keyboardState.keyState[keyboardState.key["A"]] = true; }
function OnTouchEndLeftButton() { keyboardState.keyState[keyboardState.key["A"]] = false; }
function OnTouchStartRightButton() { keyboardState.keyState[keyboardState.key["D"]] = true; }
function OnTouchEndRightButton() { keyboardState.keyState[keyboardState.key["D"]] = false; }
function OnTouchStartJumpButton() {
    keyboardState.keyState[keyboardState.key["Space"]] = true;
    keyboardState.keyState[keyboardState.key["W"]] = true;
}
function OnTouchEndJumpButton() {
    keyboardState.keyState[keyboardState.key["Space"]] = false;
    keyboardState.keyState[keyboardState.key["W"]] = false;
}