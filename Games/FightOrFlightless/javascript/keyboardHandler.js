
function InitKeyHandlers() {
    document.addEventListener("keydown", OnKeyDown, false);
    document.addEventListener("keyup", OnKeyUp, false);
}

var keyState = {
    "up": false,
    "down": false,
    "left": false,
    "right": false,
    "action1": false,
    "action2": false,
}

var keyMap = {
    "KeyW": "up",
    "ArrowUp": "up",
    "KeyA": "left",
    "ArrowLeft": "left",
    "KeyD": "right",
    "ArrowRight": "right",
    "KeyS": "down",
    "ArrowDown": "down",
    "Digit1": "action1",
    "Numpad1": "action1",
    "Digit2": "action2",
    "Numpad2": "action2",
}

function OnKeyDown(e) {
    let keyCode = e.code;
    let mappedAction = keyMap[keyCode];
    if (mappedAction) {
        keyState[mappedAction] = true;
    }
}

function OnKeyUp(e) {
    let keyCode = e.code;
    let mappedAction = keyMap[keyCode];
    if (mappedAction) {
        keyState[mappedAction] = false;
    }
}