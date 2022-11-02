"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var UiHandler = /** @class */ (function () {
    function UiHandler() {
        this.elements = [];
        this.mousedOverElements = [];
        this.lastClickedButton = null; // used to handle closing open drawers
        this.dragSource = null;
        this.initialized = false;
    }
    UiHandler.prototype.Draw = function (ctx) {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var el = _a[_i];
            el.Draw(ctx);
        }
        if (editorHandler.isInEditMode && editorHandler.mouseOverButton) {
            editorHandler.mouseOverButton.DrawTooltip(ctx);
        }
        if (MenuHandler.Dialog) {
            MenuHandler.Dialog.Draw(camera.ctx);
        }
    };
    UiHandler.prototype.Initialize = function () {
        if (this.initialized)
            return;
        this.initialized = true;
    };
    UiHandler.prototype.Update = function () {
        this.Initialize();
        this.mousedOverElements = [];
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var el = _a[_i];
            el.CheckAndUpdateMousedOver();
            el.Update();
        }
        if (document.body.style.cursor == "pointer") {
            document.body.style.cursor = "unset";
        }
        for (var _b = 0, _c = this.mousedOverElements; _b < _c.length; _b++) {
            var el = _c[_b];
            if (el instanceof Button) {
                document.body.style.cursor = "pointer";
                if (mouseHandler.isMouseClicked()) {
                    el.Click();
                    break;
                }
            }
        }
        if (MenuHandler.Dialog)
            MenuHandler.Dialog.Update();
        if (!mouseHandler.isMouseDown) {
            this.dragSource = null;
        }
    };
    UiHandler.prototype.GetAllElements = function () {
        var list = __spreadArrays(this.elements);
        for (var i = 0; i < list.length; i++) {
            if (list[i] instanceof Panel) {
                list.push.apply(list, list[i].children);
            }
        }
        return list;
    };
    return UiHandler;
}());
