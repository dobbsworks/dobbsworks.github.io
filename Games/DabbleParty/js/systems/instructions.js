"use strict";
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
var Instructions = /** @class */ (function () {
    function Instructions(minigame) {
        this.minigame = minigame;
        this.timer = 0;
    }
    Instructions.prototype.Draw = function (camera) {
        var myCam = new Camera(camera.canvas);
        var bgImage = tiles["bgInstructions"][0][0];
        var offset = Math.sin(((board === null || board === void 0 ? void 0 : board.timer) || 0) / 240) * 96;
        bgImage.Draw(myCam, offset, 0, 1.2, 1.2, false, false, 0);
        //camera.ctx.drawImage(tiles["bgInstructions"][0][0].src, 0, 0);
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
        this.timer++;
        if (this.timer < 20) {
            var opacity = Math.max(0, Math.min(1, (20 - this.timer) / 20));
            camera.ctx.fillStyle = "rgba(0, 0, 0, " + opacity.toFixed(2) + ")";
            camera.ctx.fillRect(0, 0, 960, 540);
        }
    };
    return Instructions;
}());
