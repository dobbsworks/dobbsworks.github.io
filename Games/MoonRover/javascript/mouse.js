var mouseX = 0;
var mouseY = 0;
var isMouseDown = false;
var isMouseChanged = false;

function InitMouseHandlers() {
    canvas.addEventListener("mousedown", OnMouseDown, false);
    canvas.addEventListener("mouseup", OnMouseUp, false);
    canvas.addEventListener("mousemove", OnMouseMove, false);
    canvas.addEventListener("touchstart", OnTouchStart, false);
    canvas.addEventListener("touchend", OnTouchEnd, false);
    canvas.addEventListener("touchmove", OnTouchMove, false);
}

function UpdateMouseChanged() {
    isMouseChanged = false;
}

function isMouseClicked() {
    return isMouseChanged && isMouseDown;
}

function OnMouseDown(e) {
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
    mouseX = e.layerX;
    mouseY = e.layerY;
}

function OnTouchStart(e) {
    //TODO - account for canvas position
    mouseX = e.touches[0].pageX;
    mouseY = e.touches[0].pageY;
    isMouseDown = true;
    isMouseChanged = true;
}

function OnTouchEnd(e) {
    isMouseDown = false;
    isMouseChanged = true;
}

function OnTouchMove(e) {
    mouseX = e.touches[0].pageX;
    mouseY = e.touches[0].pageY;
}