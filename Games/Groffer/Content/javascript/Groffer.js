var viewWidth = 800;
var viewHeight = 600;
window.onload = InitializeGameEngine;

var gameViewContext;
var sprites = [];
var particleEffects = [];
var particleEffectGenerators = [];
var meters = [];
var mouseInfo = { x: 0, y: 0, pressed: false, oldX: 0, oldY: 0, clicked: false };
var mainLoop = { interval: null, milliseconds: 19 };

var player;

function InitializeGameEngine() {
    initializeGraphicSheets();
    var gameView = document.getElementById('gameView');

    gameView.addEventListener("mousedown", onMouseDown, false);
    gameView.addEventListener("mouseup", onMouseUp, false);
    gameView.addEventListener("mousemove", onMouseMove, false);
    gameView.addEventListener("touchstart", onMouseDown, false);
    gameView.addEventListener("touchmove", onMouseMove, false);
    gameView.addEventListener("touchend", onMouseUp, false);
    gameView.oncontextmenu = function (e) {
        e.preventDefault();
    };

    gameView.onmousedown = function (e) {
        e = e || window.event;
        mouseInfo.x = e.clientX;
        mouseInfo.y = e.clientY;
        mouseInfo.pressed = true;
        mouseInfo.clicked = true;
    };

    gameView.onmousemove = function (e) {
        e = e || window.event;
        mouseInfo.x = e.clientX;
        mouseInfo.y = e.clientY;
    };

    gameView.onmouseup = function (e) {
        mouseInfo.pressed = false;
    };

    gameView.onmouseout = function (e) {
        mouseInfo.pressed = false;
    };

    gameView.ontouchstart = function (e) {
        e = e || window.event;
        e.preventDefault();
        var touch = e.touches.item(0);
        mouseInfo.x = touch.clientX;
        mouseInfo.y = touch.clientY;
        mouseInfo.pressed = true;
        mouseInfo.clicked = true;
    };

    gameView.ontouchmove = function (e) {
        e = e || window.event;
        e.preventDefault();
        var touch = e.touches.item(0);
        mouseInfo.x = touch.clientX;
        mouseInfo.y = touch.clientY;
        mouseInfo.pressed = true;
    };

    gameView.ontouchend = function (e) {
        e = e || window.event;
        e.preventDefault();
        mouseInfo.pressed = false;
    }

    gameViewContext = gameView.getContext('2d');
    gameViewContext.imageSmoothingEnabled = false;

    mainLoop.interval = setInterval(pulse, mainLoop.milliseconds);
    MainMenu();
}




function pulse() {
    MainDrawLoop();
    cycleMouseInfo();
}

function cycleMouseInfo() {
    mouseInfo.oldX = mouseInfo.x;
    mouseInfo.oldY = mouseInfo.y;
    mouseInfo.clicked = false;
}




function StartGame() {
    //ClearGame();
    //levelNumber = 0
    //player = new PlayerShip(400, 500, 4);
    //level = new Level(levelNumber);
    //sprites.push(player);

    //var hpMeter = new MeterBase(400, 585, 500, 10, "green",
    //    function () { return player.HP },
    //    function () { return player.maxHP; })
    //var shieldMeter = new MeterBase(400, 585, 500, 20, "cyan",
    //    function () { return player.shield.HP },
    //    function () { return player.shield.maxHP; })
    //shieldMeter.minorTicks = 2;

    //meters.push(shieldMeter);
    //meters.push(hpMeter);
}



function MainDrawLoop() {
    gameViewContext.clearRect(0, 0, viewWidth, viewHeight);

}

Array.prototype.rand = function () {
    return this[Math.floor(Math.random() * this.length)];
};

