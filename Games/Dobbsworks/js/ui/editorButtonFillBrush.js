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
var EditorButtonFillBrush = /** @class */ (function (_super) {
    __extends(EditorButtonFillBrush, _super);
    function EditorButtonFillBrush(fillBrushType, imageTile) {
        var _this = _super.call(this, imageTile) || this;
        _this.fillBrushType = fillBrushType;
        _this.imageTile = imageTile;
        _this.onClickEvents.push(function () {
            editorHandler.selectedFillBrush = _this.fillBrushType;
            if (editorHandler.currentTool instanceof FillBrush) {
                editorHandler.currentTool = new editorHandler.selectedFillBrush(editorHandler.currentTool.fillType);
            }
        });
        return _this;
    }
    EditorButtonFillBrush.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var isSelected = editorHandler.selectedFillBrush === this.fillBrushType;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    };
    return EditorButtonFillBrush;
}(EditorButton));
