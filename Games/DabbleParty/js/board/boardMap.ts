class BoardMap {
    backdropTile: ImageTile = tiles["bgBoard"][0][0];
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

    currentPlayer: Player | null = null;
    pendingMinigame = new MinigameLift();
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
        //     return `new BlueBoardSpace(${a.gameX.toFixed(0)}, ${a.gameY.toFixed(0)}).ConnectFromPrevious(),`;
        // }).join("\n")
        this.boardSpaces = [
            new BlueBoardSpace(497, 250, "first"),
            new BlueBoardSpace(468, 296).ConnectFromPrevious(),
            new BlueBoardSpace(440, 347).ConnectFromPrevious(),
            new BlueBoardSpace(435, 391).ConnectFromPrevious(),
            new BlueBoardSpace(411, 443).ConnectFromPrevious(),
            new BlueBoardSpace(358, 480).ConnectFromPrevious(),
            new DiceUpgradeSpace(283, 489).ConnectFromPrevious(),
            new BlueBoardSpace(217, 495).ConnectFromPrevious(),
            new BlueBoardSpace(155, 482).ConnectFromPrevious(),
            new BlueBoardSpace(87, 471, "10").ConnectFromPrevious(),
            new BlueBoardSpace(25, 482).ConnectFromPrevious(),
            new BlueBoardSpace(-47, 468).ConnectFromPrevious(),
            new BlueBoardSpace(-104, 440).ConnectFromPrevious(),
            new DiceUpgradeSpace(-166, 407).ConnectFromPrevious(),
            new BlueBoardSpace(-238, 561).ConnectFromPrevious(),
            new BlueBoardSpace(-309, 576).ConnectFromPrevious(),
            new BlueBoardSpace(-382, 557).ConnectFromPrevious(),
            new BlueBoardSpace(-458, 535).ConnectFromPrevious(),
            new BlueBoardSpace(-521, 492).ConnectFromPrevious(),
            new DiceUpgradeSpace(-526, 431).ConnectFromPrevious(),
            new BlueBoardSpace(-522, 224).ConnectFromPrevious(),
            new BlueBoardSpace(-494, 174, "22").ConnectFromPrevious(),
            new BlueBoardSpace(-464, 118).ConnectFromPrevious(),
            new BlueBoardSpace(-432, 55).ConnectFromPrevious(),
            new BlueBoardSpace(-412, -13).ConnectFromPrevious(),
            new BlueBoardSpace(-425, -81).ConnectFromPrevious(),
            new BlueBoardSpace(-448, -145).ConnectFromPrevious(),
            new BlueBoardSpace(-421, -207).ConnectFromPrevious(),
            new BlueBoardSpace(-343, -239).ConnectFromPrevious(),
            new BlueBoardSpace(-257, -229).ConnectFromPrevious(),
            new BlueBoardSpace(-181, -222).ConnectFromPrevious(),
            new BlueBoardSpace(-100, -207).ConnectFromPrevious(),
            new BlueBoardSpace(-22, -215).ConnectFromPrevious(),
            new BlueBoardSpace(37, -222).ConnectFromPrevious(),
            new BlueBoardSpace(125, -215).ConnectFromPrevious(),
            new BlueBoardSpace(195, -186).ConnectFromPrevious(),
            new BlueBoardSpace(250, -153).ConnectFromPrevious(),
            new BlueBoardSpace(326, -166).ConnectFromPrevious(),
            new BlueBoardSpace(390, -146).ConnectFromPrevious(),
            new BlueBoardSpace(469, -99).ConnectFromPrevious(),
            new BlueBoardSpace(493, -23).ConnectFromPrevious(),
            new BlueBoardSpace(504, 49).ConnectFromPrevious(),
            new BlueBoardSpace(510, 121).ConnectFromPrevious(),
            new BlueBoardSpace(482, 183, "last").ConnectFromPrevious(),
            new BlueBoardSpace(50, 407, "45"),
            new BlueBoardSpace(-27, 344).ConnectFromPrevious(),
            new BlueBoardSpace(-72, 301).ConnectFromPrevious(),
            new BlueBoardSpace(-133, 242).ConnectFromPrevious(),
            new BlueBoardSpace(-209, 201).ConnectFromPrevious(),
            new BlueBoardSpace(-286, 214).ConnectFromPrevious(),
            new BlueBoardSpace(-364, 220).ConnectFromPrevious(),
            new BlueBoardSpace(-441, 199, "52").ConnectFromPrevious(),

            
            new GrayBoardSpace(560, 250, "starting position")
        ];

        this.players = [
            new Player(0),
            // new Player(1),
            // new Player(2),
            // new Player(3),
        ];

        for (let i = 1; i <= this.players.length; i++ ) {
            let p = Random.RandFrom(this.players.filter(a => a.turnOrder == 0));
            p.turnOrder = i;
            if (i == 1) this.currentPlayer = p; // todo - determine turn order
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
        this.StartTurn();
    }


    Update(): void {
        if (!this.initialized) this.Initialize();
        this.timer++;
        this.boardSprites.forEach(a => a.Update());
        this.players.forEach(a => a.Update());
        this.ManualCameraControl();
        if (this.currentPlayer && this.currentPlayer?.token?.currentSpace == null) this.CameraFollow(this.currentPlayer || this.players[0]);
        this.CameraBounds();
        this.boardUI.Update();
    }

    StartTurn(): void {
        this.CameraFocus(this.currentPlayer || this.players[0]);
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
            // this is when I need to set the pending minigame and send it to the database for clients to poll
            this.boardUI.GenerateMinigameRouletteTexts(this.pendingMinigame);
        }
    }


    CameraFollow(player: Player): void {
        if (player.token) {
            camera.targetX = player.token.x;
            camera.targetY = player.token.y;
            camera.targetScale = 1.5;
        }
    }

    CameraFocus(player: Player): void {
        if (player.token) {
            camera.targetX = player.token.x;
            camera.targetY = player.token.y;
            camera.targetScale = 2;
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
        //     let boardSpace = new BlueBoardSpace(pos.xPixel, pos.yPixel);
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

    Draw(camera: Camera): void {
        let backdropScale = 1;
        if (camera.scale < 1) backdropScale = 1/camera.scale;
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