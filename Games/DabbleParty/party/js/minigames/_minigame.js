"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var MinigameBase = /** @class */ (function () {
    function MinigameBase() {
        this.sprites = [];
        this.initialized = false;
        this.isFreePlay = false;
        this.timer = -360;
        this.score = 0;
        this.isEnded = false;
        this.endTimer = 0;
        this.overlayTextSprite = null;
    }
    MinigameBase.prototype.BaseUpdate = function () {
        if (!this.initialized) {
            audioHandler.SetBackgroundMusic(this.songId);
            camera.targetX = 0;
            camera.targetY = 0;
            camera.scale = 1;
            this.Initialize();
            camera.x = camera.targetX;
            camera.y = camera.targetY;
            this.initialized = true;
        }
        if (this.timer == -240) {
            this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][0], function (s) {
                s.x = camera.x;
                s.y = camera.y;
            });
            this.sprites.push(this.overlayTextSprite);
        }
        if (this.timer == -90) {
            if (this.overlayTextSprite)
                this.overlayTextSprite.isActive = false;
            this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][1], function (s) {
                s.x = camera.x;
                s.y = camera.y;
                s.Scale(0.95);
            }).Scale(2);
            this.sprites.push(this.overlayTextSprite);
        }
        if (this.timer == 0) {
            if (this.overlayTextSprite)
                this.overlayTextSprite.isActive = false;
        }
        this.timer++;
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var spr = _a[_i];
            spr.age++;
            spr.Update();
        }
        this.Update();
        this.sprites = this.sprites.filter(function (a) { return a.isActive; });
        if (this.isEnded) {
            this.endTimer++;
            if (this.endTimer > 30 + 120 + 60) {
                currentMinigame = null;
                audioHandler.SetBackgroundMusic("lobby");
                if (this.isFreePlay) {
                    var mainMenu = new CutsceneMainMenu();
                    mainMenu.menuHandler.Initialize();
                    mainMenu.menuHandler.OpenPage(5);
                    mainMenu.menuHandler.cursorTarget = mainMenu.menuHandler.FindById("minigameSelect");
                    cutsceneService.AddScene(mainMenu);
                }
                else {
                    cutsceneService.AddScene(new BoardCutSceneFadeIn());
                }
            }
        }
    };
    MinigameBase.prototype.OnAfterDraw = function (camera) { };
    MinigameBase.prototype.OnBeforeDrawSprites = function (camera) { };
    MinigameBase.prototype.Draw = function (camera) {
        this.backdropTile.Draw(camera, camera.x, camera.y, 1, 1, false, false, 0);
        this.OnBeforeDrawSprites(camera);
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var spr = _a[_i];
            spr.Draw(camera);
        }
        this.OnAfterDraw(camera);
        // this.DrawScore(camera);
        if (this.endTimer > 0) {
            var overlayOpacity = Math.max(0, Math.min(1, (this.endTimer - 120) / 30));
            camera.ctx.fillStyle = "rgba(0, 0, 0, " + overlayOpacity.toFixed(2) + ")";
            camera.ctx.fillRect(0, 0, 960, 540);
        }
        if (this.timer > 0) {
            var ticksLeft_1 = this.GetRemainingTicks();
            var secondsLeft = Math.ceil(ticksLeft_1 / 60);
            var bounce = 0;
            if (secondsLeft == 30 || secondsLeft <= 3) {
                if (ticksLeft_1 % 60 > 40)
                    bounce = Math.sin(ticksLeft_1 / 5) / 5;
            }
            if (ticksLeft_1 == 30 * 60 || ticksLeft_1 == 0) {
                audioHandler.PlaySound("roundStart", true);
            }
            if ([3, 2, 1].some(function (a) { return ticksLeft_1 == a * 60; })) {
                audioHandler.PlaySound("swim", true);
            }
            if (secondsLeft > 0) {
                DrawNumber(-440, -235, secondsLeft, new Camera(camera.canvas), 0.5 + bounce);
            }
        }
    };
    MinigameBase.prototype.SubmitScore = function (score) {
        if (this.isEnded)
            return;
        if (board) {
            DataService.SubmitScore(board.gameId, score, board.currentRound).then(function () {
                if (board)
                    board.SpectateUpdateLoop(true);
            });
        }
        this.isEnded = true;
        this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][2], function (s) {
            s.x = camera.x;
            s.y = camera.y;
        });
        this.sprites.push(this.overlayTextSprite);
    };
    MinigameBase.prototype.DrawScore = function (camera) {
        if (this.score <= 0)
            return;
        var fontSize = 24;
        //if (this.isEnded) fontSize = 96;
        camera.ctx.font = fontSize + "px " + "arial";
        camera.ctx.textAlign = "right";
        camera.ctx.strokeStyle = "#FFF";
        camera.ctx.fillStyle = "#0006";
        var textWidth = camera.ctx.measureText(Math.floor(this.score).toString()).width;
        var width = Math.max(100, textWidth + 20);
        camera.ctx.fillRect(camera.canvas.width, camera.canvas.height, -width, -(fontSize + fontSize / 4));
        // if (this.isEnded) {
        //     camera.ctx.strokeRect(camera.canvas.width, camera.canvas.height, -width, -(fontSize + fontSize/4));
        // }
        camera.ctx.fillStyle = "#FFF9";
        camera.ctx.fillText(Math.floor(this.score).toString(), camera.canvas.width - 5, camera.canvas.height - fontSize / 4);
    };
    return MinigameBase;
}());
var MinigameGenerator = /** @class */ (function () {
    function MinigameGenerator() {
    }
    MinigameGenerator.RandomGame = function () {
        if (MinigameGenerator.CurrentPool.length == 0) {
            MinigameGenerator.CurrentPool = __spreadArrays(minigames);
        }
        var games = MinigameGenerator.CurrentPool;
        var i = Math.floor(Math.random() * games.length);
        var game = games[i];
        MinigameGenerator.CurrentPool = MinigameGenerator.CurrentPool.filter(function (a) { return a !== game; });
        return new game();
    };
    MinigameGenerator.CurrentPool = [];
    return MinigameGenerator;
}());
