class BoardMap {

    constructor(public gameId: number) {}

    isSpectateMode = false;
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
    scoreTimer = 0;
    biodomePrice = 5;

    currentPlayer: Player | null = null;
    pendingMinigame: MinigameBase = new MinigameLift();

    initialized = false;
    Initialize(): void {
        this.initialized = true;

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

        for (let i = 1; i <= this.players.length; i++) {
            let p = Random.RandFrom(this.players.filter(a => a.turnOrder == 0));
            p.turnOrder = i;
        }

        this.players.forEach(a => {
            a.token = new BoardToken(a);
            a.token.currentSpace = this.boardSpaces.find(x => x.label == "starting position") || null;
        });

        this.players.forEach(a => a.Update());
        this.boardUI.roundStarttimer = 1;
        this.PlaceGearSpace();
    }

    IsInLast5Turns(): boolean {
        return this.finalRound - this.currentRound + 1 <= 5;
    }

    Update(): void {
        if (!this.initialized) this.Initialize();
        this.timer++;
        this.boardSprites.forEach(a => a.Update());

        if (cutsceneService.isCutsceneActive) {
            //do nothing
        } else {
            this.players.forEach(a => a.Update());
            this.ManualCameraControl();
            if (!this.isSpectateMode) {
                if (this.currentPlayer) this.CameraFollow(this.currentPlayer || this.players[0]);
            }
        }
        if (this.scoreTimer > 0) {
            this.scoreTimer++;
            if (this.scoreTimer > 100 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.boardUI.isShowingScores = false;
                this.scoreTimer = 0;
                this.currentRound++;
                this.SaveGameStateToDB();
                this.boardUI.roundStarttimer = 1;
                if (this.finalRound - this.currentRound + 1 == 5) {
                    cutsceneService.AddScene(new BoardCutSceneLast5Turns());
                }
                if (this.finalRound - this.currentRound + 1 == 0) {
                    cutsceneService.AddScene(new BoardCutSceneGameEnd());
                }
            }
        }
        this.CameraBounds();
        if (!this.isSpectateMode) this.boardUI.Update();
    }

    SpectateUpdateLoop(): void {
        // request board state, wait X seconds, repeat.
        // if a minigame is active, switch to the instructions
        DataService.GetGameData(this.gameId).then(gameData => {
            let parsedData = JSON.parse(gameData.data);
            this.FromData(parsedData);
            if (parsedData.currentMinigameIndex == -1) {
                setTimeout( () => {
                    this.SpectateUpdateLoop();
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
            // this is when I need to set the pending minigame and send it to the database for clients to poll
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
        return target;
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

        if (this.isManualCamera || this.isSpectateMode) {
            let cameraSpeed = 5;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) camera.targetY -= cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) camera.targetY += cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) camera.targetX -= cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) camera.targetX += cameraSpeed;
        }


        // if (mouseHandler.isMouseClicked()) {
        //     let pos = mouseHandler.GetGameMousePixel(camera);
        //     let boardSpace = new BoardSpace(BoardSpaceType.BlueBoardSpace, pos.xPixel, pos.yPixel);
        //     this.boardSpaces.push(boardSpace);
        // }
        // if (KeyboardHandler.IsKeyPressed(KeyAction.EditorDelete, true)) {
        //     this.boardSpaces.splice(this.boardSpaces.length - 1, 1);
        // }
    }

    CameraBounds(): void {

        if (camera.GetLeftCameraEdge() < this.leftEdge) camera.SetLeftCameraEdge(this.leftEdge);
        if (camera.GetRightCameraEdge() > this.rightEdge) camera.SetRightCameraEdge(this.rightEdge);
        if (camera.GetTopCameraEdge() < this.topEdge) camera.SetTopCameraEdge(this.topEdge);
        if (camera.GetBottomCameraEdge() > this.bottomEdge) camera.SetBottomCameraEdge(this.bottomEdge);
        if (camera.scale < 0.75) camera.targetX = 0;
    }

    CreateButtonToToggleToUserViewInOBS(): void {
        let container = document.getElementById("scoreInput");
        if (container) {
            container.innerHTML = "";
            let button = document.createElement("button");
            button.textContent = "I HAVE SWITCHED OBS SCENE";
            button.onclick = () => {
                //todo - mute audio here
                this.CreateScoreInputDOM.bind(this)();
            }
            container.appendChild(button);
        }
    }

    CreateScoreInputDOM(): void {
        let container = document.getElementById("scoreInput");
        if (container) {
            container.innerHTML = "";
            for (let player of this.players) {
                let row = document.createElement("div");
                row.className = "scoreRow";
                let canvas = document.createElement("canvas");
                canvas.width = 20;
                canvas.height = 20;
                canvas.style.margin = "-6px";
                canvas.style.backgroundColor = "#0000";
                let image = tiles["playerIcons"][player.avatarIndex][0] as ImageTile;
                image.Draw(new Camera(canvas), 0, 0, 0.1, 0.1, false, false, 0);
                let input = document.createElement("input");
                input.type = "number";
                input.className = "scoreInput";
                row.appendChild(canvas);
                row.appendChild(input);
                container.appendChild(row);
            }
            let submitButton = document.createElement("button");
            submitButton.textContent = "SUBMIT SCORES";
            submitButton.onclick = () => { this.OnSubmitScores.bind(this)(); }
            container.appendChild(submitButton);
        }
        this.boardUI.isShowingScores = true;
    }

    OnSubmitScores(): void {
        this.scoreTimer = 1;
        let container = document.getElementById("scoreInput");
        if (container) {

            let inputs = Array.from(document.getElementsByClassName("scoreInput")) as HTMLInputElement[];
            let scores = inputs.map(input => +(input.value));
            if (scores.length != this.players.length) {
                console.error("WRONG INPUT COUNT");
            } else if (scores.some(a => isNaN(a))) {
                console.error("INVALID SCORE");
            } else if (inputs.some(a => a.value.length == 0)) {
                console.error("MISSING SCORE");
            } else {
                // all good 

                container.innerHTML = "";

                //award coins

                let sortedScores = [...scores]; sortedScores.sort((a, b) => b - a);
                let topScore = sortedScores[0];

                for (let playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
                    if (scores[playerIndex] == topScore) {
                        // minigame winner! (could be multiple players triggering this block)
                        this.players[playerIndex].coins += 10;
                        this.players[playerIndex].statMinigameWinnings += 10;

                        // todo put into animated value instead
                    }
                }

            }
        }
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
        DataService.SaveGameData(dt).then(a => { console.log("Game saved to DB")});
    }


    Stringify(): string {
        let data: GameExport = {
            boardId: 0,
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
            currentMinigameIndex: currentMinigame ? minigames.map(a => new a().title).indexOf(currentMinigame.title) : -1,
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
            player.token.currentSpace = this.boardSpaces[p.spaceIndex];
            player.gears = p.gears;
            player.coins = p.coins;
            player.turnOrder = p.turnOrder;
            player.inventory = p.items.map(a => itemList[a]).filter(a => a);
            player.diceBag = new DiceBag(p.diceBag as FaceCount[])
        }

        this.currentPlayer = this.players[data.currentPlayerIndex] || null;

        if (data.currentMinigameIndex > -1) {
            let minigame = new minigames[data.currentMinigameIndex]();
            if (currentMinigame == null && !cutsceneService.isCutsceneActive) {
                // bring player into instructions
                cutsceneService.AddScene(new Instructions(minigame));
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

        if (this.isSpectateMode) {
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
    }[];
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