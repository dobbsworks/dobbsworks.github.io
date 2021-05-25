var mouseX = 0;
var mouseY = 0;
var mouseScroll = 0;
var isMouseDown = false;
var isMouseChanged = false;
var hasUserInteracted = false;

function InitMouseHandlers() {
    canvas.addEventListener("mousedown", OnMouseDown, false);
    canvas.addEventListener("mouseup", OnMouseUp, false);
    canvas.addEventListener("mousemove", OnMouseMove, false);
    canvas.addEventListener("mouseout", OnMouseOut, false);
    canvas.addEventListener("touchstart", OnTouchStart, false);
    canvas.addEventListener("touchend", OnTouchEnd, false);
    canvas.addEventListener("touchmove", OnTouchMove, false);
    canvas.addEventListener("wheel", OnMouseScroll, false);
}

function UpdateMouseChanged() {
    isMouseChanged = false;
    mouseScroll = 0;
}

function isMouseClicked() {
    return isMouseChanged && isMouseDown;
}

function OnMouseDown(e) {
    hasUserInteracted = true;
    if (e.button === 0) {
        isMouseDown = true;
        isMouseChanged = true;
    }
}

function OnMouseUp(e) {
    if (e.button === 0) {
        isMouseDown = false;
        isMouseChanged = true;
    }
}

function OnMouseMove(e) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}

function OnMouseOut(e) {
    OnMouseMove(e);
    isMouseChanged = isMouseDown;
    isMouseDown = false;
}

function OnMouseScroll(e) {
    if (e.deltaY > 0) mouseScroll = 1;
    if (e.deltaY < 0) mouseScroll = -1;
}

function OnTouchStart(e) {
    //TODO - account for canvas position
    mouseX = e.touches[0].pageX - canvas.offsetLeft;
    mouseY = e.touches[0].pageY - canvas.offsetTop;
    isMouseDown = true;
    isMouseChanged = true;
    e.preventDefault();
}

function OnTouchEnd(e) {
    isMouseDown = false;
    isMouseChanged = true;
}

function OnTouchMove(e) {
    mouseX = e.touches[0].pageX;
    mouseY = e.touches[0].pageY;
    e.preventDefault();
}

function GetGameMouseX() {
    return renderer.UnmapX(mouseX);
}

function GetGameMouseY() {
    return renderer.UnmapY(mouseY);
}

let framesSincePause = 0;
let framesSinceNavigation = 0;
let gamepadIndex = -1; //current active in-use
function GamepadMouse() {
    for (let i = 0; i < navigator.getGamepads().length; i++) {
        let gp = navigator.getGamepads()[i];
        if (!gp) continue;
        if (gp.axes.some(a => a) || gp.buttons.some(a => a.pressed)) {
            gamepadIndex = i;
        }
    }
    if (gamepadIndex === -1) return;

    let dx = 0;
    let dy = 0;
    let gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return;
    if (gamepad && gamepad.axes) {
        if (gamepad.axes) {
            if (gamepad.axes[0]) dx += gamepad.axes[0];
            if (gamepad.axes[1]) dy += gamepad.axes[1];
            if (gamepad.axes[2]) dx += gamepad.axes[2];
            if (gamepad.axes[3]) dy += gamepad.axes[3];
        }
        if (gamepad.buttons) {
            let buttonPressed = false;
            if (gamepad.buttons[0].pressed) buttonPressed = true;
            else if (gamepad.buttons[1].pressed) buttonPressed = true;
            else if (gamepad.buttons[2].pressed) buttonPressed = true;
            else if (gamepad.buttons[3].pressed) buttonPressed = true;

            isMouseChanged = (isMouseDown && !buttonPressed) || (!isMouseDown && buttonPressed);
            isMouseDown = buttonPressed;

            if (gamepad.buttons[4].pressed) mouseScroll -= 1;
            if (gamepad.buttons[5].pressed) mouseScroll += 1;
            if (gamepad.buttons[6].pressed) mouseScroll -= 1;
            if (gamepad.buttons[7].pressed) mouseScroll += 1;

            let isPausePressed = false;
            if (gamepad.buttons[8].pressed) isPausePressed = true;
            if (gamepad.buttons[9].pressed) isPausePressed = true;

            if (!isPausePressed) framesSincePause++;
            if (isPausePressed && framesSincePause >= 60) {
                pauseHandler.onPauseButtonPressed();
                framesSincePause = 0;
            }
        }
    }
    // dead zone
    if (Math.abs(dx) < 0.05) dx = 0;
    if (Math.abs(dy) < 0.05) dy = 0;

    // don't move mouse unless input received
    framesSinceNavigation++;
    if (dx !== 0 || dy !== 0) {
        let buttons = uiHandler.elements.filter(a => a instanceof Button && !a.ignoreGamepad && !a.isDisabled && a.isSteadyOnScreen());
        let isMenuUp = buttons.length > 0;
        if (isMenuUp) {
            if (framesSinceNavigation > 20) {
                framesSinceNavigation = 0;

                let targetButton = GetButtonInDirection(buttons, dx, dy);
                if (targetButton) {
                    mouseX = targetButton.x + targetButton.width / 2;
                    mouseY = targetButton.y + targetButton.height / 2;
                }
            }
        } else {
            // location on screen of player center
            let xOrigin = 550;
            let yOrigin = 250;

            mouseX = xOrigin + dx * 100;
            mouseY = yOrigin + dy * 100;
        }
    }
}

function GetButtonInDirection(buttons, dx, dy) {
    // from current mouse position

    // get "main" direction (right, left, etc)
    if (Math.abs(dx) >= Math.abs(dy)) {
        dy = 0;
    } else {
        dx = 0;
    }
    if (dx === 0 && dy === 0) return;

    // button subset
    let byProximity = (a, b) => {
        return (Math.abs(a.x - mouseX) + Math.abs(a.y - mouseY)) - (Math.abs(b.x - mouseX) + Math.abs(b.y - mouseY));
    }

    validButtons = [];
    priority = [];
    if (dx > 0) {
        //right
        validButtons = buttons.filter(a => a.x > mouseX);
        priority = validButtons.filter(a => a.y <= mouseY && a.y + a.height >= mouseY);
    } else if (dx < 0) {
        //left
        validButtons = buttons.filter(a => a.x + a.width < mouseX);
        priority = validButtons.filter(a => a.y <= mouseY && a.y + a.height >= mouseY);
    } else if (dy > 0) {
        //down
        validButtons = buttons.filter(a => a.y > mouseY);
        priority = validButtons.filter(a => a.x <= mouseX && a.x + a.width >= mouseX);
    } else if (dy < 0) {
        //up
        validButtons = buttons.filter(a => a.y + a.height < mouseY);
        priority = validButtons.filter(a => a.x <= mouseX && a.x + a.width >= mouseX);
    }
    priority.sort(byProximity);
    if (priority.length > 0) return priority[0];
    validButtons.sort(byProximity);
    if (validButtons.length > 0) return validButtons[0];
    return buttons[0];
}