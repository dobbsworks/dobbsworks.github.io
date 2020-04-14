var viewWidth = 1066;
var viewHeight = 600;
window.onload = InitializeGameEngine;

var gameViewContext;
var sprites = [];
var mainLoop = { interval: null, milliseconds: 20 };


function InitializeGameEngine() {
    var gameView = document.getElementById('gameView');

    gameView.addEventListener("mouseenter", onMouseEnter, false);
    gameView.addEventListener("mouseleave", onMouseLeave, false);
    gameView.addEventListener("mousedown", onMouseDown, false);
    gameView.addEventListener("mouseup", onMouseUp, false);
    gameView.addEventListener("mousemove", onMouseMove, false);
    gameView.addEventListener("touchstart", onMouseDown, false);
    gameView.addEventListener("touchmove", onMouseMove, false);
    gameView.addEventListener("touchend", onMouseUp, false);
    gameView.oncontextmenu = function (e) {
        e.preventDefault();
    };

    gameViewContext = gameView.getContext('2d');
    gameViewContext.imageSmoothingEnabled = false;

    StartGame();
    mainLoop.interval = setInterval(pulse, mainLoop.milliseconds);
}


function pulse() {
    UpdateMouseDelta();
    MainDrawLoop();
}


var scorer = null;
var lanes = []
function StartGame() {
    lanes = [];
    sprites = [];

    lanes.push(new Lane(60));

    scorer = new Scorer(200, 450);
    sprites.push(scorer);

    for (var i = 0; i < lanes.length; i++) sprites.push(lanes[i]);

    sprites.push(new TextBubble(910, 265, "v 1.0.1", false, 300));
    sprites.push(new TextBubble(700, 130, "SHAPE DRIFTER", false, 300));
    sprites.push(new TextBubble(560, 265, "Made for Ludum Dare 35", false, 300));

    sprites.push(new TextBubble(700, 400, "Match incoming shapes to feed the blob!", false, 300));
    sprites.push(new TextBubble(700, 465, "  Click or Up/Down to change shapes.   ", false, 300));

    level = new Level();
}

var level = null;
function MainDrawLoop() {
    gameViewContext.clearRect(0, 0, viewWidth, viewHeight);

    if (level) level.executeRules();

    for (var i = 0; i < sprites.length; i++)
        if (sprites[i] && sprites[i].active)
            sprites[i].executeRules();
    for (var i = sprites.length - 1; i >= 0; i--)
        if (sprites[i] && !sprites[i].active)
            sprites[i].delete();
    for (var i = 0; i < sprites.length; i++)
        sprites[i].draw();
}