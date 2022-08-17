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
var EditorButtonSlopePen = /** @class */ (function (_super) {
    __extends(EditorButtonSlopePen, _super);
    function EditorButtonSlopePen(slopeFill) {
        var _this = _super.call(this, slopeFill.GetThumbnailImage(), "Slope pen") || this;
        _this.slopeFill = slopeFill;
        _this.onClickEvents.push(function () {
            editorHandler.currentTool = new SlopePen(slopeFill);
            editorHandler.hotbar.OnToolSelect(_this);
        });
        return _this;
    }
    EditorButtonSlopePen.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var isSelected = editorHandler.currentTool instanceof SlopePen && editorHandler.currentTool.fillType.innerTileType === this.slopeFill.innerTileType;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    };
    EditorButtonSlopePen.prototype.CreateCopy = function () {
        var copy = new EditorButtonSlopePen(this.slopeFill);
        return copy;
    };
    return EditorButtonSlopePen;
}(EditorButton));
