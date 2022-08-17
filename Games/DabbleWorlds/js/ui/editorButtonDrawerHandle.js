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
var EditorButtonDrawerHandle = /** @class */ (function (_super) {
    __extends(EditorButtonDrawerHandle, _super);
    function EditorButtonDrawerHandle(imageTile, tooltip, revealedElements) {
        var _this = _super.call(this, imageTile, tooltip) || this;
        _this.imageTile = imageTile;
        _this.revealedElements = revealedElements;
        revealedElements.forEach(function (a) {
            _this.AddChild(a);
            a.fixedPosition = true;
        });
        _this.onClickEvents.push(function () {
            _this.isSelected = !_this.isSelected;
        });
        return _this;
    }
    EditorButtonDrawerHandle.prototype.Update = function () {
        if (this.isSelected) {
            if (uiHandler.lastClickedButton != this && uiHandler.lastClickedButton != null) {
                var parentIter = uiHandler.lastClickedButton;
                while (parentIter.parentElement != this.parentElement && parentIter.parentElement != null) {
                    parentIter = parentIter.parentElement;
                }
                if (parentIter.parentElement != this.parentElement) {
                    this.isSelected = false;
                }
            }
        }
        this.borderColor = this.isSelected ? "#2FFE" : "#FF20";
        if (this.isSelected) {
            this.revealedElements.forEach(function (a) {
                a.isHidden = false;
                a.targetWidth = a.initialWidth;
            });
        }
        else {
            this.revealedElements.forEach(function (a) {
                a.isHidden = true;
                a.targetWidth = 0;
                a.width = 0;
            });
        }
        _super.prototype.Update.call(this);
    };
    return EditorButtonDrawerHandle;
}(EditorButton));
