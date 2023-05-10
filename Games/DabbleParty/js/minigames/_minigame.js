"use strict";
var MinigameBase = /** @class */ (function () {
    function MinigameBase() {
        this.backdropTile = tiles["forest"][0][0];
        this.sprites = [];
        this.initialized = false;
        this.timer = -360;
        this.overlayTextSprite = null;
    }
    MinigameBase.prototype.BaseUpdate = function () {
        if (!this.initialized) {
            this.Initialize();
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
            spr.Update();
        }
        this.Update();
        this.sprites = this.sprites.filter(function (a) { return a.isActive; });
    };
    MinigameBase.prototype.Draw = function (camera) {
        this.backdropTile.Draw(camera, camera.x, camera.y, 1, 1, false, false, 0);
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var spr = _a[_i];
            spr.Draw(camera);
        }
    };
    MinigameBase.prototype.SubmitScore = function (score) {
        // TODO
        console.log(score);
    };
    return MinigameBase;
}());
