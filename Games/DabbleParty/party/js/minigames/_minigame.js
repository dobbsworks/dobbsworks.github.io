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
        this.timer = -360;
        this.score = 0;
        this.isEnded = false;
        this.endTimer = 0;
        this.overlayTextSprite = null;
    }
    MinigameBase.prototype.BaseUpdate = function () {
        if (!this.initialized) {
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
                cutsceneService.AddScene(new BoardCutSceneFadeIn());
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
        this.DrawScore(camera);
        if (this.endTimer > 0) {
            var overlayOpacity = Math.max(0, Math.min(1, (this.endTimer - 120) / 30));
            camera.ctx.fillStyle = "rgba(0, 0, 0, " + overlayOpacity.toFixed(2) + ")";
            camera.ctx.fillRect(0, 0, 960, 540);
        }
    };
    MinigameBase.prototype.SubmitScore = function (score) {
        if (this.isEnded)
            return;
        if (board) {
            DataService.SubmitScore(board.gameId, score, board.currentRound).then(function () {
                // no callback
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
        if (this.isEnded)
            fontSize = 96;
        camera.ctx.font = fontSize + "px " + "arial";
        camera.ctx.textAlign = "right";
        camera.ctx.strokeStyle = "#FFF";
        camera.ctx.fillStyle = "#0006";
        var textWidth = camera.ctx.measureText(Math.floor(this.score).toString()).width;
        var width = Math.max(100, textWidth + 20);
        camera.ctx.fillRect(camera.canvas.width, camera.canvas.height, -width, -(fontSize + fontSize / 4));
        if (this.isEnded) {
            camera.ctx.strokeRect(camera.canvas.width, camera.canvas.height, -width, -(fontSize + fontSize / 4));
        }
        camera.ctx.fillStyle = "#FFF9";
        camera.ctx.fillText(Math.floor(this.score).toString(), camera.canvas.width - 5, camera.canvas.height - fontSize / 4);
    };
    return MinigameBase;
}());
var MinigameGenerator = /** @class */ (function () {
    function MinigameGenerator() {
    }
    MinigameGenerator.RandomGame = function () {
        var games = __spreadArrays(minigames);
        var i = Math.floor(Math.random() * games.length);
        var game = games[i];
        return new game();
    };
    return MinigameGenerator;
}());