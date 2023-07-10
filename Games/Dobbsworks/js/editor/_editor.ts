class EditorHandler {

    isEditorAllowed: boolean = false;
    isInEditMode: boolean = false;
    mouseOverTile: TileCoordinate | null = null;
    sprites: EditorSprite[] = [];
    frameNum: number = 0;
    transitionValue: number = 0;
    maxTransitionValue: number = 60;
    history = new EditorHistory();
    selectionTool = new EditorSelectTool();
    currentTool: EditorTool = this.selectionTool;
    currentSaveSlot: number = 1;

    hotbar!: EditorHotbar;
    playerButton!: EditorButtonSprite;
    hoverPlayerButton!: EditorButtonSprite;

    isMinimizedMode: boolean = false;
    isTempMinimized: boolean = false; // when dragging an item near the top or bottom of screen, hide toolbars
    editorParentElementsTop: Panel[] = [];
    editorParentElementsBottom: Panel[] = [];

    mainPanel!: Panel;
    eraserButton!: EditorButtonEraser;
    mainToolPanel!: EditorButtonDrawer;
    brushPanel!: EditorButtonDrawer;
    backgroundPanel!: EditorButtonDrawer;
    saveDrawer!: EditorSaveDrawer;
    enableEraseSprites: boolean = true;
    enableEraseTiles: boolean = true;
    enableEraseWires: boolean = true;
    enableEraseBackdrop: boolean = true;
    enableEraseWater: boolean = true;
    skyEditor!: SkyEditor;
    backgroundLayerEditors: BackgroundLayerEditor[] = [];
    exportString: string = "";
    toolMenus: EditorButtonDrawerHandle[] = [];
    mouseOverButton: EditorButton | null = null;
    mapSizeChangeAmount = 5;

    selectedFillBrush: FillBrushType = FreeformBrush;
    playerWaterModeToggle!: EditorButtonToggle;
    spriteWaterModeToggle!: EditorButtonToggle;
    horizontalWrapToggle!: EditorButtonToggle;

    playerFrames: { fd: FrameData, x: number, y: number }[] = [];

    grabbedCheckpointLocation: TileCoordinate | null = null;
    bankedCheckpointTime = 0;


    initialized = false;
    Initialize() {
        if (this.initialized) return;
        this.initialized = true;
        this.mainPanel = new Panel(165, camera.canvas.height - 80, 630, 70);
        this.hotbar = new EditorHotbar(this.mainPanel);
        let hotbarDefaults = [];

        this.eraserButton = new EditorButtonEraser();
        let eraserPanel = new EditorButtonDrawer(this.mainPanel.x + this.mainPanel.width + 10, this.mainPanel.y, 70, 70,
            this.eraserButton, [
            new EditorButtonToggle(tiles["editor"][3][0], "Toggle sprite eraser", this.enableEraseSprites, (state) => { this.enableEraseSprites = state }),
            new EditorButtonToggle(tiles["editor"][3][1], "Toggle tile eraser", this.enableEraseTiles, (state) => { this.enableEraseTiles = state }),
            new EditorButtonToggle(tiles["editor"][3][2], "Toggle wire eraser", this.enableEraseWires, (state) => { this.enableEraseWires = state }),
            new EditorButtonToggle(tiles["editor"][3][6], "Toggle water eraser", this.enableEraseWater, (state) => { this.enableEraseWater = state }),
        ]);


        let resetHandle = new EditorButtonDrawerHandle(tiles["editor"][5][4], "Reset level", []);
        let resetButton = new EditorButton(tiles["editor"][5][5], "Confirm reset");
        resetButton.onClickEvents.push(() => { LevelMap.BlankOutMap(); });
        let resetPanel = new EditorButtonDrawer(eraserPanel.x + eraserPanel.width + 10, eraserPanel.y, 70, 70, resetHandle, [resetButton]);


        let exitButton = new EditorButton(tiles["editor"][5][6], "Exit");
        let exitPanel = new EditorSingleServePanel(eraserPanel.x + eraserPanel.width + 10, 10, exitButton);
        exitButton.onClickEvents.push(() => {
            editorHandler.isEditorAllowed = false;
            editorHandler.SwitchToPlayMode();
            MenuHandler.GoBack();
            if (MenuHandler.CurrentMenu == null) {
                MenuHandler.CreateMenu(MainMenu);
            }
        });
        
        let helpButton = new EditorButton(tiles["editor"][6][1], "Help");
        let helpPanel = new EditorSingleServePanel(this.mainPanel.x + this.mainPanel.width + 10 - 70 - 70 - 10, 10, helpButton);
        helpButton.onClickEvents.push(() => {
            UIDialog.Confirm("This will open a tutorial video in a new tab. Proceed?", "OK", "Cancel", () => {
                window.open("https://youtu.be/RixtWX8cRCI", '_blank');
            });
        });


        /* TILE PANEL */
        let slopeFills: SlopeFill[] = [
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
            new SlopeFill("Mountain", TileType.MountainGround),
            new SlopeFill("Haunt", TileType.HauntGround),
        ];
        let tileRowBlocks: TileType[] = [
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
            TileType.MountainGround,
            TileType.HauntGround,
        ]
        let tilePanelButtons: EditorButton[] = [];
        let tooltips = ["Solid ground", "Solid ground", "Solid ground", "Semisolid", "Backdrop", "Ladder", "Deadly block", "Decor"];

        for (let block of tileRowBlocks) {
            let startIndex = Object.values(TileType.TileMap).indexOf(block);

            let tileTypeRow = <TileType[]>(Object.values(TileType.TileMap).slice(startIndex, startIndex + 8));
            let editorButtons = tileTypeRow.map((a, col) => {
                if (a.clockWiseRotationTileName) return new EditorButtonTile(a, tooltips[col]).AppendImage(tiles["uiButtonAdd"][0][0]);
                return new EditorButtonTile(a, tooltips[col]);
            });
            tilePanelButtons.push(...editorButtons);
            if (block == TileType.Dirt) {
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[0]);
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[3]);
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[4]);
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[5]);
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[6]);
            }
            let fill = slopeFills.splice(0, 1)[0];
            if (fill) tilePanelButtons.push(new EditorButtonSlopePen(fill));
        }
        let tilePanel = this.CreateFloatingButtonPanel(tilePanelButtons, 5, 9);


        /* ENEMY PANEL */
        let enemyTypes: SpriteType[] = [Piggle, Hoggle, Biggle, PogoPiggle, PorcoRosso, PorcoBlu, Snail, SapphireSnail, Wooly, WoolyBooly, Prickle, PrickleEgg, PrickleShell, PrickleRock, DrSnips, AFish, Lurchin, Clammy, Pufferfish,
            Snouter, PricklySnouter, BeeWithSunglasses, Bigby, Spurpider, ClimbingSpurpider, LittleJelly, ChillyJelly, Shrubbert, OrangeShrubbert, SnowtemPole, Snoworm, BouncingSnowWorm, Sparky, Orbbit, Keplurk, Yufo, Blaster, Wallop, WallopPlatform, Wallopeño, BigWallop, BigWallopPlatform, BaddleTrigger, /*, BigYufo */];
        let enemyButtons = enemyTypes.map(a => new EditorButtonSprite(a));

        enemyButtons.filter(a => a.spriteType == Piggle || a.spriteType == Snail).forEach(a => hotbarDefaults.push(a));
        let enemyPanel = this.CreateFloatingButtonPanel(enemyButtons, 5, 8);

        let gizmoTypes: (SpriteType)[] = [
            BouncePlatform, CloudPlatform, FloatingPlatform, RisingPlatform, ShakyPlatform, WeightedPlatform, MushroomPlatform, Splatform,
            MushroomSpring, Baseball, SoccerBall, BowlingBall, Battery, Door, Fan, Key, FlatKey, Umbrella, SnailShell, SpringBox, Propeller, Saw, SmallSaw, RedCannon, BlueCannon, PurpleCannon, Ring, Rocket, Yoyo, RedBalloon, BlueBalloon, YellowBalloon,
            SpinRing, FragileSpinRing, PortalRing,
        ];
        let gizmoButtons: EditorButton[] = gizmoTypes.map(a => new EditorButtonSprite(a));
        let keyIndex = gizmoButtons.findIndex(a => a instanceof EditorButtonSprite && a.spriteType == FlatKey);
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

        let gizmoPanel = this.CreateFloatingButtonPanel(gizmoButtons, 5, 8);

        let brushTypeHandle = new EditorButtonDrawerHandle(tiles["editor"][4][0], "Brush types", []);
        let brushButtons = [
            new EditorButtonFillBrush(CircleBrush, tiles["editor"][4][3], 0),
            new EditorButtonFillBrush(RectangleBrush, tiles["editor"][4][2], 1),
            new EditorButtonFillBrush(LineBrush, tiles["editor"][4][1], 2),
            new EditorButtonFillBrush(FreeformBrush, tiles["editor"][4][0], 3),
        ];
        this.brushPanel = new EditorButtonDrawer(this.mainPanel.x - 160, this.mainPanel.y, 70, 70, brushTypeHandle, brushButtons);
        this.brushPanel.children.forEach(a => {
            if (a instanceof EditorButtonFillBrush) {
                a.onClickEvents.push(() => {
                    let labelImage = <ImageFromTile>(brushTypeHandle.children.find(b => b instanceof ImageFromTile));
                    labelImage.imageTile = (<ImageFromTile>(a.children[0])).imageTile;
                })
            }
        });

        let wirePanel = this.CreateFloatingButtonPanel([
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
            new EditorButtonSprite(ControlledWinch),
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
            new EditorButtonTile(TileType.TrackLeftCapEntry, "Track Pipe").AppendImage(tiles["uiButtonAdd"][0][0]),
            new EditorButtonTile(TileType.TrackBranchDownLeftOff, "Track Branch").AppendImage(tiles["uiButtonAdd"][0][0]),
            new EditorButtonTile(TileType.TrackBridgeHorizontalOff, "Track/Wire Bridge").AppendImage(tiles["uiButtonAdd"][0][0]),
            new EditorButtonSprite(Lever),
            new EditorButtonSprite(Lightbulb),
            new EditorButtonTile(TileType.UnpoweredWindRight, "Wind Generator").AppendImage(tiles["uiButtonAdd"][0][0]),
        ], 5, 8);


        let backgroundHandle = new EditorButtonDrawerHandle(tiles["editor"][0][3], "Background customization", []);
        this.skyEditor = new SkyEditor(this.mainPanel.x - 70 - 10, 110, 700, 300);
        for (let i of [0, 1, 2, 3]) this.backgroundLayerEditors.push(new BackgroundLayerEditor(i));
        let backgroundSubMenus = [
            new EditorButtonDrawerHandle(tiles["editor"][1][3], "Sky colors", [this.skyEditor]),
            new EditorButtonDrawerHandle(tiles["editor"][0][7], "Farthest background layer", [this.backgroundLayerEditors[0]]),
            new EditorButtonDrawerHandle(tiles["editor"][0][6], "Far background layer", [this.backgroundLayerEditors[1]]),
            new EditorButtonDrawerHandle(tiles["editor"][0][5], "Mid background layer", [this.backgroundLayerEditors[2]]),
            new EditorButtonDrawerHandle(tiles["editor"][0][4], "Closest background layer", [this.backgroundLayerEditors[3]]),
        ]
        backgroundSubMenus.forEach(a => a.radioKey = "bgMenu")
        this.backgroundPanel = new EditorButtonDrawer(this.brushPanel.x, 10, 70, 70, backgroundHandle, backgroundSubMenus);
        this.backgroundPanel.expandDirection = "down";
        this.backgroundPanel.children.reverse();

        let backgroundButtons = [
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
        let backgroundsPanel = this.CreateFloatingButtonPanel(backgroundButtons, 3, 4);
        backgroundsPanel.targetX -= 80;
        backgroundsPanel.targetY = 90;
        let backgroundLoadHandle = new EditorButtonDrawerHandle(tiles["editor"][0][3], "Load background preset", [backgroundsPanel]);
        backgroundLoadHandle.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][0][8]));
        let backgroundLoadPanel = new Panel(this.brushPanel.x + 70 + 10, 10, 70, 70);
        backgroundLoadPanel.AddChild(backgroundLoadHandle);


        this.saveDrawer = new EditorSaveDrawer(this.mainPanel.x + this.mainPanel.width + 10 - 70, 10);
        let optionsButton = OptionsMenu.CreateOptionsButton();
        optionsButton.targetX -= 70;
        let mapSizeHandle = new EditorButtonDrawerHandle(tiles["editor"][4][4], "Edit map size", [new MapSizeEditor()]);
        let mapSizePanel = new Panel(backgroundLoadPanel.x + 80, backgroundLoadPanel.y, 70, 70);
        mapSizePanel.AddChild(mapSizeHandle);

        this.playerButton = new EditorButtonSprite(Player);
        this.hoverPlayerButton = new EditorButtonSprite(HoverPlayer);
        this.horizontalWrapToggle = new EditorButtonToggle(tiles["editor"][0][9], "Toggle horizontal screen wrap", currentMap.hasHorizontalWrap, (state) => { currentMap.hasHorizontalWrap = state });
        let levelFlowPanel = this.CreateFloatingButtonPanel([
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
            //new EditorButtonSprite(CopperGear),
            //new EditorButtonSprite(IronGear),
            this.horizontalWrapToggle,

        ], 4, 6);
        let levelFlowHandle = new EditorButtonDrawerHandle(tiles["editor"][5][3], "Level flow element", [levelFlowPanel]);
        let levelFlowHandlePanel = new Panel(mapSizePanel.x + 160, mapSizePanel.y, 70, 70);
        levelFlowPanel.targetX = levelFlowHandlePanel.x;
        levelFlowHandlePanel.AddChild(levelFlowHandle);

        let musicPanel = this.CreateMusicEditPanel();
        let musicHandle = new EditorButtonDrawerHandle(tiles["musicnotes"][1][0], "Level music", [musicPanel]);
        let musicHandlePanel = new Panel(mapSizePanel.x + 80, mapSizePanel.y, 70, 70);
        musicPanel.targetX = musicHandlePanel.targetX;
        musicPanel.targetY = musicHandlePanel.targetY + 80;
        musicHandlePanel.AddChild(musicHandle);

        let selectionMenuHandle = new EditorButtonDrawerHandle(tiles["editor"][0][1], "Level elements", []);
        let spriteSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][0], "Enemies", [enemyPanel]);
        let tileSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][1], "Tiles", [tilePanel]);
        let wireSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][2], "Wires and tracks", [wirePanel]);
        let gizmoSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][3], "Gadgets", [gizmoPanel]);
        let waterSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][6], "Fluids", [this.CreateWaterEditPanel()]);
        this.toolMenus = [tileSelectionHandle, spriteSelectionHandle, gizmoSelectionHandle, wireSelectionHandle, waterSelectionHandle,];
        this.toolMenus.forEach(a => a.radioKey = "toolMenu")
        this.mainToolPanel = new EditorButtonDrawer(this.mainPanel.x - 70 - 10, this.mainPanel.y, 70, 70, selectionMenuHandle, this.toolMenus);


        // TODO - prevent other buttons from being used while options is open
        // let optionsPanel = OptionsMenu.CreateOptionsButton();
        // optionsPanel.targetX -= 80;

        this.editorParentElementsTop.push(this.backgroundPanel, backgroundLoadPanel, levelFlowHandlePanel, this.saveDrawer, optionsButton, mapSizePanel, musicHandlePanel, exitPanel, helpPanel);
        this.editorParentElementsBottom.push(this.mainPanel, eraserPanel, this.mainToolPanel, this.brushPanel, resetPanel);
        uiHandler.elements.push(...this.editorParentElementsTop, ...this.editorParentElementsBottom);
        this.editorParentElementsTop.forEach(a => a.backColor = "#1138");
        this.editorParentElementsBottom.forEach(a => a.backColor = "#1138");

        hotbarDefaults.forEach(a => this.hotbar.OnToolSelect(<any>a));
        let brushPref = StorageService.GetPreference("brush", "3");
        brushButtons[+brushPref].Click();
    }

    CreateFloatingButtonPanel(buttons: EditorButton[], maxDisplayedRows: number, tilesPerRow: number): Panel {
        let panel = new Panel(this.mainPanel.x, 90, 70 * tilesPerRow, maxDisplayedRows * 70);
        panel.layout = "vertical";
        panel.margin = 0;
        panel.isHidden = true;
        while (buttons.length > 0) {
            let rowButtons = buttons.splice(0, tilesPerRow);
            let rowPanel = new Panel(0, 0, panel.width, 70);
            rowButtons.forEach(a => rowPanel.AddChild(a));
            let remainingSpaces = tilesPerRow - rowButtons.length;
            for (let i = 0; i < remainingSpaces; i++) {
                rowPanel.AddChild(new Spacer(0, 0, 60, 60))
            }
            if (panel.children.length < maxDisplayedRows) {
                panel.AddChild(rowPanel);
            } else {
                panel.scrollableChildrenDown.push(rowPanel);
            }
        }
        panel.fixedPosition = true;
        panel.backColor = "#1138";
        return panel;
    }

    CreateMusicEditPanel(): Panel {
        let songs = audioHandler.levelSongList;
        let rows = Math.ceil(songs.length / 6);
        let ret = this.CreateFloatingButtonPanel(songs.map((a, i) => new EditorButtonSong(i)), rows, 6);
        ret.y = this.mainPanel.y + 80;
        ret.targetY = ret.y;
        return ret;
    }

    CreateWaterEditPanel(): Panel {
        let waterBrush = new EditorButtonTile(TileType.Water, "Water");
        waterBrush.children = [];
        waterBrush.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["water"][4][0]));

        let purpleWaterBrush = new EditorButtonTile(TileType.PurpleWater, "Purple water");
        purpleWaterBrush.children = [];
        purpleWaterBrush.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["water"][4][3]));

        let lavaBrush = new EditorButtonTile(TileType.Lava, "Lava");
        lavaBrush.children = [];
        lavaBrush.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["water"][4][5]));

        let waterfallBrush = new EditorButtonTile(TileType.Waterfall, "Waterfall");
        let quickSandBrush = new EditorButtonTile(TileType.Quicksand, "Quicksand");

        this.spriteWaterModeToggle = new EditorButtonToggle(tiles["editor"][3][7], "Toggle sprite swim mode", currentMap.spriteWaterMode, (state) => { currentMap.spriteWaterMode = state });
        this.playerWaterModeToggle = new EditorButtonToggle(tiles["editor"][3][8], "Toggle player swim mode", currentMap.playerWaterMode, (state) => { currentMap.playerWaterMode = state });

        let bubbleButton = new EditorButtonSprite(AirBubble);
        let poisonGasBrush = new EditorButtonTile(TileType.PoisonGas, "Poison gas");
        let slimeBrush = new EditorButtonTile(TileType.Slime, "Slime");
        let honeyBrush = new EditorButtonTile(TileType.Honey, "Honey");
        let honeyLeftBrush = new EditorButtonTile(TileType.HoneyLeft, "Honey wall (left)");
        let honeyRightBrush = new EditorButtonTile(TileType.HoneyRight, "Honey wall (right)");

        let ret = this.CreateFloatingButtonPanel([
            waterBrush, waterfallBrush, quickSandBrush, purpleWaterBrush, poisonGasBrush, bubbleButton,
            lavaBrush, slimeBrush, honeyBrush, honeyLeftBrush, honeyRightBrush,
            new EditorButtonTile(TileType.InitialWaterLevel, "Initial water level"),
            new EditorButtonTile(TileType.InitialPurpleWaterLevel, "Initial purple water level"),
            new EditorButtonTile(TileType.InitialLavaLevel, "Initial lava level"),
            new EditorButtonTile(TileType.Drain, "Drain"),
            new EditorButtonTile(TileType.WaterTapOff, "Water tap"),
            new EditorButtonTile(TileType.PurpleWaterTapOff, "Purple water tap"),
            new EditorButtonTile(TileType.LavaTapOff, "Lava tap"),
            this.playerWaterModeToggle, this.spriteWaterModeToggle], 4, 5);
        //ret.y = this.mainPanel.y - ret.height -;
        ret.targetY = ret.y;
        return ret;
    }

    EditMap(importString: string): void {
        this.isEditorAllowed = true;
        this.exportString = importString;
        this.SwitchToEditMode();
    }

    SwitchToEditMode(isResettingLevel = false): void {
        this.transitionValue = 0;
        this.isInEditMode = true;
        camera.target = null;
        for (let sprite of this.sprites) {
            sprite.ResetSprite();
        }

        if (currentMap) {
            currentMap.mainLayer.sprites = [];
        }

        if (this.editorParentElementsTop[0].targetY < 0) {
            this.editorParentElementsTop.forEach(a => a.targetY += 90);
            this.editorParentElementsBottom.forEach(a => a.targetY -= 90);
        }
        if (this.exportString) {
            currentMap = LevelMap.FromImportString(this.exportString, true, isResettingLevel);
        }
        camera.Reset();
    }

    SwitchToPlayMode(): void {
        this.playerFrames = [];
        if (this.isMinimizedMode) this.ToggleMinimizeMode();
        this.CloseDrawers();
        camera.targetScale = camera.defaultScale;
        camera.scale = camera.targetScale;
        this.transitionValue = this.maxTransitionValue;
        this.isInEditMode = false;
        if (currentMap) {
            for (let tileCol of currentMap.mainLayer.tiles) {
                for (let tile of tileCol) {
                    if (tile.tileType.autoChange) {
                        currentMap.autoChangeTiles.push({ tile: tile, standDuration: 0 });
                    }
                }
            }

            for (let sprite of this.sprites) {
                sprite.ResetSprite();
            }
            currentMap.mainLayer.sprites = [];
            for (let sprite of this.sprites) {
                sprite.ResetStack();
                currentMap.mainLayer.sprites.push(sprite.spriteInstance);
            }

            if (!currentMap.mainLayer.sprites.find(a => a instanceof Player)) {
                currentMap.mainLayer.sprites.push(new Player(48, 0, currentMap.mainLayer, []));
            }

            camera.target = currentMap.mainLayer.sprites.find(a => a instanceof Player) || null;
            if (camera.target) {
                camera.x = camera.target.xMid;
                camera.y = camera.target.yMid;
                camera.targetX = camera.x;
                camera.targetY = camera.y;
            }
        }
        if (this.editorParentElementsTop[0].targetY > 0) {
            this.editorParentElementsTop.forEach(a => a.targetY -= 90);
            this.editorParentElementsBottom.forEach(a => a.targetY += 90);
        }
        this.exportString = currentMap.GetExportString();

        if (this.grabbedCheckpointLocation != null) {
            let playerSprite = currentMap.mainLayer.sprites.find(a => a instanceof Player);
            let tileX = this.grabbedCheckpointLocation.tileX;
            let tileY = this.grabbedCheckpointLocation.tileY;
            if (playerSprite) {
                playerSprite.x = tileX * 12 + 6 - playerSprite.width / 2;
                playerSprite.y = tileY * 12 + 12 - playerSprite.height;
            }
            let checkpoint = <Checkpoint>currentMap.mainLayer.sprites.find(a => a instanceof Checkpoint && a.x == tileX * 12 && a.y == tileY * 12);
            if (checkpoint) {
                checkpoint.isCollected = true;
            }
        } else {
            this.bankedCheckpointTime = 0;
        }
        camera.Reset();
    }

    ToggleMinimizeMode(): void {
        this.isTempMinimized = false;
        this.isMinimizedMode = !this.isMinimizedMode;
        if (this.isMinimizedMode) {
            this.CloseDrawers();
            if (this.editorParentElementsTop[0].targetY > 0) {
                this.editorParentElementsTop.forEach(a => a.targetY -= 90);
                this.editorParentElementsBottom.forEach(a => a.targetY += 90);
            }
        } else {
            if (this.editorParentElementsTop[0].targetY < 0) {
                this.editorParentElementsTop.forEach(a => a.targetY += 90);
                this.editorParentElementsBottom.forEach(a => a.targetY -= 90);
            }

        }
    }

    cameraMoveTimer = 0;

    Update(): void {
        //if (!this.isEditorAllowed) return;
        BenchmarkService.Log("EditorUpdate");
        this.Initialize();
        this.mouseOverButton = null;
        if (this.isInEditMode) {
            if (this.transitionValue < this.maxTransitionValue) this.transitionValue++;
        } else {
            if (this.transitionValue > 0) this.transitionValue--;

            // ghost player
            if (currentMap.frameNum % 10 == 0) {
                let players = currentMap.mainLayer.sprites.filter(a => a instanceof Player);
                for (let player of players) {
                    let newFrame = { fd: <FrameData>player.GetFrameData(currentMap.frameNum), x: player.x, y: player.y };
                    let matchesLatest = false;
                    let latestFrame = this.playerFrames[this.playerFrames.length - 1];
                    if (latestFrame) {
                        if (Math.abs(latestFrame.x - newFrame.x) < 1 && Math.abs(latestFrame.y - newFrame.y) < 1) matchesLatest = true;
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
        if (!this.isInEditMode) return;


        this.frameNum++;
        this.cameraMoveTimer++;
        let cameraSpeed = 6 / camera.scale;
        if (this.cameraMoveTimer > 60) cameraSpeed = 12 / camera.scale;
        if (this.cameraMoveTimer > 120) cameraSpeed = 24 / camera.scale;

        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) camera.targetX -= cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) camera.targetX += cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) camera.targetY -= cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) camera.targetY += cameraSpeed;

        if (!KeyboardHandler.IsKeyPressed(KeyAction.Left, false) &&
            !KeyboardHandler.IsKeyPressed(KeyAction.Right, false) &&
            !KeyboardHandler.IsKeyPressed(KeyAction.Up, false) &&
            !KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.cameraMoveTimer = 0;
        }

        let isInEditorWithoutOverlayMenu = editorHandler.isInEditMode && (MenuHandler.CurrentMenu == null || MenuHandler.CurrentMenu instanceof BlankMenu);
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorMinimize, true) && isInEditorWithoutOverlayMenu) this.ToggleMinimizeMode();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorEraseHotkey, true) && isInEditorWithoutOverlayMenu ) (<EditorButton>this.eraserButton).Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorPlayerHotkey, true)) {
            let isUsingHoverPlayer = editorHandler.sprites.some(a => a.spriteType == HoverPlayer);
            if (isUsingHoverPlayer) {
                (<EditorButton>this.hoverPlayerButton).Click();
            } else {
                (<EditorButton>this.playerButton).Click();
            }
        }

        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorUndo, true)) this.history.Undo();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorRedo, true)) this.history.Redo();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorRotateHotkey, true)) this.RotateCurrentTool();

        if (KeyboardHandler.IsKeyPressed(KeyAction.Cancel, true)) {
            this.currentTool = this.selectionTool;
            this.selectionTool.OnCancel();
            this.selectionTool.Reset();
            this.CloseDrawers();
        }

        for (let hotkey = 1; hotkey <= 9; hotkey++) {
            let keyAction = KeyAction.Hotkey(hotkey);
            if (KeyboardHandler.IsKeyReleased(keyAction)) this.hotbar.KeyboardSelectNum(hotkey);
        }

        if (uiHandler.mousedOverElements.length == 0) {
            if (mouseHandler.mouseScroll > 0) {
                camera.targetScale /= 1.1892;
            }
            if (mouseHandler.mouseScroll < 0) {
                camera.targetScale *= 1.1892;
            }
        }

        // really hacky fix to deal with occasional duplicate player objects
        for (let sprite of this.sprites) {
            if (sprite.spriteInstance.maxAllowed > -1) {
                let totalOfThisType = this.sprites.filter(a => a.spriteType == sprite.spriteType).length;
                if (totalOfThisType > sprite.spriteInstance.maxAllowed) {
                    // too many of this sprite, remove this one
                    this.sprites = this.sprites.filter(a => a !== sprite);
                    continue;
                }
            }
        }

        for (let sprite of this.sprites) {
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
                    } else {
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
    }

    CloseDrawers(): void {
        [...this.editorParentElementsTop, ...this.editorParentElementsBottom].forEach(a => {
            if (a instanceof EditorButtonDrawer) {
                a.Collapse();
                a.containerButton.isSelected = false;
            }
            a.children.forEach(a => {
                if (a instanceof EditorButtonDrawerHandle) a.isSelected = false;
            })
        })
    }


    RotateCurrentTool(): void {
        if (this.currentTool instanceof FillBrush) {
            let fillType = this.currentTool.fillType;
            if (fillType instanceof SimpleFill) {
                let oldTiletype = fillType.fillTile;
                if (oldTiletype.clockWiseRotationTileName != "") {
                    let newTileType: TileType = (<any>TileType)[oldTiletype.clockWiseRotationTileName];
                    if (newTileType) {
                        fillType.fillTile = newTileType;
                        let buttons = EditorButtonTile.AllTileButtons.filter(a => a.tileType == oldTiletype);
                        buttons.forEach(button => {
                            button.tileType = newTileType;
                            button.children = button.children.filter(a => !(a instanceof ImageFromTile) || (a instanceof ImageFromTile && a.imageTile == tiles["uiButtonAdd"][0][0]));
                            button.AddChild(new ImageFromTile(0, 0, 50, 50, newTileType.editorTile ? newTileType.editorTile : newTileType.imageTile));
                        });
                    } else {
                        console.error("Missing tile rotation: " + oldTiletype.clockWiseRotationTileName)
                    }
                }
            }
        }
        if (this.currentTool instanceof SpritePlacer) {
            let spriteType = this.currentTool.spriteType;
            let rotationSprite = spriteType.clockwiseRotationSprite;
            if (rotationSprite) {
                let buttons = EditorButtonSprite.AllSpriteButtons.filter(a => a.spriteType == spriteType);
                this.currentTool.spriteType = rotationSprite;
                buttons.forEach(button => {
                    if (rotationSprite) button.spriteType = rotationSprite;
                    button.children = button.children.filter(a => !(a instanceof ImageFromTile) || (a instanceof ImageFromTile && a.imageTile == tiles["uiButtonAdd"][0][0]));
                    if (rotationSprite) {
                        let image = (new rotationSprite(0, 0, currentMap.mainLayer, [])).GetThumbnail()
                        button.AddChild(new ImageFromTile(0, 0, 50, 50, image));
                    }
                });
            }
        }
    }


    DrawGridlines(camera: Camera, map: LevelMap): void {
        let transitionRatio = this.transitionValue / this.maxTransitionValue;

        camera.ctx.strokeStyle = "#0004";

        let xPixelLeft = camera.x - (camera.canvas.width / 2) / camera.scale;
        let yPixelTop = camera.y - (camera.canvas.height / 2) / camera.scale;

        let xTileLeft = Math.floor(xPixelLeft / map.mainLayer.tileWidth);
        let yTileTop = Math.floor(yPixelTop / map.mainLayer.tileHeight);

        let leftXPixelGrid = (map.mainLayer.tileWidth - (xPixelLeft % map.mainLayer.tileWidth)) * camera.scale;
        let topYPixelGrid = (map.mainLayer.tileHeight - (yPixelTop % map.mainLayer.tileHeight)) * camera.scale;

        let horizGridThickCounter = xTileLeft + 1;
        let vertGridThickCounter = yTileTop + 1;

        for (let xPixel = Math.floor(leftXPixelGrid); xPixel < camera.canvas.width; xPixel += map.mainLayer.tileWidth * camera.scale) {
            camera.ctx.lineWidth = horizGridThickCounter % 5 == 0 ? 2 : 1;
            horizGridThickCounter++;
            camera.ctx.beginPath();
            if (horizGridThickCounter % 2) {
                camera.ctx.moveTo(xPixel, camera.canvas.height * (1 - transitionRatio));
                camera.ctx.lineTo(xPixel, camera.canvas.height);
            } else {
                camera.ctx.moveTo(xPixel, 0);
                camera.ctx.lineTo(xPixel, camera.canvas.height * (transitionRatio));
            }
            camera.ctx.stroke();
        }
        for (let yPixel = Math.floor(topYPixelGrid); yPixel < camera.canvas.height; yPixel += currentMap.mainLayer.tileHeight * camera.scale) {
            camera.ctx.lineWidth = vertGridThickCounter % 5 == 0 ? 2 : 1;
            vertGridThickCounter++;
            camera.ctx.beginPath();
            if (vertGridThickCounter % 2) {
                camera.ctx.moveTo(camera.canvas.width * (1 - transitionRatio), yPixel);
                camera.ctx.lineTo(camera.canvas.width, yPixel);
            } else {
                camera.ctx.moveTo(0, yPixel);
                camera.ctx.lineTo(camera.canvas.width * transitionRatio, yPixel);
            }
            camera.ctx.stroke();
        }
    }

    DrawSprites(camera: Camera): void {
        for (let sprite of this.sprites) {
            sprite.Draw(this.frameNum);
        }
    }

    Draw(camera: Camera): void {
        if (this.transitionValue > 0 && currentMap) {

            if (this.playerFrames.length > 1) {
                for (let playerFrame of this.playerFrames) {
                    let sprite = <Sprite>{ x: playerFrame.x, y: playerFrame.y };
                    currentMap.mainLayer.DrawFrame(GetGhostFrameData(playerFrame.fd), camera.scale, sprite);
                }
            }

            this.DrawSprites(camera);
            this.DrawGridlines(camera, currentMap);
            let tileWidth = currentMap.mainLayer.tileWidth;
            let tileHeight = currentMap.mainLayer.tileHeight;

            if (this.mouseOverTile && uiHandler.mousedOverElements.length == 0) {
                camera.ctx.fillStyle = "#FFF3";
                camera.ctx.strokeStyle = "#0003";
                camera.ctx.lineWidth = 4;

                let x = this.mouseOverTile.tileX * tileWidth;
                let y = this.mouseOverTile.tileY * tileHeight;
                camera.ctx.fillRect(
                    (x - camera.x) * camera.scale + camera.canvas.width / 2,
                    (y - camera.y) * camera.scale + camera.canvas.height / 2,
                    tileWidth * camera.scale, tileHeight * camera.scale);
                camera.ctx.strokeRect(
                    (x - camera.x) * camera.scale + camera.canvas.width / 2,
                    (y - camera.y) * camera.scale + camera.canvas.height / 2,
                    tileWidth * camera.scale, tileHeight * camera.scale);
            }

            if (this.currentTool) {
                camera.ctx.fillStyle = "#22F6";
                camera.ctx.strokeStyle = "#FFF";
                camera.ctx.lineWidth = 4;

                for (let tileCoord of this.currentTool.selectedTiles) {
                    camera.ctx.strokeRect(
                        (tileCoord.tileX * tileWidth - camera.x) * camera.scale + camera.canvas.width / 2,
                        (tileCoord.tileY * tileHeight - camera.y) * camera.scale + camera.canvas.height / 2,
                        tileWidth * camera.scale, tileHeight * camera.scale);
                }
                for (let tileCoord of this.currentTool.selectedTiles) {
                    camera.ctx.fillRect(
                        (tileCoord.tileX * tileWidth - camera.x) * camera.scale + camera.canvas.width / 2,
                        (tileCoord.tileY * tileHeight - camera.y) * camera.scale + camera.canvas.height / 2,
                        tileWidth * camera.scale, tileHeight * camera.scale);
                }

                camera.ctx.fillStyle = "#F226";
                for (let tileCoord of this.currentTool.invalidTiles) {
                    camera.ctx.strokeRect(
                        (tileCoord.tileX * tileWidth - camera.x) * camera.scale + camera.canvas.width / 2,
                        (tileCoord.tileY * tileHeight - camera.y) * camera.scale + camera.canvas.height / 2,
                        tileWidth * camera.scale, tileHeight * camera.scale);
                }
                for (let tileCoord of this.currentTool.invalidTiles) {
                    camera.ctx.fillRect(
                        (tileCoord.tileX * tileWidth - camera.x) * camera.scale + camera.canvas.width / 2,
                        (tileCoord.tileY * tileHeight - camera.y) * camera.scale + camera.canvas.height / 2,
                        tileWidth * camera.scale, tileHeight * camera.scale);
                }
            }

            let mover = this.selectionTool.selectionMoverTool;
            if (mover) {
                let frameData = mover.frameData;
                let scale = camera.scale;
                frameData.imageTile.Draw(camera.ctx,
                    ((mover.xOffset + mover.upperLeftSelectionStart.tileX) * tileWidth - camera.x - frameData.xOffset) * scale + camera.canvas.width / 2,
                    ((mover.yOffset + mover.upperLeftSelectionStart.tileY) * tileHeight - camera.y - frameData.yOffset) * scale + camera.canvas.height / 2,
                    scale, frameData.xFlip, frameData.yFlip);
                for (let sprite of mover.sprites) {
                    sprite.Draw(this.frameNum);
                }
            }
        }
    }

}