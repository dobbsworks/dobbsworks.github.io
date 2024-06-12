"use strict";
//1.11.2;12;0;0;3;0;0|#003232,#415057,0.00,1.00,0.60;AB,#5959a5,0,0,0.05,-1,1,0;AB,#5959a5,0,0,0.1,0,1,0;AM,#b2ffff,0,0,0.2,0,1,0;AL,#ffffff,0,0.5,0.3,0,0,0;#1257eccc;#5e23b8cc;#cf2e16fe|AA/AARAGAAAKAGAAAWAGAAAKAGAAAWAGAAAKAGAAA/AAmAGDAAHAGDAAHAGDAAHAGDAAFAGFAAFAGFAAFAGFAA/AA/AA/AA/AA/AA/AAx|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAL|AAECDGAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAKCDAAAKCDAAAJCDBAAKCDAAAKCDAAAJCDBAAKCDAAAKCDAAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDB|AAEAGAAAPAGAAAKAGAAAKAGAAAKAGAAAKAGAAAiAGAAAiAGAAAiAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAGAGAAACAGAAAGAGAAACAGAAAGAGAAACAGAAAGAGAAACAGAAAEAGAAAAAGAAACAGAAAEAGAAAAAGAAACAGAAAEAGAAAAAGAAACAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAA|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAL|ABA3AI;CnAOAB;AEAXAJ;AEAZAJ;AEAbAJ;BqAIAJ
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
var KingSlush = /** @class */ (function (_super) {
    __extends(KingSlush, _super);
    function KingSlush() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 36;
        _this.width = 30;
        _this.respectsSolidTiles = true;
        _this.body = null;
        _this.canBeBouncedOn = true;
        _this.zIndex = 1;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        return _this;
    }
    KingSlush.prototype.Update = function () {
        if (!this.body) {
            this.body = new BigSnowmanBase(this.x - (72 - 30) / 2, this.y + this.height, this.layer, []);
            this.layer.sprites.push(this.body);
            this.stackedOn = this.body;
            this.body.head = this;
        }
    };
    KingSlush.prototype.GetFrameData = function (frameNum) {
        var frame = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["bigSnowmanHead"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 1
        };
    };
    return KingSlush;
}(Enemy));
var BigSnowmanBase = /** @class */ (function (_super) {
    __extends(BigSnowmanBase, _super);
    function BigSnowmanBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 72;
        _this.width = 72;
        _this.respectsSolidTiles = true;
        _this.rolls = true;
        _this.revealTimer = false;
        _this.head = null;
        _this.hurtsEnemies = true;
        return _this;
    }
    BigSnowmanBase.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (!this.WaitForOnScreen())
            return;
        if (player && this.head) {
            this.head.direction = (player.xMid < this.xMid ? -1 : 1);
            this.AccelerateHorizontally(0.008, this.head.direction);
        }
        this.ApplyGravity();
        this.rotation += this.GetTotalDx() / 2;
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    };
    BigSnowmanBase.prototype.DoesPlayerOverlap = function (player) {
        // special override for round hitbox
        var x = player.x;
        if (player.x < this.xMid)
            x = this.xMid;
        if (player.xRight < this.xMid)
            x = player.xRight;
        var y = player.y;
        if (player.y < this.yMid)
            y = this.yMid;
        if (player.yBottom < this.yMid)
            y = player.yBottom;
        var distSquared = Math.pow((x - this.xMid), 2) + Math.pow((y - this.yMid), 2);
        return distSquared < Math.pow((this.width / 2), 2);
    };
    BigSnowmanBase.prototype.IsHazardActive = function () {
        return true;
    };
    BigSnowmanBase.prototype.GetFrameData = function (frameNum) {
        var totalFrames = Object.keys(tiles["bigSnowball"]).length;
        var rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        var frame = Math.floor(rot / (Math.PI * 2) * totalFrames) || 0;
        if (frame < 0)
            frame = 0;
        return {
            imageTile: tiles["bigSnowball"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return BigSnowmanBase;
}(Hazard));
