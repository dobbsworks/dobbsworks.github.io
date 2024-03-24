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
var Nimby = /** @class */ (function (_super) {
    __extends(Nimby, _super);
    function Nimby() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 18;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = true;
        _this.timer = 0;
        _this.zIndex = 1;
        _this.state = "patrol";
        return _this;
    }
    Nimby.prototype.OnSpinBounce = function () { this.ReplaceWithSpriteType(Poof); };
    Nimby.prototype.OnBounce = function () {
        this.dx = 0;
        this.dy = 0;
        this.OnDead();
        this.isActive = false;
        // add particle poofs
        for (var i = 0; i < 10; i++) {
            var cloudBit = new CloudBit(this.xMid, this.yMid, this.layer, []);
            cloudBit.dx = (Math.random() - 0.5) / 1;
            cloudBit.dy = (Math.random() - 0.5) / 1;
            this.layer.sprites.push(cloudBit);
        }
    };
    Nimby.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        this.timer++;
        if (player && this.WaitForOnScreen()) {
            if (this.state == "patrol") {
                // particle
                if (this.age % 8 == 0) {
                    var cloudBit = new CloudBit(this.xMid, this.yMid, this.layer, []);
                    cloudBit.dx = -this.dx / 2;
                    cloudBit.dy = -this.dy / 2 + (Math.random() - 0.5) / 4;
                    this.layer.sprites.push(cloudBit);
                }
                var oldDx = this.dx;
                this.AccelerateHorizontally(0.03, this.direction * 2);
                if (oldDx == this.dx) {
                    // achieved maxSpeed
                    this.direction = (player.xMid < this.xMid ? -1 : 1);
                }
                if (this.timer > 120 && Math.abs(this.xMid - player.xMid) < 5 && player.y > this.yBottom) {
                    this.timer = 0;
                    this.state = "charging";
                    this.dx = 0;
                }
            }
            else if (this.state == "charging") {
                if (this.timer > 30) {
                    this.timer = 0;
                    this.state = "striking";
                    var lightning = new LightningStrike(this.x, this.y, this.layer, []);
                    lightning.x = this.xMid - lightning.width / 2;
                    lightning.y = this.yBottom;
                    this.layer.sprites.push(lightning);
                    if (!currentMap.targetSky) {
                        currentMap.targetSky = currentMap.sky;
                    }
                    currentMap.sky = new Sky();
                    currentMap.sky.bgColorTop = "#FFFFFF";
                    currentMap.sky.bgColorBottom = "#FFFFFF";
                }
            }
            else if (this.state == "striking") {
                if (this.timer > 30) {
                    this.timer = 0;
                    this.state = "resetting";
                }
            }
            else if (this.state == "resetting") {
                if (this.timer > 30) {
                    this.timer = 0;
                    this.state = "patrol";
                }
            }
        }
    };
    Nimby.prototype.GetFrameData = function (frameNum) {
        var frames = [0, 1];
        var frame = frames[Math.floor(frameNum * 0.05) % frames.length];
        var xFlip = this.direction == 1;
        if (this.state == "charging") {
            frame = 2;
            xFlip = Math.floor(frameNum / 5) % 2 == 0;
        }
        if (this.state == "striking")
            frame = 3;
        if (this.state == "resetting")
            frame = 2;
        return {
            imageTile: tiles["cloud"][frame][0],
            xFlip: xFlip,
            yFlip: false,
            xOffset: 3,
            yOffset: 3
        };
    };
    return Nimby;
}(Enemy));
var LightningStrike = /** @class */ (function (_super) {
    __extends(LightningStrike, _super);
    function LightningStrike() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 0;
        _this.width = 6;
        _this.respectsSolidTiles = false;
        _this.isPowerSource = true;
        return _this;
    }
    LightningStrike.prototype.GetPowerPoints = function () {
        var ret = [];
        for (var y = this.yBottom + 1; y > this.y; y -= 12) {
            ret.push({ xPixel: this.xMid, yPixel: y });
        }
        ret.push({ xPixel: this.xMid, yPixel: this.y - 1 });
        return ret;
    };
    LightningStrike.prototype.Update = function () {
        if (this.height == 0) {
            var heightOfFloor = this.GetHeightOfSolid(0, 1, 20).yPixel;
            if (heightOfFloor < this.y)
                heightOfFloor = this.y + 20 * 12;
            var tilesHeight = Math.floor((heightOfFloor - this.yBottom) / 12);
            this.y = heightOfFloor - tilesHeight * 12;
            this.height = tilesHeight * 12;
        }
        _super.prototype.Update.call(this);
        if (this.age > 30)
            this.isActive = false;
    };
    LightningStrike.prototype.IsHazardActive = function () {
        return true;
    };
    LightningStrike.prototype.GetFrameData = function (frameNum) {
        var ret = [];
        for (var y = 0; y < this.height; y += 12) {
            var f = (y / 12 + Math.floor(frameNum / 4)) % 8;
            ret.push({
                imageTile: tiles["lightning"][f % 4][0],
                xFlip: f % 2 == 0,
                yFlip: false,
                xOffset: 3,
                yOffset: 0 - y
            });
        }
        return ret;
    };
    return LightningStrike;
}(Hazard));
