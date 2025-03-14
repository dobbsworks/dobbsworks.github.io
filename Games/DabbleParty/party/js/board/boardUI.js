"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var BoardUI = /** @class */ (function () {
    function BoardUI(board) {
        this.board = board;
        this.dice = [];
        this.uiCamera = new Camera(camera.canvas);
        this.combineTimer = 0;
        this.combinedNumber = 0;
        this.combinedNumberScale = 1;
        this.roundStarttimer = 0;
        this.slideFrames = 30;
        this.waitFrames = 30;
        this.playerStartTimer = 0;
        this.useAltStartText = false;
        this.rollTimer = 0;
        this.menuId = 1;
        this._currentMenu = null;
        this.isChoosingMinigame = false;
        this.minigameTextTime = 0;
        this.fakeMinigameNames = [
            "Turtle Will Love This One",
            "The Rise And Fall",
            "Dev Exit",
            "Goose On The Loose",
            "Snek In The Grass",
            "Circle of Birds",
            "The Third One",
            "Mammoth Wooly",
            "Which Switch?",
            "Pollen Fallin'",
            "Surfing The Web",
            "Something Fishay",
            "Berry Sunny",
            "SIX",
            "Nightmare Bistro",
            "Crushing Wheelie",
            "Wall o' Wallops",
            "Popplin' Off",
            "TTS Censor Simulator 2000",
            "Casual Trolling",
            "Snail of a Time",
            "Grand Ham",
            "Submarine Soon",
            "Minigames Done Badly",
            "Midar's Revenge",
            "For Whom The Bell Ends",
            "Haven't You Ever...",
            "Chickadee's Putt-Putts",
        ];
        this.fakeMinigamePool = [];
        this.currentRouletteTexts = [];
        this.rouletteTheta = 0;
    }
    Object.defineProperty(BoardUI.prototype, "currentMenu", {
        get: function () {
            return this._currentMenu;
        },
        set: function (menu) {
            this._currentMenu = menu;
            this.menuId++;
            if (playmode == PlayMode.host || playmode == PlayMode.playinghost) {
                this.board.SaveGameStateToDB();
            }
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    BoardUI.prototype.Clear = function () {
        this.combineTimer = 0;
        this.combinedNumber = 0;
        this.minigameTextTime = 0;
        this.rouletteTheta = 0;
    };
    BoardUI.prototype.StartPlayerStartText = function () {
        this.playerStartTimer = 1;
        this.useAltStartText = (Math.random() > 0.95 && this.board.currentRound > 3);
    };
    BoardUI.prototype.StartRoll = function () {
        if (this.board.currentPlayer) {
            audioHandler.PlaySound("diceRoll", true);
            this.dice = this.board.currentPlayer.diceBag.GetDiceSprites();
        }
    };
    BoardUI.prototype.GenerateMinigameRouletteTexts = function (targetMinigame) {
        this.currentRouletteTexts = [targetMinigame.title];
        var _loop_1 = function (i) {
            if (this_1.fakeMinigamePool.length == 0) {
                this_1.fakeMinigamePool = __spreadArrays(this_1.fakeMinigameNames);
            }
            var drawn = Random.SeededRandFrom(this_1.fakeMinigamePool);
            this_1.fakeMinigamePool = this_1.fakeMinigamePool.filter(function (a) { return a != drawn; });
            this_1.currentRouletteTexts.push(drawn);
        };
        var this_1 = this;
        for (var i = 0; i < 4; i++) {
            _loop_1(i);
        }
    };
    BoardUI.prototype.Update = function () {
        if (this.playerStartTimer > 0)
            this.playerStartTimer++;
        if (this.playerStartTimer == this.slideFrames * 2 + this.waitFrames) {
            this.currentMenu = BoardMenu.CreateTurnStartMenu();
        }
        if (this.isChoosingMinigame) {
            if (this.minigameTextTime == 140) {
                audioHandler.PlaySound("diceRoll", true);
            }
            if (this.minigameTextTime == 320) {
                audioHandler.StopSound("diceRoll");
                audioHandler.PlaySound("hit2", true);
            }
            this.minigameTextTime++;
            this.rouletteTheta += 0.1;
            if (this.minigameTextTime == 540 && this.board.pendingMinigame) {
                this.isChoosingMinigame = false;
                var minigame_1 = this.board.pendingMinigame;
                var tickDuration = minigame_1.GetRemainingTicks();
                if (playmode == PlayMode.host) {
                    cutsceneService.AddScene(new Instructions(this.board.pendingMinigame), new BoardCutSceneSingleAction(function () {
                        audioHandler.SetBackgroundMusic(minigame_1.songId);
                    }), new BoardCutScenePadding(tickDuration), new BoardCutSceneMinigameResults());
                }
                else if (playmode == PlayMode.playinghost) {
                    cutsceneService.AddScene(new Instructions(this.board.pendingMinigame));
                }
            }
        }
        else {
            this.minigameTextTime = 0;
            this.rouletteTheta = 0;
        }
        if (cutsceneService.isCutsceneActive)
            return;
        if (this.roundStarttimer > 0) {
            if (this.roundStarttimer == 1) {
                audioHandler.PlaySound("roundStart", false);
                audioHandler.SetBackgroundMusic(board.songId);
            }
            this.roundStarttimer++;
            if (this.roundStarttimer > 100) {
                this.roundStarttimer = 0;
                this.board.CurrentPlayerTurnEnd();
            }
        }
        this.dice.forEach(function (a) { return a.Update(); });
        if (this.dice.some(function (a) { return !a.IsStopped(); })) {
            this.rollTimer++;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) || this.rollTimer > 40) {
                this.rollTimer = 0;
                var d = this.dice.find(function (a) { return !a.IsStopped(); });
                if (d) {
                    d.Stop();
                    if (this.dice.every(function (a) { return a.IsStopped(); })) {
                        audioHandler.StopSound("diceRoll");
                    }
                }
            }
        }
        if (this.dice.length > 0 && this.dice.every(function (a) { return a.IsDoneAnimating(); }) && cutsceneService.cutscenes.length == 0) {
            if (this.combineTimer == 0)
                this.dice.forEach(function (a) { return a.HideDie(); });
            var moveScale = [1.05, 1.03, 1.01, 0.99, 0.98, 0.95][this.combineTimer] || 0.9;
            for (var _i = 0, _a = this.dice; _i < _a.length; _i++) {
                var die = _a[_i];
                if (die.x !== 0) {
                    die.x *= moveScale;
                }
            }
            this.combineTimer++;
            if (this.combineTimer == 20) {
                audioHandler.PlaySound("hit2", true);
                this.combinedNumber = this.dice.map(function (a) { return a.chosenValue; }).reduce(function (a, b) { return a + b; }, 0);
                this.dice = [];
                if (this.board.currentPlayer)
                    this.board.currentPlayer.statDiceTotal += this.combinedNumber;
            }
        }
        if (this.combinedNumber > 0) {
            this.combineTimer++;
            this.combinedNumberScale = Math.sin(Math.PI * (this.combineTimer - 20) / 20) + 1;
            if (this.combineTimer > 40)
                this.combinedNumberScale = 1;
            if (this.combineTimer >= 80 && this.board.currentPlayer) {
                this.board.currentPlayer.amountOfMovementLeft = this.combinedNumber;
                this.Clear();
            }
        }
        // item menu handling
        if (this.currentMenu) {
            this.currentMenu.Update();
        }
    };
    BoardUI.prototype.DrawForSpectator = function (ctx) {
        this.DrawScoreboard(ctx);
        if (this.currentMenu)
            this.currentMenu.Draw(ctx);
    };
    BoardUI.prototype.Draw = function (ctx) {
        var _this = this;
        var _a;
        if (cutsceneService.isCutsceneActive)
            return;
        if (this.playerStartTimer > 0) {
            var turnStartName = tiles["turnStartText"][this.useAltStartText ? 1 : 0][((_a = this.board.currentPlayer) === null || _a === void 0 ? void 0 : _a.avatarIndex) || 0];
            var x = Math.pow((this.playerStartTimer - this.slideFrames), 2);
            if (this.playerStartTimer > this.slideFrames && this.playerStartTimer < this.slideFrames + this.waitFrames)
                x = 0;
            if (this.playerStartTimer >= this.slideFrames + this.waitFrames)
                x = -(Math.pow((this.playerStartTimer - this.slideFrames - this.waitFrames), 2));
            var y = -50;
            turnStartName.Draw(this.uiCamera, x, y, 1, 1, false, false, 0);
        }
        this.dice.forEach(function (a) { return a.Draw(_this.uiCamera); });
        if (this.combinedNumber > 0) {
            DrawNumber(0, -100, this.combinedNumber, this.uiCamera, this.combinedNumberScale);
        }
        if (this.roundStarttimer > 0)
            this.DrawRoundStart(ctx);
        if (this.currentMenu)
            this.currentMenu.Draw(ctx);
        if (this.roundStarttimer == 0) {
            this.DrawScoreboard(ctx);
        }
        if (this.isChoosingMinigame)
            this.DrawMinigameChoose(ctx);
    };
    BoardUI.prototype.DrawRoundStart = function (ctx) {
        var fontSize = 72 + (20 - this.roundStarttimer) * 100;
        if (this.roundStarttimer >= 20)
            fontSize = 72;
        if (this.roundStarttimer > 80)
            fontSize = (this.roundStarttimer - 80) * -4 + 72;
        if (fontSize > 0) {
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#FFF";
            ctx.lineWidth = 12;
            ctx.font = "900 " + fontSize + "px " + "arial";
            ctx.textAlign = "center";
            var text = "ROUND " + this.board.currentRound + " START";
            var lastXRound = this.board.finalRound - this.board.currentRound + 1;
            if (lastXRound <= 5)
                text = "LAST " + lastXRound + " ROUNDS";
            if (lastXRound == 1)
                text = "FINAL ROUND!";
            ctx.strokeText(text, 480, 270);
            ctx.fillText(text, 480, 270);
            ctx.textBaseline = "alphabetic";
        }
    };
    BoardUI.prototype.DrawScoreboard = function (ctx) {
        var x = 510;
        var _loop_2 = function (turn) {
            var player = this_2.board.players.find(function (a) { return a.turnOrder == turn; });
            if (player) {
                if (player == this_2.board.currentPlayer) {
                    ctx.fillStyle = "#0008";
                    ctx.fillRect(x - 25, 65, 110, -100);
                }
                var gearIcon = tiles["uiSmallIcons"][0][0];
                gearIcon.Draw(this_2.uiCamera, x - 480 + 35, -247 - 8, 1, 1, false, false, 0);
                var coinIcon = tiles["uiSmallIcons"][0][1];
                coinIcon.Draw(this_2.uiCamera, x - 480 + 35, -247 + 10, 1, 1, false, false, 0);
                ctx.fillStyle = "#FFF";
                var image = tiles["playerIcons"][player.avatarIndex][0];
                image.Draw(this_2.uiCamera, x - 480, -247, 0.2, 0.2, false, false, 0);
                ctx.textAlign = "right";
                ctx.font = "600 " + 14 + "px " + "arial";
                ctx.fillText(player.gears.toString(), x + 75, 20);
                ctx.fillText(player.displayedCoins.toString(), x + 75, 37);
                ctx.fillRect(x - 20, 45, 100, 1);
                ctx.textAlign = "left";
                ctx.font = "800 " + 14 + "px " + "arial";
                ctx.fillText(player.CurrentPlaceText(), x - 20, 58);
                var diceIcons = player.diceBag.GetDiceSprites();
                var diceX = x - 460;
                for (var _i = 0, diceIcons_1 = diceIcons; _i < diceIcons_1.length; _i++) {
                    var diceIcon = diceIcons_1[_i];
                    diceIcon.GetImage().Draw(this_2.uiCamera, diceX, -215, 0.15, 0.15, false, false, 0);
                    diceX += 15;
                }
                var itemX = x - 425;
                var itemSpacing = 30 / player.inventory.length;
                for (var _a = 0, _b = player.inventory; _a < _b.length; _a++) {
                    var item = _b[_a];
                    item.imageTile.Draw(this_2.uiCamera, itemX, -215, 0.15, 0.15, false, false, 0);
                    itemX += itemSpacing;
                }
            }
            x += 120;
        };
        var this_2 = this;
        for (var turn = 1; turn <= 4; turn++) {
            _loop_2(turn);
        }
    };
    BoardUI.prototype.DrawMinigameChoose = function (ctx) {
        var textImage = tiles["minigameText"][0][0];
        var titleY = Math.pow((this.minigameTextTime - 60), 2);
        if (this.minigameTextTime > 60 && this.minigameTextTime < 120)
            titleY = 0;
        if (this.minigameTextTime >= 120 && this.minigameTextTime < 180)
            titleY = (1 - Math.cos((this.minigameTextTime - 120) / 60 * Math.PI)) * -75;
        if (this.minigameTextTime >= 180)
            titleY = -150;
        textImage.Draw(this.uiCamera, 0, titleY, 1, 1, false, false, 0);
        var rouletteCenterY = titleY + 200;
        if (this.minigameTextTime < 180)
            rouletteCenterY += Math.pow((180 - this.minigameTextTime), 2);
        ctx.font = 20 + "px " + "arial";
        ctx.textAlign = "center";
        var largeRadius = 1;
        var smallRadius = 1;
        if (this.minigameTextTime > 300) {
            largeRadius = 1 + (this.minigameTextTime - 300) / 10;
            smallRadius = 1 - (this.minigameTextTime - 300) / 100;
        }
        if (this.minigameTextTime > 400) {
            smallRadius = 0;
        }
        for (var i = 0; i < this.currentRouletteTexts.length; i++) {
            var theta = i * (Math.PI * 2 / this.currentRouletteTexts.length) + (this.rouletteTheta);
            var text = this.currentRouletteTexts[i];
            var x = (i == 0 ? smallRadius : largeRadius) * 300 * Math.cos(theta) + this.uiCamera.canvas.width / 2;
            var y = (i == 0 ? smallRadius : largeRadius) * 100 * Math.sin(theta) + rouletteCenterY + this.uiCamera.canvas.height / 2;
            ctx.fillStyle = "#000";
            ctx.fillRect(x - 180, y - 35, 360, 50);
            ctx.fillStyle = "#FFF";
            ctx.fillText(text, x, y);
        }
        if (this.minigameTextTime > 440) {
            var opacity = Math.min(1, (this.minigameTextTime - 400) / 100);
            ctx.fillStyle = "rgba(0, 0, 0, " + opacity.toFixed(2) + ")";
            ctx.fillRect(0, 0, 960, 540);
        }
    };
    return BoardUI;
}());
var DiceSprite = /** @class */ (function (_super) {
    __extends(DiceSprite, _super);
    function DiceSprite(x, y, faces, isFragile) {
        var _this = _super.call(this, x, y) || this;
        _this.x = x;
        _this.y = y;
        _this.faces = faces;
        _this.isFragile = isFragile;
        _this.width = 0;
        _this.height = 0;
        _this.frame = 0;
        _this._isStopped = false;
        _this.chosenValue = 0;
        _this.framesSinceStop = 0;
        _this.isHiding = false;
        _this.dieScale = 1.5;
        return _this;
    }
    DiceSprite.prototype.GetFrameData = function (frameNum) {
        throw new Error("Method not implemented.");
    };
    DiceSprite.prototype.IsDoneAnimating = function () { return this._isStopped && this.framesSinceStop > 20; };
    DiceSprite.prototype.IsStopped = function () { return this._isStopped; };
    DiceSprite.prototype.HideDie = function () {
        this.isHiding = true;
    };
    DiceSprite.prototype.Update = function () {
        if (this._isStopped) {
            this.framesSinceStop++;
        }
        else {
            this.frame++;
        }
        if (this.isHiding) {
            this.dieScale -= 0.04;
            if (this.dieScale < 0)
                this.dieScale = 0;
        }
    };
    DiceSprite.prototype.Stop = function () {
        audioHandler.PlaySound("hit1", true);
        this._isStopped = true;
        this.frame = 0;
        this.chosenValue = Math.ceil(Math.random() * this.faces);
    };
    DiceSprite.prototype.GetImage = function (offset) {
        if (offset === void 0) { offset = 0; }
        var frameSheet = "d" + this.faces.toString();
        if (this.isFragile)
            frameSheet += "-fragile";
        var frame = this.frame + offset;
        var f = Math.floor(frame) % 48;
        var row = f % 6;
        var col = Math.floor(f / 6);
        return tiles[frameSheet][col][row];
    };
    DiceSprite.prototype.Draw = function (camera) {
        var dieImage = this.GetImage();
        if (this.dieScale > 0) {
            dieImage.Draw(camera, this.x, this.y, this.dieScale, this.dieScale, false, false, 0);
        }
        if (this._isStopped) {
            var digitScale = 1;
            if (this.framesSinceStop < 20) {
                digitScale = Math.sin(Math.PI * this.framesSinceStop / 20) + 1;
            }
            DrawNumber(this.x, this.y, this.chosenValue, camera, digitScale);
        }
    };
    return DiceSprite;
}(Sprite));
function DrawNumber(centerX, centerY, number, camera, scale) {
    DrawText(centerX, centerY, number.toString(), camera, scale, 2);
}
function DrawText(centerX, centerY, text, camera, scale, color) {
    var x = (text.length - 1) / 2 * -65 * scale;
    for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
        var char = text_1[_i];
        if ('0123456789+-'.indexOf(char) == -1) {
            console.error("invalid char", char);
            return;
        }
        var col = +char;
        if (char == "+")
            col = 10;
        if (char == "-")
            col = 11;
        var digitImage = tiles["digits"][col][color];
        digitImage.Draw(camera, centerX + x, centerY, scale, scale, false, false, 0);
        x += 65 * scale;
    }
}
