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
        this.cameraMoveTimer = 0;
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
        this.eraserButton = new EditorButtonEraser();
        var eraserPanel = new EditorButtonDrawer(this.mainPanel.x + this.mainPanel.width + 10, this.mainPanel.y, 70, 70, this.eraserButton, [
            new EditorButtonToggle(tiles["editor"][3][0], "Toggle sprite eraser", this.enableEraseSprites, function (state) { _this.enableEraseSprites = state; }),
            new EditorButtonToggle(tiles["editor"][3][1], "Toggle tile eraser", this.enableEraseTiles, function (state) { _this.enableEraseTiles = state; }),
            new EditorButtonToggle(tiles["editor"][3][2], "Toggle wire eraser", this.enableEraseWires, function (state) { _this.enableEraseWires = state; }),
            new EditorButtonToggle(tiles["editor"][3][6], "Toggle water eraser", this.enableEraseWater, function (state) { _this.enableEraseWater = state; }),
        ]);
        var resetHandle = new EditorButtonDrawerHandle(tiles["editor"][5][4], "Reset level", []);
        var resetButton = new EditorButton(tiles["editor"][5][5], "Confirm reset");
        resetButton.onClickEvents.push(function () { LevelMap.BlankOutMap(); });
        var resetPanel = new EditorButtonDrawer(eraserPanel.x + eraserPanel.width + 10, eraserPanel.y, 70, 70, resetHandle, [resetButton]);
        var exitButton = new EditorButton(tiles["editor"][5][6], "Exit");
        var exitPanel = new EditorSingleServePanel(eraserPanel.x + eraserPanel.width + 10, 10, exitButton);
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
            new SlopeFill("Metal", TileType.MetalBrick),
            new SlopeFill("Cave", TileType.CaveGround),
            new SlopeFill("White", TileType.WhiteGround),
            new SlopeFill("Candy", TileType.CandyGround),
        ];
        var tileRowBlocks = [
            TileType.Dirt,
            TileType.Tree,
            TileType.SandyGround,
            TileType.GreenStone,
            TileType.WoodPlanks,
            TileType.BlueGround,
            TileType.PurpleGround,
            TileType.MetalGround,
            TileType.CaveGround,
            TileType.WhiteGround,
            TileType.CandyGround,
        ];
        var tilePanelButtons = [];
        var tooltips = ["Solid ground", "Solid ground", "Solid ground", "Semisolid", "Backdrop", "Ladder", "Deadly block", "Decor"];
        for (var _i = 0, tileRowBlocks_1 = tileRowBlocks; _i < tileRowBlocks_1.length; _i++) {
            var block = tileRowBlocks_1[_i];
            var startIndex = Object.values(TileType.TileMap).indexOf(block);
            var tileTypeRow = (Object.values(TileType.TileMap).slice(startIndex, startIndex + 8));
            var editorButtons = tileTypeRow.map(function (a, col) {
                if (a.clockWiseRotationTileName)
                    return new EditorButtonTile(a, tooltips[col]).AppendImage(tiles["uiButtonAdd"][0][0]);
                return new EditorButtonTile(a, tooltips[col]);
            });
            tilePanelButtons.push.apply(tilePanelButtons, editorButtons);
            if (block == TileType.Dirt) {
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
        var tilePanel = this.CreateFloatingButtonPanel(tilePanelButtons, 5, 9);
        /* ENEMY PANEL */
        var enemyTypes = [Piggle, Hoggle, Biggle, PogoPiggle, PorcoRosso, PorcoBlu, Snail, SapphireSnail, Wooly, WoolyBooly, Prickle, PrickleEgg, PrickleShell, PrickleRock, DrSnips, AFish, Lurchin, Clammy, Pufferfish,
            Snouter, PricklySnouter, BeeWithSunglasses, Spurpider, ClimbingSpurpider, LittleJelly, ChillyJelly, Shrubbert, OrangeShrubbert, SnowtemPole, Snoworm, BouncingSnowWorm, Sparky, Orbbit, Keplurk, Yufo, Blaster, BaddleTrigger,];
        var enemyButtons = enemyTypes.map(function (a) { return new EditorButtonSprite(a); });
        enemyButtons.filter(function (a) { return a.spriteType == Piggle || a.spriteType == Snail; }).forEach(function (a) { return hotbarDefaults.push(a); });
        var enemyPanel = this.CreateFloatingButtonPanel(enemyButtons, 5, 7);
        var gizmoTypes = [
            BouncePlatform, CloudPlatform, FloatingPlatform, RisingPlatform, ShakyPlatform, WeightedPlatform, MushroomPlatform, Splatform,
            MushroomSpring, Baseball, Battery, Door, Fan, Key, FlatKey, Umbrella, SnailShell, SpringBox, Propeller, Saw, SmallSaw, RedCannon, BlueCannon, PurpleCannon, Ring, Rocket, Yoyo, RedBalloon, BlueBalloon, YellowBalloon,
            SpinRing, FragileSpinRing, PortalRing,
        ];
        var gizmoButtons = gizmoTypes.map(function (a) { return new EditorButtonSprite(a); });
        var keyIndex = gizmoButtons.findIndex(function (a) { return a instanceof EditorButtonSprite && a.spriteType == FlatKey; });
        gizmoButtons.splice(keyIndex + 1, 0, new EditorButtonTile(TileType.Lock, "Lock block"));
        gizmoButtons.push(new EditorButtonTile(TileType.ConveyorLeft, "Conveyor (left)").AppendImage(tiles["editor"][0][2]));
        gizmoButtons.push(new EditorButtonTile(TileType.ConveyorRight, "Conveyor (right)").AppendImage(tiles["editor"][2][2]));
        gizmoButtons.push(new EditorButtonTile(TileType.ConveyorLeftFast, "Fast conveyor (left)").AppendImage(tiles["editor"][5][2]));
        gizmoButtons.push(new EditorButtonTile(TileType.ConveyorRightFast, "Fast conveyor (right)").AppendImage(tiles["editor"][6][2]));
        gizmoButtons.push(new EditorButtonTile(TileType.HangingConveyorLeft, "Hanging Conveyor (left)"));
        gizmoButtons.push(new EditorButtonTile(TileType.HangingConveyorRight, "Hanging Conveyor (right)"));
        gizmoButtons.push(new EditorButtonTile(TileType.Barrel, "Barrel"));
        gizmoButtons.push(new EditorButtonTile(TileType.SteelBarrel, "Steel Barrel"));
        gizmoButtons.push(new EditorButtonTile(TileType.Pumpkin, "Pumpkin"));
        gizmoButtons.push(new EditorButtonTile(TileType.BubbleBlock1, "Bubble block"));
        gizmoButtons.push(new EditorButtonTile(TileType.HangingVine, "Hanging vines"));
        gizmoButtons.push(new EditorButtonTile(TileType.HangingBars, "Hanging bars"));
        gizmoButtons.push(new EditorButtonTile(TileType.Ice, "Ice Block"));
        gizmoButtons.push(new EditorButtonTile(TileType.IceTop, "Ice Top"));
        gizmoButtons.push(new EditorButtonTile(TileType.WindRight, "Wind").AppendImage(tiles["uiButtonAdd"][0][0]));
        gizmoButtons.push(new EditorButtonTile(TileType.FastWindRight, "Fast Wind").AppendImage(tiles["uiButtonAdd"][0][0]));
        gizmoButtons.push(new EditorButtonSprite(WindTriggerRight));
        gizmoButtons.push(new EditorButtonSprite(WindTriggerReset));
        gizmoButtons.push(new EditorButtonTile(TileType.OneWayRight, "One-way").AppendImage(tiles["uiButtonAdd"][0][0]));
        gizmoButtons.push(new EditorButtonTile(TileType.ArrowRight, "Arrow").AppendImage(tiles["uiButtonAdd"][0][0]));
        gizmoButtons.push(new EditorButtonTile(TileType.SolidForPlayer, "Player Blocker"));
        gizmoButtons.push(new EditorButtonTile(TileType.SolidForNonplayer, "Sprite Blocker"));
        gizmoButtons.push(new EditorButtonTile(TileType.SpriteKiller, "Sprite Killer"));
        gizmoButtons.push(new EditorButtonTile(TileType.ShimmerInitial, "Shimmer Block"));
        gizmoButtons.push(new EditorButtonTile(TileType.WallJumpLeft, "Wall Jump (left)"));
        gizmoButtons.push(new EditorButtonTile(TileType.WallJumpRight, "Wall Jump (right)"));
        // gizmoButtons.push(new EditorButtonTile(TileType.WallWarpLeft, "Warp Wall (left)"));
        // gizmoButtons.push(new EditorButtonTile(TileType.WallWarpRight, "Warp Wall (right)"));
        gizmoButtons.push(new EditorButtonSprite(Doopster));
        gizmoButtons.push(new EditorButtonSprite(Dabbot));
        var gizmoPanel = this.CreateFloatingButtonPanel(gizmoButtons, 5, 6);
        var brushTypeHandle = new EditorButtonDrawerHandle(tiles["editor"][4][0], "Brush types", []);
        var brushButtons = [
            new EditorButtonFillBrush(CircleBrush, tiles["editor"][4][3], 0),
            new EditorButtonFillBrush(RectangleBrush, tiles["editor"][4][2], 1),
            new EditorButtonFillBrush(LineBrush, tiles["editor"][4][1], 2),
            new EditorButtonFillBrush(FreeformBrush, tiles["editor"][4][0], 3),
        ];
        this.brushPanel = new EditorButtonDrawer(this.mainPanel.x - 160, this.mainPanel.y, 70, 70, brushTypeHandle, brushButtons);
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
            new EditorButtonTile(TileType.ConveyorLeftOffFast, "Powered fast conveyor (left)").AppendImage(tiles["editor"][0][2]),
            new EditorButtonTile(TileType.ConveyorRightOffFast, "Powered fast conveyor (right)").AppendImage(tiles["editor"][2][2]),
            new EditorButtonTile(TileType.AppearingBlockOff, "Appearing block"),
            new EditorButtonTile(TileType.DisappearingBlockOff, "Disappearing block"),
            new EditorButtonSprite(FloorButton),
            new EditorButtonTile(TileType.DiodeRightOff, "Diode").AppendImage(tiles["uiButtonAdd"][0][0]),
            new EditorButtonTile(TileType.AndGateRightOff, "And gate").AppendImage(tiles["uiButtonAdd"][0][0]),
            new EditorButtonTile(TileType.InverterRightOff, "Inverter").AppendImage(tiles["uiButtonAdd"][0][0]),
            new EditorButtonTile(TileType.PowerBlock, "Power source"),
            new EditorButtonTile(TileType.CircuitHurtOff, "Zappy wire"),
            new EditorButtonTile(TileType.CircuitHurtSolidOff, "Zappy block"),
            //new EditorButtonTile(TileType.CircuitMusicOff, "Music block"),
            new EditorButtonSprite(Winch),
            new EditorButtonSprite(ReverseWinch),
            new EditorButtonSprite(PullSwitch),
            new EditorButtonSprite(SlowMotor),
            new EditorButtonSprite(Motor),
            new EditorButtonSprite(FastMotor),
            new EditorButtonSprite(UpwardMotor),
            new EditorButtonSprite(FerrisMotorRight).AppendImage(tiles["editor"][2][2]).ChangeTooltip("Ferris Motor (clockwise)"),
            new EditorButtonSprite(FerrisMotorLeft).AppendImage(tiles["editor"][0][2]).ChangeTooltip("Ferris Motor (counter-clockwise)"),
            new EditorButtonSprite(FastFerrisMotorRight).AppendImage(tiles["editor"][6][2]).ChangeTooltip("Fast Ferris Motor (clockwise)"),
            new EditorButtonSprite(FastFerrisMotorLeft).AppendImage(tiles["editor"][5][2]).ChangeTooltip("Fast Ferris Motor (counter-clockwise)"),
            // new EditorButtonTile(TileType.TrackHorizontal, "Straight Track").AppendImage(tiles["uiButtonAdd"][0][0]),
            // new EditorButtonTile(TileType.TrackCurveDownRight, "Track Curve").AppendImage(tiles["uiButtonAdd"][0][0]),
            // new EditorButtonTile(TileType.TrackLeftCap, "Track Cap").AppendImage(tiles["uiButtonAdd"][0][0]),
            // new EditorButtonTile(TileType.TrackBridge, "Track Bridge"),
            new EditorButtonTrackTool(),
            new EditorButtonTile(TileType.TrackBranchDownLeftOff, "Track Branch").AppendImage(tiles["uiButtonAdd"][0][0]),
            new EditorButtonSprite(Lever),
            new EditorButtonSprite(Lightbulb),
            new EditorButtonTile(TileType.UnpoweredWindRight, "Wind generator"),
        ], 4, 8);
        var backgroundHandle = new EditorButtonDrawerHandle(tiles["editor"][0][3], "Background customization", []);
        this.skyEditor = new SkyEditor(this.mainPanel.x - 70 - 10, 110, 700, 300);
        for (var _b = 0, _c = [0, 1, 2, 3]; _b < _c.length; _b++) {
            var i = _c[_b];
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
            new EditorButtonBackgroundLoad("grassland", 0, BackgroundDefaults[0]),
            new EditorButtonBackgroundLoad("desert", 1, BackgroundDefaults[1]),
            new EditorButtonBackgroundLoad("forest", 2, BackgroundDefaults[2]),
            new EditorButtonBackgroundLoad("snow", 3, BackgroundDefaults[3]),
            new EditorButtonBackgroundLoad("beach", 4, BackgroundDefaults[4]),
            new EditorButtonBackgroundLoad("cave", 5, BackgroundDefaults[5]),
            new EditorButtonBackgroundLoad("ocean", 6, BackgroundDefaults[6]),
            new EditorButtonBackgroundLoad("space", 7, BackgroundDefaults[7]),
            new EditorButtonBackgroundLoad("sky", 8, BackgroundDefaults[8]),
            new EditorButtonBackgroundLoad("city", 9, BackgroundDefaults[9]),
            new EditorButtonBackgroundLoad("digital", 10, BackgroundDefaults[10]),
            new EditorButtonBackgroundLoad("toxic", 11, BackgroundDefaults[11]),
        ];
        var backgroundsPanel = this.CreateFloatingButtonPanel(backgroundButtons, 3, 4);
        backgroundsPanel.targetX -= 80;
        backgroundsPanel.targetY = 90;
        var backgroundLoadHandle = new EditorButtonDrawerHandle(tiles["editor"][0][3], "Load background preset", [backgroundsPanel]);
        backgroundLoadHandle.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][0][8]));
        var backgroundLoadPanel = new Panel(this.brushPanel.x + 70 + 10, 10, 70, 70);
        backgroundLoadPanel.AddChild(backgroundLoadHandle);
        this.saveDrawer = new EditorSaveDrawer(this.mainPanel.x + this.mainPanel.width + 10 - 70, 10);
        var optionsButton = OptionsMenu.CreateOptionsButton();
        optionsButton.targetX -= 70;
        var mapSizeHandle = new EditorButtonDrawerHandle(tiles["editor"][4][4], "Edit map size", [new MapSizeEditor()]);
        var mapSizePanel = new Panel(backgroundLoadPanel.x + 80, backgroundLoadPanel.y, 70, 70);
        mapSizePanel.AddChild(mapSizeHandle);
        this.playerButton = new EditorButtonSprite(Player);
        this.hoverPlayerButton = new EditorButtonSprite(HoverPlayer);
        var levelFlowPanel = this.CreateFloatingButtonPanel([
            this.playerButton,
            this.hoverPlayerButton,
            new EditorButtonSprite(GoldGear),
            new EditorButtonSprite(Coin),
            new EditorButtonSprite(Dabbloon),
            new EditorButtonSprite(ExtraHitHeart),
            new EditorButtonSprite(GoldHeart),
            new EditorButtonSprite(ReviveWings),
            new EditorButtonSprite(Checkpoint),
            new EditorButtonSprite(CameraLockHorizontal),
            new EditorButtonSprite(CameraLockVertical),
            new EditorButtonSprite(CameraZoomIn),
            new EditorButtonSprite(CameraZoomOut),
            new EditorButtonSprite(CameraScrollRight),
            new EditorButtonSprite(CameraScrollUp),
            new EditorButtonSprite(CameraScrollLeft),
            new EditorButtonSprite(CameraScrollDown),
            new EditorButtonSprite(CameraScrollReset),
        ], 3, 6);
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
        this.toolMenus = [tileSelectionHandle, spriteSelectionHandle, gizmoSelectionHandle, wireSelectionHandle, waterSelectionHandle,];
        this.toolMenus.forEach(function (a) { return a.radioKey = "toolMenu"; });
        this.mainToolPanel = new EditorButtonDrawer(this.mainPanel.x - 70 - 10, this.mainPanel.y, 70, 70, selectionMenuHandle, this.toolMenus);
        // TODO - prevent other buttons from being used while options is open
        // let optionsPanel = OptionsMenu.CreateOptionsButton();
        // optionsPanel.targetX -= 80;
        this.editorParentElementsTop.push(this.backgroundPanel, backgroundLoadPanel, levelFlowHandlePanel, this.saveDrawer, optionsButton, mapSizePanel, musicHandlePanel, exitPanel);
        this.editorParentElementsBottom.push(this.mainPanel, eraserPanel, this.mainToolPanel, this.brushPanel, resetPanel);
        (_a = uiHandler.elements).push.apply(_a, __spreadArrays(this.editorParentElementsTop, this.editorParentElementsBottom));
        this.editorParentElementsTop.forEach(function (a) { return a.backColor = "#1138"; });
        this.editorParentElementsBottom.forEach(function (a) { return a.backColor = "#1138"; });
        hotbarDefaults.forEach(function (a) { return _this.hotbar.OnToolSelect(a); });
        var brushPref = StorageService.GetPreference("brush", "3");
        brushButtons[+brushPref].Click();
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
            var remainingSpaces = tilesPerRow - rowButtons.length;
            for (var i = 0; i < remainingSpaces; i++) {
                rowPanel.AddChild(new Spacer(0, 0, 60, 60));
            }
            if (panel.children.length < maxDisplayedRows) {
                panel.AddChild(rowPanel);
            }
            else {
                panel.scrollableChildrenDown.push(rowPanel);
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
        var slimeBrush = new EditorButtonTile(TileType.Slime, "Slime");
        var honeyBrush = new EditorButtonTile(TileType.Honey, "Honey");
        var honeyLeftBrush = new EditorButtonTile(TileType.HoneyLeft, "Honey wall (left)");
        var honeyRightBrush = new EditorButtonTile(TileType.HoneyRight, "Honey wall (right)");
        var ret = this.CreateFloatingButtonPanel([
            waterBrush, waterfallBrush, quickSandBrush, purpleWaterBrush, poisonGasBrush, bubbleButton,
            lavaBrush, slimeBrush, honeyBrush, honeyLeftBrush, honeyRightBrush,
            new EditorButtonTile(TileType.InitialWaterLevel, "Initial water level"),
            new EditorButtonTile(TileType.InitialPurpleWaterLevel, "Initial purple water level"),
            new EditorButtonTile(TileType.InitialLavaLevel, "Initial lava level"),
            new EditorButtonTile(TileType.Drain, "Drain"),
            new EditorButtonTile(TileType.WaterTapOff, "Water tap"),
            new EditorButtonTile(TileType.PurpleWaterTapOff, "Purple water tap"),
            new EditorButtonTile(TileType.LavaTapOff, "Lava tap"),
            this.playerWaterModeToggle, this.spriteWaterModeToggle
        ], 4, 5);
        //ret.y = this.mainPanel.y - ret.height -;
        ret.targetY = ret.y;
        return ret;
    };
    EditorHandler.prototype.EditMap = function (importString) {
        this.isEditorAllowed = true;
        this.exportString = importString;
        this.SwitchToEditMode();
    };
    EditorHandler.prototype.SwitchToEditMode = function (isResettingLevel) {
        if (isResettingLevel === void 0) { isResettingLevel = false; }
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
            currentMap = LevelMap.FromImportString(this.exportString, true, isResettingLevel);
        }
        camera.Reset();
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
            for (var _i = 0, _a = currentMap.mainLayer.tiles; _i < _a.length; _i++) {
                var tileCol = _a[_i];
                for (var _b = 0, tileCol_1 = tileCol; _b < tileCol_1.length; _b++) {
                    var tile = tileCol_1[_b];
                    if (tile.tileType.autoChange) {
                        currentMap.autoChangeTiles.push({ tile: tile, standDuration: 0 });
                    }
                }
            }
            for (var _c = 0, _d = this.sprites; _c < _d.length; _c++) {
                var sprite = _d[_c];
                sprite.ResetSprite();
            }
            currentMap.mainLayer.sprites = [];
            for (var _e = 0, _f = this.sprites; _e < _f.length; _e++) {
                var sprite = _f[_e];
                sprite.ResetStack();
                currentMap.mainLayer.sprites.push(sprite.spriteInstance);
            }
            if (!currentMap.mainLayer.sprites.find(function (a) { return a instanceof Player; })) {
                currentMap.mainLayer.sprites.push(new Player(48, 0, currentMap.mainLayer, []));
            }
            camera.target = currentMap.mainLayer.sprites.find(function (a) { return a instanceof Player; }) || null;
            if (camera.target) {
                camera.x = camera.target.xMid;
                camera.y = camera.target.yMid;
                camera.targetX = camera.x;
                camera.targetY = camera.y;
            }
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
        camera.Reset();
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
                var players = currentMap.mainLayer.sprites.filter(function (a) { return a instanceof Player; });
                for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
                    var player_1 = players_1[_i];
                    var newFrame = { fd: player_1.GetFrameData(currentMap.frameNum), x: player_1.x, y: player_1.y };
                    var matchesLatest = false;
                    var latestFrame = this.playerFrames[this.playerFrames.length - 1];
                    if (latestFrame) {
                        if (Math.abs(latestFrame.x - newFrame.x) < 1 && Math.abs(latestFrame.y - newFrame.y) < 1)
                            matchesLatest = true;
                    }
                    if (!matchesLatest) {
                        this.playerFrames.push(newFrame);
                        if (this.playerFrames.length > 30) {
                            this.playerFrames.splice(0, 1);
                        }
                    }
                }
            }
        }
        if (!this.isInEditMode)
            return;
        this.frameNum++;
        this.cameraMoveTimer++;
        var cameraSpeed = 6 / camera.scale;
        if (this.cameraMoveTimer > 60)
            cameraSpeed = 12 / camera.scale;
        if (this.cameraMoveTimer > 120)
            cameraSpeed = 24 / camera.scale;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false))
            camera.targetX -= cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false))
            camera.targetX += cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false))
            camera.targetY -= cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false))
            camera.targetY += cameraSpeed;
        if (!KeyboardHandler.IsKeyPressed(KeyAction.Left, false) &&
            !KeyboardHandler.IsKeyPressed(KeyAction.Right, false) &&
            !KeyboardHandler.IsKeyPressed(KeyAction.Up, false) &&
            !KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.cameraMoveTimer = 0;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorMinimize, true) && MenuHandler.CurrentMenu == null)
            this.ToggleMinimizeMode();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorEraseHotkey, true) && MenuHandler.CurrentMenu == null)
            this.eraserButton.Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorPlayerHotkey, true)) {
            var isUsingHoverPlayer = editorHandler.sprites.some(function (a) { return a.spriteType == HoverPlayer; });
            if (isUsingHoverPlayer) {
                this.hoverPlayerButton.Click();
            }
            else {
                this.playerButton.Click();
            }
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorUndo, true))
            this.history.Undo();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorRedo, true))
            this.history.Redo();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorRotateHotkey, true))
            this.RotateCurrentTool();
        if (KeyboardHandler.IsKeyPressed(KeyAction.Cancel, true)) {
            this.currentTool = this.selectionTool;
            this.selectionTool.OnCancel();
            this.selectionTool.Reset();
            this.CloseDrawers();
        }
        for (var hotkey = 1; hotkey <= 9; hotkey++) {
            var keyAction = KeyAction.Hotkey(hotkey);
            if (KeyboardHandler.IsKeyReleased(keyAction))
                this.hotbar.KeyboardSelectNum(hotkey);
        }
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
        for (var _a = 0, _b = this.sprites; _a < _b.length; _a++) {
            var sprite = _b[_a];
            _loop_2(sprite);
        }
        for (var _c = 0, _d = this.sprites; _c < _d.length; _c++) {
            var sprite = _d[_c];
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
                        this.currentTool.OnReleaseClick();
                        this.history.RecordHistory();
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
                this.selectionTool.DeleteSelectedTiles();
                this.selectionTool.Reset();
                audioHandler.PlaySound("erase", true);
                this.history.RecordHistory();
            }
            if (mouseHandler.isMouseClicked() && uiHandler.mousedOverElements.length == 0) {
                this.CloseDrawers();
            }
        }
        camera.Update();
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
    EditorHandler.prototype.RotateCurrentTool = function () {
        if (this.currentTool instanceof FillBrush) {
            var fillType = this.currentTool.fillType;
            if (fillType instanceof SimpleFill) {
                var oldTiletype_1 = fillType.fillTile;
                if (oldTiletype_1.clockWiseRotationTileName != "") {
                    var newTileType_1 = TileType[oldTiletype_1.clockWiseRotationTileName];
                    if (newTileType_1) {
                        fillType.fillTile = newTileType_1;
                        var buttons = EditorButtonTile.AllTileButtons.filter(function (a) { return a.tileType == oldTiletype_1; });
                        buttons.forEach(function (button) {
                            button.tileType = newTileType_1;
                            button.children = button.children.filter(function (a) { return !(a instanceof ImageFromTile) || (a instanceof ImageFromTile && a.imageTile == tiles["uiButtonAdd"][0][0]); });
                            button.AddChild(new ImageFromTile(0, 0, 50, 50, newTileType_1.editorTile ? newTileType_1.editorTile : newTileType_1.imageTile));
                        });
                    }
                    else {
                        console.error("Missing tile rotation: " + oldTiletype_1.clockWiseRotationTileName);
                    }
                }
            }
        }
        if (this.currentTool instanceof SpritePlacer) {
            var spriteType_1 = this.currentTool.spriteType;
            var rotationSprite_1 = spriteType_1.clockwiseRotationSprite;
            if (rotationSprite_1) {
                var buttons = EditorButtonSprite.AllSpriteButtons.filter(function (a) { return a.spriteType == spriteType_1; });
                this.currentTool.spriteType = rotationSprite_1;
                buttons.forEach(function (button) {
                    if (rotationSprite_1)
                        button.spriteType = rotationSprite_1;
                    button.children = button.children.filter(function (a) { return !(a instanceof ImageFromTile) || (a instanceof ImageFromTile && a.imageTile == tiles["uiButtonAdd"][0][0]); });
                    if (rotationSprite_1) {
                        var image = (new rotationSprite_1(0, 0, currentMap.mainLayer, [])).GetThumbnail();
                        button.AddChild(new ImageFromTile(0, 0, 50, 50, image));
                    }
                });
            }
        }
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
            if (this.playerFrames.length > 1) {
                for (var _i = 0, _a = this.playerFrames; _i < _a.length; _i++) {
                    var playerFrame = _a[_i];
                    var sprite = { x: playerFrame.x, y: playerFrame.y };
                    currentMap.mainLayer.DrawFrame(GetGhostFrameData(playerFrame.fd), camera.scale, sprite);
                }
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
