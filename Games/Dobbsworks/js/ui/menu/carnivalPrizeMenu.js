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
var CarnivalPrizeMenu = /** @class */ (function (_super) {
    __extends(CarnivalPrizeMenu, _super);
    function CarnivalPrizeMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#000";
        _this.timer = 0;
        _this.bank = new PiggleBank(camera.canvas.width / 4, 0);
        _this.gameState = "paying";
        _this.playCost = 1;
        _this.unlockResult = null;
        return _this;
    }
    CarnivalPrizeMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        var imageContainer = new Panel(-5, -5, camera.canvas.width + 10, camera.canvas.height + 10);
        imageContainer.backColor = "#F000";
        ret.push(imageContainer);
        var bg = new ImageFromTile(0, 0, camera.canvas.width, camera.canvas.height, tiles["carnivalBack"][0][1]);
        bg.fixedPosition = true;
        bg.zoom = 1;
        imageContainer.AddChild(bg);
        this.backButton = this.CreateBackButton();
        ret.push(this.backButton);
        ret.push.apply(ret, this.GetGameElements());
        ret.push(this.bank);
        this.payButton = new Button(345, 480, 270, 85);
        this.payButton.normalBackColor = "#F00";
        this.payButton.mouseoverBackColor = "#F44";
        this.payButton.borderRadius = 4;
        this.payButton.borderColor = "#000";
        var coinIcon = new ImageFromTile(0, 0, 75, 75, tiles["dobbloon"][0][0]);
        this.payButton.AddChild(coinIcon);
        var costText = new UIText(0, 0, this.playCost + "/play", 40, "white");
        costText.yOffset = this.payButton.height / 2 + 10;
        costText.xOffset = -10;
        costText.textAlign = "right";
        this.payButton.AddChild(costText);
        ret.push(this.payButton);
        this.payButton.onClickEvents.push(function () {
            _this.payButton.isHidden = true;
            _this.backButton.isHidden = true;
            // // TODO REMOVE
            // setTimeout(() => {
            //     this.unlockResult = {
            //         ItemCode: "1AC",
            //         Success: true
            //     }
            //     this.OnSuccessfulSpendCall();
            // }, 1000);
            DataService.RollForUnlock(_this.playCost).then(function (rollResult) {
                _this.unlockResult = rollResult;
                _this.OnSuccessfulSpendCall();
            }).catch(function (err) {
                UIDialog.Alert("Unable to complete transaction, please try again later.", "OK");
                MenuHandler.GoBack();
            });
        });
        this.deadPayButton = new Button(345, 480, 270, 85);
        this.deadPayButton.normalBackColor = "#888";
        this.deadPayButton.mouseoverBackColor = "#888";
        this.deadPayButton.borderRadius = 4;
        this.deadPayButton.borderColor = "#000";
        var deadcoinIcon = new ImageFromTile(0, 0, 75, 75, tiles["dobbloon"][0][0]);
        this.deadPayButton.AddChild(deadcoinIcon);
        var deadcostText = new UIText(0, 0, this.playCost + "/play", 40, "white");
        deadcostText.yOffset = this.deadPayButton.height / 2 + 10;
        deadcostText.xOffset = -10;
        deadcostText.textAlign = "right";
        this.deadPayButton.AddChild(deadcostText);
        ret.push(this.deadPayButton);
        this.deadPayButton.onClickEvents.push(function () {
            audioHandler.PlaySound("error", true);
        });
        this.playButton = new Button(645, 480, 270, 85);
        this.playButton.normalBackColor = "#F00";
        this.playButton.mouseoverBackColor = "#F44";
        this.playButton.borderRadius = 4;
        this.playButton.borderColor = "#000";
        var playText = new UIText(0, 0, "GO", 40, "white");
        playText.yOffset = this.playButton.height / 2 + 10;
        playText.xOffset = this.playButton.width / 2;
        playText.textAlign = "center";
        this.playButton.AddChild(playText);
        this.playButton.isHidden = true;
        ret.push(this.playButton);
        this.playButton.onClickEvents.push(function () {
            _this.SwitchState("running");
        });
        this.prizeDisplay = new PrizeDisplay(camera.canvas.width / 2, -400);
        ret.push(this.prizeDisplay);
        this.SwitchState("paying");
        return ret;
    };
    CarnivalPrizeMenu.prototype.OnSuccessfulSpendCall = function () {
        this.bank.RemoveCoins(this.playCost);
        this.SwitchState("starting");
    };
    CarnivalPrizeMenu.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.timer++;
        this.bank.Update();
        switch (this.gameState) {
            case "starting":
                this.GameStartUpdate();
                break;
            case "waiting":
                this.GameWaitUpdate();
                break;
            case "running":
                this.GameRunningUpdate();
                break;
            case "prize":
                this.PrizeUpdate();
                break;
        }
    };
    CarnivalPrizeMenu.prototype.PrizeUpdate = function () {
        var _a;
        if (this.timer == 1 && this.unlockResult) {
            this.prizeDisplay.avatarCode = this.unlockResult.itemCode;
            this.prizeDisplay.isNew = this.unlockResult.success;
            if ((_a = this.unlockResult) === null || _a === void 0 ? void 0 : _a.success) {
                toastService.AnnounceAvatarUnlock(AvatarCustomizationMenu.GetImageFrom3CharCode(this.unlockResult.itemCode));
            }
        }
        var targetY = camera.canvas.height / 2;
        if (this.timer > 120) {
            targetY = -600;
        }
        if (this.timer == 150) {
            this.SwitchState("done");
            this.SwitchState("paying");
        }
        this.prizeDisplay.targetY = targetY;
    };
    CarnivalPrizeMenu.prototype.SwitchState = function (newState) {
        this.gameState = newState;
        this.timer = 0;
        if (newState == "waiting")
            this.playButton.isHidden = false;
        if (newState == "running")
            this.playButton.isHidden = true;
        if (newState == "done")
            this.backButton.isHidden = false;
        if (newState == "paying") {
            this.payButton.isHidden = moneyService.currentFunds < this.playCost;
            this.deadPayButton.isHidden = moneyService.currentFunds >= this.playCost;
            this.unlockResult = null;
        }
    };
    CarnivalPrizeMenu.prototype.GetGameElements = function () {
        this.wheel = new PrizeWheel(camera.canvas.width / 2, camera.canvas.height / 2 - 40);
        return [this.wheel];
    };
    CarnivalPrizeMenu.prototype.GameStartUpdate = function () {
        // wheel rears back, then speeds up
        if (this.timer == 1) {
            this.wheel.speed = -0.02;
        }
        if (this.timer < 100) {
            this.wheel.speed *= 0.95;
        }
        if (this.timer >= 100 && this.timer < 120) {
            this.wheel.speed += 0.005;
        }
        if (this.timer == 130) {
            this.wheel.speed = 0.1;
            this.SwitchState("waiting");
        }
        this.wheel.Update();
    };
    CarnivalPrizeMenu.prototype.GameWaitUpdate = function () {
        // wheel continues at static pace
        this.wheel.Update();
    };
    CarnivalPrizeMenu.prototype.GameRunningUpdate = function () {
        // wheel waits until over correct slice, then slows down at predefined intervals
        if (this.wheel.targetTheta == -1 && this.unlockResult) {
            var isOnPrize = this.wheel.IsThetaOnPrize(this.wheel.theta);
            var isOnCorrectSlice = (isOnPrize && this.unlockResult.itemCode) || (!isOnPrize && !this.unlockResult.itemCode);
            if (isOnCorrectSlice) {
                this.wheel.targetTheta = this.wheel.theta + (4 * Math.PI);
            }
        }
        else {
            var remainingTheta = this.wheel.targetTheta - this.wheel.theta;
            if (remainingTheta < 0.002) {
                // close enough, lock in
                this.wheel.theta = this.wheel.targetTheta;
                this.wheel.speed = 0;
                this.SwitchState("prize");
            }
            else {
                var targetSpeed = remainingTheta * 0.02;
                if (targetSpeed < this.wheel.speed) {
                    this.wheel.speed = targetSpeed;
                }
            }
        }
        this.wheel.Update();
    };
    return CarnivalPrizeMenu;
}(Menu));
var PrizeDisplay = /** @class */ (function (_super) {
    __extends(PrizeDisplay, _super);
    function PrizeDisplay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.avatarCode = "";
        _this.timer = 0;
        _this.isNew = false;
        return _this;
    }
    PrizeDisplay.prototype.FillStarburst = function (ctx, centerX, centerY, numPoints, r1, r2, thetaOffset) {
        ctx.beginPath();
        var thetaDelta = Math.PI / numPoints;
        var theta = 0;
        for (var i = 0; i < numPoints * 2; i++) {
            theta += thetaDelta;
            var r = (i % 2 == 0) ? r1 : r2;
            var x = centerX + r * Math.cos(theta + thetaOffset);
            var y = centerY + r * Math.sin(theta + thetaOffset);
            ctx.lineTo(x, y);
        }
        ctx.fill();
    };
    PrizeDisplay.prototype.Draw = function (ctx) {
        if (this.avatarCode) {
            var imageTile = AvatarCustomizationMenu.GetImageFrom3CharCode(this.avatarCode);
            // draw a starburst and the image on top
            this.timer++;
            var thetaOffset = this.timer / 300;
            ctx.fillStyle = "#AA8500";
            this.FillStarburst(ctx, this.x, this.y + 3, 32, 150, 180, -thetaOffset);
            ctx.fillStyle = "#FFD700";
            this.FillStarburst(ctx, this.x, this.y, 32, 150, 180, -thetaOffset);
            ctx.fillStyle = "#AAAA00";
            this.FillStarburst(ctx, this.x, this.y + 3, 24, 100, 130, thetaOffset);
            ctx.fillStyle = "#FFFF00";
            this.FillStarburst(ctx, this.x, this.y, 24, 100, 130, thetaOffset);
            ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height, this.x - 80, this.y - 80, 80 * 2, 80 * 2);
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.font = "30px Grobold";
            ctx.textAlign = "center";
            ctx.fillText("Received:", this.x, this.y - 80);
            ctx.strokeText("Received:", this.x, this.y - 80);
            if (this.isNew) {
                ctx.font = "60px Grobold";
                var hue = ((this.timer * 3) % 360).toFixed(0);
                ctx.fillStyle = "hsl(" + hue + ",100%,50%)";
                ctx.fillText("New!", this.x, this.y + 120);
                ctx.strokeText("New!", this.x, this.y + 120);
            }
            else {
                ctx.fillText("Already owned", this.x, this.y + 100);
                ctx.strokeText("Already owned", this.x, this.y + 100);
            }
        }
    };
    PrizeDisplay.prototype.IsMouseOver = function () { return false; };
    PrizeDisplay.prototype.GetMouseOverElement = function () { return null; };
    return PrizeDisplay;
}(UIElement));
var PrizeWheel = /** @class */ (function (_super) {
    __extends(PrizeWheel, _super);
    function PrizeWheel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetTheta = -1;
        _this.theta = 0;
        _this.speed = 0;
        _this.prizeRanges = [];
        return _this;
    }
    PrizeWheel.prototype.Draw = function (ctx) {
        var radius = 150;
        ctx.fillStyle = "#759";
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "lime";
        for (var _i = 0, _a = this.prizeRanges; _i < _a.length; _i++) {
            var slice = _a[_i];
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.arc(this.x, this.y, radius, this.theta - slice.t0, this.theta - slice.t1, true);
            ctx.fill();
        }
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "#999";
        ctx.beginPath();
        ctx.moveTo(this.x + radius + 10, this.y);
        ctx.lineTo(this.x + radius + 10 + 30, this.y + 15);
        ctx.lineTo(this.x + radius + 10 + 30, this.y - 15);
        ctx.lineTo(this.x + radius + 10, this.y);
        ctx.fill();
    };
    PrizeWheel.prototype.IsThetaOnPrize = function (theta) {
        theta %= (2 * Math.PI);
        return this.prizeRanges.some(function (a) { return theta > a.t0 && theta < a.t1; });
    };
    PrizeWheel.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.prizeRanges.length == 0) {
            var sliceCount = 8;
            var sliceSize = 2 * Math.PI / sliceCount;
            for (var i = 0; i < sliceCount; i += 2) {
                var t0 = i * sliceSize;
                var t1 = t0 + sliceSize;
                this.prizeRanges.push({ t0: t0, t1: t1 });
            }
        }
        this.theta += this.speed;
    };
    PrizeWheel.prototype.IsMouseOver = function () {
        return false;
    };
    PrizeWheel.prototype.GetMouseOverElement = function () {
        return null;
    };
    return PrizeWheel;
}(UIElement));
