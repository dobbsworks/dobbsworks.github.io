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
var EditorButtonEraser = /** @class */ (function (_super) {
    __extends(EditorButtonEraser, _super);
    function EditorButtonEraser() {
        var _this = _super.call(this, tiles["editor"][0][0], "Eraser") || this;
        _this.linkedTool = new Eraser();
        _this.onClickEvents.push(function () {
            editorHandler.currentTool = _this.linkedTool;
        });
        return _this;
    }
    EditorButtonEraser.prototype.Update = function () {
        this.isSelected = editorHandler.currentTool === this.linkedTool;
        this.borderColor = this.isSelected ? "#FF2E" : "#FF20";
        _super.prototype.Update.call(this);
    };
    return EditorButtonEraser;
}(EditorButton));
