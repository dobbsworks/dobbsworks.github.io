abstract class BoardMap {

    constructor(public gameId: number) {}

    abstract boardId: number;
    abstract introText: string;
    abstract logo: ImageTile;
    abstract songId: string;
    abstract fanfare: string;
    latestCompletedMenuId = -1;
    backdropTile: ImageTile = tiles["bgBoard"][0][0];
    currentRound = 1;
    finalRound = 15;
    boardSprites: Sprite[] = [];
    boardOverlaySprites: Sprite[] = [];
    boardSpaces: BoardSpace[] = [];
    players: Player[] = [];
    timer: number = 0;
    boardUI: BoardUI = new BoardUI(this);
    rightEdge = 840;
    leftEdge = -840;
    topEdge = -640;
    bottomEdge = 640;
    isManualCamera = false;
    biodomePrice = 5;

    currentPlayer: Player | null = null;
    pendingMinigame: MinigameBase | null = null;

    initialized = false;
    Initialize(): void {
        this.initialized = true;

        this.SetupBoardSpaces();

        for (let i = 1; i <= this.players.length; i++) {
            let p = Random.SeededRandFrom(this.players.filter(a => a.turnOrder == 0));
            p.turnOrder = i;
        }

        this.players.forEach(a => {
            a.token = new BoardToken(a);
            a.token.currentSpace = this.boardSpaces.find(x => x.label == "starting position") || null;
        });

        this.players.forEach(a => a.Update());
        this.boardUI.roundStarttimer = 1;
        //this.PlaceGearSpace();
    }

    // override for each map
    abstract SetupBoardSpaces(): void;


    GetStartingSpace(): BoardSpace {
        let ret = this.boardSpaces.find(x => x.label == "starting position") ?? this.boardSpaces[0];
        return ret;
    }

    IsInLast5Turns(): boolean {
        return this.finalRound - this.currentRound + 1 <= 5;
    }

    Update(): void {
        if (!this.initialized) this.Initialize();
        this.timer++;
        this.boardSprites.forEach(a => a.Update());
        this.UpdateCoinDisplays();

        if (cutsceneService.isCutsceneActive) {
            //do nothing
        } else {
            this.players.forEach(a => a.Update());
            this.ManualCameraControl();
            if (playmode == PlayMode.host || playmode == PlayMode.playinghost) {
                if (this.currentPlayer) this.CameraFollow(this.currentPlayer || this.players[0]);
            }
        }
        this.CameraBounds();
        if (playmode == PlayMode.host || playmode == PlayMode.playinghost) {
            this.boardUI.Update();
        } else {
            // item menu handling
            if (this.boardUI.currentMenu) {
                this.boardUI.currentMenu.Update();
            }
        }
    }
    
    UpdateCoinDisplays(): void {
        let shouldPlaySoundUp = false;
        let shouldPlaySoundDown = false;
        for (let player of this.players) {
            let coinDiff = player.coins - player.displayedCoins;
            if ((coinDiff > 10 && this.timer % 2 == 0) || (coinDiff > 0 && this.timer % 8 == 0)) {
                player.displayedCoins++;
                shouldPlaySoundUp = true;
            }
            if ((coinDiff < -10 && this.timer % 2 == 0) || (coinDiff < 0 && this.timer % 8 == 0)) {
                player.displayedCoins--;
                shouldPlaySoundDown = true;
            }
        }
        if (shouldPlaySoundUp) audioHandler.PlaySound("coin", true);
        if (shouldPlaySoundDown) audioHandler.PlaySound("hurt", true);
    }

    SpectateUpdateLoop(exitingMinigame: boolean): void {
        // request board state, wait X seconds, repeat.
        // if a minigame is active, switch to the instructions
        DataService.GetGameData(this.gameId).then(gameData => {
            let parsedData = JSON.parse(gameData.data);
            if (!exitingMinigame || parsedData.currentMinigameIndex == -1) this.FromData(parsedData);
            if (parsedData.currentMinigameIndex == -1 || exitingMinigame) {
                setTimeout( () => {
                    this.SpectateUpdateLoop(parsedData.currentMinigameIndex != -1);
                }, 5000);
            }
        });
    }

    StartTurn(): void {
        this.boardUI.StartPlayerStartText();
        this.SaveGameStateToDB();
    }

    CurrentPlayerTurnEnd(): void {
        let currentOrder = this.currentPlayer?.turnOrder || 0;
        let nextOrder = currentOrder + 1;
        let targetPlayer = this.players.find(a => a.turnOrder == nextOrder);
        if (targetPlayer) {
            this.currentPlayer = targetPlayer;
            this.StartTurn();
        } else {
            // minigame time!
            this.currentPlayer = null;
            camera.targetScale = 0.421875;
            this.boardUI.isChoosingMinigame = true;

            this.pendingMinigame = MinigameGenerator.RandomGame();
            
            this.SaveGameStateToDB();
            this.boardUI.GenerateMinigameRouletteTexts(this.pendingMinigame);
        }
    }

    CameraFocusSpace(boardSpace: BoardSpace): void {
        camera.targetX = boardSpace.gameX;
        camera.targetY = boardSpace.gameY;
    }


    CameraFollow(player: Player): void {
        if (player.token) {
            camera.targetX = player.token.x;
            camera.targetY = player.token.y;
            camera.targetScale = 1.5;

            if (this.boardUI.currentMenu) {
                camera.targetX = player.token.x - 80;
                camera.targetY = player.token.y - 20;
                camera.targetScale = 2;
            }
        }
    }

    PlaceGearSpace(): BoardSpace {
        let existingSpace = this.boardSpaces.find(a => a.spaceType == BoardSpaceType.GearSpace);
        let spaces = this.boardSpaces.filter(a => a.isPotentialGearSpace);
        let target = spaces[6];
        if (existingSpace) {
            target = spaces[Math.floor(Math.random() * spaces.length)];
            existingSpace.spaceType = BoardSpaceType.BlueBoardSpace;
        }
        target.spaceType = BoardSpaceType.GearSpace;
        board!.SaveGameStateToDB();
        return target;
    }

    SetGearSpace(id: number): void {
        let existingSpace = this.boardSpaces.find(a => a.spaceType == BoardSpaceType.GearSpace);
        let spaces = this.boardSpaces.filter(a => a.isPotentialGearSpace);
        let target = spaces[6];
        if (existingSpace) {
            target = this.boardSpaces.find(a => a.id === id) || target;
            existingSpace.spaceType = BoardSpaceType.BlueBoardSpace;
        }
        target.spaceType = BoardSpaceType.GearSpace;
    }


    ManualCameraControl(): void {
        if (mouseHandler.mouseScroll !== 0) {
            this.isManualCamera = true;
            if (mouseHandler.mouseScroll < 0) camera.targetScale += 0.25;
            if (mouseHandler.mouseScroll > 0) camera.targetScale -= 0.25;
        }

        if (KeyboardHandler.IsKeyPressed(KeyAction.Cancel, false)) {
            this.isManualCamera = false;
        }

        if (this.isManualCamera || playmode == PlayMode.client) {
            let cameraSpeed = 5;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) camera.targetY -= cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) camera.targetY += cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) camera.targetX -= cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) camera.targetX += cameraSpeed;
        }

        // TEMP
        if (mouseHandler.isMouseClicked()) {
            let pos = mouseHandler.GetGameMousePixel(camera);
            let boardSpace = new BoardSpace(BoardSpaceType.BlueBoardSpace, pos.xPixel, pos.yPixel);
            this.boardSpaces.push(boardSpace);
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.EditorDelete, true)) {
            this.boardSpaces.splice(this.boardSpaces.length - 1, 1);
        }
    }

    CameraBounds(): void {

        if (camera.GetLeftCameraEdge() < this.leftEdge) camera.SetLeftCameraEdge(this.leftEdge);
        if (camera.GetRightCameraEdge() > this.rightEdge) camera.SetRightCameraEdge(this.rightEdge);
        if (camera.GetTopCameraEdge() < this.topEdge) camera.SetTopCameraEdge(this.topEdge);
        if (camera.GetBottomCameraEdge() > this.bottomEdge) camera.SetBottomCameraEdge(this.bottomEdge);
        if (camera.scale < 0.75) camera.targetX = 0;
    }

    SaveGameStateToDB(): void {
        let dt = {
            id: this.gameId,
            data: this.Stringify(),
            lastUpdate: new Date(),
            currentRound: this.currentRound,
            hostId: 0,
            hostName: "",
            playerIds: ""
        }
        DataService.SaveGameData(dt).then(a => { });
    }


    Stringify(): string {
        let gearSpace = this.boardSpaces.find(a => a.spaceType == BoardSpaceType.GearSpace);
        let gearSpaceId = gearSpace?.id || -1;
        let menu = {id: this.boardUI.menuId, options: [] as string[]};
        if (this.boardUI.currentMenu) {
            menu.options = this.boardUI.currentMenu.options.map(a => a.plainText);
        }

        let data: GameExport = {
            boardId: this.boardId,
            currentRound: this.currentRound,
            finalRound: this.finalRound,
            currentPlayerIndex: this.currentPlayer ? this.players.indexOf(this.currentPlayer) : -1,
            players: this.players.map(p => ({
                gears: p.gears,
                coins: p.coins,
                turnOrder: p.turnOrder,
                avatarIndex: p.avatarIndex,
                spaceIndex: this.boardSpaces.indexOf(p.token.latestSpace),
                items: p.inventory.map(a => itemList.indexOf(a)),
                userId: p.userId,
                userName: p.userName,
                diceBag: p.diceBag.dieFaces,
            })),
            currentMinigameIndex: this.pendingMinigame ? minigames.map(a => new a().title).indexOf(this.pendingMinigame.title) : -1,
            gearSpaceId: gearSpaceId,
            menu: menu
        };
        return JSON.stringify(data);
    }

    FromString(importString: string): void {
        let data: GameExport = JSON.parse(importString);
        this.FromData(data);
    }

    FromData(data: GameExport): void {
        this.currentRound = data.currentRound;
        this.finalRound = data.finalRound;
        this.players = [];

        for (let p of data.players) {
            let player = new Player(p.avatarIndex);
            this.players.push(player);
            player.userId = p.userId;
            player.token = new BoardToken(player);
            player.token.currentSpace = this.boardSpaces[p.spaceIndex] || this.GetStartingSpace();
            player.gears = p.gears;
            player.coins = p.coins;
            player.displayedCoins = p.coins;
            player.turnOrder = p.turnOrder;
            player.inventory = p.items.map(a => itemList[a]).filter(a => a);
            player.diceBag = new DiceBag(p.diceBag as FaceCount[])
        }

        let myPlayer = data.players[clientPlayerIndex];
        if (myPlayer) {
            playerIndex = myPlayer.turnOrder % 4;
            if (playerIndex < 0) playerIndex = 0;
        }

        this.currentPlayer = this.players[data.currentPlayerIndex] || null;

        this.SetGearSpace(data.gearSpaceId);

        if (data.currentMinigameIndex > -1) {
            let minigame = new minigames[data.currentMinigameIndex]();
            if (currentMinigame == null && !cutsceneService.isCutsceneActive) {
                // bring player into instructions
                cutsceneService.AddScene(new Instructions(minigame));
            }
        } else {
            audioHandler.SetBackgroundMusic(this.songId);
        }

        if (data.menu && 
            clientPlayerIndex == data.currentPlayerIndex && 
            this.boardUI.currentMenu == null && 
            data.menu.options.length > 0) {
            if (data.menu.id > this.latestCompletedMenuId) {
                this.boardUI.currentMenu = BoardMenu.CreateClientMenu(data.menu.id, data.menu.options);
            }
        }
    }



    Draw(camera: Camera): void {
        let backdropScale = 1;
        if (camera.scale < 1) backdropScale = 1 / camera.scale;
        this.backdropTile.Draw(camera, camera.x, camera.y, backdropScale, backdropScale, false, false, 0);
        this.boardSprites.forEach(a => a.Draw(camera));
        this.boardSpaces.forEach(a => a.DrawConnections(camera));
        this.boardSpaces.forEach(a => a.Draw(camera));
        this.players.forEach(a => a.DrawToken(camera));
        this.boardOverlaySprites.forEach(a => a.Draw(camera));

        if (playmode == PlayMode.client) {
            this.boardUI.DrawForSpectator(camera.ctx);
        } else {
            this.boardUI.Draw(camera.ctx);
        }
    }
}

