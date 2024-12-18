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
            currentMap.sky.bgColorTop = _this.topRgb;
        });
        _this.bottomColorPanel = new RgbPanel(200, panelHeight, function (rgb) {
            _this.bottomRgb = rgb;
            currentMap.sky.bgColorBottom = _this.bottomRgb;
        });
        var vertSliderHeight = (_this.height - _this.margin * 5);
        var centerPanel = new Panel(0, 0, 200, panelHeight);
        var leftVertSlider = new Slider(0, 0, 40, vertSliderHeight, function (newValue) { currentMap.sky.bgColorTopPositionRatio = newValue; });
        leftVertSlider.value = 0;
        leftVertSlider.maxValue = 1;
        leftVertSlider.layout = "vertical";
        leftVertSlider.step = 0.05;
        centerPanel.AddChild(leftVertSlider);
        var rightVertSlider = new Slider(0, 0, 40, vertSliderHeight, function (newValue) { currentMap.sky.bgColorBottomPositionRatio = newValue; });
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
        var opacitySlider = new Slider(0, 0, 40, vertSliderHeight, function (newValue) { currentMap.sky.overlayOpacity = newValue; });
        opacitySlider.value = currentMap.sky.overlayOpacity;
        opacitySlider.minValue = 0;
        opacitySlider.maxValue = 1;
        opacitySlider.step = 0.05;
        opacitySlider.layout = "vertical";
        opacityPanel.AddChild(opacitySlider);
        _this.AddChild(opacityPanel);
        return _this;
    }
    SkyEditor.prototype.Draw = function (ctx) {
        _super.prototype.Draw.call(this, ctx);
        if (!this.isHidden) {
            var grd = camera.ctx.createLinearGradient(0, this.y + this.margin, 0, this.y + this.height - this.margin);
            grd.addColorStop(currentMap.sky.bgColorTopPositionRatio, currentMap.sky.bgColorTop);
            grd.addColorStop(currentMap.sky.bgColorBottomPositionRatio, currentMap.sky.bgColorBottom);
            camera.ctx.fillStyle = grd;
            camera.ctx.fillRect(this.x + this.width * 0.4, this.y + this.margin * 2, this.width * 0.1, this.height - this.margin * 4);
        }
    };
    return SkyEditor;
}(Panel));
var RgbPanel = /** @class */ (function (_super) {
    __extends(RgbPanel, _super);
    function RgbPanel(width, height, onValueSelected, allowAlpha) {
        if (allowAlpha === void 0) { allowAlpha = false; }
        var _this = _super.call(this, 0, 0, width, height) || this;
        _this.onValueSelected = onValueSelected;
        _this.allowAlpha = allowAlpha;
        _this.hue = 0;
        _this.sat = 0;
        _this.lum = 0;
        _this.alpha = 1;
        _this.margin = 30;
        _this.layout = "vertical";
        _this.hueSlider = new HueSlider(0, 0, width, height / 5, function (newValue) { _this.hue = newValue; _this.OnChange(); });
        _this.lumSlider = new GradientSlider(0, 0, width, height / 5, function (newValue) { _this.lum = newValue; _this.OnChange(); });
        _this.satSlider = new GradientSlider(0, 0, width, height / 5, function (newValue) { _this.sat = newValue; _this.OnChange(); });
        _this.alphaSlider = new GradientSlider(0, 0, width, height / 5, function (newValue) { _this.alpha = newValue; _this.OnChange(); });
        _this.AddChild(_this.hueSlider);
        _this.AddChild(_this.satSlider);
        _this.AddChild(_this.lumSlider);
        if (allowAlpha)
            _this.AddChild(_this.alphaSlider);
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
    RgbPanel.prototype.SetColorWithAlpha = function (rgba) {
        var rgb = rgba.substring(0, 7);
        this.SetColor(rgb);
        var alpha = rgba.substring(7, 9);
        this.alpha = parseInt(alpha, 16) / 2.55;
        this.alphaSlider.value = this.alpha;
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
        this.alphaSlider.gradColorLow = "hsla(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%,0%,0)";
        this.alphaSlider.gradColorMid = "hsla(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%,0%,0.5)";
        this.alphaSlider.gradColorHigh = "hsla(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%,0%,1.0)";
        this.alphaSlider.fillColor = "hsl(" + this.hue.toFixed(0) + "," + this.sat.toFixed(0) + "%," + this.lum.toFixed(0) + "%," + this.alpha / 100 + ")";
        var rgb = hslToRGB({ h: this.hue, s: this.sat / 100, l: this.lum / 100 });
        if (this.allowAlpha) {
            var a = this.alpha * 2.55;
            // a is [0,255]
            var str = a.toString(16);
            if (str.length > 2)
                str = str.substring(0, 2);
            if (str[1] == ".")
                str = str.substring(0, 1);
            if (str.length == 1)
                str = "0" + str;
            rgb += str;
        }
        this.onValueSelected(rgb);
    };
    return RgbPanel;
}(Panel));
