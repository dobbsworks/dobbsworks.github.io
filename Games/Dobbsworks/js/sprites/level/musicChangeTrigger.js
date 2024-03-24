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
var MusicChangeTrigger = /** @class */ (function (_super) {
    __extends(MusicChangeTrigger, _super);
    function MusicChangeTrigger(x, y, layer, editorProps) {
        var _this = _super.call(this, x, y, layer, editorProps) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        _this.uiArrowIndex = 6;
        _this.crossfadeSpeed = 1;
        _this.songIndex = -1;
        _this.songIndex = +(editorProps[0]);
        if (isNaN(_this.songIndex))
            _this.songIndex = -1;
        return _this;
    }
    MusicChangeTrigger.prototype.GetThumbnail = function () {
        return tiles["editor"][6][9];
    };
    MusicChangeTrigger.prototype.Update = function () {
        if (this.IsOnScreen(0)) {
            if (this.songIndex >= 0) {
                audioHandler.SetCrossfadeBackgroundMusic(audioHandler.levelSongList[this.songIndex]);
                audioHandler.crossfadeSpeed = this.crossfadeSpeed;
            }
            this.isActive = false;
        }
    };
    MusicChangeTrigger.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            if (this.songIndex == -1) {
                return [{
                        imageTile: tiles["editor"][6][9],
                        xFlip: false,
                        yFlip: false,
                        xOffset: 0,
                        yOffset: 0
                    }];
            }
            return [{
                    imageTile: tiles["musicnotes"][this.songIndex % 6][Math.floor(this.songIndex / 6)],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 0,
                    yOffset: 0
                }, {
                    imageTile: tiles["editor"][this.uiArrowIndex][2],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 0,
                    yOffset: 0
                }];
        }
        else {
            return [{
                    imageTile: tiles["empty"][0][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 0,
                    yOffset: 0
                }];
        }
    };
    return MusicChangeTrigger;
}(Sprite));
var MusicFadeTrigger = /** @class */ (function (_super) {
    __extends(MusicFadeTrigger, _super);
    function MusicFadeTrigger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.uiArrowIndex = 2;
        _this.crossfadeSpeed = 0.01;
        return _this;
    }
    return MusicFadeTrigger;
}(MusicChangeTrigger));
