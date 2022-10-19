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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Checkpoint = /** @class */ (function (_super) {
    __extends(Checkpoint, _super);
    function Checkpoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.flagWaveTimer = 0;
        _this.isCollected = false;
        _this.waveSpeed = 0;
        _this.waveSpeedInitial = 2.1;
        return _this;
    }
    Checkpoint.prototype.Update = function () {
        var _this = this;
        this.flagWaveTimer += this.waveSpeed;
        this.waveSpeed *= 0.95;
        if (!this.isCollected && player) {
            if (player.IsGoingToOverlapSprite(this)) {
                // uncollect all flags
                var flags = this.layer.sprites.filter(function (a) { return a instanceof Checkpoint && a.isCollected; });
                flags.forEach(function (a) {
                    a.isCollected = false;
                    a.waveSpeed = -_this.waveSpeedInitial;
                    a.flagWaveTimer = 42;
                });
                this.isCollected = true;
                audioHandler.PlaySound("checkpoint", false);
                var originalPlace = editorHandler.sprites.find(function (a) { return a.spriteInstance == _this; });
                if (originalPlace) {
                    // don't use flag's current location since could be changed by motors, etc
                    editorHandler.grabbedCheckpointLocation = __assign({}, originalPlace.tileCoord);
                }
                this.waveSpeed = this.waveSpeedInitial;
                this.flagWaveTimer = 0;
            }
        }
    };
    Checkpoint.prototype.GetFrameData = function (frameNum) {
        var col = Math.abs(Math.floor(this.flagWaveTimer / 5)) % 5;
        return {
            imageTile: tiles["flag"][col][this.isCollected ? 1 : 0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return Checkpoint;
}(Sprite));
