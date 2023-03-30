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
var BaddleTrigger = /** @class */ (function (_super) {
    __extends(BaddleTrigger, _super);
    function BaddleTrigger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 36;
        _this.width = 36;
        _this.respectsSolidTiles = false;
        return _this;
    }
    BaddleTrigger.prototype.Update = function () {
        if (player) {
            if (player.Overlaps(this)) {
                this.isActive = false;
                // find target
                var target_1 = player;
                while (this.layer.sprites.find(function (a) { return a instanceof Baddle && a.target == target_1; })) {
                    target_1 = this.layer.sprites.find(function (a) { return a instanceof Baddle && a.target == target_1; });
                }
                // create Baddle
                var baddle = new Baddle(target_1.x, target_1.y, target_1.layer, []);
                baddle.target = target_1;
                this.layer.sprites.push(baddle);
            }
        }
    };
    BaddleTrigger.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["baddleTrigger"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
    };
    return BaddleTrigger;
}(Sprite));
var Baddle = /** @class */ (function (_super) {
    __extends(Baddle, _super);
    function Baddle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 5;
        _this.respectsSolidTiles = false;
        _this.damagesPlayer = false;
        _this.killedByProjectiles = false;
        _this.target = null;
        _this.storedFrames = [];
        _this.pulledFrame = null;
        return _this;
    }
    Baddle.prototype.Update = function () {
        var _a;
        if (!((_a = this.target) === null || _a === void 0 ? void 0 : _a.isActive)) {
            this.ReplaceWithSpriteType(Poof);
        }
        if (this.target) {
            this.storedFrames.push({ fd: this.target.GetFrameData(currentMap.frameNum), x: this.target.x, y: this.target.y });
            var frameLength = (this.target instanceof Player ? 50 : 12);
            if (this.storedFrames.length >= frameLength) {
                this.damagesPlayer = true;
                var storedFrame = this.storedFrames.shift();
                if (storedFrame) {
                    this.pulledFrame = storedFrame.fd;
                    this.x = storedFrame.x;
                    this.y = storedFrame.y;
                }
            }
        }
    };
    Baddle.prototype.GetFrameData = function (frameNum) {
        if (this.pulledFrame == null) {
            return {
                imageTile: tiles["baddle"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 1,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["baddle"][this.pulledFrame.imageTile.xSrc / 7][this.pulledFrame.imageTile.ySrc / 9],
            xFlip: this.pulledFrame.xFlip,
            yFlip: this.pulledFrame.yFlip,
            xOffset: 1,
            yOffset: 0
        };
    };
    return Baddle;
}(Enemy));
