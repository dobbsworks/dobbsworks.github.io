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
var BankMenu = /** @class */ (function (_super) {
    __extends(BankMenu, _super);
    function BankMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#DA0";
        _this.backgroundColor2 = "#431";
        _this.bank = new PiggleBank(camera.canvas.width / 2, 0);
        return _this;
    }
    BankMenu.prototype.CreateElements = function () {
        var ret = [];
        var buttonWidth = 200;
        var buttonHeight = 50;
        this.continueButton = new Button(camera.canvas.width - buttonWidth - 20, camera.canvas.height - buttonHeight - 20, buttonWidth, buttonHeight);
        var continueText = new UIText(camera.canvas.width / 2, this.continueButton.y + 20, "CONTINUE", 20, "#FFF");
        this.continueButton.AddChild(continueText);
        continueText.xOffset = this.continueButton.width / 2 - 5;
        continueText.yOffset = 30;
        this.continueButton.onClickEvents.push(function () {
            MenuHandler.GoBack();
        });
        ret.push(this.continueButton);
        this.continueButton.isHidden = true;
        ret.push(this.bank);
        return ret;
    };
    BankMenu.prototype.Update = function () {
        this.bank.Update();
        if (this.bank.IsDone()) {
            this.continueButton.isHidden = false;
        }
    };
    return BankMenu;
}(Menu));
var PiggleBank = /** @class */ (function (_super) {
    __extends(PiggleBank, _super);
    function PiggleBank() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.incomingCoins = [];
        _this.outgoingCoins = [];
        _this.timer = 0;
        _this.bankAnimationTimer = 0;
        return _this;
    }
    PiggleBank.prototype.Draw = function (ctx) {
        for (var _i = 0, _a = __spreadArrays(this.incomingCoins, this.outgoingCoins).filter(function (a) { return !a.processed; }); _i < _a.length; _i++) {
            var coin = _a[_i];
            var frame = Math.floor(coin.frame / 10) % 6;
            var coinTile = tiles["dobbloon"][frame][0];
            var coinScale = 4;
            ctx.drawImage(coinTile.src, coinTile.xSrc, coinTile.ySrc, coinTile.width, coinTile.height, coin.x - (coinScale * coinTile.width / 2), coin.y, coinTile.width * coinScale, coinTile.height * coinScale);
        }
        // 36x32
        var bankFrame = [1, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 2, 1, 0, 0, 1, 2, 3, 2][Math.floor(this.bankAnimationTimer)];
        var imageTile = tiles["piggleBank"][bankFrame][0];
        var scale = 8;
        ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height, this.x - (scale * imageTile.width / 2), 400, imageTile.width * scale, imageTile.height * scale);
        if (this.x == camera.canvas.width / 2) {
            var bubbleImage = tiles["bankBubble"][0][0];
            ctx.drawImage(bubbleImage.src, bubbleImage.xSrc, bubbleImage.ySrc, bubbleImage.width, bubbleImage.height, 80, 350, bubbleImage.width, bubbleImage.height);
        }
        // draw money amount
        ctx.font = 48 + "px " + "Grobold";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        var text = moneyService.currentFunds.toString();
        if (this.x == camera.canvas.width / 2) {
            ctx.strokeText(text, 220, 370);
            ctx.fillText(text, 220, 370);
        }
        else {
            ctx.strokeText(text, 235, 550);
            ctx.fillText(text, 235, 550);
        }
    };
    PiggleBank.prototype.RemoveCoins = function (coinCount) {
        for (var i = 0; i < coinCount; i++) {
            var x = (Math.random() * 4) - 2 + this.x;
            var y = i * 100 + Math.random() * 50 + 400;
            var frame = Math.floor(Math.random() * 60);
            this.outgoingCoins.push({ x: x, y: y, frame: frame, processed: false });
        }
    };
    PiggleBank.prototype.Update = function () {
        this.timer++;
        if (this.bankAnimationTimer > 0)
            this.bankAnimationTimer -= 0.25;
        if (this.timer == 20) {
            var numCoins = moneyService.fundsToAnimate;
            for (var i = 0; i < numCoins; i++) {
                var x = (Math.random() * 0.8 + 0.1) * camera.canvas.width;
                var y = i * -100 + Math.random() * 50 - 100;
                var frame = Math.floor(Math.random() * 60);
                this.incomingCoins.push({ x: x, y: y, frame: frame, processed: false });
            }
        }
        var targetX = this.x;
        for (var _i = 0, _a = this.incomingCoins.filter(function (a) { return !a.processed; }); _i < _a.length; _i++) {
            var coin = _a[_i];
            coin.x += (targetX - coin.x) * 0.02;
            coin.y += 4;
            coin.frame++;
            if (coin.y > 400) {
                coin.processed = true;
                this.bankAnimationTimer = 18;
                moneyService.fundsToAnimate--;
                moneyService.currentFunds++;
                audioHandler.PlaySound("dobbloon", false);
            }
        }
        for (var _b = 0, _c = this.outgoingCoins.filter(function (a) { return !a.processed; }); _b < _c.length; _b++) {
            var coin = _c[_b];
            if (coin.y < 400)
                coin.x += (targetX > coin.x) ? -0.3 : 0.3;
            coin.y -= 4;
            coin.frame++;
            if (coin.y < 400 && coin.y >= 396) {
                this.bankAnimationTimer = 18;
                moneyService.currentFunds--;
                audioHandler.PlaySound("dobbloon", false);
            }
            if (coin.y < -100) {
                coin.processed = true;
            }
        }
    };
    PiggleBank.prototype.IsDone = function () {
        return this.incomingCoins.every(function (a) { return a.processed; }) && this.outgoingCoins.every(function (a) { return a.processed; }) && this.bankAnimationTimer <= 0 && this.timer > 60;
    };
    PiggleBank.prototype.IsMouseOver = function () {
        return false;
    };
    PiggleBank.prototype.GetMouseOverElement = function () {
        return null;
    };
    return PiggleBank;
}(UIElement));
