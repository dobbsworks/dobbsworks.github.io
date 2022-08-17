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
var EditorButtonDrawer = /** @class */ (function (_super) {
    __extends(EditorButtonDrawer, _super);
    function EditorButtonDrawer(x, y, width, height, containerButton, containedButtons) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.containerButton = containerButton;
        _this.containedButtons = containedButtons;
        _this.expandOnFirstClick = false;
        _this.initialHeight = 0;
        _this.initialY = 0;
        _this.isExpanded = false;
        _this.expandDirection = "up";
        _this.AddChild(containerButton);
        _this.spacer = new Spacer(x, y, width - _this.margin * 2, 2);
        _this.drawerElements = __spreadArrays([_this.spacer], _this.containedButtons);
        _this.drawerElements.forEach(function (a) {
            _this.AddChild(a);
            a.isHidden = true;
        });
        containerButton.onClickEvents.push(function () {
            if (containerButton.isSelected || _this.expandOnFirstClick) {
                if (_this.isExpanded)
                    _this.Collapse();
                else
                    _this.Expand();
            }
        });
        _this.layout = "vertical";
        _this.expandedHeight = _this.children.map(function (a) { return a.height; }).reduce(Utility.Sum) + (_this.children.length + 1) * _this.margin * 2 - _this.height;
        _this.initialY = _this.y;
        return _this;
    }
    EditorButtonDrawer.prototype.Update = function () {
        if (!this.initialHeight)
            this.initialHeight = this.height;
        if (!this.initialY) {
            this.initialY = this.y;
        }
        _super.prototype.Update.call(this);
        if (!this.containerButton.isSelected && this.isExpanded) {
            this.Collapse();
        }
    };
    EditorButtonDrawer.prototype.Expand = function () {
        var _this = this;
        this.isExpanded = true;
        this.targetHeight = this.initialHeight + this.expandedHeight;
        this.targetY = this.expandDirection == "up" ? (this.initialY - this.expandedHeight) : this.initialY;
        this.drawerElements.forEach(function (a) {
            a.x = _this.containerButton.x;
            a.y = _this.containerButton.y;
            a.targetX = _this.containerButton.x;
            a.targetY = _this.containerButton.y;
        });
        this.drawerElements.forEach(function (a) {
            a.isHidden = false;
        });
    };
    EditorButtonDrawer.prototype.Collapse = function () {
        if (this.isExpanded) {
            this.isExpanded = false;
            this.targetHeight = this.initialHeight;
            this.targetY = this.initialY;
            this.drawerElements.forEach(function (a) {
                a.isHidden = true;
                if (a instanceof EditorButtonDrawer)
                    a.Collapse();
            });
        }
    };
    EditorButtonDrawer.prototype.Draw = function (ctx) {
        _super.prototype.Draw.call(this, ctx);
        this.containerButton.Draw(ctx);
    };
    return EditorButtonDrawer;
}(Panel));
