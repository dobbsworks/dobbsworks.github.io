"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var EditorHandler = /** @class */ (function () {
    function EditorHandler() {
        this.isEditorAllowed = false;
        this.isInEditMode = false;
        this.mouseOverTile = null;
        this.sprites = [];
        this.frameNum = 0;
        this.transitionValue = 0;
        this.maxTransitionValue = 60;
        this.history = new EditorHistory();
        this.selectionTool = new EditorSelectTool();
        this.currentTool = this.selectionTool;
        this.currentSaveSlot = 1;
        this.isMinimizedMode = false;
        this.isTempMinimized = false; // when dragging an item near the top or bottom of screen, hide toolbars
        this.editorParentElementsTop = [];
        this.editorParentElementsBottom = [];
        this.enableEraseSprites = true;
        this.enableEraseTiles = true;
        this.enableEraseWires = true;
        this.enableEraseBackdrop = true;
        this.enableEraseWater = true;
        this.backgroundLayerEditors = [];
        this.exportString = "";
        this.toolMenus = [];
        this.mouseOverButton = null;
        this.mapSizeChangeAmount = 5;
        this.selectedFillBrush = FreeformBrush;
        this.playerFrames = [];
        this.grabbedCheckpointLocation = null;
        this.bankedCheckpointTime = 0;
        this.initialized = false;
    }
    EditorHandler.prototype.Initialize = function () {
        var _a;
        var _this = this;
        if (this.initialized)
            return;
        this.initialized = true;
        this.mainPanel = new Panel(165, camera.canvas.height - 80, 630, 70);
        this.hotbar = new EditorHotbar(this.mainPanel);
        var hotbarDefaults = [];
        var eraserButton = new EditorButtonEraser();
        this.eraserPanel = new EditorButtonDrawer(this.mainPanel.x + this.mainPanel.width + 10, this.mainPanel.y, 70, 70, eraserButton, [
            new EditorButtonToggle(tiles["editor"][3][6], "Toggle water eraser", this.enableEraseWater, function (state) { _this.enableEraseWater = state; }),
            new EditorButtonToggle(tiles["editor"][3][2], "Toggle wire eraser", this.enableEraseWires, function (state) { _this.enableEraseWires = state; }),
            new EditorButtonToggle(tiles["editor"][3][1], "Toggle tile eraser", this.enableEraseTiles, function (state) { _this.enableEraseTiles = state; }),
            new EditorButtonToggle(tiles["editor"][3][0], "Toggle sprite eraser", this.enableEraseSprites, function (state) { _this.enableEraseSprites = state; }),
        ]);
        var resetHandle = new EditorButtonDrawerHandle(tiles["editor"][5][4], "Reset level", []);
        var resetButton = new EditorButton(tiles["editor"][5][5], "Confirm reset");
        resetButton.onClickEvents.push(function () { LevelMap.BlankOutMap(); });
        var resetPanel = new EditorButtonDrawer(this.eraserPanel.x + this.eraserPanel.width + 10, this.eraserPanel.y, 70, 70, resetHandle, [resetButton]);
        var exitButton = new EditorButton(tiles["editor"][5][6], "Exit");
        var exitPanel = new EditorSingleServePanel(this.eraserPanel.x + this.eraserPanel.width + 10, 10, exitButton);
        exitButton.onClickEvents.push(function () {
            editorHandler.isEditorAllowed = false;
            editorHandler.SwitchToPlayMode();
            MenuHandler.GoBack();
            if (MenuHandler.CurrentMenu == null) {
                MenuHandler.CreateMenu(MainMenu);
            }
        });
        /* TILE PANEL */
        var slopeFills = [
            new SlopeFill("Grassy", TileType.Dirt),
            new SlopeFill("Leafy", TileType.Leaves),
            new SlopeFill("Sandy", TileType.SandyGround),
            new SlopeFill("GreenStone", TileType.GreenStone),
            new SlopeFill("Plank", TileType.WoodPlanks),
            new SlopeFill("Blue", TileType.BlueGround),
            new SlopeFill("Purple", TileType.PurpleBrick),
        ];
        var tilePanelButtons = [];
        var tooltips = ["Solid ground", "Solid ground", "Solid ground", "Semisolid", "Backdrop", "Ladder", "Deadly block", "Decor"];
        for (var i = 0; i < 7; i++) {
            var tileTypeRow = (Object.values(TileType.TileMap).slice(i * 28 + 1, i * 28 + 9));
            tilePanelButtons.push.apply(tilePanelButtons, tileTypeRow.map(function (a, col) { return new EditorButtonTile(a, tooltips[col]); }));
            if (i == 0) {
                hotbarDefaults.push(tilePanelButtons[0]);
                hotbarDefaults.push(tilePanelButtons[3]);
                hotbarDefaults.push(tilePanelButtons[4]);
                hotbarDefaults.push(tilePanelButtons[5]);
                hotbarDefaults.push(tilePanelButtons[6]);
            }
            var fill = slopeFills.splice(0, 1)[0];
            if (fill)
                tilePanelButtons.push(new EditorButtonSlopePen(fill));
        }
        tilePanelButtons.push.apply(tilePanelButtons, [
            TileType.MetalGround, TileType.MetalBrick, TileType.MetalBlock, TileType.MetalTop,
            TileType.MetalBack, TileType.ChainLadder, TileType.MetalSpikes, TileType.DecorChain
        ].map(function (a, col) { return new EditorButtonTile(a, tooltips[col]); }));
        tilePanelButtons.push(new EditorButtonSlopePen(new SlopeFill("Metal", TileType.MetalBrick)));
        tilePanelButtons.push.apply(tilePanelButtons, [
            TileType.CaveGround, TileType.CaveBrick, TileType.CaveBlock, TileType.CaveTop,
            TileType.CaveBack, TileType.CaveLadder, TileType.CaveSpikes, TileType.DecorCave
        ].map(function (a, col) { return new EditorButtonTile(a, tooltips[col]); }));
        tilePanelButtons.push(new EditorButtonSlopePen(new SlopeFill("Cave", TileType.CaveGround)));
        var tilePanel = this.CreateFloatingButtonPanel(tilePanelButtons, 5, 9);
        /* ENEMY PANEL */
        var enemyTypes = [Piggle, Hoggle, Biggle, PorcoRosso, PorcoBlu, Snail, Prickle, PrickleEgg, PrickleShell, PrickleRock, DrSnips, AFish, Snouter, PricklySnouter, BeeWithSunglasses, Spurpider, Shrubbert, SnowtemPole, Snoworm, BouncingSnowWorm, Sparky];
        var enemyButtons = enemyTypes.map(function (a) { return new EditorButtonSprite(a); });
        enemyButtons.filter(function (a) { return a.spriteType == Piggle || a.spriteType == Snail; }).forEach(function (a) { return hotbarDefaults.push(a); });
        var enemyPanel = this.CreateFloatingButtonPanel(enemyButtons, 3, 7);
        var gizmoTypes = [
            BouncePlatform, CloudPlatform, FloatingPlatform, RisingPlatform, ShakyPlatform, WeightedPlatform, MushroomPlatform,
            Checkpoint, Baseball, Battery, Door, Fan, Key, Umbrella, SnailShell, Propeller, RedCannon, BlueCannon, Ring, Rocket, RedBalloon, BlueBalloon, YellowBalloon,
        ];
        var gizmoButtons = gizmoTypes.map(function (a) { return new EditorButtonSprite(a); });
        var keyIndex = gizmoButtons.findIndex(function (a) { return a instanceof EditorButtonSprite && a.spriteType == Key; });
        gizmoButtons.splice(keyIndex + 1, 0, new EditorButtonTile(TileType.Lock, "Lock block"));
        gizmoButtons.push(new EditorButtonTile(TileType.ConveyorLeft, "Conveyor (left)").AppendImage(tiles["editor"][0][2]));
        gizmoButtons.push(new EditorButtonTile(TileType.ConveyorRight, "Conveyor (right)").AppendImage(tiles["editor"][2][2]));
        gizmoButtons.push(new EditorButtonTile(TileType.ConveyorLeftFast, "Fast conveyor (left)").AppendImage(tiles["editor"][5][2]));
        gizmoButtons.push(new EditorButtonTile(TileType.ConveyorRightFast, "Fast conveyor (right)").AppendImage(tiles["editor"][6][2]));
        gizmoButtons.push(new EditorButtonTile(TileType.Barrel, "Barrel"));
        gizmoButtons.push(new EditorButtonTile(TileType.Pumpkin, "Pumpkin"));
        gizmoButtons.push(new EditorButtonTile(TileType.BubbleBlock1, "Bubble block"));
        gizmoButtons.push(new EditorButtonTile(TileType.HangingVine, "Hanging vines"));
        gizmoButtons.push(new EditorButtonTile(TileType.HangingBars, "Hanging bars"));
        gizmoButtons.push(new EditorButtonTile(TileType.Ice, "Ice"));
        var gizmoPanel = this.CreateFloatingButtonPanel(gizmoButtons, 5, 6);
        var brushTypeHandle = new EditorButtonDrawerHandle(tiles["editor"][4][0], "Brush types", []);
        this.brushPanel = new EditorButtonDrawer(this.mainPanel.x - 160, this.mainPanel.y, 70, 70, brushTypeHandle, [
            new EditorButtonFillBrush(FreeformBrush, tiles["editor"][4][0]),
            new EditorButtonFillBrush(LineBrush, tiles["editor"][4][1]),
            new EditorButtonFillBrush(RectangleBrush, tiles["editor"][4][2]),
            new EditorButtonFillBrush(CircleBrush, tiles["editor"][4][3])
        ]);
        this.brushPanel.children.forEach(function (a) {
            if (a instanceof EditorButtonFillBrush) {
                a.onClickEvents.push(function () {
                    var labelImage = (brushTypeHandle.children.find(function (b) { return b instanceof ImageFromTile; }));
                    labelImage.imageTile = (a.children[0]).imageTile;
                });
            }
        });
        var wirePanel = this.CreateFloatingButtonPanel([
            new EditorButtonTile(TileType.CircuitOff, "Wire"),
            new EditorButtonTile(TileType.CircuitCrossOff, "Wire bridge"),
            new EditorButtonTile(TileType.SlowCircuitOff, "Slow wire"),
            new EditorButtonTile(TileType.ExtraSlowCircuitOff, "Extra slow wire"),
            new EditorButtonTile(TileType.ConveyorLeftOff, "Powered conveyor (left)").AppendImage(tiles["editor"][0][2]),
            new EditorButtonTile(TileType.ConveyorRightOff, "Powered conveyor (right)").AppendImage(tiles["editor"][2][2]),
            new EditorButtonTile(TileType.AppearingBlockOff, "Appearing block"),
            new EditorButtonTile(TileType.DisappearingBlockOff, "Disappearing block"),
            new EditorButtonSprite(FloorButton),
            new EditorButtonSprite(LeftSideButton),
            new EditorButtonSprite(RightSideButton),
            new EditorButtonSprite(CeilingButton),
            new EditorButtonTile(TileType.DiodeRightOff, "Diode (right)"),
            new EditorButtonTile(TileType.DiodeDownOff, "Diode (down)"),
            new EditorButtonTile(TileType.DiodeLeftOff, "Diode (left)"),
            new EditorButtonTile(TileType.DiodeUpOff, "Diode (up)"),
            new EditorButtonTile(TileType.AndGateRightOff, "And gate (right)"),
            new EditorButtonTile(TileType.AndGateDownOff, "And gate (down)"),
            new EditorButtonTile(TileType.AndGateLeftOff, "And gate (left)"),
            new EditorButtonTile(TileType.AndGateUpOff, "And gate (up)"),
            new EditorButtonTile(TileType.InverterRightOff, "Inverter (right)"),
            new EditorButtonTile(TileType.InverterDownOff, "Inverter (down)"),
            new EditorButtonTile(TileType.InverterLeftOff, "Inverter (left)"),
            new EditorButtonTile(TileType.InverterUpOff, "Inverter (up)"),
            new EditorButtonTile(TileType.PowerBlock, "Power source"),
            new EditorButtonTile(TileType.CircuitHurtOff, "Zappy wire"),
            new EditorButtonTile(TileType.CircuitHurtSolidOff, "Zappy block"),
            new EditorButtonTile(TileType.CircuitMusicOff, "Music block"),
            new EditorButtonSprite(SlowMotor),
            new EditorButtonSprite(Motor),
            new EditorButtonSprite(FastMotor),
            new EditorButtonSprite(UpwardMotor),
            new EditorButtonTile(TileType.TrackHorizontal, "Horizontal Track"),
            new EditorButtonTile(TileType.TrackVertical, "Vertical Track"),
            new EditorButtonTile(TileType.TrackCurveDownRight, "Track Curve"),
            new EditorButtonTile(TileType.TrackCurveDownLeft, "TrackCurve"),
            new EditorButtonTile(TileType.TrackCurveUpLeft, "Track Curve"),
            new EditorButtonTile(TileType.TrackCurveUpRight, "Track Curve"),
            new EditorButtonTile(TileType.TrackLeftCap, "Track Cap"),
            new EditorButtonTile(TileType.TrackTopCap, "Track Cap"),
            new EditorButtonTile(TileType.TrackRightCap, "Track Cap"),
            new EditorButtonTile(TileType.TrackBottomCap, "Track Cap"),
            new EditorButtonSprite(Lever),
        ], 5, 8);
        var backgroundHandle = new EditorButtonDrawerHandle(tiles["editor"][0][3], "Background customization", []);
        this.skyEditor = new SkyEditor(this.mainPanel.x - 70 - 10, 110, 700, 300);
        for (var _i = 0, _b = [0, 1, 2, 3]; _i < _b.length; _i++) {
            var i = _b[_i];
            this.backgroundLayerEditors.push(new BackgroundLayerEditor(i));
        }
        var backgroundSubMenus = [
            new EditorButtonDrawerHandle(tiles["editor"][1][3], "Sky colors", [this.skyEditor]),
            new EditorButtonDrawerHandle(tiles["editor"][0][7], "Farthest background layer", [this.backgroundLayerEditors[0]]),
            new EditorButtonDrawerHandle(tiles["editor"][0][6], "Far background layer", [this.backgroundLayerEditors[1]]),
            new EditorButtonDrawerHandle(tiles["editor"][0][5], "Mid background layer", [this.backgroundLayerEditors[2]]),
            new EditorButtonDrawerHandle(tiles["editor"][0][4], "Closest background layer", [this.backgroundLayerEditors[3]]),
        ];
        backgroundSubMenus.forEach(function (a) { return a.radioKey = "bgMenu"; });
        this.backgroundPanel = new EditorButtonDrawer(this.brushPanel.x, 10, 70, 70, backgroundHandle, backgroundSubMenus);
        this.backgroundPanel.expandDirection = "down";
        this.backgroundPanel.children.reverse();
        var backgroundButtons = [
            new EditorButtonBackgroundLoad("digital", 10, BackgroundDefaults[10]),
            new EditorButtonBackgroundLoad("city", 9, BackgroundDefaults[9]),
            new EditorButtonBackgroundLoad("sky", 8, BackgroundDefaults[8]),
            new EditorButtonBackgroundLoad("space", 7, BackgroundDefaults[7]),
            new EditorButtonBackgroundLoad("ocean", 6, BackgroundDefaults[6]),
            new EditorButtonBackgroundLoad("cave", 5, BackgroundDefaults[5]),
            new EditorButtonBackgroundLoad("beach", 4, BackgroundDefaults[4]),
            new EditorButtonBackgroundLoad("snow", 3, BackgroundDefaults[3]),
            new EditorButtonBackgroundLoad("grassland", 0, BackgroundDefaults[0]),
            new EditorButtonBackgroundLoad("desert", 1, BackgroundDefaults[1]),
            new EditorButtonBackgroundLoad("forest", 2, BackgroundDefaults[2]),
        ];
        var backgroundsPanel = this.CreateFloatingButtonPanel(backgroundButtons, 3, 4);
        backgroundsPanel.targetX -= 80;
        backgroundsPanel.targetY = 90;
        var backgroundLoadHandle = new EditorButtonDrawerHandle(tiles["editor"][0][3], "Load background preset", [backgroundsPanel]);
        backgroundLoadHandle.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][0][8]));
        //let backgroundLoadPanel = new EditorButtonDrawer(this.brushPanel.x + 70 + 10, 10, 70, 70, backgroundLoadHandle, );
        var backgroundLoadPanel = new Panel(this.brushPanel.x + 70 + 10, 10, 70, 70);
        backgroundLoadPanel.AddChild(backgroundLoadHandle);
        var saveButton = new EditorSaveDrawer(this.mainPanel.x + this.mainPanel.width + 10, 10);
        var mapSizeHandle = new EditorButtonDrawerHandle(tiles["editor"][4][4], "Edit map size", [new MapSizeEditor()]);
        var mapSizePanel = new Panel(backgroundLoadPanel.x + 80, backgroundLoadPanel.y, 70, 70);
        mapSizePanel.AddChild(mapSizeHandle);
        this.playerButton = new EditorButtonSprite(Player);
        var levelFlowPanel = this.CreateFloatingButtonPanel([
            this.playerButton,
            new EditorButtonSprite(GoldGear),
            new EditorButtonSprite(Coin),
            new EditorButtonSprite(Dobbloon),
            new EditorButtonSprite(ExtraHitHeart),
        ], 1, 5);
        var levelFlowHandle = new EditorButtonDrawerHandle(tiles["editor"][5][3], "Level flow element", [levelFlowPanel]);
        var levelFlowHandlePanel = new Panel(mapSizePanel.x + 160, mapSizePanel.y, 70, 70);
        levelFlowPanel.targetX = levelFlowHandlePanel.x;
        levelFlowHandlePanel.AddChild(levelFlowHandle);
        var musicPanel = this.CreateMusicEditPanel();
        var musicHandle = new EditorButtonDrawerHandle(tiles["musicnotes"][1][0], "Level music", [musicPanel]);
        var musicHandlePanel = new Panel(mapSizePanel.x + 80, mapSizePanel.y, 70, 70);
        musicPanel.targetX = musicHandlePanel.targetX;
        musicPanel.targetY = musicHandlePanel.targetY + 80;
        musicHandlePanel.AddChild(musicHandle);
        var selectionMenuHandle = new EditorButtonDrawerHandle(tiles["editor"][0][1], "Level elements", []);
        var spriteSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][0], "Sprites", [enemyPanel]);
        var tileSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][1], "Tiles", [tilePanel]);
        var wireSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][2], "Wires and tracks", [wirePanel]);
        var gizmoSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][3], "Gadgets", [gizmoPanel]);
        var waterSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][6], "Fluids", [this.CreateWaterEditPanel()]);
        this.toolMenus = [waterSelectionHandle, wireSelectionHandle, gizmoSelectionHandle, spriteSelectionHandle, tileSelectionHandle];
        this.toolMenus.forEach(function (a) { return a.radioKey = "toolMenu"; });
        this.mainToolPanel = new EditorButtonDrawer(this.mainPanel.x - 70 - 10, this.mainPanel.y, 70, 70, selectionMenuHandle, this.toolMenus);
        // TODO - prevent other buttons from being used while options is open
        // let optionsPanel = OptionsMenu.CreateOptionsButton();
        // optionsPanel.targetX -= 80;
        this.editorParentElementsTop.push(this.backgroundPanel, backgroundLoadPanel, levelFlowHandlePanel, saveButton, mapSizePanel, musicHandlePanel, exitPanel);
        this.editorParentElementsBottom.push(this.mainPanel, this.eraserPanel, this.mainToolPanel, this.brushPanel, resetPanel);
        (_a = uiHandler.elements).push.apply(_a, __spreadArrays(this.editorParentElementsTop, this.editorParentElementsBottom));
        this.editorParentElementsTop.forEach(function (a) { return a.backColor = "#1138"; });
        this.editorParentElementsBottom.forEach(function (a) { return a.backColor = "#1138"; });
        hotbarDefaults.forEach(function (a) { return _this.hotbar.OnToolSelect(a); });
    };
    EditorHandler.prototype.CreateFloatingButtonPanel = function (buttons, maxDisplayedRows, tilesPerRow) {
        var panel = new Panel(this.mainPanel.x, 90, 70 * tilesPerRow, maxDisplayedRows * 70);
        panel.layout = "vertical";
        panel.margin = 0;
        panel.isHidden = true;
        var _loop_1 = function () {
            var rowButtons = buttons.splice(0, tilesPerRow);
            var rowPanel = new Panel(0, 0, panel.width, 70);
            rowButtons.forEach(function (a) { return rowPanel.AddChild(a); });
            if (panel.children.length < maxDisplayedRows) {
                panel.AddChild(rowPanel);
            }
            else {
                panel.scrollableChildren.push(rowPanel);
            }
        };
        while (buttons.length > 0) {
            _loop_1();
        }
        panel.fixedPosition = true;
        panel.backColor = "#1138";
        return panel;
    };
    EditorHandler.prototype.CreateMusicEditPanel = function () {
        var songs = audioHandler.levelSongList;
        var rows = Math.ceil(songs.length / 6);
        var ret = this.CreateFloatingButtonPanel(songs.map(function (a, i) { return new EditorButtonSong(i); }), rows, 6);
        ret.y = this.mainPanel.y + 80;
        ret.targetY = ret.y;
        return ret;
    };
    EditorHandler.prototype.CreateWaterEditPanel = function () {
        var waterBrush = new EditorButtonTile(TileType.Water, "Water");
        waterBrush.children = [];
        waterBrush.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["water"][4][0]));
        var purpleWaterBrush = new EditorButtonTile(TileType.PurpleWater, "Purple water");
        purpleWaterBrush.children = [];
        purpleWaterBrush.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["water"][4][3]));
        var lavaBrush = new EditorButtonTile(TileType.Lava, "Lava");
        lavaBrush.children = [];
        lavaBrush.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["water"][4][5]));
        var waterfallBrush = new EditorButtonTile(TileType.Waterfall, "Waterfall");
        var quickSandBrush = new EditorButtonTile(TileType.Quicksand, "Quicksand");
        this.spriteWaterModeToggle = new EditorButtonToggle(tiles["editor"][3][7], "Toggle sprite swim mode", currentMap.spriteWaterMode, function (state) { currentMap.spriteWaterMode = state; });
        this.playerWaterModeToggle = new EditorButtonToggle(tiles["editor"][3][8], "Toggle player swim mode", currentMap.playerWaterMode, function (state) { currentMap.playerWaterMode = state; });
        var bubbleButton = new EditorButtonSprite(AirBubble);
        var poisonGasBrush = new EditorButtonTile(TileType.PoisonGas, "Poison gas");
        var honeyBrush = new EditorButtonTile(TileType.Honey, "Honey");
        var honeyLeftBrush = new EditorButtonTile(TileType.HoneyLeft, "Honey wall (left)");
        var honeyRightBrush = new EditorButtonTile(TileType.HoneyRight, "Honey wall (right)");
        var ret = this.CreateFloatingButtonPanel([
            waterBrush, waterfallBrush, quickSandBrush, purpleWaterBrush, bubbleButton,
            lavaBrush, honeyBrush, honeyLeftBrush, honeyRightBrush,
            new EditorButtonTile(TileType.InitialWaterLevel, "Initial water level"),
            new EditorButtonTile(TileType.InitialPurpleWaterLevel, "Initial purple water level"),
            new EditorButtonTile(TileType.InitialLavaLevel, "Initial lava level"),
            new EditorButtonTile(TileType.Drain, "Drain"),
            new EditorButtonTile(TileType.WaterTapOff, "Water tap"),
            new EditorButtonTile(TileType.PurpleWaterTapOff, "Purple water tap"),
            new EditorButtonTile(TileType.LavaTapOff, "Lava tap"),
            this.playerWaterModeToggle, this.spriteWaterModeToggle
        ], 3, 6);
        ret.y = this.mainPanel.y - 290;
        ret.targetY = ret.y;
        return ret;
    };
    EditorHandler.prototype.EditMap = function (importString) {
        this.isEditorAllowed = true;
        this.exportString = importString;
        this.SwitchToEditMode();
    };
    EditorHandler.prototype.SwitchToEditMode = function () {
        this.transitionValue = 0;
        this.isInEditMode = true;
        camera.target = null;
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            sprite.ResetSprite();
        }
        if (currentMap) {
            currentMap.mainLayer.sprites = [];
        }
        if (this.editorParentElementsTop[0].targetY < 0) {
            this.editorParentElementsTop.forEach(function (a) { return a.targetY += 90; });
            this.editorParentElementsBottom.forEach(function (a) { return a.targetY -= 90; });
        }
        if (this.exportString) {
            currentMap = LevelMap.FromImportString(this.exportString, true);
        }
    };
    EditorHandler.prototype.SwitchToPlayMode = function () {
        this.playerFrames = [];
        if (this.isMinimizedMode)
            this.ToggleMinimizeMode();
        this.CloseDrawers();
        camera.targetScale = camera.defaultScale;
        camera.scale = camera.targetScale;
        this.transitionValue = this.maxTransitionValue;
        this.isInEditMode = false;
        if (currentMap) {
            for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.ResetSprite();
            }
            currentMap.mainLayer.sprites = [];
            for (var _b = 0, _c = this.sprites; _b < _c.length; _b++) {
                var sprite = _c[_b];
                sprite.ResetStack();
                currentMap.mainLayer.sprites.push(sprite.spriteInstance);
            }
            if (!currentMap.mainLayer.sprites.find(function (a) { return a instanceof Player; })) {
                currentMap.mainLayer.sprites.push(new Player(48, 0, currentMap.mainLayer, []));
            }
            camera.target = currentMap.mainLayer.sprites.find(function (a) { return a instanceof Player; }) || null;
        }
        if (this.editorParentElementsTop[0].targetY > 0) {
            this.editorParentElementsTop.forEach(function (a) { return a.targetY -= 90; });
            this.editorParentElementsBottom.forEach(function (a) { return a.targetY += 90; });
        }
        this.exportString = currentMap.GetExportString();
        if (this.grabbedCheckpointLocation != null) {
            var playerSprite = currentMap.mainLayer.sprites.find(function (a) { return a instanceof Player; });
            var tileX_1 = this.grabbedCheckpointLocation.tileX;
            var tileY_1 = this.grabbedCheckpointLocation.tileY;
            if (playerSprite) {
                playerSprite.x = tileX_1 * 12 + 6 - playerSprite.width / 2;
                playerSprite.y = tileY_1 * 12 + 12 - playerSprite.height;
            }
            var checkpoint = currentMap.mainLayer.sprites.find(function (a) { return a instanceof Checkpoint && a.x == tileX_1 * 12 && a.y == tileY_1 * 12; });
            if (checkpoint) {
                checkpoint.isCollected = true;
            }
        }
        else {
            this.bankedCheckpointTime = 0;
        }
    };
    EditorHandler.prototype.ToggleMinimizeMode = function () {
        this.isTempMinimized = false;
        this.isMinimizedMode = !this.isMinimizedMode;
        if (this.isMinimizedMode) {
            this.CloseDrawers();
            if (this.editorParentElementsTop[0].targetY > 0) {
                this.editorParentElementsTop.forEach(function (a) { return a.targetY -= 90; });
                this.editorParentElementsBottom.forEach(function (a) { return a.targetY += 90; });
            }
        }
        else {
            if (this.editorParentElementsTop[0].targetY < 0) {
                this.editorParentElementsTop.forEach(function (a) { return a.targetY += 90; });
                this.editorParentElementsBottom.forEach(function (a) { return a.targetY -= 90; });
            }
        }
    };
    EditorHandler.prototype.Update = function () {
        //if (!this.isEditorAllowed) return;
        BenchmarkService.Log("EditorUpdate");
        this.Initialize();
        this.mouseOverButton = null;
        if (this.isInEditMode) {
            if (this.transitionValue < this.maxTransitionValue)
                this.transitionValue++;
        }
        else {
            if (this.transitionValue > 0)
                this.transitionValue--;
            // ghost player
            if (currentMap.frameNum % 10 == 0) {
                var player_1 = currentMap.mainLayer.sprites.find(function (a) { return a instanceof Player; });
                if (player_1) {
                    this.playerFrames.push({ fd: player_1.GetFrameData(currentMap.frameNum), x: player_1.x, y: player_1.y });
                    if (this.playerFrames.length > 30) {
                        this.playerFrames.splice(0, 1);
                    }
                }
            }
        }
        if (!this.isInEditMode)
            return;
        this.frameNum++;
        var cameraSpeed = 6 / camera.scale;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false))
            camera.x -= cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false))
            camera.x += cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false))
            camera.y -= cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false))
            camera.y += cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorMinimize, true))
            this.ToggleMinimizeMode();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorEraseHotkey, true))
            this.eraserPanel.children[0].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorPlayerHotkey, true))
            this.playerButton.Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorUndo, true))
            this.history.Undo();
        //if (KeyboardHandler.IsKeyPressed(KeyAction.EditorRedo, true)) this.history.Redo();
        if (KeyboardHandler.IsKeyPressed(KeyAction.Cancel, true)) {
            this.currentTool = this.selectionTool;
            this.selectionTool.OnCancel();
            this.selectionTool.Reset();
            this.CloseDrawers();
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey1, true))
            this.hotbar.panel.children[0].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey2, true))
            this.hotbar.panel.children[1].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey3, true))
            this.hotbar.panel.children[2].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey4, true))
            this.hotbar.panel.children[3].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey5, true))
            this.hotbar.panel.children[4].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey6, true))
            this.hotbar.panel.children[5].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey7, true))
            this.hotbar.panel.children[6].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey8, true))
            this.hotbar.panel.children[7].Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorHotkey9, true))
            this.hotbar.panel.children[8].Click();
        if (uiHandler.mousedOverElements.length == 0) {
            if (mouseHandler.mouseScroll > 0) {
                camera.targetScale -= 1;
            }
            if (mouseHandler.mouseScroll < 0) {
                camera.targetScale += 1;
            }
        }
        var _loop_2 = function (sprite) {
            if (sprite.spriteInstance.maxAllowed > -1) {
                var totalOfThisType = this_1.sprites.filter(function (a) { return a.spriteType == sprite.spriteType; }).length;
                if (totalOfThisType > sprite.spriteInstance.maxAllowed) {
                    // too many of this sprite, remove this one
                    this_1.sprites = this_1.sprites.filter(function (a) { return a !== sprite; });
                    return "continue";
                }
            }
        };
        var this_1 = this;
        // really hacky fix to deal with occasional duplicate player objects
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            _loop_2(sprite);
        }
        for (var _b = 0, _c = this.sprites; _b < _c.length; _b++) {
            var sprite = _c[_b];
            sprite.Update();
        }
        if (currentMap) {
            this.mouseOverTile = mouseHandler.GetGameMouseTile(currentMap.mainLayer, camera);
            if (this.currentTool) {
                if (mouseHandler.isMouseClicked() && uiHandler.mousedOverElements.length == 0) {
                    this.currentTool.OnInitialClick(this.mouseOverTile);
                    this.currentTool.initiallyClicked = true;
                }
                if (mouseHandler.isMouseDown && this.currentTool.initiallyClicked) {
                    this.currentTool.OnClickOver(this.mouseOverTile);
                    // drag to top or bottom
                    if (mouseHandler.mouseY > 400 || mouseHandler.mouseY < 140) {
                        if (!this.isMinimizedMode) {
                            this.ToggleMinimizeMode();
                            this.isTempMinimized = true;
                        }
                    }
                }
                if (!mouseHandler.isMouseDown && mouseHandler.isMouseChanged && this.currentTool.initiallyClicked) {
                    this.currentTool.invalidTiles = [];
                    if (mouseHandler.isMouseOver) {
                        this.history.RecordHistory();
                        this.currentTool.OnReleaseClick();
                    }
                    else {
                        this.currentTool.OnCancel();
                    }
                    if (this.isTempMinimized) {
                        this.ToggleMinimizeMode();
                    }
                }
                if (!mouseHandler.isMouseDown) {
                    this.currentTool.initiallyClicked = false;
                }
            }
            if (this.selectionTool.selectedTiles.length > 0 && KeyboardHandler.IsKeyPressed(KeyAction.EditorDelete, true)) {
                this.history.RecordHistory();
                this.selectionTool.DeleteSelectedTiles();
                this.selectionTool.Reset();
                audioHandler.PlaySound("erase", true);
            }
            if (mouseHandler.isMouseClicked() && uiHandler.mousedOverElements.length == 0) {
                this.CloseDrawers();
            }
        }
        BenchmarkService.Log("EditorUpdateDone");
    };
    EditorHandler.prototype.CloseDrawers = function () {
        __spreadArrays(this.editorParentElementsTop, this.editorParentElementsBottom).forEach(function (a) {
            if (a instanceof EditorButtonDrawer) {
                a.Collapse();
                a.containerButton.isSelected = false;
            }
            a.children.forEach(function (a) {
                if (a instanceof EditorButtonDrawerHandle)
                    a.isSelected = false;
            });
        });
    };
    EditorHandler.prototype.DrawGridlines = function (camera, map) {
        var transitionRatio = this.transitionValue / this.maxTransitionValue;
        camera.ctx.strokeStyle = "#0004";
        var xPixelLeft = camera.x - (camera.canvas.width / 2) / camera.scale;
        var yPixelTop = camera.y - (camera.canvas.height / 2) / camera.scale;
        var xTileLeft = Math.floor(xPixelLeft / map.mainLayer.tileWidth);
        var yTileTop = Math.floor(yPixelTop / map.mainLayer.tileHeight);
        var leftXPixelGrid = (map.mainLayer.tileWidth - (xPixelLeft % map.mainLayer.tileWidth)) * camera.scale;
        var topYPixelGrid = (map.mainLayer.tileHeight - (yPixelTop % map.mainLayer.tileHeight)) * camera.scale;
        var horizGridThickCounter = xTileLeft + 1;
        var vertGridThickCounter = yTileTop + 1;
        for (var xPixel = Math.floor(leftXPixelGrid); xPixel < camera.canvas.width; xPixel += map.mainLayer.tileWidth * camera.scale) {
            camera.ctx.lineWidth = horizGridThickCounter % 5 == 0 ? 2 : 1;
            horizGridThickCounter++;
            camera.ctx.beginPath();
            if (horizGridThickCounter % 2) {
                camera.ctx.moveTo(xPixel, camera.canvas.height * (1 - transitionRatio));
                camera.ctx.lineTo(xPixel, camera.canvas.height);
            }
            else {
                camera.ctx.moveTo(xPixel, 0);
                camera.ctx.lineTo(xPixel, camera.canvas.height * (transitionRatio));
            }
            camera.ctx.stroke();
        }
        for (var yPixel = Math.floor(topYPixelGrid); yPixel < camera.canvas.height; yPixel += currentMap.mainLayer.tileHeight * camera.scale) {
            camera.ctx.lineWidth = vertGridThickCounter % 5 == 0 ? 2 : 1;
            vertGridThickCounter++;
            camera.ctx.beginPath();
            if (vertGridThickCounter % 2) {
                camera.ctx.moveTo(camera.canvas.width * (1 - transitionRatio), yPixel);
                camera.ctx.lineTo(camera.canvas.width, yPixel);
            }
            else {
                camera.ctx.moveTo(0, yPixel);
                camera.ctx.lineTo(camera.canvas.width * transitionRatio, yPixel);
            }
            camera.ctx.stroke();
        }
    };
    EditorHandler.prototype.DrawSprites = function (camera) {
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            sprite.Draw(this.frameNum);
        }
    };
    EditorHandler.prototype.Draw = function (camera) {
        if (this.transitionValue > 0 && currentMap) {
            for (var _i = 0, _a = this.playerFrames; _i < _a.length; _i++) {
                var playerFrame = _a[_i];
                var sprite = { x: playerFrame.x, y: playerFrame.y };
                currentMap.mainLayer.DrawFrame(GetGhostFrameData(playerFrame.fd), camera.scale, sprite);
            }
            this.DrawSprites(camera);
            this.DrawGridlines(camera, currentMap);
            var tileWidth = currentMap.mainLayer.tileWidth;
            var tileHeight = currentMap.mainLayer.tileHeight;
            if (this.mouseOverTile && uiHandler.mousedOverElements.length == 0) {
                camera.ctx.fillStyle = "#FFF3";
                camera.ctx.strokeStyle = "#0003";
                camera.ctx.lineWidth = 4;
                var x = this.mouseOverTile.tileX * tileWidth;
                var y = this.mouseOverTile.tileY * tileHeight;
                camera.ctx.fillRect((x - camera.x) * camera.scale + camera.canvas.width / 2, (y - camera.y) * camera.scale + camera.canvas.height / 2, tileWidth * camera.scale, tileHeight * camera.scale);
                camera.ctx.strokeRect((x - camera.x) * camera.scale + camera.canvas.width / 2, (y - camera.y) * camera.scale + camera.canvas.height / 2, tileWidth * camera.scale, tileHeight * camera.scale);
            }
            if (this.currentTool) {
                camera.ctx.fillStyle = "#22F6";
                camera.ctx.strokeStyle = "#FFF";
                camera.ctx.lineWidth = 4;
                for (var _b = 0, _c = this.currentTool.selectedTiles; _b < _c.length; _b++) {
                    var tileCoord = _c[_b];
                    camera.ctx.strokeRect((tileCoord.tileX * tileWidth - camera.x) * camera.scale + camera.canvas.width / 2, (tileCoord.tileY * tileHeight - camera.y) * camera.scale + camera.canvas.height / 2, tileWidth * camera.scale, tileHeight * camera.scale);
                }
                for (var _d = 0, _e = this.currentTool.selectedTiles; _d < _e.length; _d++) {
                    var tileCoord = _e[_d];
                    camera.ctx.fillRect((tileCoord.tileX * tileWidth - camera.x) * camera.scale + camera.canvas.width / 2, (tileCoord.tileY * tileHeight - camera.y) * camera.scale + camera.canvas.height / 2, tileWidth * camera.scale, tileHeight * camera.scale);
                }
                camera.ctx.fillStyle = "#F226";
                for (var _f = 0, _g = this.currentTool.invalidTiles; _f < _g.length; _f++) {
                    var tileCoord = _g[_f];
                    camera.ctx.strokeRect((tileCoord.tileX * tileWidth - camera.x) * camera.scale + camera.canvas.width / 2, (tileCoord.tileY * tileHeight - camera.y) * camera.scale + camera.canvas.height / 2, tileWidth * camera.scale, tileHeight * camera.scale);
                }
                for (var _h = 0, _j = this.currentTool.invalidTiles; _h < _j.length; _h++) {
                    var tileCoord = _j[_h];
                    camera.ctx.fillRect((tileCoord.tileX * tileWidth - camera.x) * camera.scale + camera.canvas.width / 2, (tileCoord.tileY * tileHeight - camera.y) * camera.scale + camera.canvas.height / 2, tileWidth * camera.scale, tileHeight * camera.scale);
                }
            }
            var mover = this.selectionTool.selectionMoverTool;
            if (mover) {
                var frameData = mover.frameData;
                var scale = camera.scale;
                frameData.imageTile.Draw(camera.ctx, ((mover.xOffset + mover.upperLeftSelectionStart.tileX) * tileWidth - camera.x - frameData.xOffset) * scale + camera.canvas.width / 2, ((mover.yOffset + mover.upperLeftSelectionStart.tileY) * tileHeight - camera.y - frameData.yOffset) * scale + camera.canvas.height / 2, scale, frameData.xFlip, frameData.yFlip);
                for (var _k = 0, _l = mover.sprites; _k < _l.length; _k++) {
                    var sprite = _l[_k];
                    sprite.Draw(this.frameNum);
                }
            }
        }
    };
    return EditorHandler;
}());
