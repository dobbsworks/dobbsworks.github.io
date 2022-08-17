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
var EditorButtonToggle = /** @class */ (function (_super) {
    __extends(EditorButtonToggle, _super);
    function EditorButtonToggle(imageTile, tooltip, initialState, onChange) {
        var _this = _super.call(this, imageTile, tooltip) || this;
        _this.onChange = onChange;
        _this.isSelected = initialState;
        _this.onClickEvents.push(function () {
            _this.isSelected = !_this.isSelected;
            _this.onChange(_this.isSelected);
        });
        return _this;
    }
    EditorButtonToggle.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
    };
    return EditorButtonToggle;
}(EditorButton));
