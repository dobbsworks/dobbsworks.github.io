
function InitKeyHandlers() {
    document.addEventListener("keydown", OnKeyDown, false);
    document.addEventListener("keyup", OnKeyUp, false);
}

var keyState = {
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
    "Digit3": "action3",
    "Numpad3": "action3",
    "Digit4": "action4",
    "Numpad4": "action4",
    "Digit5": "action5",
    "Numpad5": "action5",
    "Digit6": "action6",
    "Numpad6": "action6",
    "Digit7": "action7",
    "Numpad7": "action7",
    "Digit8": "action8",
    "Numpad8": "action8",
    "Digit9": "action9",
    "Numpad9": "action9",
}

var actionKeys = [
    "action1", "action2", "action3", 
    "action4", "action5", "action6", 
    "action7", "action8", "action9"];

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