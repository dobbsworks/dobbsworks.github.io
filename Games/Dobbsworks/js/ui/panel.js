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
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel(x, y, width, height) {
        var _this = _super.call(this, x, y) || this;
        _this.width = width;
        _this.height = height;
        _this.scrollBar = null;
        _this.children = [];
        _this.scrollableChildrenUp = [];
        _this.scrollableChildrenDown = [];
        _this.margin = 5;
        _this.backColor = "#0000";
        _this.borderColor = "#0000";
        _this.borderRadius = 8;
        _this.layout = "horizontal";
        _this.scrollIndex = 0;
        _this.xOffset = 0;
        _this.yOffset = 0;
        _this.targetWidth = width;
        _this.targetHeight = height;
        _this.initialWidth = width;
        _this.initialHeight = height;
        return _this;
    }
    Panel.prototype.IsMouseOver = function () {
        if (this.isHidden)
            return false;
        return mouseHandler.GetCanvasMousePixel().xPixel >= (this.x + this.xOffset) && mouseHandler.GetCanvasMousePixel().xPixel <= this.x + this.xOffset + this.width &&
            mouseHandler.GetCanvasMousePixel().yPixel >= this.y + this.yOffset && mouseHandler.GetCanvasMousePixel().yPixel <= this.y + this.yOffset + this.height;
    };
    Panel.prototype.GetMouseOverElement = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.IsMouseOver()) {
                var el = child.GetMouseOverElement();
                if (el)
                    return el;
            }
        }
        if (this.IsMouseOver())
            return this;
        return null;
    };
    Panel.prototype.AddChild = function (newChild) {
        newChild.parentElement = this;
        this.children.push(newChild);
    };
    Panel.prototype.Scroll = function (direction) {
        var _this = this;
        if (direction == 1 && this.scrollableChildrenDown.length != 0) {
            // scroll down
            audioHandler.PlaySound("scroll", true);
            this.scrollIndex++;
            this.scrollableChildrenUp.push(this.children.splice(0, 1)[0]);
            this.children.push(this.scrollableChildrenDown.splice(0, 1)[0]);
        }
        else if (direction == -1 && this.scrollableChildrenUp.length != 0) {
            // scroll up
            audioHandler.PlaySound("scroll", true);
            this.scrollIndex--;
            var el1 = this.children.splice(this.children.length - 1, 1)[0];
            this.scrollableChildrenDown.unshift(el1);
            var el2 = this.scrollableChildrenUp.splice(this.scrollableChildrenUp.length - 1, 1)[0];
            this.children.unshift(el2);
        }
        this.children.forEach(function (a) { return a.parentElement = _this; });
    };
    Panel.prototype.Update = function () {
        if (uiHandler.mousedOverElements.indexOf(this) > -1) {
            if (mouseHandler.mouseScroll > 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollDown, true))
                this.Scroll(1);
            if (mouseHandler.mouseScroll < 0 || KeyboardHandler.IsKeyPressed(KeyAction.ScrollUp, true))
                this.Scroll(-1);
        }
        _super.prototype.Update.call(this);
        var children = this.children.filter(function (a) { return !a.isHidden; });
        if (children.length) {
            var availableMarginWidth = this.width -
                children.map(function (a) { return a.width; }).reduce(Utility.Sum, 0) -
                this.margin * 2;
            if (this.layout == "vertical")
                availableMarginWidth = 0;
            var availableMarginHeight = this.height -
                children.map(function (a) { return a.height; }).reduce(Utility.Sum, 0) -
                this.margin * 2;
            if (this.layout == "horizontal")
                availableMarginHeight = 0;
            var marginWidth = availableMarginWidth / (children.length - 1);
            var marginHeight = availableMarginHeight / (children.length - 1);
            var x = this.x + this.margin;
            var y = this.y + this.margin;
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                if (!child.fixedPosition) {
                    child.targetX = x;
                    child.x = x;
                    if (this.layout == "horizontal")
                        x += Math.max(child.width + marginWidth, 0);
                    child.targetY = y;
                    child.y = y;
                    if (this.layout == "vertical")
                        y += Math.max(child.height + marginHeight, 0);
                    if (child instanceof Panel) {
                        if (this.layout == "vertical")
                            child.targetWidth = this.width - this.margin * 2;
                    }
                }
            }
            this.children.forEach(function (a) { return a.Update(); });
        }
        if (this.scrollableChildrenUp.length + this.scrollableChildrenDown.length > 0 && this.scrollBar == null) {
            this.scrollBar = new PanelScroll(this);
        }
        if (this.scrollBar)
            this.scrollBar.Update();
    };
    Panel.prototype.Draw = function (ctx) {
        if (this.isHidden)
            return;
        if (this.scrollBar)
            this.scrollBar.Draw(ctx);
        var radius = this.borderRadius;
        var x = this.x;
        var y = this.y;
        var width = this.width;
        var height = this.height;
        ctx.fillStyle = this.backColor;
        ctx.strokeStyle = this.borderColor;
        //ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;
        ctx.translate(this.xOffset, this.yOffset);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.children.forEach(function (a) { return a.Draw(ctx); });
        ctx.translate(-this.xOffset, -this.yOffset);
    };
    return Panel;
}(UIElement));
