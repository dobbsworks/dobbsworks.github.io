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
var WaterColorEditor = /** @class */ (function (_super) {
    __extends(WaterColorEditor, _super);
    function WaterColorEditor(x, y, width, height, property) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.property = property;
        _this.fixedPosition = true;
        _this.backColor = "#1138";
        _this.colorRgb = "";
        var panelHeight = height - _this.margin * 2;
        _this.colorPanel = new RgbPanel(width - _this.margin * 2, panelHeight, function (rgb) {
            _this.colorRgb = rgb;
            _this.UpdateColors();
        }, true);
        _this.AddChild(_this.colorPanel);
        return _this;
    }
    WaterColorEditor.prototype.UpdateColors = function () {
        currentMap[this.property] = this.colorRgb;
        new WaterRecolor().ApplyRecolors();
        currentMap.waterLayer.isDirty = true;
    };
    return WaterColorEditor;
}(Panel));
