var mouseX = 0;
var mouseY = 0;
var isMouseDown = false;
var isMouseChanged = false;

function InitMouseHandlers() {
    canvas.addEventListener("mousedown", OnMouseDown, false);
    canvas.addEventListener("mouseup", OnMouseUp, false);
    canvas.addEventListener("mousemove", OnMouseMove, false);
}

function UpdateMouseChanged() {
    isMouseChanged = false;
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