type GameExport = {
    boardId: number;
    currentRound: number;
    finalRound: number;
    currentPlayerIndex: number;
    currentMinigameIndex: number;
    gearSpaceId: number;
    players: {
        gears: number;
        coins: number;
        turnOrder: number;
        avatarIndex: number;
        spaceIndex: number;
        items: number[];
        userId: number;
        userName: string;
        diceBag: number[];
    }[],
    menu: {
        id: number,
        options: string[]
    } | null
}

type PartyGameDT = {
    id: number;
    data: string; //GameExport
    lastUpdate: Date;
    currentRound: number;
    hostId: number;
    hostName: string;
    playerIds: string;
}
type PartyScoreDT = {
    id: number;
    gameId: number;
    playerId: number;
    score: number;
    roundNumber: number;
}
type PartyMenuDT = {
    id: number;
    gameId: number;
    menuId: number;
    selectedIndex: number;
}

interface PartyGameDTWithMenu extends PartyGameDT {
    latestMenu: PartyMenuDT;
}




class BoardMapRover extends BoardMap {
    boardId = 0;
    logo = tiles["spaceBoardTitle"][0][0] as ImageTile;
    songId = "level1";
    fanfare = "spaceFanfare";
    introText = "Welcome to Rover's Space Base! This lunar level is full of treasures to win amidst the technological wonders up here on the moon.";
    SetupBoardSpaces(): void {
        this.boardSprites = [
            new SimpleSprite(0, 0, tiles["boardTestTerrain"][0][0]),
            new SimpleSprite(-550, 50, tiles["boardWarpBase"][0][0]),
            new SimpleSprite(-560, 20, tiles["boardWarp"][0][0], (s) => { s.rotation += 0.01 }),
            new SimpleSprite(570, -120, tiles["boardWarpBase"][0][0], (s) => { s.xScale = -1 }),
            new SimpleSprite(580, -150, tiles["boardWarp"][0][0], (s) => { s.rotation += 0.01 }),
        ]
        this.boardOverlaySprites = [
            new SimpleSprite(176, 22, tiles["boardDome"][0][0]),
        ]
        // board.boardSpaces.map(a => {
        //     return `new BoardSpace(BoardSpaceType.BlueBoardSpace, ${a.gameX.toFixed(0)}, ${a.gameY.toFixed(0)}).ConnectFromPrevious(),`;
        // }).join("\n")
        this.boardSpaces = [
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 497, 250, "first"),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 468, 296, "2").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.RedBoardSpace, 440, 347).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 435, 391).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 411, 443).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 358, 480).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 283, 489).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.RedBoardSpace, 217, 495).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.ShopSpace, 155, 482).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 87, 471, "10").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 25, 482).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -47, 468).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.TwitchSpace, -104, 440).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -166, 407).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.RedBoardSpace, -238, 561).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -309, 576, "16").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -382, 557).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -458, 535).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.RedBoardSpace, -521, 492).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, -526, 431).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -522, 224).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -494, 174, "22").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -474, 128).ConnectFromPrevious(),
            
            new BoardSpace(BoardSpaceType.Warp1BoardSpace, -448, 86, "warp1").ConnectFromPrevious(),

            new BoardSpace(BoardSpaceType.BlueBoardSpace, -422, 45, "24").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -412, -13).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, -425, -81).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -448, -145).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -421, -207).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -343, -239, "29").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.RedBoardSpace, -257, -229).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.ShopSpace, -181, -222).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -100, -207, "32").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -22, -215).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 37, -222).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 125, -215).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 195, -186).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 250, -153, "37").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 326, -166, "38").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.TwitchSpace, 390, -146).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 440, -120).ConnectFromPrevious(),

            new BoardSpace(BoardSpaceType.Warp2BoardSpace, 460, -75, "warp2").ConnectFromPrevious(),

            new BoardSpace(BoardSpaceType.BlueBoardSpace, 480, -30).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.RedBoardSpace, 504, 49).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 510, 121).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 482, 183, "last").ConnectFromPrevious(),

            new BoardSpace(BoardSpaceType.BlueBoardSpace, 50, 407, "45"),
            new BoardSpace(BoardSpaceType.RedBoardSpace, -27, 344).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -72, 301).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -133, 242, "48").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, -209, 201).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -286, 214).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -364, 220).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.RedBoardSpace, -441, 199, "52").ConnectFromPrevious(),

            new BoardSpace(BoardSpaceType.GrayBoardSpace, 560, 250, "starting position"),

            new BoardSpace(BoardSpaceType.BlueBoardSpace, -353, 26, "54"),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -272, 15).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.RedBoardSpace, -210, 30).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -140, 36, "57").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BiodomeEntryBoardSpace, -80, 50).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, -19, 63).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 28, 93, "59").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 101, 93).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 185, 100, "61").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.WallopSpace, 262, 96).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 330, 109).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, 418, 152, "64").ConnectFromPrevious(),

            new BoardSpace(BoardSpaceType.BlueBoardSpace, -111, -27, "65"),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -141, -96, "66").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.TwitchSpace, -116, -152, "67").ConnectFromPrevious(),

            new BoardSpace(BoardSpaceType.BlueBoardSpace, 193, 23, "68"),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, 177, -40).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 199, -97, "70").ConnectFromPrevious(),
        ];

        ["2", "16", "29", "38", "48", "59", "66"].forEach(a => {
            let space = this.boardSpaces.find(x => x.label == a);
            if (space) space.isPotentialGearSpace = true;
        });

        BoardSpace.ConnectLabels("last", "first");
        BoardSpace.ConnectLabels("10", "45");
        BoardSpace.ConnectLabels("52", "22");
        BoardSpace.ConnectLabels("starting position", "first");
        BoardSpace.ConnectLabels("24", "54");
        BoardSpace.ConnectLabels("64", "last");
        BoardSpace.ConnectLabels("57", "65");
        BoardSpace.ConnectLabels("67", "32");
        BoardSpace.ConnectLabels("61", "68");
        BoardSpace.ConnectLabels("70", "37");
    }
}


