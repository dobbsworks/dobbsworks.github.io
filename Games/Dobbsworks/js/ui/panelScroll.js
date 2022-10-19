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
var PanelScroll = /** @class */ (function (_super) {
    __extends(PanelScroll, _super);
    function PanelScroll(parentPanel) {
        var _this = _super.call(this, parentPanel.x + parentPanel.width + 2, parentPanel.y, 16, parentPanel.height) || this;
        _this.parentPanel = parentPanel;
        _this.handleTopY = -1;
        _this.handleBottomY = -1;
        return _this;
    }
    PanelScroll.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.backColor = this.parentPanel.backColor;
        this.isHidden = this.parentPanel.isHidden;
        this.targetX = this.parentPanel.targetX + this.parentPanel.targetWidth + 2;
        this.targetY = this.parentPanel.targetY;
        if (this.isHidden)
            return;
        if (mouseHandler.mouseX > this.x &&
            mouseHandler.mouseX < this.x + this.width &&
            mouseHandler.mouseY > this.y && mouseHandler.mouseY < this.y + this.height) {
            if (mouseHandler.isMouseDown) {
                if (mouseHandler.mouseY < this.handleTopY)
                    this.parentPanel.Scroll(-1);
                if (mouseHandler.mouseY > this.handleBottomY)
                    this.parentPanel.Scroll(1);
            }
            if (mouseHandler.mouseScroll > 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollDown, true))
                this.parentPanel.Scroll(1);
            if (mouseHandler.mouseScroll < 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollUp, true))
                this.parentPanel.Scroll(-1);
        }
    };
    PanelScroll.prototype.Draw = function (ctx) {
        if (this.isHidden)
            return;
        _super.prototype.Draw.call(this, ctx);
        var panel = this.parentPanel;
        var totalElements = (panel.children.length + panel.scrollableChildrenDown.length + panel.scrollableChildrenUp.length);
        var displayedRatio = panel.children.length / totalElements;
        var scrollOffset = (panel.scrollIndex % totalElements);
        var scrollOffsetRatio = scrollOffset / (panel.scrollableChildrenDown.length + panel.scrollableChildrenUp.length);
        ctx.fillStyle = "#FFF8";
        var availableScrollSpace = this.height - 8;
        var scrollHandleSize = availableScrollSpace * displayedRatio;
        var availableMovementDistance = availableScrollSpace - scrollHandleSize;
        this.handleTopY = this.y + 4 + scrollOffsetRatio * availableMovementDistance;
        this.handleBottomY = this.handleTopY + scrollHandleSize;
        ctx.fillRect(this.x + 4, this.handleTopY, 8, scrollHandleSize);
    };
    return PanelScroll;
}(Panel));
