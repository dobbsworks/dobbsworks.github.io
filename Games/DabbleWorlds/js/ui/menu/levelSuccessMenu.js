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
        _this.liked = false;
        _this.disliked = false;
        _this.likeButton = null;
        _this.dislikeButton = null;
        return _this;
    }
    LevelSuccessMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        this.container = new Panel(80, 80, camera.canvas.width - 80 * 2, camera.canvas.height - 80 * 2);
        //this.container.backColor = "#4228";
        this.container.layout = "vertical";
        ret.push(this.container);
        this.minigameContainer = new Panel(0, 0, camera.canvas.width, camera.canvas.height);
        ret.push(this.minigameContainer);
        var buttonWidth = 350;
        var continueButton = new Button(camera.canvas.width / 2 - buttonWidth / 2, 430, buttonWidth, 55);
        var restartButton = new Button(continueButton.x, continueButton.y + continueButton.height + 10, buttonWidth, 55);
        var opinionButtonSize = continueButton.height * 2 + 10;
        this.likeButton = new Button(continueButton.x + continueButton.width + 10, continueButton.y, opinionButtonSize, opinionButtonSize);
        this.dislikeButton = new Button(continueButton.x - 10 - this.likeButton.width, continueButton.y, opinionButtonSize, opinionButtonSize);
        var buttons = [continueButton, restartButton, this.likeButton, this.dislikeButton];
        buttons.forEach(function (a) { return a.isNoisy = true; });
        ret.push.apply(ret, buttons);
        var continueText = new UIText(camera.canvas.width / 2, continueButton.y + 20, "Continue", 20, "#FFF");
        continueButton.AddChild(continueText);
        continueText.xOffset = buttonWidth / 2 - 5;
        continueText.yOffset = -15;
        continueButton.onClickEvents.push(function () {
            var _a;
            (_a = _this.gear) === null || _a === void 0 ? void 0 : _a.DoneWithLevel();
        });
        if (isDemoMode) {
            this.likeButton.isHidden = true;
            this.dislikeButton.isHidden = true;
        }
        var restartText = new UIText(camera.canvas.width / 2, continueButton.y + 20, "Start Over", 20, "#FFF");
        restartButton.AddChild(restartText);
        restartText.xOffset = buttonWidth / 2 - 5;
        restartText.yOffset = -15;
        restartButton.onClickEvents.push(function () {
            _this.Dispose();
            editorHandler.SwitchToPlayMode();
        });
        var likeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][0][0]);
        this.likeButton.AddChild(likeImage);
        var dislikeImage = new ImageFromTile(0, 0, 110, 110, tiles["menuButtons"][1][0]);
        this.dislikeButton.AddChild(dislikeImage);
        this.likeButton.onClickEvents.push(function () {
            if (_this.liked || _this.disliked)
                return;
            _this.liked = true;
            if (_this.likeButton)
                _this.likeButton.normalBackColor = "#0000";
            if (_this.likeButton)
                _this.likeButton.mouseoverBackColor = "#0000";
            if (_this.dislikeButton)
                _this.dislikeButton.isHidden = true;
            DataService.LikeLevel(currentLevelCode);
        });
        this.dislikeButton.onClickEvents.push(function () {
            if (_this.liked || _this.disliked)
                return;
            _this.disliked = true;
            if (_this.dislikeButton)
                _this.dislikeButton.normalBackColor = "#0000";
            if (_this.dislikeButton)
                _this.dislikeButton.mouseoverBackColor = "#0000";
            if (_this.likeButton)
                _this.likeButton.isHidden = true;
            DataService.DislikeLevel(currentLevelCode);
        });
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
        var deaths = StorageService.PopDeathCounter(currentLevelCode);
        var progressModel = new LevelProgressModel(currentLevelCode, frameCount, deaths + 1);
        this.deathCount = deaths;
        if (!isDemoMode) {
            DataService.LogLevelPlayDone(progressModel).then(function (awardsModel) { _this.PopulateTimes(awardsModel, frameCount); });
        }
    };
    LevelSuccessMenu.prototype.PopulateTimes = function (awardsModel, frameCount) {
        if (this.gear) {
            this.gear.awardsModel = awardsModel;
            this.gear.frameCount = frameCount;
        }
        this.liked = awardsModel.liked;
        this.disliked = awardsModel.disliked;
        if (this.likeButton && this.dislikeButton) {
            if (this.liked) {
                this.likeButton.normalBackColor = "#0000";
                this.likeButton.mouseoverBackColor = "#0000";
                this.dislikeButton.isHidden = true;
            }
            if (this.disliked) {
                this.dislikeButton.normalBackColor = "#0000";
                this.dislikeButton.mouseoverBackColor = "#0000";
                this.likeButton.isHidden = true;
            }
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
        _this.age = 600;
        _this.frame = 0;
        _this.spinSpeed = 2;
        _this.dScore = 0;
        _this.h = 180;
        _this.s = 100;
        _this.l = 0;
        _this.a = 1;
        _this.tickXOffset = 0;
        _this.targetScore = collectedGear.frame;
        _this.frameRow = collectedGear.frameRow;
        _this.width = tiles["logo"][0][0].width * 8;
        _this.height = tiles["logo"][0][0].height * 8;
        _this.targetWidth = _this.width;
        _this.targetHeight = _this.height;
        currentMap.fullDarknessRatio = 0;
        currentMap.bgDarknessRatio = 0;
        currentMap.mainLayer.sprites = currentMap.mainLayer.sprites.filter(function (a) { return !(a instanceof Player); });
        return _this;
    }
    EndOfLevelMinigameGear.prototype.Update = function () {
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
        // if (this.age > 800 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
        //     this.DoneWithLevel();
        // }
    };
    EndOfLevelMinigameGear.prototype.DoneWithLevel = function () {
        camera.targetScale = 4;
        camera.scale = 4;
        if (isDemoMode) {
            currentDemoIndex++;
            if (currentDemoIndex < allDemoLevels.length) {
                currentMap = LevelMap.FromImportString(allDemoLevels[currentDemoIndex]);
                editorHandler.SwitchToPlayMode();
                MenuHandler.GoBack();
                MenuHandler.SubMenu(BlankMenu);
            }
            else {
                // done with demo
                MenuHandler.GoBack();
            }
        }
        else {
            var listing = RecentLevelsMenu.GetListing(currentLevelCode);
            if (listing) {
                listing.isCleared = true;
            }
            RecentLevelsMenu.Reset();
            MenuHandler.GoBack();
            currentLevelCode = "";
            // menu music
            audioHandler.SetBackgroundMusic("menuJazz");
        }
    };
    EndOfLevelMinigameGear.prototype.IsMouseOver = function () { return false; };
    EndOfLevelMinigameGear.prototype.GetMouseOverElement = function () { return null; };
    EndOfLevelMinigameGear.prototype.Draw = function (ctx) {
        var _this = this;
        ctx.fillStyle = "hsla(" + this.h.toFixed(0) + "," + this.s.toFixed(0) + "%," + this.l.toFixed(0) + "%," + this.a.toFixed(2) + ")";
        ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        // ctx.textAlign = "right";
        // let ticks = [];
        // for (let i = 500; i < this.targetScore + 1000; i += 250) { ticks.push(i); }
        // ctx.textAlign = "center";
        // ctx.font = `24px grobold`;
        // for (let tick of ticks) {
        //     let textY = this.y - (tick - this.displayedScore);
        //     if (textY < -100 || textY > 800) continue;
        //     ctx.fillStyle = "#333";
        //     ctx.fillRect(50 - 5 * this.tickXOffset, textY - 36, 100, 50);
        //     ctx.fillRect(0, textY, camera.canvas.width * (50 - this.tickXOffset) / 50, 2);
        //     ctx.fillStyle = "white";
        //     ctx.fillText(tick.toString(), 100 - this.tickXOffset * 5, textY);
        // }
        // ctx.font = `42px grobold`;
        // ctx.textAlign = "right";
        // ctx.fillStyle = "white";
        // ctx.fillText(this.displayedScore.toFixed(1), camera.canvas.width - 10 + this.tickXOffset * 3, camera.canvas.height - 10);
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
        var yIter = this.y + 290;
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
        //makeTextLine(725, "Bonus Score", this.displayedScore.toFixed(1), "", "cyan");
    };
    return EndOfLevelMinigameGear;
}(UIElement));