class BoardMapIron extends BoardMap {
    boardId = 1;
    logo = tiles["ironBoardTitle"][0][0] as ImageTile;
    songId = "ironsworn";
    fanfare = "ironIntro";
    introText = "Welcome to The Ironlands! This harsh and dangerous landscape is teeming with ancient secrets, terrifying beasts, and untold treasures.";
    backdropTile: ImageTile = tiles["bgBoard"][0][0];
    SetupBoardSpaces(): void {
        this.boardSprites = [
            new SimpleSprite(0, 0, tiles["boardIronTerrain"][0][0]),
        ]
        this.boardOverlaySprites = []
        // board.boardSpaces.map(a => {
        //     return `new BoardSpace(BoardSpaceType.BlueBoardSpace, ${a.gameX.toFixed(0)}, ${a.gameY.toFixed(0)}).ConnectFromPrevious(),`;
        // }).join("\n")
        this.boardSpaces = [
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 410, 488, "first"),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 351, 533).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 275, 538).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 194, 510).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 116, 474).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 57, 412).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 57, 329, "A").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 50, 265, "B").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 2, 218, "C").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -73, 216, "D").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -154, 258, "E").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -185, 334, "F").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -187, 405).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -206, 500).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -287, 555).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -384, 559).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -474, 526).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -521, 457).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -521, 375).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -467, 303).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -389, 251).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -306, 254, "G").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -204, 228, "H").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -159, 154, "I").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -164, 92, "J").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -211, 47, "K").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -301, 38, "L").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -377, 40).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -457, 7).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -500, -62).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -488, -130).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -434, -199).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -365, -237).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -270, -239).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -199, -197).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -161, -128).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -183, -52, "M").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -154, 9, "N").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -100, 38, "O").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -14, 31, "P").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 81, 12, "Q").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 119, -71, "R").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 142, -140).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 197, -197).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 287, -216).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 382, -197).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 448, -140).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 472, -66).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 457, 17).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 393, 73).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 299, 78).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 187, 52, "S").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 104, 64, "T").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 78, 119, "U").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 76, 183, "V").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 102, 239, "W").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 171, 258, "X").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 263, 251).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 341, 268).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 403, 308).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 431, 360).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 436, 424, "last").ConnectFromPrevious(),
        ];

        // ["2", "16", "29", "38", "48", "59", "66"].forEach(a => {
        //     let space = this.boardSpaces.find(x => x.label == a);
        //     if (space) space.isPotentialGearSpace = true;
        // });

        BoardSpace.ConnectLabels("last", "first");
        BoardSpace.ConnectLabels("A", "X");
        BoardSpace.ConnectLabels("G", "F");
        BoardSpace.ConnectLabels("M", "L");
        BoardSpace.ConnectLabels("S", "R");
        
        BoardSpace.ConnectLabels("V", "C");
        BoardSpace.ConnectLabels("D", "I");
        BoardSpace.ConnectLabels("J", "O");
        BoardSpace.ConnectLabels("P", "U");

        // BoardSpace.ConnectLabels("10", "45");
        // BoardSpace.ConnectLabels("52", "22");
        // BoardSpace.ConnectLabels("starting position", "first");
        // BoardSpace.ConnectLabels("24", "54");
        // BoardSpace.ConnectLabels("64", "last");
        // BoardSpace.ConnectLabels("57", "65");
        // BoardSpace.ConnectLabels("67", "32");
        // BoardSpace.ConnectLabels("61", "68");
        // BoardSpace.ConnectLabels("70", "37");
    }
}




let boards = [
    BoardMapRover,
    BoardMapIron
];