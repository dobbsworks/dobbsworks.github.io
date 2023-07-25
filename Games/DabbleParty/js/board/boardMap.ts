class BoardMap {
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

    currentPlayer: Player | null = null;
    pendingMinigame: MinigameBase = new MinigameLift();
    instructions: Instructions | null = null;

    initialized = false;
    Initialize(): void {
        this.initialized = true;

        this.boardSprites = [
            new SimpleSprite(8000, -1000, tiles["boardPlanet"][0][0]).SetScrollSpeed(0.05),
            new SimpleSprite(0, 0, tiles["boardTestTerrain"][0][0]),
        ]
        this.boardOverlaySprites = [
            new SimpleSprite(176, 22, tiles["boardDome"][0][0]),
        ]
        // board.boardSpaces.map(a => {
        //     return `new BoardSpace(BoardSpaceType.BlueBoardSpace, ${a.gameX.toFixed(0)}, ${a.gameY.toFixed(0)}).ConnectFromPrevious(),`;
        // }).join("\n")
        this.boardSpaces = [
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 497, 250, "first"),
            new BoardSpace(BoardSpaceType.ShopSpace, 468, 296).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 440, 347).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 435, 391).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 411, 443).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 358, 480).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, 283, 489).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 217, 495).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 155, 482).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 87, 471, "10").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 25, 482).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -47, 468).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -104, 440).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, -166, 407).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -238, 561).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -309, 576).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -382, 557).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -458, 535).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -521, 492).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.DiceUpgradeSpace, -526, 431).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -522, 224).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -494, 174, "22").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -464, 118).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -432, 55).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -412, -13).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -425, -81).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -448, -145).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -421, -207).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -343, -239).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -257, -229).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -181, -222).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -100, -207).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -22, -215).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 37, -222).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 125, -215).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 195, -186).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 250, -153).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 326, -166).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 390, -146).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 469, -99).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 493, -23).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 504, 49).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 510, 121).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 482, 183, "last").ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, 50, 407, "45"),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -27, 344).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -72, 301).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -133, 242).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -209, 201).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -286, 214).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -364, 220).ConnectFromPrevious(),
            new BoardSpace(BoardSpaceType.BlueBoardSpace, -441, 199, "52").ConnectFromPrevious(),

            new BoardSpace(BoardSpaceType.GrayBoardSpace, 560, 250, "starting position")
        ];

        this.players = [
            new Player(0),
            new Player(1),
            new Player(2),
            new Player(3),
        ];

        for (let i = 1; i <= this.players.length; i++) {
            let p = Random.RandFrom(this.players.filter(a => a.turnOrder == 0));
            p.turnOrder = i;
        }

        this.players.forEach(a => {
            a.token = new BoardToken(a);
            a.token.currentSpace = this.boardSpaces.find(x => x.label == "starting position") || null;
        });
        BoardSpace.ConnectLabels("last", "first");
        BoardSpace.ConnectLabels("10", "45");
        BoardSpace.ConnectLabels("52", "22");
        BoardSpace.ConnectLabels("starting position", "first");

        this.players.forEach(a => a.Update());
        this.boardUI.roundStarttimer = 1;
    }


    Update(): void {
        if (!this.initialized) this.Initialize();
        this.timer++;
        this.boardSprites.forEach(a => a.Update());
        this.players.forEach(a => a.Update());
        this.ManualCameraControl();
        if (this.currentPlayer) this.CameraFollow(this.currentPlayer || this.players[0]);
        if (this.scoreTimer > 0) {
            this.scoreTimer++;
            if (this.scoreTimer > 100 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.boardUI.isShowingScores = false;
                this.scoreTimer = 0;
                this.currentRound++;
                this.boardUI.roundStarttimer = 1;
            }
        }
        this.CameraBounds();
        this.boardUI.Update();
    }

    StartTurn(): void {
        this.boardUI.StartPlayerStartText();
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

    ManualCameraControl(): void {
        if (mouseHandler.mouseScroll !== 0) {
            this.isManualCamera = true;
            if (mouseHandler.mouseScroll < 0) camera.targetScale += 0.25;
            if (mouseHandler.mouseScroll > 0) camera.targetScale -= 0.25;
        }

        if (KeyboardHandler.IsKeyPressed(KeyAction.Cancel, false)) {
            this.isManualCamera = false;
        }

        if (this.isManualCamera) {
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
        //     this.boardSpaces.splice(this.boardSpaces.length-1,1);
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
        this.instructions = null;
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

                let sortedScores = [...scores]; sortedScores.sort((a,b) => b-a);
                let topScore = sortedScores[0];

                for (let playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
                    if (scores[playerIndex] == topScore) {
                        // minigame winner! (could be multiple players triggering this block)
                        this.players[playerIndex].coins += 10;
                        // todo put into animated value instead
                    }
                }

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

        if (this.instructions) {
            this.instructions.Draw(camera);
        } else {
            this.boardUI.Draw(camera.ctx);
        }

    }
}