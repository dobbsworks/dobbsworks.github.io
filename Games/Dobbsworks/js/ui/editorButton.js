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
var EditorButton = /** @class */ (function (_super) {
    __extends(EditorButton, _super);
    function EditorButton(imageTile, tooltip) {
        if (tooltip === void 0) { tooltip = ""; }
        var _this = _super.call(this, 0, 0, 60, 60) || this;
        _this.tooltip = tooltip;
        _this.isSelected = false;
        _this.radioKey = "";
        _this.AddChild(new ImageFromTile(0, 0, 50, 50, imageTile));
        _this.onClickEvents.push(function () {
            if (_this.radioKey !== "") {
                var buttons = uiHandler.GetAllElements().
                    filter(function (a) { return a instanceof EditorButton && a != _this && a.radioKey === _this.radioKey; });
                buttons.forEach(function (a) { return a.isSelected = false; });
            }
        });
        return _this;
    }
    EditorButton.prototype.CreateCopy = function () {
        return null;
    };
    ;
    EditorButton.prototype.Draw = function (ctx) {
        if (this.isHidden)
            return;
        _super.prototype.Draw.call(this, ctx);
        if (this.isMousedOver)
            editorHandler.mouseOverButton = this;
    };
    EditorButton.prototype.DrawTooltip = function (ctx) {
        var text = this.tooltip;
        if (!text)
            return;
        ctx.textAlign = "center";
        ctx.font = 16 + "px Arial";
        var upperY = this.y - 40;
        if (upperY < 5)
            upperY = this.y + this.height + 15;
        var textWidth = ctx.measureText(text).width;
        var panelWidth = Math.max(this.width, textWidth + 8);
        var midX = this.x + this.width / 2;
        if (midX + panelWidth / 2 > camera.canvas.width)
            midX = camera.canvas.width - panelWidth / 2 - 5;
        if (midX - panelWidth / 2 < 0)
            midX = panelWidth / 2 + 5;
        ctx.fillStyle = "#002f";
        ctx.fillRect(midX - panelWidth / 2, upperY, panelWidth, 25);
        ctx.fillStyle = "#FFF";
        ctx.fillText(text, midX, upperY + 20);
    };
    return EditorButton;
}(Button));
