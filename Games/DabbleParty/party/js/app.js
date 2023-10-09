"use strict";
window.onload = function () { setTimeout(Initialize, 100); };
var tiles = {};
var camera;
var mouseHandler;
var audioHandler;
var playerIndex = 0;
var currentMinigame = null;
var board = null;
var cutsceneService = new CutsceneService();
var minigames = [
    MinigameChip,
    MinigameConveyor,
    MinigameDodgePodge,
    MinigameFightOrFlightless,
    MinigameHoopstersForever,
    MinigameJustPlunkIt,
    MinigameLift,
    MinigameMatch,
    MinigameMushroomBounce,
    MinigamePointAndQuick,
    MinigameSlots,
    MinigameSnowtemPole,
    MinigameSpaceRace,
    MinigameThanksForTheCream,
    MinigameWhenPigsFly
];
function Initialize() {
    LoadImageSources();
    var canvas = document.getElementById("canvas");
    camera = new Camera(canvas);
    mouseHandler = new MouseHandler(canvas);
    audioHandler = new AudioHandler();
    audioHandler.Initialize();
    new FocusHandler().Initialize();
    UnloadHandler.RegisterUnloadHandler();
    KeyboardHandler.InitKeyHandlers();
    setInterval(MainLoop, 1000 / 60);
    InitializeTwitchSpaceUI();
    InitializeItemList();
    cutsceneService.AddScene(new CutscenePreTitle());
    // cutsceneService.AddScene(new CutsceneMainMenu());
    // setTimeout(() => {
    //     board = new BoardMap(-2);
    //     board.Initialize();
    //     board.FromData({
    //         "boardId":0,
    //         "currentRound":1,
    //         "finalRound":1,
    //         "currentPlayerIndex":-1,
    //         "currentMinigameIndex":-1,
    //         "players":[
    //             {"gears":0,"coins":10,"turnOrder":1,"avatarIndex":0,"spaceIndex":54,"items":[0,1],"userId":1,"userName":"Dobbs","diceBag":[6,6]},
    //             {"gears":0,"coins":10,"turnOrder":2,"avatarIndex":1,"spaceIndex":54,"items":[0,1],"userId":1,"userName":"Dobbs","diceBag":[6,6]}
    //         ]});
    //     let hostControls = document.getElementById("inputSection");
    //     if (hostControls) hostControls.style.display = "block";
    //     setTimeout(() => {
    //         audioHandler.SetBackgroundMusic("level1")
    //     }, 7000);
    //     //cutsceneService.AddScene(new BoardCutSceneIntro());
    // }, 500)
}
var times = [];
function MainLoop() {
    var t0 = performance.now();
    Update();
    Draw();
    audioHandler.Update();
    var t1 = performance.now();
    times.push(t1 - t0);
    if (times.length > 60)
        times.shift();
}
function GetLoopTime() {
    return times.reduce(function (a, b) { return a + b; }, 0) / times.length;
}
function Update() {
    var _a;
    KeyboardHandler.Update();
    if (KeyboardHandler.IsKeyPressed(KeyAction.Fullscreen, true))
        (_a = document.getElementById("canvas")) === null || _a === void 0 ? void 0 : _a.requestFullscreen();
    cutsceneService.Update();
    if (currentMinigame) {
        currentMinigame.BaseUpdate();
    }
    else if (board) {
        board.Update();
    }
    camera.Update();
    mouseHandler.UpdateMouseChanged();
    KeyboardHandler.AfterUpdate();
}
function Draw() {
    if (currentMinigame) {
        camera.ctx.imageSmoothingEnabled = false;
        currentMinigame.Draw(camera);
    }
    else if (board) {
        camera.ctx.imageSmoothingEnabled = true;
        board.Draw(camera);
    }
    cutsceneService.Draw(camera);
}
function LoadImageSources() {
    var _a, _b;
    var container = document.getElementById("imageResources");
    var images = container === null || container === void 0 ? void 0 : container.querySelectorAll("img");
    if (images)
        for (var _i = 0, _c = Array.from(images); _i < _c.length; _i++) {
            var img = _c[_i];
            var src = img.src.split(".png")[0];
            var imgName = src.split("/")[src.split("/").length - 1];
            if (src.indexOf("/bg/") > -1)
                imgName = "bg_" + imgName;
            var tileMap = {};
            var rows = +((_a = img.dataset.rows) !== null && _a !== void 0 ? _a : 1) || 1;
            var cols = +((_b = img.dataset.cols) !== null && _b !== void 0 ? _b : 1) || 1;
            var rowHeight = img.height / rows;
            var colWidth = img.width / cols;
            tileMap.rows = rows;
            tileMap.cols = cols;
            for (var col = 0; col < cols; col++) {
                var tileCol = {};
                for (var row = 0; row < rows; row++) {
                    var imageTile = new ImageTile(img, col * colWidth, row * rowHeight, colWidth, rowHeight, tileMap);
                    tileCol[row] = imageTile;
                }
                tileMap[col] = tileCol;
            }
            tiles[imgName] = tileMap;
        }
}
