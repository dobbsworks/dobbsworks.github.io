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
var SpinRing = /** @class */ (function (_super) {
    __extends(SpinRing, _super);
    function SpinRing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 22;
        _this.respectsSolidTiles = false;
        _this.col = 0;
        _this.overlayType = ColorRingOverlay;
        _this.overlay = null;
        _this.spinTimer = 0;
        _this.animationOffset = 0;
        _this.isReusable = true;
        _this.rowOffset = 0;
        return _this;
    }
    SpinRing.prototype.Update = function () {
        if (!this.overlay) {
            this.overlay = (new this.overlayType(this.x, this.y, this.layer, []));
            this.layer.sprites.push(this.overlay);
        }
        if (this.spinTimer > 0) {
            this.spinTimer--;
            this.animationOffset += this.spinTimer / 2;
        }
        this.overlay.x = this.x;
        this.overlay.y = this.y;
        this.overlay.animationOffset = this.animationOffset;
    };
    SpinRing.prototype.OnPlayerUseSpinRing = function () {
        this.spinTimer = 30;
        if (!this.isReusable) {
            this.ReplaceWithSpriteType(Poof);
            if (this.overlay)
                this.overlay.isActive = false;
        }
    };
    SpinRing.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return [{
                    imageTile: tiles["colorRing"][0][0 + this.rowOffset],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 2,
                    yOffset: 1
                }, {
                    imageTile: tiles["colorRing"][1][0 + this.rowOffset],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 2,
                    yOffset: 1
                }];
        }
        var row = Math.floor((frameNum + this.animationOffset) / 5) % 3;
        return [{
                imageTile: tiles["colorRing"][this.col][row + this.rowOffset],
                xFlip: false,
                yFlip: false,
                xOffset: 2,
                yOffset: 1
            }];
    };
    SpinRing.prototype.GetThumbnail = function () {
        return tiles["colorRingThumb"][0][0 + this.rowOffset / 3];
    };
    return SpinRing;
}(Sprite));
var ColorRingOverlay = /** @class */ (function (_super) {
    __extends(ColorRingOverlay, _super);
    function ColorRingOverlay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.col = 1;
        _this.zIndex = 1;
        return _this;
    }
    ColorRingOverlay.prototype.Update = function () { };
    return ColorRingOverlay;
}(SpinRing));
var FragileSpinRing = /** @class */ (function (_super) {
    __extends(FragileSpinRing, _super);
    function FragileSpinRing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overlayType = FragileSpinRingOverlay;
        _this.rowOffset = 3;
        _this.isReusable = false;
        return _this;
    }
    return FragileSpinRing;
}(SpinRing));
var FragileSpinRingOverlay = /** @class */ (function (_super) {
    __extends(FragileSpinRingOverlay, _super);
    function FragileSpinRingOverlay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.col = 1;
        _this.zIndex = 1;
        return _this;
    }
    FragileSpinRingOverlay.prototype.Update = function () { };
    return FragileSpinRingOverlay;
}(FragileSpinRing));
