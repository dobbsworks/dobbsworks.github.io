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
var ModerationMenu = /** @class */ (function (_super) {
    __extends(ModerationMenu, _super);
    function ModerationMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#335";
        _this.backgroundColor2 = "#03ddde";
        _this.level = null;
        return _this;
    }
    ModerationMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        var backButton = this.CreateBackButton();
        ret.push(backButton);
        var container = new Panel(camera.canvas.width * 0.15, camera.canvas.height / 2 - 150, camera.canvas.width * 0.7, 360);
        container.margin = 0;
        container.layout = "vertical";
        ret.push(container);
        var isGlitchButton = this.CreateButton("Mark As Glitch");
        container.AddChild(isGlitchButton);
        isGlitchButton.onClickEvents.push(function () {
            var _a;
            DataService.MarkLevelAsGlitch(((_a = _this.level) === null || _a === void 0 ? void 0 : _a.code) || "");
        });
        var isNotGlitchButton = this.CreateButton("Mark As Not Glitch");
        container.AddChild(isNotGlitchButton);
        isNotGlitchButton.onClickEvents.push(function () {
            var _a;
            DataService.MarkLevelAsNotGlitch(((_a = _this.level) === null || _a === void 0 ? void 0 : _a.code) || "");
        });
        return ret;
    };
    ModerationMenu.prototype.CreateButton = function (text, sizeRatio) {
        if (sizeRatio === void 0) { sizeRatio = 1; }
        var button = new Button(0, 0, camera.canvas.width * 0.7 * sizeRatio, 60);
        var buttonText = new UIText(0, 0, text, 30, "#000");
        button.margin = 0;
        button.isNoisy = true;
        button.AddChild(buttonText);
        buttonText.xOffset = button.width / 2;
        buttonText.yOffset = 40;
        buttonText.textAlign = "center";
        button.normalBackColor = "#fff8";
        button.mouseoverBackColor = "#f73738";
        button.borderColor = "#000";
        button.borderRadius = 9;
        return button;
    };
    return ModerationMenu;
}(Menu));
