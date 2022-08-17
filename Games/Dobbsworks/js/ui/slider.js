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
var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    function Slider(x, y, width, height, onChange) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.onChange = onChange;
        _this.layout = "horizontal";
        _this.sliderSize = 10;
        _this.handleThickness = 10;
        _this.handleBorderThickness = 5;
        _this.value = 30;
        _this.minValue = 0;
        _this.maxValue = 100;
        _this.step = 5; // value will always be a multiple of step
        _this.fillColor = "#224";
        _this.handleBorderColor = "#224";
        _this.onClickEvents.push(function () {
            _this.SlideToMousePosition();
        });
        return _this;
    }
    Slider.prototype.SlideToMousePosition = function () {
        if (this.layout == "horizontal") {
            var clickRatioX = (mouseHandler.GetCanvasMousePixel().xPixel - this.x) / this.width;
            clickRatioX = Math.max(0, Math.min(1, clickRatioX));
            this.value = clickRatioX * this.range + this.minValue;
        }
        else {
            var clickRatioY = (mouseHandler.GetCanvasMousePixel().yPixel - this.y) / this.height;
            clickRatioY = Math.max(0, Math.min(1, clickRatioY));
            this.value = clickRatioY * this.range + this.minValue;
        }
        this.LockToStep();
        this.onChange(this.value);
    };
    Object.defineProperty(Slider.prototype, "range", {
        get: function () {
            return this.maxValue - this.minValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, "ratio", {
        get: function () {
            return (this.value - this.minValue) / this.range;
        },
        enumerable: false,
        configurable: true
    });
    Slider.prototype.LockToStep = function () {
        this.value = Math.round(this.value / this.step) * this.step;
    };
    Slider.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.backColor = "#0000";
        if (uiHandler.mousedOverElements.indexOf(this) > -1 && mouseHandler.mouseScroll != 0) {
            this.value += ((mouseHandler.mouseScroll > 0) ? 1 : -1) * (this.step);
            this.LockToStep();
            if (this.value < this.minValue)
                this.value = this.minValue;
            if (this.value > this.maxValue)
                this.value = this.maxValue;
            this.onChange(this.value);
            //audioHandler.PlaySound("scroll", true);
        }
        if (uiHandler.dragSource == this) {
            this.SlideToMousePosition();
            //audioHandler.PlaySound("scroll", true);
        }
    };
    Slider.prototype.Draw = function (ctx) {
        ctx.fillStyle = this.handleBorderColor;
        if (this.layout == "horizontal") {
            var y = (this.height - this.sliderSize) / 2 + this.y;
            ctx.fillRect(this.x, y, this.width, this.sliderSize);
            var handleX = this.width * this.ratio + this.x - this.handleThickness / 2;
            ctx.fillRect(handleX - this.handleBorderThickness, this.y - this.handleBorderThickness, this.handleThickness + this.handleBorderThickness * 2, this.height + this.handleBorderThickness * 2);
            ctx.fillStyle = this.fillColor;
            ctx.fillRect(handleX, this.y, this.handleThickness, this.height);
        }
        else {
            var x = (this.width - this.sliderSize) / 2 + this.x;
            ctx.fillRect(x, this.y, this.sliderSize, this.height);
            var handleY = this.height * (this.ratio) + this.y - this.handleThickness / 2;
            ctx.fillRect(this.x - this.handleBorderThickness, handleY - this.handleBorderThickness, this.width + this.handleBorderThickness * 2, this.handleThickness + this.handleBorderThickness * 2);
            ctx.fillStyle = this.fillColor;
            ctx.fillRect(this.x, handleY, this.width, this.handleThickness);
        }
    };
    return Slider;
}(Button));
var HueSlider = /** @class */ (function (_super) {
    __extends(HueSlider, _super);
    function HueSlider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sliderSize = 10;
        _this.handleThickness = 10;
        _this.handleBorderThickness = 5;
        _this.value = 30;
        _this.maxValue = 360;
        _this.fillColor = "#FFF";
        _this.handleBorderColor = "#224";
        return _this;
    }
    HueSlider.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.fillColor = "hsl(" + this.value.toFixed(0) + ",100%,50%)";
    };
    HueSlider.prototype.Draw = function (ctx) {
        var y = (this.height - this.sliderSize) / 2 + this.y;
        ctx.drawImage(tiles["rainbow"][0][0].src, this.x, y, this.width, this.sliderSize);
        ctx.fillStyle = this.handleBorderColor;
        var ratio = this.value / this.maxValue;
        var handleX = this.width * ratio + this.x - this.handleThickness / 2;
        ctx.fillRect(handleX - this.handleBorderThickness, this.y - this.handleBorderThickness, this.handleThickness + this.handleBorderThickness * 2, this.height + this.handleBorderThickness * 2);
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(handleX, this.y, this.handleThickness, this.height);
    };
    return HueSlider;
}(Slider));
var GradientSlider = /** @class */ (function (_super) {
    __extends(GradientSlider, _super);
    function GradientSlider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gradColorLow = "#000";
        _this.gradColorMid = "#000";
        _this.gradColorHigh = "#000";
        _this.maxValue = 100;
        return _this;
    }
    GradientSlider.prototype.Draw = function (ctx) {
        var grd = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        grd.addColorStop(0, this.gradColorLow);
        grd.addColorStop(0.5, this.gradColorMid);
        grd.addColorStop(1, this.gradColorHigh);
        ctx.fillStyle = grd;
        var y = (this.height - this.sliderSize) / 2 + this.y;
        ctx.fillRect(this.x, y, this.width, this.sliderSize);
        ctx.fillStyle = this.handleBorderColor;
        var ratio = this.value / this.maxValue;
        var handleX = this.width * ratio + this.x - this.handleThickness / 2;
        ctx.fillRect(handleX - this.handleBorderThickness, this.y - this.handleBorderThickness, this.handleThickness + this.handleBorderThickness * 2, this.height + this.handleBorderThickness * 2);
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(handleX, this.y, this.handleThickness, this.height);
    };
    return GradientSlider;
}(Slider));
