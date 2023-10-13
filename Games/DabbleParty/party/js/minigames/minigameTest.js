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
var MinigameTest = /** @class */ (function (_super) {
    __extends(MinigameTest, _super);
    function MinigameTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "test";
        _this.instructions = [];
        _this.backdropTile = tiles["bgParty"][0][0];
        _this.thumbnail = tiles["thumbnails"][0][0];
        _this.controls = [];
        _this.songId = "silence";
        _this.times = [];
        return _this;
    }
    MinigameTest.prototype.Initialize = function () { };
    MinigameTest.prototype.Update = function () {
        this.times.push(+(new Date()));
        if (this.times.length > 200)
            this.times.shift();
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            for (var i = 0; i < 5; i++) {
                var x = (Math.random() - 0.5) * 960;
                var y = (Math.random() - 0.5) * 540;
                var s = new SimpleSprite(x, y, tiles["boardArrow"][0][0], function (q) { return q.rotation += 0.03; });
                this.sprites.push(s);
            }
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            for (var i = 0; i < 5; i++) {
                if (this.sprites.length > 0)
                    this.sprites.pop();
            }
        }
    };
    MinigameTest.prototype.OnAfterDraw = function (camera) {
        camera.ctx.font = "700 " + 32 + "px " + "arial";
        camera.ctx.fillStyle = "black";
        camera.ctx.textAlign = "left";
        camera.ctx.fillText("Press up/down to adjust sprite count.", 50, 300);
        camera.ctx.fillText("If you have >60 fps with 50 sprites you should be fine.", 50, 350);
        if (this.times.length > 1) {
            var totalTimeInMs = this.times[this.times.length - 1] - this.times[0];
            var frames_1 = this.times.length - 1;
            var fps = (frames_1 / totalTimeInMs * 1000).toFixed(0);
            camera.ctx.fillText("Estimated FPS: " + fps, 50, 450);
        }
        camera.ctx.fillText("Sprite count: " + this.sprites.length, 50, 500);
    };
    MinigameTest.prototype.GetRemainingTicks = function () {
        return 60 * 60; // - this.timer;
    };
    return MinigameTest;
}(MinigameBase));
