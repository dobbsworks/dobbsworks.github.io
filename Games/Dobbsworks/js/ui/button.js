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
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.borderRadius = 0;
        _this.radioKey = "";
        _this.onClickEvents = [];
        _this.normalBackColor = "#002b";
        _this.mouseoverBackColor = "#224b";
        _this.isMousedOver = false;
        _this.isNoisy = false;
        _this.isSelected = false;
        _this.onClickEvents.push(function () {
            if (_this.radioKey !== "") {
                var buttons = uiHandler.GetAllElements().
                    filter(function (a) { return a instanceof Button && a != _this && a.radioKey === _this.radioKey; });
                buttons.forEach(function (a) { return a.isSelected = false; });
            }
        });
        return _this;
    }
    Button.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var oldMousedOver = this.isMousedOver;
        this.isMousedOver = this.IsMouseOver();
        if (!oldMousedOver && this.isMousedOver) {
            if (this.isNoisy)
                audioHandler.PlaySound("small-beep", true);
        }
        this.backColor = this.isMousedOver ? this.mouseoverBackColor : this.normalBackColor;
    };
    Button.prototype.Click = function () {
        if (this.isNoisy)
            audioHandler.PlaySound("small-confirm", true);
        this.onClickEvents.forEach(function (a) { return a(); });
        uiHandler.lastClickedButton = this;
        uiHandler.dragSource = this;
    };
    return Button;
}(Panel));
