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
var SkyEditor = /** @class */ (function (_super) {
    __extends(SkyEditor, _super);
    function SkyEditor(x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.fixedPosition = true;
        _this.backColor = "#1138";
        _this.topRgb = "";
        _this.bottomRgb = "";
        var panelHeight = height - _this.margin * 2;
        _this.topColorPanel = new RgbPanel(200, panelHeight, function (rgb) {
            _this.topRgb = rgb;
            _this.UpdateSky();
        });
        _this.bottomColorPanel = new RgbPanel(200, panelHeight, function (rgb) {
            _this.bottomRgb = rgb;
            _this.UpdateSky();
        });
        var vertSliderHeight = (_this.height - _this.margin * 5);
        var centerPanel = new Panel(0, 0, 200, panelHeight);
        var leftVertSlider = new Slider(0, 0, 40, vertSliderHeight, function (newValue) { currentMap.bgColorTopPositionRatio = newValue; });
        leftVertSlider.value = 0;
        leftVertSlider.maxValue = 1;
        leftVertSlider.layout = "vertical";
        leftVertSlider.step = 0.05;
        centerPanel.AddChild(leftVertSlider);
        var rightVertSlider = new Slider(0, 0, 40, vertSliderHeight, function (newValue) { currentMap.bgColorBottomPositionRatio = newValue; });
        rightVertSlider.value = 1;
        rightVertSlider.minValue = 0;
        rightVertSlider.maxValue = 1;
        rightVertSlider.layout = "vertical";
        rightVertSlider.step = 0.05;
        centerPanel.AddChild(rightVertSlider);
        _this.AddChild(_this.topColorPanel);
        _this.AddChild(centerPanel);
        _this.AddChild(_this.bottomColorPanel);
        _this.topColorPanel.SetColor("#00DDDD");
        _this.bottomColorPanel.SetColor("#EEEEFF");
        var opacityPanel = new Panel(0, 0, 60, panelHeight);
        ;
        var opacitySlider = new Slider(0, 0, 40, vertSliderHeight, function (newValue) { currentMap.overlayOpacity = newValue; });
        opacitySlider.value = currentMap.overlayOpacity;
        opacitySlider.minValue = 0;
        opacitySlider.maxValue = 1;
        opacitySlider.step = 0.05;
        opacitySlider.layout = "vertical";
        opacityPanel.AddChild(opacitySlider);
        _this.AddChild(opacityPanel);
        return _this;
    }
    SkyEditor.prototype.UpdateSky = function () {
        currentMap.bgColorTop = this.topRgb;
        currentMap.bgColorBottom = this.bottomRgb;
    };
    SkyEditor.prototype.Draw = function (ctx) {
        _super.prototype.Draw.call(this, ctx);
        if (!this.isHidden) {
            var grd = camera.ctx.createLinearGradient(0, this.y + this.margin, 0, this.y + this.height - this.margin);
            grd.addColorStop(currentMap.bgColorTopPositionRatio, currentMap.bgColorTop);
            grd.addColorStop(currentMap.bgColorBottomPositionRatio, currentMap.bgColorBottom);
            camera.ctx.fillStyle = grd;
            camera.ctx.fillRect(this.x + this.width * 0.4, this.y + this.margin * 2, this.width * 0.1, this.height - this.margin * 4);
        }
    };
    return SkyEditor;
}(Panel));
var RgbPanel = /** @class */ (function (_super) {
    __extends(RgbPanel, _super);
    function RgbPanel(width, height, onValueSelected) {
        var _this = _super.call(this, 0, 0, width, height) || this;
        _this.onValueSelected = onValueSelected;
        _this.hue = 0;
        _this.sat = 0;
        _this.lum = 0;
        _this.margin = 30;
        _this.layout = "vertical";
        _this.hueSlider = new HueSlider(0, 0, width, height / 5, function (newValue) { _this.hue = newValue; _this.OnChange(); });
        _this.lumSlider = new GradientSlider(0, 0, width, height / 5, function (newValue) { _this.lum = newValue; _this.OnChange(); });
        _this.satSlider = new GradientSlider(0, 0, width, height / 5, function (newValue) { _this.sat = newValue; _this.OnChange(); });
        _this.AddChild(_this.lumSlider);
        _this.AddChild(_this.satSlider);
        _this.AddChild(_this.hueSlider);
        _this.OnChange();
        return _this;
    }
    RgbPanel.prototype.SetColor = function (rgb) {
        var hsl = rgbStringToHSL(rgb);
        this.hue = hsl.h;
        this.sat = hsl.s * 100;
        this.lum = hsl.l * 100;
        this.hueSlider.value = this.hue;
        this.satSlider.value = this.sat;
        this.lumSlider.value = this.lum;
        this.OnChange();
    };
    RgbPanel.prototype.OnChange = function () {
        this.satSlider.gradColorLow = "hsl(" + this.hue.toFixed(0) + ",0%,50%)";
        this.satSlider.gradColorMid = "hsl(" + this.hue.toFixed(0) + ",50%,50%)";
        this.satSlider.gradColorHigh = "hsl(" + this.hue.toFixed(0) + ",100%,50%)";
        this.satSlider.fillColor = "hsl(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%,50%)";
        this.lumSlider.gradColorLow = "hsl(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%,0%)";
        this.lumSlider.gradColorMid = "hsl(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%,50%)";
        this.lumSlider.gradColorHigh = "hsl(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%,100%)";
        this.lumSlider.fillColor = "hsl(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%," + this.lum.toFixed(0) + "%)";
        var rgb = hslToRGB({ h: this.hue, s: this.sat / 100, l: this.lum / 100 });
        this.onValueSelected(rgb);
    };
    return RgbPanel;
}(Panel));
