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
var LevelSuccessMenu = /** @class */ (function (_super) {
    __extends(LevelSuccessMenu, _super);
    function LevelSuccessMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = null;
        _this.minigameContainer = null;
        _this.collectedGear = null;
        _this.timer = 0;
        _this.deathCount = 0;
        _this.gear = null;
        return _this;
    }
    LevelSuccessMenu.prototype.CreateElements = function () {
        var ret = [];
        this.container = new Panel(80, 80, camera.canvas.width - 80 * 2, camera.canvas.height - 80 * 2);
        //this.container.backColor = "#4228";
        this.container.layout = "vertical";
        ret.push(this.container);
        this.minigameContainer = new Panel(0, 0, camera.canvas.width, camera.canvas.height);
        ret.push(this.minigameContainer);
        return ret;
    };
    LevelSuccessMenu.prototype.Update = function () {
        this.timer++;
        if (this.timer == 1 && this.minigameContainer) {
            if (!this.collectedGear)
                this.collectedGear = new GoldGear(0, 0, currentMap.mainLayer, []);
            this.gear = new EndOfLevelMinigameGear((camera.canvas.width - 192) / 2, 0, this.collectedGear);
            this.gear.fixedPosition = true;
            this.gear.deathCount = this.deathCount;
            this.minigameContainer.AddChild(this.gear);
        }
    };
    LevelSuccessMenu.prototype.SetLevelCompletionTime = function (frameCount) {
        var _this = this;
        var deaths = StorageService.PopDeathCounter(currentLevelId);
        var progressModel = new LevelProgressModel(currentLevelId, frameCount, deaths + 1);
        this.deathCount = deaths;
        DataService.LogLevelPlayDone(progressModel).then(function (awardsModel) { _this.PopulateTimes(awardsModel, frameCount); });
    };
    LevelSuccessMenu.prototype.PopulateTimes = function (awardsModel, frameCount) {
        if (this.gear) {
            this.gear.awardsModel = awardsModel;
            this.gear.frameCount = frameCount;
        }
    };
    LevelSuccessMenu.prototype.CreateRow = function (leftText, rightText, lowerText, lowerColor) {
        var block = new Panel(0, 0, 600, 80);
        block.layout = "vertical";
        if (lowerText != "") {
            var lowerRow = new Panel(0, 0, 600, 50);
            lowerRow.AddChild(new Spacer(0, 0, 0, 0));
            var text = new UIText(0, 0, lowerText, 20, "white");
            text.textAlign = "right";
            text.strokeColor = lowerColor;
            lowerRow.AddChild(text);
            block.AddChild(lowerRow);
        }
        var row = new Panel(0, 0, 600, 50);
        var text1 = new UIText(0, 0, leftText, 36, "white");
        text1.textAlign = "left";
        row.AddChild(text1);
        var text2 = new UIText(0, 0, rightText, 36, "white");
        text2.textAlign = "right";
        row.AddChild(text2);
        block.AddChild(row);
        return block;
    };
    return LevelSuccessMenu;
}(Menu));
var EndOfLevelMinigameGear = /** @class */ (function (_super) {
    __extends(EndOfLevelMinigameGear, _super);
    function EndOfLevelMinigameGear(x, y, collectedGear) {
        var _this = _super.call(this, x, y) || this;
        _this.displayedScore = 0;
        _this.awardsModel = null;
        _this.frameCount = 0;
        _this.deathCount = 0;
        _this.age = 650;
        _this.frame = 0;
        _this.spinSpeed = 2;
        _this.dScore = 0;
        _this.h = 180;
        _this.s = 100;
        _this.l = 50;
        _this.a = 1;
        _this.tickXOffset = 0;
        _this.targetScore = collectedGear.frame;
        _this.frameRow = collectedGear.frameRow;
        _this.width = tiles["logo"][0][0].width * 8;
        _this.height = tiles["logo"][0][0].height * 8;
        _this.targetWidth = _this.width;
        _this.targetHeight = _this.height;
        return _this;
    }
    EndOfLevelMinigameGear.prototype.Update = function () {
        console.log(this.age);
        _super.prototype.Update.call(this);
        if (this.age == 0) {
            currentMap.fullDarknessRatio = 0;
            currentMap.bgDarknessRatio = 0;
            currentMap.mainLayer.sprites = currentMap.mainLayer.sprites.filter(function (a) { return !(a instanceof Player); });
        }
        this.age++;
        this.frame += this.spinSpeed;
        this.y = camera.canvas.height - this.age * 2;
        if (this.y < 50)
            this.y = 50;
        if (this.age < 300) {
            this.dScore = this.targetScore / 600;
        }
        else if (this.age < 600) {
            this.dScore *= 0.95;
            this.spinSpeed *= 0.95;
        }
        else {
            this.dScore = 0;
        }
        this.displayedScore += this.dScore;
        if (this.age < 50) {
            this.l = this.age;
        }
        if (this.age >= 50 && this.age < 600) {
            // lightness closer to 0 as score approaches 10k
            this.l = 50 - (50) * Math.min(1, (this.displayedScore / 10000));
        }
        if (this.age > 600 && this.age <= 650) {
            this.a = 1 - ((this.age - 600) / 50) / 2;
            this.l *= 0.99;
            this.tickXOffset += 1;
        }
        else if (this.age >= 650) {
            this.a = 0.5;
            this.l *= 0.9;
        }
        this.h = (240 - 180) * Math.min(1, (this.displayedScore / 10000)) + 180;
        if (this.age > 650) {
            var frameIndeces = [
                0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
                0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
                0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5
            ];
            this.frame = frameIndeces[Math.floor(this.age * 0.5) % frameIndeces.length] * 20;
        }
        if (this.age > 800 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            camera.targetScale = 4;
            camera.scale = 4;
            var listing = RecentLevelsMenu.GetListing(currentLevelId);
            if (listing) {
                listing.isCleared = true;
            }
            RecentLevelsMenu.Reset();
            MenuHandler.GoBack();
            currentLevelId = -1;
        }
    };
    EndOfLevelMinigameGear.prototype.IsMouseOver = function () { return false; };
    EndOfLevelMinigameGear.prototype.GetMouseOverElement = function () { return null; };
    EndOfLevelMinigameGear.prototype.Draw = function (ctx) {
        var _this = this;
        ctx.fillStyle = "hsla(" + this.h.toFixed(0) + "," + this.s.toFixed(0) + "%," + this.l.toFixed(0) + "%," + this.a.toFixed(2) + ")";
        ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        ctx.textAlign = "right";
        var ticks = [];
        for (var i = 500; i < this.targetScore + 1000; i += 250) {
            ticks.push(i);
        }
        ctx.textAlign = "center";
        ctx.font = "24px grobold";
        for (var _i = 0, ticks_1 = ticks; _i < ticks_1.length; _i++) {
            var tick = ticks_1[_i];
            var textY = this.y - (tick - this.displayedScore);
            if (textY < -100 || textY > 800)
                continue;
            ctx.fillStyle = "#333";
            ctx.fillRect(50 - 5 * this.tickXOffset, textY - 36, 100, 50);
            ctx.fillRect(0, textY, camera.canvas.width * (50 - this.tickXOffset) / 50, 2);
            ctx.fillStyle = "white";
            ctx.fillText(tick.toString(), 100 - this.tickXOffset * 5, textY);
        }
        ctx.font = "42px grobold";
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.fillText(this.displayedScore.toFixed(1), camera.canvas.width - 10 + this.tickXOffset * 3, camera.canvas.height - 10);
        var frameCol = Math.floor(this.frame) % 6;
        var imageTile = tiles["gears"][frameCol][this.frameRow];
        var scale = 8;
        ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height, this.x, this.y, imageTile.width * scale, imageTile.height * scale);
        var playerCol = this.age < 650 ? 3 : 0;
        var imageTilePlayer = tiles["dobbs"][playerCol][0];
        var playerY = (this.age - 650) * 10 + 150;
        if (playerY > 150)
            playerY = 150;
        ctx.drawImage(imageTilePlayer.src, imageTilePlayer.xSrc, imageTilePlayer.ySrc, imageTilePlayer.width, imageTilePlayer.height, 300, playerY, imageTilePlayer.width * scale, imageTilePlayer.height * scale);
        var strokeFillText = function (text, x, y) {
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        };
        if (this.age > 650) {
            ctx.textAlign = "center";
            ctx.fillStyle = "#f8f8c8";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "#f6c729";
            ctx.lineWidth = 10;
            ctx.font = "70px grobold";
            var x = camera.canvas.width / 2 + (this.age < 700 ? (700 - this.age) * 20 : 0);
            strokeFillText("LEVEL CLEAR!", x, this.y + 220);
        }
        var yIter = this.y + 320;
        var makeTextLine = function (age, textLeft, textRight, extraText, extraTextColor) {
            if (_this.age > age) {
                ctx.textAlign = "left";
                ctx.fillStyle = "white";
                ctx.font = "36px grobold";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 8;
                var x = ((_this.age < age + 50) ? (age + 50 - _this.age) * 20 : 0);
                strokeFillText(textLeft, 200 + x, yIter);
                ctx.textAlign = "right";
                strokeFillText(textRight, camera.canvas.width - 200 + x, yIter);
                ctx.fillStyle = extraTextColor;
                ctx.font = "20px grobold";
                ctx.lineWidth = 4;
                if (extraText)
                    strokeFillText(extraText, camera.canvas.width - 200 + x, yIter - 40);
            }
            yIter += 50;
        };
        if (this.awardsModel) {
            var extraText = "";
            var extraColor = "red";
            if (this.awardsModel.isFC) {
                extraText = "First Clear!";
                extraColor = "yellow";
            }
            else if (this.awardsModel.isWR) {
                extraText = "World Record!";
            }
            else if (this.awardsModel.isPB) {
                extraText = "Personal best!";
                extraColor = "cyan";
            }
            makeTextLine(675, "Clear Time", Utility.FramesToTimeText(this.frameCount), extraText, extraColor);
        }
        makeTextLine(700, "Attempts", (this.deathCount + 1).toString(), "", "cyan");
        makeTextLine(725, "Bonus Score", this.displayedScore.toFixed(1), "", "cyan");
    };
    return EndOfLevelMinigameGear;
}(UIElement));
