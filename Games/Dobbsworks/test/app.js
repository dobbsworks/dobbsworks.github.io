"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
window.onload = Initialize;
var tiles = {};
var camera;
var currentMap;
var mouseHandler;
var editorHandler = new EditorHandler();
var uiHandler = new UiHandler();
var audioHandler;
var currentLevelId = -1;
function Initialize() {
    LoadImageSources();
    var canvas = document.getElementById("canvas");
    camera = new Camera(canvas);
    mouseHandler = new MouseHandler(canvas);
    audioHandler = new AudioHandler();
    audioHandler.Initialize();
    KeyboardHandler.InitKeyHandlers();
    CreateTestMap();
    setInterval(MainLoop, 1000 / 60);
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
            for (var col = 0; col < cols; col++) {
                var tileCol = {};
                for (var row = 0; row < rows; row++) {
                    var imageTile = new ImageTile(img, col * colWidth, row * rowHeight, colWidth, rowHeight);
                    tileCol[row] = imageTile;
                }
                tileMap[col] = tileCol;
            }
            tiles[imgName] = tileMap;
        }
}
function MainLoop() {
    Update();
    Draw();
    audioHandler.Update();
    var perf = document.getElementById("perf");
    perf.innerHTML = BenchmarkService.GetReports();
    var otherData = document.getElementById("data");
    otherData.innerHTML = "Version: " + version;
    BenchmarkService.Log("IDLE");
}
function Draw() {
    if (currentMap)
        currentMap.Draw(camera);
    MenuHandler.Draw(camera);
    BenchmarkService.Log("DrawEditor");
    if (editorHandler.isInEditMode)
        editorHandler.Draw(camera);
    BenchmarkService.Log("DrawUI");
    uiHandler.Draw(camera.ctx);
    BenchmarkService.Log("DrawDone");
}
var debugMode = false;
//var replayHandler: ReplayHandler | null; = new ReplayHandler();
//replayHandler.ImportFromBase64("ABcgGCQCNAg1BDEQIRUxBSEXIAwiBSAEIQYmAiIHJgIkAgQIJAIlAyEBMQERCDEBIQMgAyIJIAYkCAQDJAUgDSEcJAIiNAIFAAMQBwANEAgABRAEABUQDwAFEQkBHAADAgQyFyILMgM0AzEBEQoUARIDAg4ABQECEQMxCzIeOQExBiEFARgADQgGAAYIBAAFCAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=");
function Update() {
    var _a, _b, _c;
    //replayHandler.LoadFrame();
    KeyboardHandler.Update();
    MenuHandler.Update();
    var doesMenuBlockMapUpdate = (_a = MenuHandler.CurrentMenu) === null || _a === void 0 ? void 0 : _a.stopsMapUpdate;
    if (KeyboardHandler.IsKeyPressed(KeyAction.Fullscreen, true))
        (_b = document.getElementById("canvas")) === null || _b === void 0 ? void 0 : _b.requestFullscreen();
    if (KeyboardHandler.IsKeyPressed(KeyAction.Debug1, true))
        debugMode = !debugMode;
    //if (KeyboardHandler.IsKeyPressed(KeyAction.Reset, true)) window.location.reload();
    if (KeyboardHandler.IsKeyPressed(KeyAction.EditToggle, true)) {
        if (editorHandler.isInEditMode)
            editorHandler.SwitchToPlayMode();
        else if (editorHandler.isEditorAllowed)
            editorHandler.SwitchToEditMode();
    }
    if (debugMode) {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Debug2, true)) {
            if (currentMap && !editorHandler.isInEditMode && !doesMenuBlockMapUpdate)
                currentMap.Update();
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Debug3, true)) {
            var player_1 = currentMap.mainLayer.sprites[0];
            player_1.LoadHistory();
        }
    }
    else {
        //replayHandler.StoreFrame();
        if (currentMap && !doesMenuBlockMapUpdate) {
            if (editorHandler.isInEditMode) {
                currentMap.frameNum++;
                currentMap.mainLayer.Update();
            }
            else {
                currentMap.Update();
            }
        }
        if (currentMap && !doesMenuBlockMapUpdate && !editorHandler.isInEditMode && currentMap.CanPause() && !((_c = MenuHandler.CurrentMenu) === null || _c === void 0 ? void 0 : _c.blocksPause)) {
            var isOnMainMenu = MenuHandler.CurrentMenu instanceof MainMenu;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Pause, true) && !isOnMainMenu) {
                var msSinceUnpause = (+(new Date()) - +PauseMenu.UnpauseTime);
                if (msSinceUnpause > 100)
                    MenuHandler.SubMenu(PauseMenu);
            }
        }
    }
    uiHandler.Update();
    editorHandler.Update();
    camera.Update();
    mouseHandler.UpdateMouseChanged();
}
function CreateTestMap() {
    var mainLayer = new LevelLayer(TargetLayer.main);
    var wireLayer = new LevelLayer(TargetLayer.wire);
    var waterLayer = new LevelLayer(TargetLayer.water);
    var semisolidLayer = new LevelLayer(TargetLayer.semisolid);
    var backdropLayer = new LevelLayer(TargetLayer.backdrop);
    TileType.RegisterTiles();
    var map = new LevelMap(mainLayer, wireLayer, waterLayer, semisolidLayer, backdropLayer);
    currentMap = map;
    editorHandler.Update(); // need to run one update cycle to init + set "default" positions
    editorHandler.sprites.push(new EditorSprite(Player, { tileX: 4, tileY: 16 }));
    currentMap = LevelMap.FromImportString("0.8.0;12;0;0;7|#18ffff,#ffd37f,0.00,0.65,0.40;AJ,#5eeded,-3.75,0,0.05,-2,1,0;AB,#5959a5,-3.5,0,0.1,-4,1,0;AJ,#5eeded,-7.75,0,0.2,-3,1,0;AJ,#5eeded,-10,0,0.3,-5,1,0|AA3AHAAAiAHAAA/AAdAHAAAiAHAAA/AAAAHGAA/AA8AHGAA/AA/AATAIHAADAIIAACAIIAACAIIAACAIIAACAIIAACAIIAACAIIAACAIIAACAIIAACAIIAACAIIAACAIIAA/AAWAIIAACAIIAACAIIAACAIIAACAIIAA/AA/AA/AA/AA/AA/AA/AAEAHAAAiAHAAA/AA4AHAAAiAHAAA/AAcAHAAAiAHAAA/AAY|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAL|AATADAClAAAJCkAADAAAKADAAAJDTAADAAAJDTAADAAAJDTAADAAAJDTAADAAAKADAAAsADAClAAAJCkAADAAAKADAAAJDTAADAAAJDTAADAAAJDTAADAAAJDTAADAAAKADAAACADAAAKADAAAKADAAAKADAAAGBQAAACADADXGBQAAACADAAAGBQAAACADAAAGBQAAACADAAAGBQAAACADAAAEBqBBQAAACADAAAEBqBBQAAACADAAAFBqABQAAACADAAAGBQAAACADAAAGBQAAACADAAAGBQAAACADAAAGBQAAACADADXGBQAAACADAAAGBQAAACADAAAKADAAAKADAAAcADBClAAAIADBCeAClAAAHCkACeAADBCtAAAHCkAADBCuAAAIADCCtAAAHADCCuAAAHADIDXCADDDSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAGBqAADADSAADADSAAAGBqAADADSAADADSAAAHADCDTADaAAAFDYADTAAABDZADTADXFDTADbAAACDSAAAFDTAAADDSAAAFDTAAADDSAAAFDTAAACDYADTADXFDTADaAAABDTADbAAAFDZADTAAABDSAAAHADCDSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADCDTAAAKDTAAAKDTAAAKDTAAAGADDDTAAAGADADSAADADSADTAAAGADADSAADADSADTAAAGADADSAADADSADTAAAGADADSAADADSADTAAAGADADSAADADSBAAEDTAAAAADADSAADADSBAAEDTAAAAADADSAADADSBAAEDTAAAAADADSAADADSBAAEDTAAAAADADSAADADSBDXDAAADTAAAAADADSAADADSBAAEDTAAAAADADSAADADSBAAEDTAAAAADADSAADADSBAAEDTAAAAADDDSAAAEDTAAAADUDDSAAAEDTAAAAADDDSAAADDYADTAAAAADADSAADADSBAACDYADTADbAAAAADCDSBAACDTADbAAACDSAADADSBDXCDTAAADDSAADADSADTEAADDSAADADSAAADDTADaAAACDSAADADSAAADDZADTADaAAAAADCDSAAAEDZADTAAAAADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAAHADADSAADADSAAApADAClAAAJCkAADAAAKADAAAJDTAADAAAJDTAADAAAJDTAADAAAJDTAADAAAKADAAA/AAHADAClAAAJCkAADAAAKADAAAJDTAADAAAJDTAADAAAJDTAADAAAJDTAADAAAKADAAArADAClAAAJCkAADAAAKADAAAJDTAADAAAJDTAADAAAJDTAADAAAJDTAADAAAKADAAA/AAL|AA3AFAAAAAFAAAIAFAAJAAFAAAIAFAAJAAFAAAIAFAAAAAFAAA/AAbAFAAAAAFAAAIAFAAJAAFAAAIAFAAJAAFAAAIAFAAAAAFAAA5ANAAAKANAAAKANAAAKANAAAKANAAAKANAAAKANAAAKANAAAKANAAAKANAAAKANAAAKANAAAKANAAAKANAAA/AA/AA/AA/AA/AACAJAAAKAJAAAKAJAAA/AA/AAwAFAAAKAFAAAEAJAAAKAJAAAKAJAAAKAJAAAKAJAAAKAJAAAKAJAAAKAJAAAKAJAAAKAJAAAKAJAAA/AA/AA/AAcAFAAAAAFAAAIAFAAJAAFAAAIAFAAJAAFAAAIAFAAAAAFAAA/AA2AFAAAAAFAAAIAFAAJAAFAAAIAFAAJAAFAAAIAFAAAAAFAAA/AAaAFAAAAAFAAAIAFAAJAAFAAAIAFAAJAAFAAAIAFAAAAAFAAA/AAW|AA/AAoABAAA/AA/AABABAAA/AA/AA/AA/AA8ABAAAKABAAA/AACABAAAKABAAAWABAAAKABAAA/AA/AA/AA/AA/AAZADAAAKADAAAFADAAADADAAAFADAAADADAAAFADAAADADAAAFADDAXAADAAAFADAAAKADAAAKADAAAKADAAA/AAvABAAA/AA/AAAABAAA/AA/AAcABAAA/AA/AAAABAAA/AAL|ABCHAC;ApAJAH;ApAUAG;AqAZAF;AHAkAH;ApAvNaAN;ApAuNaAN;ApAvAA;ApAuNaAN;ApAuAA;AqBGAH;AqBGAF;ApA0AI;ApA4AI;ArBLAG;ApBUAH;ApBWAH;ApBYAH;ArBgAI;ApBWAC;AfBeAD;ApBoAH;ApBzAF;ApCAAH;ArB9AE;ArCBAH;ApCLAF;ArCJAF;AAAEAH");
    //EditorSaveSlotButton.Buttons[1].SaveToSlot();
    editorHandler.SwitchToPlayMode();
    __spreadArrays(editorHandler.editorParentElementsTop, editorHandler.editorParentElementsBottom).forEach(function (a) { return a.SnapToPlace(); });
    MenuHandler.CreateMenu(InitialMenu);
}
var player;
