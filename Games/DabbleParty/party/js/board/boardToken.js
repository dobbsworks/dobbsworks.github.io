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
var BoardToken = /** @class */ (function (_super) {
    __extends(BoardToken, _super);
    function BoardToken(player) {
        var _this = _super.call(this, 0, 0) || this;
        _this.player = player;
        _this.width = 10;
        _this.height = 10;
        _this.z = 0;
        _this.xScale = 0.2;
        _this.yScale = 0.2;
        _this.currentSpace = null; // not for animating between moves
        _this.movementStartingSpace = null;
        _this.movementTargetSpace = null;
        _this.movementTimer = 0;
        _this.movementDuration = 20;
        return _this;
    }
    BoardToken.prototype.Update = function () {
        if (this.movementTargetSpace)
            this.latestSpace = this.movementTargetSpace;
        if (this.currentSpace)
            this.latestSpace = this.currentSpace;
        if (this.movementStartingSpace && this.movementTargetSpace) {
            var ratio = this.movementTimer / this.movementDuration;
            var x = this.movementStartingSpace.gameX * (1 - ratio) + this.movementTargetSpace.gameX * ratio;
            var y = this.movementStartingSpace.gameY * (1 - ratio) + this.movementTargetSpace.gameY * ratio;
            this.x = x;
            this.y = y;
            this.z = -20 * Math.sin(ratio * Math.PI);
            this.rotation = Math.sin(ratio * Math.PI) * 0.5;
            this.movementTimer++;
            if (this.movementTimer == this.movementDuration) {
                this.movementStartingSpace = null;
                this.currentSpace = this.movementTargetSpace;
                audioHandler.PlaySound("tap", true);
            }
        }
        else if (this.currentSpace) {
            this.x = this.currentSpace.gameX;
            this.y = this.currentSpace.gameY;
            this.z = 0;
        }
    };
    BoardToken.prototype.MoveToSpace = function (targetSpace) {
        if (this.currentSpace == null) {
            console.error("Can't move, not on space");
            return;
        }
        this.movementTargetSpace = targetSpace;
        this.movementStartingSpace = this.currentSpace;
        this.currentSpace = null;
        this.movementTimer = 0;
        var distanceBetweenSpaces = Math.sqrt(Math.pow((this.movementTargetSpace.gameX - this.movementStartingSpace.gameX), 2) +
            Math.pow((this.movementTargetSpace.gameY - this.movementStartingSpace.gameY), 2));
        this.movementDuration = Math.floor(distanceBetweenSpaces / 4);
        if (this.movementDuration < 20)
            this.movementDuration = 20;
    };
    BoardToken.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["boardTokens"][this.player.avatarIndex][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: this.z
        };
    };
    return BoardToken;
}(Sprite));
