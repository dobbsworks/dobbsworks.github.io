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
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        ret.push(OptionsMenu.CreateOptionsButton());
        var logo = new Logo(262, 30);
        ret.push(logo);
        var centerX = camera.canvas.width / 2;
        var playButtonWidth = camera.canvas.width / 4;
        var playButtonHeight = 60;
        var playButtonX = centerX - playButtonWidth / 2;
        var playButtonY = logo.y + logo.height + 15;
        var playButton = new Button(playButtonX, playButtonY, playButtonWidth, playButtonHeight);
        var playText = new UIText(centerX, playButtonY + 40, "Start Making", 30, "#000");
        playButton.AddChild(playText);
        playText.xOffset = playButtonWidth / 2 - 5;
        playText.yOffset = -15;
        playButton.isNoisy = true;
        ret.push(playButton);
        var myLevelsButton = new Button(playButtonX, playButtonY + playButtonHeight + 10, playButtonWidth, playButtonHeight);
        var myLevelsText = new UIText(centerX, playButtonY + 40, "My Levels", 30, "#000");
        myLevelsButton.AddChild(myLevelsText);
        myLevelsText.xOffset = playButtonWidth / 2 - 5;
        myLevelsText.yOffset = -15;
        myLevelsButton.isNoisy = true;
        ret.push(myLevelsButton);
        var recentLevelsButton = new Button(playButtonX, playButtonY + (playButtonHeight + 10) * 2, playButtonWidth, playButtonHeight);
        var recentLevelsText = new UIText(centerX, playButtonY + 40, "Recent Levels", 30, "#000");
        recentLevelsButton.AddChild(recentLevelsText);
        recentLevelsText.xOffset = playButtonWidth / 2 - 5;
        recentLevelsText.yOffset = -15;
        recentLevelsButton.isNoisy = true;
        ret.push(recentLevelsButton);
        [playButton, myLevelsButton, recentLevelsButton].forEach(function (b) {
            b.normalBackColor = "#fff8";
            b.mouseoverBackColor = "#f73738";
            b.borderColor = "#000";
            b.borderRadius = 9;
        });
        playButton.onClickEvents.push(function () {
            editorHandler.isEditorAllowed = true;
            editorHandler.SwitchToEditMode();
            _this.Hide(-1);
        });
        myLevelsButton.onClickEvents.push(function () {
            MenuHandler.SubMenu(MyLevelsMenu);
        });
        recentLevelsButton.onClickEvents.push(function () {
            MenuHandler.SubMenu(RecentLevelsMenu);
        });
        return ret;
    };
    return MainMenu;
}(Menu));
var Logo = /** @class */ (function (_super) {
    __extends(Logo, _super);
    function Logo(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.age = 0;
        _this.width = tiles["logo"][0][0].width * 4;
        _this.height = tiles["logo"][0][0].height * 4;
        _this.targetWidth = _this.width;
        _this.targetHeight = _this.height;
        return _this;
    }
    Logo.prototype.IsMouseOver = function () {
        return false;
    };
    Logo.prototype.GetMouseOverElement = function () { return null; };
    Logo.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.age++;
    };
    Logo.prototype.Draw = function (ctx) {
        var frame = Math.floor(this.age / 5) % 3;
        var imageTile = tiles["logo"][frame][0];
        var scale = 4;
        ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height, this.x, this.y, imageTile.width * scale, imageTile.height * scale);
    };
    return Logo;
}(UIElement));
