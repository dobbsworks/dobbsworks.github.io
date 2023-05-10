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
var MinigameBase = /** @class */ (function () {
    function MinigameBase() {
        this.backdropTile = tiles["forest"][0][0];
        this.sprites = [];
        this.initialized = false;
    }
    MinigameBase.prototype.BaseUpdate = function () {
        if (!this.initialized) {
            this.Initialize();
            this.initialized = true;
        }
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var spr = _a[_i];
            spr.Update();
        }
    };
    MinigameBase.prototype.Draw = function (camera) {
        this.backdropTile.Draw(camera, 0, 0, 1, 1, false, false, 0);
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var spr = _a[_i];
            spr.Draw(camera);
        }
    };
    return MinigameBase;
}());
var MinigameMushroomBounce = /** @class */ (function (_super) {
    __extends(MinigameMushroomBounce, _super);
    function MinigameMushroomBounce() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MinigameMushroomBounce.prototype.Initialize = function () {
        this.sprites.push(new SimpleSprite(0, 0, tiles["droppingItems"][0][0], function (spr) { spr.y += 1; }));
    };
    MinigameMushroomBounce.prototype.Update = function () {
    };
    return MinigameMushroomBounce;
}(MinigameBase));
