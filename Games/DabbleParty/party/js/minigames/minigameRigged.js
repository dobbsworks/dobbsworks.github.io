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
var RopeConnection = /** @class */ (function () {
    function RopeConnection(x1, x2, y) {
        this.x1 = x1;
        this.x2 = x2;
        this.y = y;
    }
    return RopeConnection;
}());
var RopeMaze = /** @class */ (function () {
    function RopeMaze(numColumns, numConnections) {
        this.numColumns = numColumns;
        this.margin = 30;
        this.width = 600;
        this.height = 350;
        this.xDist = 0;
        this.xBase = 0;
        this.yDist = 0;
        this.yBase = 0;
        this.connections = [];
        this.xBase = camera.canvas.width / 2 - this.width / 2;
        this.yBase = camera.canvas.height / 2 - this.height / 2;
        this.xDist = this.width / (numColumns - 1);
        this.yDist = (this.height - this.margin * 2) / (numConnections - 1);
        for (var i = 0; i < numConnections; i++) {
            var index = Random.GetRandInt(0, numColumns - 2);
            var x1 = this.xBase + index * this.xDist;
            var x2 = x1 + this.xDist;
            var y = this.yBase + i * this.yDist;
            var connection = new RopeConnection(x1, x2, y);
            this.connections.push(connection);
        }
    }
    RopeMaze.prototype.Draw = function (camera) {
        camera.ctx.strokeStyle = "#9c4805";
        camera.ctx.lineWidth = 8;
        for (var i = 0; i < this.numColumns; i++) {
            camera.ctx.beginPath();
            camera.ctx.moveTo(this.xBase + i * this.xDist, this.yBase);
            camera.ctx.lineTo(this.xBase + i * this.xDist, this.yBase + this.height);
            camera.ctx.stroke();
        }
        for (var _i = 0, _a = this.connections; _i < _a.length; _i++) {
            var connection = _a[_i];
            camera.ctx.beginPath();
            camera.ctx.moveTo(connection.x1, connection.y + this.margin);
            camera.ctx.lineTo(connection.x2, connection.y + this.margin);
            camera.ctx.stroke();
        }
    };
    return RopeMaze;
}());
var MinigameRigged = /** @class */ (function (_super) {
    __extends(MinigameRigged, _super);
    function MinigameRigged() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Rigged";
        _this.instructions = [
            "Ahoy! Select the rope that will lead to the gold",
            "dobbloon! The coin will follow the path down, but",
            "always takes side routes."
        ];
        _this.backdropTile = tiles["bgRigged"][0][0];
        _this.thumbnail = tiles["thumbnails"][0][0];
        _this.controls = [
            new InstructionControl(Control.Horizontal, "Change Rope"),
            new InstructionControl(Control.Button, "Confirm Choice")
        ];
        _this.songId = "carnival";
        _this.currentMaze = new RopeMaze(5, 10);
        _this.currentSelectionIndex = 0;
        _this.isChoosing = false;
        _this.dropCount = 0;
        _this.arrowSprite = new SimpleSprite(0, 0, tiles["boardArrow"][playerIndex][0]);
        _this.coin = new SimpleSprite(0, -400, tiles["dobbloon"][0][0], function (spr) {
            spr.Animate(0.25);
        }).Scale(0.5);
        _this.coinTarget = null;
        return _this;
    }
    MinigameRigged.prototype.Initialize = function () {
        this.GenerateMaze();
        this.arrowSprite.rotation = -Math.PI / 2;
        this.sprites.push(this.arrowSprite, this.coin);
    };
    MinigameRigged.prototype.GenerateMaze = function () {
        var ropeCount = 3 + Math.floor(this.dropCount * 0.6);
        var conns = 6 + this.dropCount * 2;
        this.currentMaze = new RopeMaze(ropeCount, conns);
    };
    MinigameRigged.prototype.PlaceCoin = function () {
        this.isChoosing = true;
        this.coin.y = -200;
        this.coin.x = this.currentMaze.xBase - camera.canvas.width / 2 + this.currentMaze.xDist * Random.GetRandInt(0, this.currentMaze.numColumns - 1);
        this.coinTarget = null;
    };
    MinigameRigged.prototype.SetVerticalConnection = function () {
        var mappedX = this.coin.x + camera.canvas.width / 2;
        var mappedY = this.coin.y + camera.canvas.height / 2;
        var potentialTargets = this.currentMaze.connections.filter(function (a) { return a.x1 == mappedX || a.x2 == mappedX; });
        var potentialYs = potentialTargets.map(function (a) { return a.y; }).filter(function (a) { return a > mappedY + 1; });
        potentialYs.sort(function (a, b) { return a - b; });
        if (potentialYs.length > 0) {
            this.coinTarget = { x: mappedX, y: potentialYs[0] };
        }
        else {
            this.coinTarget = { x: mappedX, y: 500 };
        }
    };
    MinigameRigged.prototype.CoinMovement = function () {
        if (this.coinTarget == null) {
            this.SetVerticalConnection();
        }
        if (this.coinTarget) {
            var speed = 3 + this.dropCount * 1;
            var targetX = this.coinTarget.x - camera.canvas.width / 2;
            var targetY = this.coinTarget.y - camera.canvas.height / 2;
            var wasMovingVertically = this.coin.x == targetX;
            if (Math.abs(targetX - this.coin.x) <= speed) {
                this.coin.x = targetX;
            }
            else {
                if (targetX > this.coin.x) {
                    this.coin.x += speed;
                }
                else {
                    this.coin.x -= speed;
                }
            }
            if (Math.abs(targetY - this.coin.y) <= speed) {
                this.coin.y = targetY;
            }
            else {
                if (targetY > this.coin.y) {
                    this.coin.y += speed;
                }
                else {
                    this.coin.y -= speed;
                }
            }
            if (this.coin.x == targetX && this.coin.y == targetY) {
                // hit target!
                var coinY_1 = this.coinTarget.y;
                var coinX = this.coinTarget.x;
                if (wasMovingVertically) {
                    var conn = this.currentMaze.connections.filter(function (a) { return a.y == coinY_1; })[0];
                    if (conn) {
                        var newTargetX = conn.x1 == coinX ? conn.x2 : conn.x1;
                        this.coinTarget = { x: newTargetX, y: coinY_1 };
                    }
                }
                else {
                    this.SetVerticalConnection();
                }
            }
        }
        if (this.coin.y == 230) {
            if (this.coin.x == this.arrowSprite.x) {
                // yay!
                audioHandler.PlaySound("dobbloon", false);
                this.score++;
            }
            this.GenerateMaze();
            this.PlaceCoin();
            this.isChoosing = true;
        }
    };
    MinigameRigged.prototype.Update = function () {
        if (this.timer == 0) {
            this.PlaceCoin();
        }
        if (this.isChoosing || this.timer < 0) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true)) {
                this.currentSelectionIndex--;
                if (this.currentSelectionIndex < 0) {
                    this.currentSelectionIndex = 0;
                }
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true)) {
                this.currentSelectionIndex++;
                if (this.currentSelectionIndex >= this.currentMaze.numColumns) {
                    this.currentSelectionIndex = this.currentMaze.numColumns - 1;
                }
            }
        }
        if (this.isChoosing) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.isChoosing = false;
                this.dropCount++;
            }
        }
        if (!this.isChoosing && this.timer >= 0 && this.GetRemainingTicks() > 0) {
            this.CoinMovement();
        }
        this.arrowSprite.x = this.currentMaze.xBase + this.currentSelectionIndex * this.currentMaze.xDist - camera.canvas.width / 2;
        this.arrowSprite.y = 240;
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    MinigameRigged.prototype.GetRemainingTicks = function () {
        return 60 * 60 - this.timer;
    };
    MinigameRigged.prototype.OnBeforeDrawSprites = function (camera) {
        this.currentMaze.Draw(camera);
    };
    return MinigameRigged;
}(MinigameBase));
