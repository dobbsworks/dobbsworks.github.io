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
var Control = /** @class */ (function () {
    function Control(tileIndex) {
        this.tileIndex = tileIndex;
    }
    Control.Button = new Control(0);
    Control.Move = new Control(1);
    Control.Horizontal = new Control(2);
    Control.Vertical = new Control(3);
    Control.Up = new Control(4);
    Control.Down = new Control(5);
    return Control;
}());
var InstructionControl = /** @class */ (function () {
    function InstructionControl(control, text) {
        this.control = control;
        this.text = text;
    }
    return InstructionControl;
}());
var Instructions = /** @class */ (function (_super) {
    __extends(Instructions, _super);
    function Instructions(minigame) {
        var _this = _super.call(this) || this;
        _this.minigame = minigame;
        _this.timer = 0;
        _this.doneTimer = 0;
        _this.overlayOpacity = 1;
        return _this;
    }
    Instructions.prototype.Update = function () {
        this.timer++;
        if (this.timer < 20) {
            this.overlayOpacity = Math.max(0, Math.min(1, (20 - this.timer) / 20));
        }
        if (this.timer > 120 && this.doneTimer == 0 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.doneTimer = 1;
        }
        if (this.doneTimer > 0) {
            this.doneTimer++;
            this.overlayOpacity = Math.max(0, Math.min(1, (this.doneTimer - 1) / 20));
        }
        if (this.doneTimer > 25) {
            this.isDone = true;
            // set minigame
            currentMinigame = this.minigame;
        }
    };
    Instructions.prototype.Draw = function (camera) {
        var myCam = new Camera(camera.canvas);
        var bgImage = tiles["bgInstructions"][0][0];
        var offset = Math.sin(((board === null || board === void 0 ? void 0 : board.timer) || 0) / 240) * 96;
        bgImage.Draw(myCam, offset, 0, 1.2, 1.2, false, false, 0);
        camera.ctx.drawImage(tiles["instructionsPanel"][0][0].src, 0, 100);
        camera.ctx.drawImage(tiles["instructionsBoard"][0][0].src, 30, 380);
        camera.ctx.drawImage(this.minigame.thumbnail.src, this.minigame.thumbnail.xSrc, this.minigame.thumbnail.ySrc, 480, 270, 50, 111, 480, 270);
        camera.ctx.font = "800 " + 36 + "px " + "arial";
        camera.ctx.textAlign = "left";
        camera.ctx.fillStyle = "#FFF";
        camera.ctx.fillText(this.minigame.title, 45, 70);
        camera.ctx.font = "800 " + 18 + "px " + "arial";
        camera.ctx.textAlign = "left";
        camera.ctx.fillStyle = "#000";
        camera.ctx.fillText("Controls", 600, 190);
        camera.ctx.fillRect(600, 200, 300, 3);
        camera.ctx.font = "400 " + 18 + "px " + "arial";
        var y = 220;
        for (var _i = 0, _a = this.minigame.controls; _i < _a.length; _i++) {
            var control = _a[_i];
            var buttonIndex = control.control.tileIndex;
            var buttonImage = tiles["controls"][buttonIndex][0];
            camera.ctx.drawImage(buttonImage.src, buttonImage.xSrc, buttonImage.ySrc, 29, 29, 600, y, 29, 29);
            camera.ctx.fillText(control.text, 640, y + 21);
            y += 35;
        }
        y = 448;
        camera.ctx.fillStyle = "#FFF";
        camera.ctx.textAlign = "center";
        for (var _b = 0, _c = this.minigame.instructions; _b < _c.length; _b++) {
            var instruction = _c[_b];
            camera.ctx.fillText(instruction, 420, y);
            y += 27;
        }
        camera.ctx.fillStyle = "#000";
        camera.ctx.textAlign = "left";
        camera.ctx.font = "800 " + 18 + "px " + "arial";
        camera.ctx.fillText("Wait for the host's", 700, 470);
        camera.ctx.fillText("countdown, then press", 700, 490);
        camera.ctx.fillText("A to start the game!", 700, 510);
        if (this.overlayOpacity > 0) {
            camera.ctx.fillStyle = "rgba(0, 0, 0, " + this.overlayOpacity.toFixed(2) + ")";
            camera.ctx.fillRect(0, 0, 960, 540);
        }
    };
    return Instructions;
}(BoardCutScene));
