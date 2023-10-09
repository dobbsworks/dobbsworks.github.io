"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var BoardMap = /** @class */ (function () {
    function BoardMap(gameId) {
        this.gameId = gameId;
        this.isSpectateMode = false;
        this.backdropTile = tiles["bgBoard"][0][0];
        this.currentRound = 1;
        this.finalRound = 15;
        this.boardSprites = [];
        this.boardOverlaySprites = [];
        this.boardSpaces = [];
        this.players = [];
        this.timer = 0;
        this.boardUI = new BoardUI(this);
        this.rightEdge = 840;
        this.leftEdge = -840;
        this.topEdge = -640;
        this.bottomEdge = 640;
        this.isManualCamera = false;
        this.scoreTimer = 0;
        this.biodomePrice = 5;
        this.currentPlayer = null;
        this.pendingMinigame = null;
        this.initialized = false;
    }
    BoardMap.prototype.Initialize = function () {
        var _this = this;
        this.initialized = true;
        this.boardSprites = [
            new SimpleSprite(0, 0, tiles["boardTestTerrain"][0][0]),
            new SimpleSprite(-550, 50, tiles["boardWarpBase"][0][0]),
            new SimpleSprite(-560, 20, tiles["boardWarp"][0][0], function (s) { s.rotation += 0.01; }),
            new SimpleSprite(570, -120, tiles["boardWarpBase"][0][0], function (s) { s.xScale = -1; }),
            new SimpleSprite(580, -150, tiles["boardWarp"][0][0], function (s) { s.rotation += 0.01; }),
        ];
        this.boardOverlaySprites = [
            new SimpleSprite(176, 22, tiles["boardDome"][0][0]),
        ];
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
        ["2", "16", "29", "38", "48", "59", "66"].forEach(function (a) {
            var space = _this.boardSpaces.find(function (x) { return x.label == a; });
            if (space)
                space.isPotentialGearSpace = true;
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
        for (var i = 1; i <= this.players.length; i++) {
            var p = Random.RandFrom(this.players.filter(function (a) { return a.turnOrder == 0; }));
            p.turnOrder = i;
        }
        this.players.forEach(function (a) {
            a.token = new BoardToken(a);
            a.token.currentSpace = _this.boardSpaces.find(function (x) { return x.label == "starting position"; }) || null;
        });
        this.players.forEach(function (a) { return a.Update(); });
        this.boardUI.roundStarttimer = 1;
        this.PlaceGearSpace();
    };
    BoardMap.prototype.IsInLast5Turns = function () {
        return this.finalRound - this.currentRound + 1 <= 5;
    };
    BoardMap.prototype.Update = function () {
        if (!this.initialized)
            this.Initialize();
        this.timer++;
        this.boardSprites.forEach(function (a) { return a.Update(); });
        this.UpdateCoinDisplays();
        if (cutsceneService.isCutsceneActive) {
            //do nothing
        }
        else {
            this.players.forEach(function (a) { return a.Update(); });
            this.ManualCameraControl();
            if (!this.isSpectateMode) {
                if (this.currentPlayer)
                    this.CameraFollow(this.currentPlayer || this.players[0]);
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
                    audioHandler.SetBackgroundMusic("level1");
                    cutsceneService.AddScene(new BoardCutSceneGameEnd());
                }
            }
        }
        this.CameraBounds();
        if (!this.isSpectateMode)
            this.boardUI.Update();
    };
    BoardMap.prototype.UpdateCoinDisplays = function () {
        var shouldPlaySoundUp = false;
        var shouldPlaySoundDown = false;
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            var coinDiff = player.coins - player.displayedCoins;
            if ((coinDiff > 10 && this.timer % 2 == 0) || (coinDiff > 0 && this.timer % 8 == 0)) {
                player.displayedCoins++;
                shouldPlaySoundUp = true;
            }
            if ((coinDiff < -10 && this.timer % 2 == 0) || (coinDiff < 0 && this.timer % 8 == 0)) {
                player.displayedCoins--;
                shouldPlaySoundDown = true;
            }
        }
        if (shouldPlaySoundUp)
            audioHandler.PlaySound("coin", true);
        if (shouldPlaySoundDown)
            audioHandler.PlaySound("hurt", true);
    };
    BoardMap.prototype.SpectateUpdateLoop = function (exitingMinigame) {
        var _this = this;
        // request board state, wait X seconds, repeat.
        // if a minigame is active, switch to the instructions
        DataService.GetGameData(this.gameId).then(function (gameData) {
            var parsedData = JSON.parse(gameData.data);
            if (!exitingMinigame || parsedData.currentMinigameIndex == -1)
                _this.FromData(parsedData);
            if (parsedData.currentMinigameIndex == -1 || exitingMinigame) {
                setTimeout(function () {
                    _this.SpectateUpdateLoop(parsedData.currentMinigameIndex != -1);
                }, 5000);
            }
        });
    };
    BoardMap.prototype.StartTurn = function () {
        this.boardUI.StartPlayerStartText();
        this.SaveGameStateToDB();
    };
    BoardMap.prototype.CurrentPlayerTurnEnd = function () {
        var _a;
        var currentOrder = ((_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.turnOrder) || 0;
        var nextOrder = currentOrder + 1;
        var targetPlayer = this.players.find(function (a) { return a.turnOrder == nextOrder; });
        if (targetPlayer) {
            this.currentPlayer = targetPlayer;
            this.StartTurn();
        }
        else {
            // minigame time!
            this.currentPlayer = null;
            camera.targetScale = 0.421875;
            this.boardUI.isChoosingMinigame = true;
            this.pendingMinigame = MinigameGenerator.RandomGame();
            this.SaveGameStateToDB();
            this.boardUI.GenerateMinigameRouletteTexts(this.pendingMinigame);
        }
    };
    BoardMap.prototype.CameraFocusSpace = function (boardSpace) {
        camera.targetX = boardSpace.gameX;
        camera.targetY = boardSpace.gameY;
    };
    BoardMap.prototype.CameraFollow = function (player) {
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
    };
    BoardMap.prototype.PlaceGearSpace = function () {
        var existingSpace = this.boardSpaces.find(function (a) { return a.spaceType == BoardSpaceType.GearSpace; });
        var spaces = this.boardSpaces.filter(function (a) { return a.isPotentialGearSpace; });
        var target = spaces[6];
        if (existingSpace) {
            target = spaces[Math.floor(Math.random() * spaces.length)];
            existingSpace.spaceType = BoardSpaceType.BlueBoardSpace;
        }
        target.spaceType = BoardSpaceType.GearSpace;
        return target;
    };
    BoardMap.prototype.SetGearSpace = function (id) {
        var existingSpace = this.boardSpaces.find(function (a) { return a.spaceType == BoardSpaceType.GearSpace; });
        var spaces = this.boardSpaces.filter(function (a) { return a.isPotentialGearSpace; });
        var target = spaces[6];
        if (existingSpace) {
            target = this.boardSpaces.find(function (a) { return a.id === id; }) || target;
            existingSpace.spaceType = BoardSpaceType.BlueBoardSpace;
        }
        target.spaceType = BoardSpaceType.GearSpace;
    };
    BoardMap.prototype.ManualCameraControl = function () {
        if (mouseHandler.mouseScroll !== 0) {
            this.isManualCamera = true;
            if (mouseHandler.mouseScroll < 0)
                camera.targetScale += 0.25;
            if (mouseHandler.mouseScroll > 0)
                camera.targetScale -= 0.25;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Cancel, false)) {
            this.isManualCamera = false;
        }
        if (this.isManualCamera || this.isSpectateMode) {
            var cameraSpeed = 5;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false))
                camera.targetY -= cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false))
                camera.targetY += cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false))
                camera.targetX -= cameraSpeed;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false))
                camera.targetX += cameraSpeed;
        }
        // if (mouseHandler.isMouseClicked()) {
        //     let pos = mouseHandler.GetGameMousePixel(camera);
        //     let boardSpace = new BoardSpace(BoardSpaceType.BlueBoardSpace, pos.xPixel, pos.yPixel);
        //     this.boardSpaces.push(boardSpace);
        // }
        // if (KeyboardHandler.IsKeyPressed(KeyAction.EditorDelete, true)) {
        //     this.boardSpaces.splice(this.boardSpaces.length - 1, 1);
        // }
    };
    BoardMap.prototype.CameraBounds = function () {
        if (camera.GetLeftCameraEdge() < this.leftEdge)
            camera.SetLeftCameraEdge(this.leftEdge);
        if (camera.GetRightCameraEdge() > this.rightEdge)
            camera.SetRightCameraEdge(this.rightEdge);
        if (camera.GetTopCameraEdge() < this.topEdge)
            camera.SetTopCameraEdge(this.topEdge);
        if (camera.GetBottomCameraEdge() > this.bottomEdge)
            camera.SetBottomCameraEdge(this.bottomEdge);
        if (camera.scale < 0.75)
            camera.targetX = 0;
    };
    BoardMap.prototype.CreateButtonToToggleToUserViewInOBS = function () {
        var _this = this;
        var container = document.getElementById("scoreInput");
        if (container) {
            container.innerHTML = "";
            var button = document.createElement("button");
            button.textContent = "I HAVE SWITCHED OBS SCENE";
            button.onclick = function () {
                //todo - mute audio here
                var instructions = cutsceneService.cutscenes[0];
                if (instructions && instructions.minigame && instructions.minigame.songId) {
                    audioHandler.SetBackgroundMusic(instructions.minigame.songId);
                    instructions.isDone = true;
                }
                _this.CreateScoreInputDOM.bind(_this)();
            };
            container.appendChild(button);
        }
    };
    BoardMap.prototype.CreateScoreInputDOM = function () {
        var _this = this;
        var container = document.getElementById("scoreInput");
        if (container) {
            container.innerHTML = "";
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                var row = document.createElement("div");
                row.className = "scoreRow";
                var canvas = document.createElement("canvas");
                canvas.width = 20;
                canvas.height = 20;
                canvas.style.margin = "-6px";
                canvas.style.backgroundColor = "#0000";
                var image = tiles["playerIcons"][player.avatarIndex][0];
                image.Draw(new Camera(canvas), 0, 0, 0.1, 0.1, false, false, 0);
                var input = document.createElement("input");
                input.type = "number";
                input.dataset.playerId = player.userId.toString();
                input.className = "scoreInput";
                row.appendChild(canvas);
                row.appendChild(input);
                container.appendChild(row);
            }
            var pullScoresButton = document.createElement("button");
            pullScoresButton.textContent = "PULL SCORES";
            pullScoresButton.onclick = function () {
                DataService.GetScores(_this.gameId, _this.currentRound).then(function (scores) {
                    for (var _i = 0, scores_1 = scores; _i < scores_1.length; _i++) {
                        var score = scores_1[_i];
                        var inputBox = document.querySelector("input[data-player-id=\"" + score.playerId + "\"]");
                        if (inputBox) {
                            inputBox.value = score.score.toString();
                            inputBox.style.backgroundColor = "#AAA";
                        }
                    }
                });
                if (board) {
                    board.pendingMinigame = null;
                    board.SaveGameStateToDB();
                }
            };
            container.appendChild(pullScoresButton);
            var submitButton = document.createElement("button");
            submitButton.textContent = "SUBMIT SCORES";
            submitButton.onclick = function () { _this.OnSubmitScores.bind(_this)(); };
            container.appendChild(submitButton);
            var musicButton = document.createElement("button");
            musicButton.textContent = "SWAP TO LOBBY MUSIC";
            musicButton.onclick = function () { audioHandler.SetBackgroundMusic("lobby"); };
            container.appendChild(musicButton);
        }
        this.boardUI.isShowingScores = true;
    };
    BoardMap.prototype.OnSubmitScores = function () {
        this.scoreTimer = 1;
        var container = document.getElementById("scoreInput");
        if (container) {
            var inputs = Array.from(document.getElementsByClassName("scoreInput"));
            var scores = inputs.map(function (input) { return +(input.value); });
            if (scores.length != this.players.length) {
                console.error("WRONG INPUT COUNT");
            }
            else if (scores.some(function (a) { return isNaN(a); })) {
                console.error("INVALID SCORE");
            }
            else if (inputs.some(function (a) { return a.value.length == 0; })) {
                console.error("MISSING SCORE");
            }
            else {
                // all good 
                container.innerHTML = "";
                //award coins
                var sortedScores = __spreadArrays(scores);
                sortedScores.sort(function (a, b) { return b - a; });
                var topScore = sortedScores[0];
                for (var playerIndex_1 = 0; playerIndex_1 < this.players.length; playerIndex_1++) {
                    if (scores[playerIndex_1] == topScore) {
                        // minigame winner! (could be multiple players triggering this block)
                        this.players[playerIndex_1].coins += 10;
                        this.players[playerIndex_1].statMinigameWinnings += 10;
                        // todo put into animated value instead
                    }
                }
            }
        }
    };
    BoardMap.prototype.SaveGameStateToDB = function () {
        var dt = {
            id: this.gameId,
            data: this.Stringify(),
            lastUpdate: new Date(),
            currentRound: this.currentRound,
            hostId: 0,
            hostName: "",
            playerIds: ""
        };
        DataService.SaveGameData(dt).then(function (a) { });
    };
    BoardMap.prototype.Stringify = function () {
        var _this = this;
        var gearSpace = this.boardSpaces.find(function (a) { return a.spaceType == BoardSpaceType.GearSpace; });
        var gearSpaceId = (gearSpace === null || gearSpace === void 0 ? void 0 : gearSpace.id) || -1;
        var data = {
            boardId: 0,
            currentRound: this.currentRound,
            finalRound: this.finalRound,
            currentPlayerIndex: this.currentPlayer ? this.players.indexOf(this.currentPlayer) : -1,
            players: this.players.map(function (p) { return ({
                gears: p.gears,
                coins: p.coins,
                turnOrder: p.turnOrder,
                avatarIndex: p.avatarIndex,
                spaceIndex: _this.boardSpaces.indexOf(p.token.latestSpace),
                items: p.inventory.map(function (a) { return itemList.indexOf(a); }),
                userId: p.userId,
                userName: p.userName,
                diceBag: p.diceBag.dieFaces,
            }); }),
            currentMinigameIndex: this.pendingMinigame ? minigames.map(function (a) { return new a().title; }).indexOf(this.pendingMinigame.title) : -1,
            gearSpaceId: gearSpaceId
        };
        return JSON.stringify(data);
    };
    BoardMap.prototype.FromString = function (importString) {
        var data = JSON.parse(importString);
        this.FromData(data);
    };
    BoardMap.prototype.FromData = function (data) {
        this.currentRound = data.currentRound;
        this.finalRound = data.finalRound;
        this.players = [];
        for (var _i = 0, _a = data.players; _i < _a.length; _i++) {
            var p = _a[_i];
            var player = new Player(p.avatarIndex);
            this.players.push(player);
            player.userId = p.userId;
            player.token = new BoardToken(player);
            player.token.currentSpace = this.boardSpaces[p.spaceIndex];
            player.gears = p.gears;
            player.coins = p.coins;
            player.displayedCoins = p.coins;
            player.turnOrder = p.turnOrder;
            player.inventory = p.items.map(function (a) { return itemList[a]; }).filter(function (a) { return a; });
            player.diceBag = new DiceBag(p.diceBag);
        }
        this.currentPlayer = this.players[data.currentPlayerIndex] || null;
        this.SetGearSpace(data.gearSpaceId);
        if (data.currentMinigameIndex > -1) {
            var minigame = new minigames[data.currentMinigameIndex]();
            if (currentMinigame == null && !cutsceneService.isCutsceneActive) {
                // bring player into instructions
                cutsceneService.AddScene(new Instructions(minigame));
            }
        }
        else {
            audioHandler.SetBackgroundMusic("level1");
        }
    };
    BoardMap.prototype.Draw = function (camera) {
        var backdropScale = 1;
        if (camera.scale < 1)
            backdropScale = 1 / camera.scale;
        this.backdropTile.Draw(camera, camera.x, camera.y, backdropScale, backdropScale, false, false, 0);
        this.boardSprites.forEach(function (a) { return a.Draw(camera); });
        this.boardSpaces.forEach(function (a) { return a.DrawConnections(camera); });
        this.boardSpaces.forEach(function (a) { return a.Draw(camera); });
        this.players.forEach(function (a) { return a.DrawToken(camera); });
        this.boardOverlaySprites.forEach(function (a) { return a.Draw(camera); });
        if (this.isSpectateMode) {
            this.boardUI.DrawForSpectator(camera.ctx);
        }
        else {
            this.boardUI.Draw(camera.ctx);
        }
    };
    return BoardMap;
}());
