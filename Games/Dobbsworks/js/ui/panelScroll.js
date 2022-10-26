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
        _this.mouseInitialClickY = -1;
        _this.mouseScrollAnchorY = -1;
        _this.mouseScrollThresholdDistance = -1;
        _this.uncommitedScrollDelta = 0;
        _this.isOutOfScrollColumn = false;
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
        var mousePixel = mouseHandler.GetCanvasMousePixel();
        var mouseX = mousePixel.xPixel;
        var mouseY = mousePixel.yPixel;
        if (mouseX > this.x &&
            mouseX < this.x + this.width) {
            // within horizontal column
            if (mouseY >= this.y &&
                mouseY <= this.y + this.height) {
                // within bounding box
                if (this.mouseInitialClickY == -1 &&
                    mouseHandler.isMouseDown) {
                    if (mouseY >= this.handleTopY &&
                        mouseY <= this.handleBottomY &&
                        mouseHandler.isMouseClicked()) {
                        // initial click on scroll handle
                        this.mouseInitialClickY = mouseY;
                        this.mouseScrollAnchorY = mouseY;
                    }
                    else if (mouseY < this.handleTopY) {
                        this.parentPanel.Scroll(-1);
                    }
                    else if (mouseY > this.handleBottomY) {
                        this.parentPanel.Scroll(1);
                    }
                }
                else {
                    if (mouseHandler.mouseScroll > 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollDown, true))
                        this.parentPanel.Scroll(1);
                    if (mouseHandler.mouseScroll < 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollUp, true))
                        this.parentPanel.Scroll(-1);
                }
            }
        }
        if (!mouseHandler.isMouseDown) {
            this.mouseInitialClickY = -1;
            this.mouseScrollAnchorY = -1;
            this.uncommitedScrollDelta = 0;
            this.isOutOfScrollColumn = false;
        }
        if (mouseHandler.isMouseDown &&
            this.mouseInitialClickY !== -1) {
            if (mouseX > this.x - 100 &&
                mouseX < this.x + this.width + 100) {
                if (this.isOutOfScrollColumn) {
                    this.isOutOfScrollColumn = false;
                    for (var i = 0; i < this.uncommitedScrollDelta; i++)
                        this.parentPanel.Scroll(1);
                    for (var i = 0; i < -this.uncommitedScrollDelta; i++)
                        this.parentPanel.Scroll(-1);
                }
                // dragging within horizontal column
                if (mouseY - this.mouseScrollAnchorY > this.mouseScrollThresholdDistance) {
                    var scrollSuccessful = this.parentPanel.Scroll(1);
                    if (scrollSuccessful) {
                        this.mouseScrollAnchorY += this.mouseScrollThresholdDistance;
                        this.uncommitedScrollDelta += 1;
                    }
                }
                if (mouseY - this.mouseScrollAnchorY < -this.mouseScrollThresholdDistance) {
                    var scrollSuccessful = this.parentPanel.Scroll(-1);
                    if (scrollSuccessful) {
                        this.mouseScrollAnchorY -= this.mouseScrollThresholdDistance;
                        this.uncommitedScrollDelta -= 1;
                    }
                }
            }
            else {
                for (var i = 0; i < this.uncommitedScrollDelta; i++)
                    this.parentPanel.Scroll(-1);
                for (var i = 0; i < -this.uncommitedScrollDelta; i++)
                    this.parentPanel.Scroll(1);
                this.isOutOfScrollColumn = true;
            }
        }
    };
    PanelScroll.prototype.Draw = function (ctx) {
        if (this.isHidden)
            return;
        _super.prototype.Draw.call(this, ctx);
        var panel = this.parentPanel;
        var numberOfScrollableElements = panel.scrollableChildrenDown.length + panel.scrollableChildrenUp.length;
        var totalElements = panel.children.length + numberOfScrollableElements;
        var displayedRatio = panel.children.length / totalElements;
        var scrollOffset = panel.scrollIndex % totalElements;
        var scrollOffsetRatio = scrollOffset / numberOfScrollableElements;
        ctx.fillStyle = (this.mouseInitialClickY == -1 ? "#FFF8" : "#FFFF");
        var availableScrollSpace = this.height - 8;
        var scrollHandleSize = availableScrollSpace * displayedRatio;
        var availableMovementDistance = availableScrollSpace - scrollHandleSize;
        this.mouseScrollThresholdDistance = availableMovementDistance / numberOfScrollableElements;
        this.handleTopY = this.y + 4 + scrollOffsetRatio * availableMovementDistance;
        this.handleBottomY = this.handleTopY + scrollHandleSize;
        ctx.fillRect(this.x + 4, this.handleTopY, 8, scrollHandleSize);
    };
    return PanelScroll;
}(Panel));
