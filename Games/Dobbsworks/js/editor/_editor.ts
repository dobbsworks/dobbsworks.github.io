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

    isMinimizedMode: boolean = false;
    isTempMinimized: boolean = false; // when dragging an item near the top or bottom of screen, hide toolbars
    editorParentElementsTop: Panel[] = [];
    editorParentElementsBottom: Panel[] = [];

    mainPanel!: Panel;
    eraserPanel!: Panel;
    mainToolPanel!: EditorButtonDrawer;
    brushPanel!: EditorButtonDrawer;
    backgroundPanel!: EditorButtonDrawer;
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

        let eraserButton = new EditorButtonEraser();
        this.eraserPanel = new EditorButtonDrawer(this.mainPanel.x + this.mainPanel.width + 10, this.mainPanel.y, 70, 70,
            eraserButton, [
            new EditorButtonToggle(tiles["editor"][3][6], "Toggle water eraser", this.enableEraseWater, (state) => { this.enableEraseWater = state }),
            new EditorButtonToggle(tiles["editor"][3][2], "Toggle wire eraser", this.enableEraseWires, (state) => { this.enableEraseWires = state }),
            new EditorButtonToggle(tiles["editor"][3][1], "Toggle tile eraser", this.enableEraseTiles, (state) => { this.enableEraseTiles = state }),
            new EditorButtonToggle(tiles["editor"][3][0], "Toggle sprite eraser", this.enableEraseSprites, (state) => { this.enableEraseSprites = state }),
        ]);

        
        let resetHandle = new EditorButtonDrawerHandle(tiles["editor"][5][4], "Reset level", []);
        let resetButton = new EditorButton(tiles["editor"][5][5], "Confirm reset");
        resetButton.onClickEvents.push(() => { LevelMap.BlankOutMap(); });
        let resetPanel = new EditorButtonDrawer(this.eraserPanel.x + this.eraserPanel.width + 10, this.eraserPanel.y, 70, 70, resetHandle, [resetButton]);


        let exitButton = new EditorButton(tiles["editor"][5][6], "Exit");
        let exitPanel = new EditorSingleServePanel(this.eraserPanel.x + this.eraserPanel.width + 10, 10, exitButton);
        exitButton.onClickEvents.push(() => {
            editorHandler.isEditorAllowed = false;
            editorHandler.SwitchToPlayMode();
            MenuHandler.GoBack();
            if (MenuHandler.CurrentMenu == null) {
                MenuHandler.CreateMenu(MainMenu);
            }
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
        ]
        let tilePanelButtons: EditorButton[] = [];
        let tooltips = ["Solid ground", "Solid ground", "Solid ground", "Semisolid", "Backdrop", "Ladder", "Deadly block", "Decor"];
        for (let i = 0; i < 7; i++) {
            let tileTypeRow = <TileType[]>(Object.values(TileType.TileMap).slice(i * 28 + 1, i * 28 + 9));
            tilePanelButtons.push(...tileTypeRow.map((a, col) => new EditorButtonTile(a, tooltips[col])));
            if (i == 0) {
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[0]);
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[3]);
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[4]);
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[5]);
                hotbarDefaults.push(<EditorButtonTile>tilePanelButtons[6]);
            }
            let fill = slopeFills.splice(0, 1)[0];
            if (fill) tilePanelButtons.push(new EditorButtonSlopePen(fill));
        }
        tilePanelButtons.push(...[
            TileType.MetalGround, TileType.MetalBrick, TileType.MetalBlock, TileType.MetalTop, 
            TileType.MetalBack, TileType.ChainLadder, TileType.MetalSpikes, TileType.DecorChain].map((a, col) => new EditorButtonTile(a, tooltips[col])));
        tilePanelButtons.push(new EditorButtonSlopePen(new SlopeFill("Metal", TileType.MetalBrick)));
        
        tilePanelButtons.push(...[
            TileType.CaveGround, TileType.CaveBrick, TileType.CaveBlock, TileType.CaveTop, 
            TileType.CaveBack, TileType.CaveLadder, TileType.CaveSpikes, TileType.DecorCave].map((a, col) => new EditorButtonTile(a, tooltips[col])));
        tilePanelButtons.push(new EditorButtonSlopePen(new SlopeFill("Cave", TileType.CaveGround)));

        let tilePanel = this.CreateFloatingButtonPanel(tilePanelButtons, 5, 9);


        /* ENEMY PANEL */
        let enemyTypes: SpriteType[] = [Piggle, Hoggle,  Biggle, PorcoRosso, PorcoBlu, Snail, Prickle, PrickleEgg, PrickleShell, PrickleRock, DrSnips, AFish, 
            Snouter, PricklySnouter, BeeWithSunglasses, Spurpider, Shrubbert, SnowtemPole, Snoworm, BouncingSnowWorm, Sparky, Yufo];
        let enemyButtons = enemyTypes.map(a => new EditorButtonSprite(a));
        enemyButtons.filter(a => a.spriteType == Piggle || a.spriteType == Snail).forEach(a => hotbarDefaults.push(a));
        let enemyPanel = this.CreateFloatingButtonPanel(enemyButtons, 4, 6);

        let gizmoTypes: (SpriteType)[] = [
            BouncePlatform, CloudPlatform, FloatingPlatform, RisingPlatform, ShakyPlatform, WeightedPlatform, MushroomPlatform,
            Checkpoint, Baseball, Battery, Door, Fan, Key, Umbrella, SnailShell, Propeller, RedCannon, BlueCannon, Ring, Rocket, RedBalloon, BlueBalloon, YellowBalloon,
        ];
        let gizmoButtons: EditorButton[] = gizmoTypes.map(a => new EditorButtonSprite(a));
        let keyIndex = gizmoButtons.findIndex(a => a instanceof EditorButtonSprite && a.spriteType == Key);
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

        let gizmoPanel = this.CreateFloatingButtonPanel(gizmoButtons, 5, 6);

        let brushTypeHandle = new EditorButtonDrawerHandle(tiles["editor"][4][0], "Brush types", []);
        this.brushPanel = new EditorButtonDrawer(this.mainPanel.x - 160, this.mainPanel.y, 70, 70, brushTypeHandle, [
            new EditorButtonFillBrush(FreeformBrush, tiles["editor"][4][0]),
            new EditorButtonFillBrush(LineBrush, tiles["editor"][4][1]),
            new EditorButtonFillBrush(RectangleBrush, tiles["editor"][4][2]),
            new EditorButtonFillBrush(CircleBrush, tiles["editor"][4][3])
        ]);
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
        let backgroundsPanel = this.CreateFloatingButtonPanel(backgroundButtons, 3, 4);
        backgroundsPanel.targetX -= 80;
        backgroundsPanel.targetY = 90;
        let backgroundLoadHandle = new EditorButtonDrawerHandle(tiles["editor"][0][3], "Load background preset", [backgroundsPanel]);
        backgroundLoadHandle.AddChild(new ImageFromTile(0, 0, 50, 50, tiles["editor"][0][8]));
        //let backgroundLoadPanel = new EditorButtonDrawer(this.brushPanel.x + 70 + 10, 10, 70, 70, backgroundLoadHandle, );
        let backgroundLoadPanel = new Panel(this.brushPanel.x + 70 + 10, 10, 70, 70);
        backgroundLoadPanel.AddChild(backgroundLoadHandle);


        let saveButton = new EditorSaveDrawer(this.mainPanel.x + this.mainPanel.width + 10, 10);
        let mapSizeHandle = new EditorButtonDrawerHandle(tiles["editor"][4][4], "Edit map size", [new MapSizeEditor()]);
        let mapSizePanel = new Panel(backgroundLoadPanel.x + 80, backgroundLoadPanel.y, 70, 70);
        mapSizePanel.AddChild(mapSizeHandle);

        this.playerButton = new EditorButtonSprite(Player)
        let levelFlowPanel = this.CreateFloatingButtonPanel([
            this.playerButton,
            new EditorButtonSprite(GoldGear),
            new EditorButtonSprite(Coin),
            new EditorButtonSprite(Dobbloon),
            new EditorButtonSprite(ExtraHitHeart),

            new EditorButtonSprite(CameraLockHorizontal),
            new EditorButtonSprite(CameraScrollRight),
            new EditorButtonSprite(CameraScrollUp),
            new EditorButtonSprite(CameraScrollLeft),
            new EditorButtonSprite(CameraScrollDown),
            new EditorButtonSprite(CameraZoomIn),
            new EditorButtonSprite(CameraZoomOut),
            //new EditorButtonSprite(CopperGear),
            //new EditorButtonSprite(IronGear),
        ], 3, 5);
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
        let spriteSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][0], "Sprites", [enemyPanel]);
        let tileSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][1], "Tiles", [tilePanel]);
        let wireSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][2], "Wires and tracks", [wirePanel]);
        let gizmoSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][3], "Gadgets", [gizmoPanel]);
        let waterSelectionHandle = new EditorButtonDrawerHandle(tiles["editor"][3][6], "Fluids", [this.CreateWaterEditPanel()]);
        this.toolMenus = [waterSelectionHandle, wireSelectionHandle, gizmoSelectionHandle, spriteSelectionHandle, tileSelectionHandle];
        this.toolMenus.forEach(a => a.radioKey = "toolMenu")
        this.mainToolPanel = new EditorButtonDrawer(this.mainPanel.x - 70 - 10, this.mainPanel.y, 70, 70, selectionMenuHandle, this.toolMenus);


        // TODO - prevent other buttons from being used while options is open
        // let optionsPanel = OptionsMenu.CreateOptionsButton();
        // optionsPanel.targetX -= 80;

        this.editorParentElementsTop.push(this.backgroundPanel, backgroundLoadPanel, levelFlowHandlePanel, saveButton, mapSizePanel, musicHandlePanel, exitPanel);
        this.editorParentElementsBottom.push(this.mainPanel, this.eraserPanel, this.mainToolPanel, this.brushPanel, resetPanel);
        uiHandler.elements.push(...this.editorParentElementsTop, ...this.editorParentElementsBottom);
        this.editorParentElementsTop.forEach(a => a.backColor = "#1138");
        this.editorParentElementsBottom.forEach(a => a.backColor = "#1138");

        hotbarDefaults.forEach(a => this.hotbar.OnToolSelect(<any>a));
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
            if (panel.children.length < maxDisplayedRows) {
                panel.AddChild(rowPanel);
            } else {
                panel.scrollableChildren.push(rowPanel);
            }
        }
        panel.fixedPosition = true;
        panel.backColor = "#1138";
        return panel;
    }

    CreateMusicEditPanel(): Panel {
        let songs = audioHandler.levelSongList;
        let rows = Math.ceil(songs.length / 6);
        let ret = this.CreateFloatingButtonPanel(songs.map((a,i) => new EditorButtonSong(i)), rows, 6);
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
        let honeyBrush = new EditorButtonTile(TileType.Honey, "Honey");
        let honeyLeftBrush = new EditorButtonTile(TileType.HoneyLeft, "Honey wall (left)");
        let honeyRightBrush = new EditorButtonTile(TileType.HoneyRight, "Honey wall (right)");

        let ret = this.CreateFloatingButtonPanel([
            waterBrush, waterfallBrush, quickSandBrush, purpleWaterBrush, bubbleButton, 
            lavaBrush, honeyBrush, honeyLeftBrush, honeyRightBrush,
            new EditorButtonTile(TileType.InitialWaterLevel, "Initial water level"),
            new EditorButtonTile(TileType.InitialPurpleWaterLevel, "Initial purple water level"),
            new EditorButtonTile(TileType.InitialLavaLevel, "Initial lava level"),
            new EditorButtonTile(TileType.Drain, "Drain"),
            new EditorButtonTile(TileType.WaterTapOff, "Water tap"),
            new EditorButtonTile(TileType.PurpleWaterTapOff, "Purple water tap"),
            new EditorButtonTile(TileType.LavaTapOff, "Lava tap"),
            this.playerWaterModeToggle, this.spriteWaterModeToggle], 3, 6);
        ret.y = this.mainPanel.y - 290;
        ret.targetY = ret.y;
        return ret;
    }

    EditMap(importString: string): void {
        this.isEditorAllowed = true;
        this.exportString = importString;
        this.SwitchToEditMode();
    }

    SwitchToEditMode(): void {
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
            currentMap = LevelMap.FromImportString(this.exportString, true);
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
                let player = currentMap.mainLayer.sprites.find(a => a instanceof Player);
                if (player) {
                    this.playerFrames.push({ fd: <FrameData>player.GetFrameData(currentMap.frameNum), x: player.x, y: player.y });
                    if (this.playerFrames.length > 30) {
                        this.playerFrames.splice(0, 1);
                    }
                }
            }
        }
        if (!this.isInEditMode) return;


        this.frameNum++;
        let cameraSpeed = 6 / camera.scale;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) camera.targetX -= cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) camera.targetX += cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) camera.targetY -= cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) camera.targetY += cameraSpeed;
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorMinimize, true)) this.ToggleMinimizeMode();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorEraseHotkey, true)) (<EditorButton>this.eraserPanel.children[0]).Click();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorPlayerHotkey, true)) (<EditorButton>this.playerButton).Click();

        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorUndo, true)) this.history.Undo();
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorRedo, true)) this.history.Redo();

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
                camera.targetScale -= 1;
            }
            if (mouseHandler.mouseScroll < 0) {
                camera.targetScale += 1;
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

            for (let playerFrame of this.playerFrames) {
                let sprite = <Sprite>{ x: playerFrame.x, y: playerFrame.y };
                currentMap.mainLayer.DrawFrame(GetGhostFrameData(playerFrame.fd), camera.scale, sprite);
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