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
var EditorButtonTrackTool = /** @class */ (function (_super) {
    __extends(EditorButtonTrackTool, _super);
    function EditorButtonTrackTool() {
        var _this = _super.call(this, tiles["editor"][6][0], "Track Pen") || this;
        _this.onClickEvents.push(function () {
            editorHandler.currentTool = new editorHandler.selectedFillBrush(new TrackPlacer());
            editorHandler.hotbar.OnToolSelect(_this);
        });
        return _this;
    }
    EditorButtonTrackTool.prototype.Update = function () {
        this.isSelected = editorHandler.currentTool instanceof FillBrush && editorHandler.currentTool.fillType instanceof TrackPlacer;
        this.borderColor = this.isSelected ? "#FF2E" : "#FF20";
        _super.prototype.Update.call(this);
    };
    EditorButtonTrackTool.prototype.CreateCopy = function () {
        var copy = new EditorButtonTrackTool();
        return copy;
    };
    return EditorButtonTrackTool;
}(EditorButton));
