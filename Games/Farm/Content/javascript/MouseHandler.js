
var mouseX = 0;
var mouseY = 0;

function UpdateMousePosition(e) {
    var canvas = document.getElementById("gameView");

    var pageX = e.pageX;
    var pageY = e.pageY;
    if (e.touches) {
        pageX = e.touches[0].pageX;
        pageY = e.touches[0].pageY;
    }

    var x = pageX;
    var y = pageY;
    for (var node = canvas; node != null; node = node.offsetParent) {
        if (node.offsetLeft) x -= node.offsetLeft;
        if (node.offsetTop) y -= node.offsetTop;
    }

    mouseX = x;
    mouseY = y;
    mouseInfo.x = x;
    mouseInfo.y = y;
}

function onMouseUp(e) {
}


function onMouseMove(e) {
    var canvas = document.getElementById("gameView");
    var pageX = e.pageX;
    var pageY = e.pageY;
    if (e.touches) {
        pageX = e.touches[0].pageX;
        pageY = e.touches[0].pageY;
    }

    var x = pageX - canvas.offsetLeft;
    var y = pageY - canvas.offsetTop;

    mouseX = x;
    mouseY = y;
}