var viewWidth;
var viewHeight;
window.onload = InitializeGameEngine;

var debugMode = false;

var gameViewContext;
var sprites = [];
var editorSprites = [];
var mouseInfo = { x: 0, y: 0, pressed: false, oldX: 0, oldY: 0, clicked: false };
var mainLoop = { interval: null, milliseconds: 20 };

function ResizeWindow() {
    var gameViewContainer = document.getElementById('gameViewContainer');
    var gameView = document.getElementById('gameView');
    viewWidth = window.innerWidth - 20;
    viewHeight = window.innerHeight - 20;
    gameView.width = viewWidth;
    gameView.height = viewHeight;
    gameView.style.width = viewWidth + 'px';
    gameView.style.height = viewHeight + 'px';
    gameViewContainer.style.width = viewWidth + 'px';
    gameViewContainer.style.height = viewHeight + 'px';
    for (var i = 0; i < menus.length; i++) {
        menus[i].refreshPosition();
    }
}

function InitializeGameEngine() {
    var gameView = document.getElementById('gameView');
    ResizeWindow();

    var mainMenu = new MainMenu();
    mainMenu.display();

    document.body.onresize = ResizeWindow;
    window.addEventListener('orientationchange', ResizeWindow);

    gameView.addEventListener("mousedown", onMouseDown, false);
    gameView.addEventListener("mouseup", onMouseUp, false);
    gameView.addEventListener("mousemove", onMouseMove, false);
    gameView.addEventListener("touchstart", onMouseDown, false);
    gameView.addEventListener("touchmove", onMouseMove, false);
    gameView.addEventListener("touchend", onMouseUp, false);
    gameView.addEventListener("wheel", onMouseScroll, false);
    gameView.oncontextmenu = function (e) { e.preventDefault(); };
    InitializeTableControls();

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

    gameView.onmouseup = function (e) { mouseInfo.pressed = false; };
    gameView.onmouseout = function (e) { mouseInfo.pressed = false; };

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
}

var debugKeyStep = false;
function pulse() {
    UpdateMouseDelta();
    MainDrawLoop();
    //cycleMouseInfo();
}

var gameMode = {
    play: 0,
    playPaused: 1,
    edit: 2
}

var mode = gameMode.play;

function MainDrawLoop() {

    gameViewContext.clearRect(0, 0, viewWidth, viewHeight);

    var background = document.getElementById('Background1');
    gameViewContext.drawImage(background, 20, 10, 260, 190, 0, 0, viewWidth, viewHeight);
    gameViewContext.fillStyle = "rgba(72, 140, 192, 0.5)";
    gameViewContext.fillRect(0, 0, viewWidth, viewHeight);

    if (keyboardState.isKeyPressed(keyboardState.key.P) && mode == gameMode.playPaused) mode = gameMode.play;
    if (keyboardState.isKeyPressed(keyboardState.key.O) && mode == gameMode.play) mode = gameMode.playPaused;
    
    var debugPressed = keyboardState.isKeyPressed(keyboardState.key.M);
    if (!debugPressed) debugKeyStep = false;

    StartLog("sprites-executeRules");
    for (var i = 0; i < sprites.length; i++)
        if (sprites[i] && sprites[i].active)
            if (mode != gameMode.playPaused || (debugPressed && !debugKeyStep)) {
                sprites[i].executeRules();
            }
    StartLog("sprites-delete");
    for (var i = sprites.length - 1; i >= 0; i--)
        if (sprites[i] && !sprites[i].active)
    sprites[i].delete();
    StartLog("particleEffects-delete");
    for (var i = particleEffects.length - 1; i >= 0; i--)
        if (particleEffects[i] && !particleEffects[i].active)
            particleEffects[i].delete();

    StartLog("camera-update");
    camera.updateCamera();

    StartLog("PowerConnection-draw");
    for (var i = 0; i < sprites.length; i++) {
        camera.drawPowerConnection(sprites[i]);
    }
    StartLog("sprites-draw");
    for (var z = -5; z <= 5; z++) {
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i].zIndex != z) continue;
            sprites[i].prepareDraw();
            sprites[i].draw();
        }
    }
    //for (var i = 0; i < sprites.length; i++) {
    //    if (!sprites[i].background) continue;
    //    sprites[i].prepareDraw();
    //    sprites[i].draw();
    //}
    //for (var i = 0; i < sprites.length; i++) {
    //    if (sprites[i].background) continue;
    //    sprites[i].prepareDraw();
    //    sprites[i].draw();
    //}
    StartLog("particleEffects-draw");
    for (var i = 0; i < particleEffects.length; i++) {
        particleEffects[i].draw();
    }
    EndLog();

    
    if (mode == gameMode.edit) {
        EditorDraw();
    }

    if (debugPressed) debugKeyStep = true;

    CheckForDeadState();
}

function EditorDraw() {
    StartLog("handleAnchors");
    HandleAnchors();
    StartLog("editorSprites-executeRules");
    for (var i = 0; i < editorSprites.length; i++) {
        if (editorSprites[i].executeRules)
            editorSprites[i].executeRules();
    }
    StartLog("editorSprites-drawPowerConnection");
    for (var i = 0; i < editorSprites.length; i++) {
        camera.drawPowerConnection(editorSprites[i]);
    }
    StartLog("editorSprites-draw");
    for (var z = -5; z <= 5; z++) {
        for (var i = 0; i < editorSprites.length; i++) {
            if (editorSprites[i].zIndex != z) continue;
            editorSprites[i].draw();
        }
    }
    EndLog();
    camera.drawEditorGridLines();
    if (selectedSprite) selectedSprite.drawAnchors();

    gameViewContext.strokeStyle = 'rgba(255,255,255,0.5)';
    gameViewContext.lineWidth = 3;
    camera.drawLine(camera.x - 8, camera.y - 8, camera.x + 8, camera.y + 8);
    camera.drawLine(camera.x + 8, camera.y - 8, camera.x - 8, camera.y + 8);
}