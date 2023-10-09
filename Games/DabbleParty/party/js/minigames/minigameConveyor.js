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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var MinigameConveyor = /** @class */ (function (_super) {
    __extends(MinigameConveyor, _super);
    function MinigameConveyor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Conveyor Surveyor";
        _this.instructions = [
            "Sort as many boxes as you can into the matching",
            "crates! There's no penalty for boxes going into",
            "the wrong place."
        ];
        _this.backdropTile = tiles["bgConveyor"][0][0];
        _this.thumbnail = tiles["thumbnails"][1][0];
        _this.controls = [
            new InstructionControl(Control.Up, "Reverse upper conveyors"),
            new InstructionControl(Control.Horizontal, "Reverse middle conveyors"),
            new InstructionControl(Control.Down, "Reverse lower conveyors"),
        ];
        _this.songId = "clocktower";
        _this.axles = [];
        _this.overlays = [];
        _this.conveyorSpots = [
            { left: 40 * 5, right: 40 * 10, top: 40 * 3, direction: 1, axles: [], x1: 0, x2: 0, y: 0 },
            { left: 40 * 14, right: 40 * 19, top: 40 * 3, direction: 1, axles: [], x1: 0, x2: 0, y: 0 },
            { left: 40 * 2, right: 40 * 6, top: 40 * 6, direction: -1, axles: [], x1: 0, x2: 0, y: 0 },
            { left: 40 * 9, right: 40 * 15, top: 40 * 6, direction: -1, axles: [], x1: 0, x2: 0, y: 0 },
            { left: 40 * 18, right: 40 * 22, top: 40 * 6, direction: -1, axles: [], x1: 0, x2: 0, y: 0 },
            { left: 40 * 5, right: 40 * 11.25, top: 40 * 9, direction: 1, axles: [], x1: 0, x2: 0, y: 0 },
            { left: 40 * 12.75, right: 40 * 19, top: 40 * 9, direction: 1, axles: [], x1: 0, x2: 0, y: 0 }
        ];
        return _this;
    }
    MinigameConveyor.prototype.Initialize = function () {
        var _a;
        for (var _i = 0, _b = this.conveyorSpots; _i < _b.length; _i++) {
            var c = _b[_i];
            c.x1 = c.left - camera.canvas.width / 2;
            c.x2 = c.right - camera.canvas.width / 2;
            c.y = c.top - camera.canvas.height / 2;
            var index = c.direction == 1 ? 3 : 4;
            var axle1 = new SimpleSprite(c.left + 20 - camera.canvas.width / 2, c.top + 20 - camera.canvas.height / 2, tiles['conveyorBlocks'][index][0]);
            var axle2 = new SimpleSprite(c.right - 20 - camera.canvas.width / 2, c.top + 20 - camera.canvas.height / 2, tiles['conveyorBlocks'][index][0]);
            this.axles.push(axle1, axle2);
            c.axles = [axle1, axle2];
        }
        this.overlays.push(new SimpleSprite(-300, 250, tiles["conveyorCrates"][0][0]), new SimpleSprite(0, 250, tiles["conveyorCrates"][1][0]), new SimpleSprite(300, 250, tiles["conveyorCrates"][2][0]), new SimpleSprite(-420, 250, tiles["conveyorCrates"][3][0]), new SimpleSprite(420, 250, tiles["conveyorCrates"][3][0]), new SimpleSprite(-180, -270, tiles["conveyorCrates"][4][0]), new SimpleSprite(180, -270, tiles["conveyorCrates"][4][0]));
        (_a = this.sprites).push.apply(_a, __spreadArrays(this.axles, this.overlays));
    };
    MinigameConveyor.prototype.CreateNewBox = function () {
        var x = Random.RandFrom([-180, 180]);
        var y = -220;
        var boxIndex = Random.GetRandInt(0, 2);
        var box = new SimpleSprite(x, y, tiles['conveyorBlocks'][boxIndex][0]);
        box.name = boxIndex.toString();
        this.sprites.push(box);
    };
    MinigameConveyor.prototype.FlipConveyor = function (conveyorSpot) {
        conveyorSpot.direction *= -1;
        var tile = tiles['conveyorBlocks'][conveyorSpot.direction == 1 ? 3 : 4][0];
        conveyorSpot.axles.forEach(function (a) {
            a.imageTile = tile;
        });
    };
    MinigameConveyor.prototype.Update = function () {
        var _loop_1 = function (box) {
            var conveyorBelow = this_1.conveyorSpots.find(function (a) { return a.x1 < box.x + 20 && a.x2 > box.x - 20 && a.y >= box.y + 20; });
            box.dy += 0.2;
            box.y += box.dy;
            if (conveyorBelow) {
                if (box.y + 20 >= conveyorBelow.y) {
                    // on conveyor
                    box.y = conveyorBelow.y - 20;
                    box.dy = 0;
                    box.x += conveyorBelow.direction * 1;
                }
            }
            if (box.y >= 210) {
                box.isActive = false;
                var crate = this_1.overlays.find(function (a) { return Math.abs(a.x - box.x) < 12; });
                if (crate) {
                    crate.dy = 10; // store wiggle in dy, whatever
                    // check for right box
                    if (crate == this_1.overlays[+box.name]) {
                        this_1.score++;
                        audioHandler.PlaySound("dobbloon", false);
                        this_1.sprites.push(new ScoreSprite(box.x, box.y));
                    }
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.sprites.filter(function (a) { return a.name.length > 0; }); _i < _a.length; _i++) {
            var box = _a[_i];
            _loop_1(box);
        }
        for (var _b = 0, _c = this.overlays; _b < _c.length; _b++) {
            var overlay = _c[_b];
            if (overlay.dy > 0) {
                overlay.xScale = ([1, 0.9, 0.85, 0.9, 1.05, 1.2, 1.3, 1.35, 1.3, 1.2, 1.05][overlay.dy] + 1) / 2;
                overlay.yScale = overlay.xScale;
                overlay.dy--;
            }
        }
        var _loop_2 = function (conveyor) {
            conveyor.axles.forEach(function (a) {
                a.rotation += 0.1 * conveyor.direction;
            });
        };
        for (var _d = 0, _e = this.conveyorSpots; _d < _e.length; _d++) {
            var conveyor = _e[_d];
            _loop_2(conveyor);
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            for (var _f = 0, _g = [0, 1]; _f < _g.length; _f++) {
                var index = _g[_f];
                this.FlipConveyor(this.conveyorSpots[index]);
            }
            audioHandler.PlaySound("erase", false);
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true) || KeyboardHandler.IsKeyPressed(KeyAction.Right, true) || KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            for (var _h = 0, _j = [2, 3, 4]; _h < _j.length; _h++) {
                var index = _j[_h];
                this.FlipConveyor(this.conveyorSpots[index]);
            }
            audioHandler.PlaySound("erase", false);
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            for (var _k = 0, _l = [5, 6]; _k < _l.length; _k++) {
                var index = _l[_k];
                this.FlipConveyor(this.conveyorSpots[index]);
            }
            audioHandler.PlaySound("erase", false);
        }
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
        var timerSeconds = this.timer / 60;
        if (timerSeconds % 1 == 0 && timerSeconds > 0 && timerSeconds < 60) {
            this.CreateNewBox();
        }
    };
    MinigameConveyor.prototype.GetRemainingTicks = function () {
        return 60 * 60 - this.timer;
    };
    MinigameConveyor.prototype.OnBeforeDrawSprites = function (camera) {
        for (var _i = 0, _a = this.conveyorSpots; _i < _a.length; _i++) {
            var conveyor = _a[_i];
            var x1 = conveyor.left - camera.canvas.width / 2;
            var xMid = (conveyor.right + conveyor.left) / 2 - camera.canvas.width / 2;
            var x2 = conveyor.right - camera.canvas.width / 2;
            var scale = (conveyor.right - conveyor.left) / 40 - 2;
            var y = conveyor.top - camera.canvas.height / 2;
            var imageRow = conveyor.direction == 1 ? 2 : 1;
            tiles['conveyorBlocks'][0][imageRow].Draw(camera, x1 + 20, y + 20, 1, 1, false, false, 0);
            tiles['conveyorBlocks'][2][imageRow].Draw(camera, x2 - 20, y + 20, 1, 1, false, false, 0);
            tiles['conveyorBlocks'][1][imageRow].Draw(camera, xMid, y + 20, scale, 1, false, false, 0);
        }
    };
    return MinigameConveyor;
}(MinigameBase));
