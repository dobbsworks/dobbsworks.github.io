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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var BackgroundLayerEditor = /** @class */ (function (_super) {
    __extends(BackgroundLayerEditor, _super);
    function BackgroundLayerEditor(layerIndex) {
        var _this = _super.call(this, 85, 90, 720, 340) || this;
        _this.layerIndex = layerIndex;
        _this.fixedPosition = true;
        _this.backColor = "#1138";
        _this.margin = 0;
        _this.verticalFlip = false;
        _this.horizontalFlip = false;
        _this.scalePower = 0;
        var bgLayer = currentMap.backgroundLayers[layerIndex];
        _this.hslOffset = __assign({}, bgLayer.hslOffset);
        _this.selectedSource = bgLayer.backgroundSource;
        var sourceSelectionPanel = editorHandler.CreateFloatingButtonPanel(BackgroundSource.GetSources().map(function (a) { return new EditorButtonBackgroundSource(a, _this); }), 5, 3);
        sourceSelectionPanel.fixedPosition = false;
        sourceSelectionPanel.isHidden = false;
        sourceSelectionPanel.targetX -= 80;
        sourceSelectionPanel.x = sourceSelectionPanel.targetX;
        _this.AddChild(sourceSelectionPanel);
        _this.scrollPanel = new Panel(0, 0, 0, 340);
        _this.scrollPanel.backColor = "#1138";
        _this.scrollPanel.margin = 0;
        _this.depthSlider = _this.CreateSlider(function (newValue) { bgLayer.cameraScrollSpeed = newValue; _this.OnChange(); }, tiles["editor"][2][4], tiles["editor"][1][4], 0, 1, 0.3);
        _this.depthSlider.value = bgLayer.cameraScrollSpeed;
        _this.depthSlider.step = 0.1;
        _this.xScrollSlider = _this.CreateSlider(function (newValue) { bgLayer.autoHorizontalScrollSpeed = -newValue; _this.OnChange(); }, tiles["editor"][1][5], tiles["editor"][2][5], -10, 10, 0);
        _this.xScrollSlider.value = bgLayer.autoHorizontalScrollSpeed;
        _this.xScrollPanel = _this.xScrollSlider.parentElement;
        _this.xScrollSlider.step = 0.25;
        _this.yScrollSlider = _this.CreateSlider(function (newValue) { bgLayer.autoVerticalScrollSpeed = -newValue; _this.OnChange(); }, tiles["editor"][1][6], tiles["editor"][2][6], -10, 10, 0);
        _this.yScrollSlider.value = bgLayer.autoVerticalScrollSpeed;
        _this.yScrollPanel = _this.yScrollSlider.parentElement;
        _this.yScrollSlider.step = 0.25;
        _this.scaleSlider = _this.CreateSlider(function (newValue) { _this.scalePower = newValue; _this.OnChange(); }, tiles["editor"][1][7], tiles["editor"][2][7], -10, 10, 0);
        _this.scaleSlider.value = bgLayer.scale;
        _this.scaleSlider.step = 1;
        var colorAndAnchorPanel = new Panel(0, 0, 180, 340);
        colorAndAnchorPanel.backColor = "#1138";
        var anchorPanel = new Panel(0, 0, 140, 90);
        var anchorButton1 = new EditorButtonToggle(tiles["editor"][2][3], "Toggle vertical flip", false, function (newSelectedState) {
            _this.verticalFlip = newSelectedState;
            _this.OnChange();
        });
        anchorPanel.AddChild(anchorButton1);
        var anchorButton2 = new EditorButtonToggle(tiles["editor"][2][1], "Toggle horizontal flip", false, function (newSelectedState) {
            _this.horizontalFlip = newSelectedState;
            _this.OnChange();
        });
        anchorPanel.AddChild(anchorButton2);
        colorAndAnchorPanel.AddChild(anchorPanel);
        colorAndAnchorPanel.layout = "vertical";
        var hsl = __assign({}, _this.hslOffset);
        _this.colorEdit = new RgbPanel(140, 280, function (rgb) {
            var hsl = rgbStringToHSL(rgb);
            _this.hslOffset = { h: hsl.h, s: hsl.s * 1, l: hsl.l * 2 };
            _this.OnChange();
        });
        _this.colorEdit.SetColor(hslToRGB({
            h: hsl.h,
            s: hsl.s,
            l: hsl.l / 2
        }));
        colorAndAnchorPanel.AddChild(_this.colorEdit);
        _this.AddChild(colorAndAnchorPanel);
        _this.AddChild(_this.scrollPanel);
        _this.targetWidth = 440 + _this.scrollPanel.width;
        _this.backColor = "#0000";
        return _this;
    }
    BackgroundLayerEditor.prototype.CreateSlider = function (onChange, topTileImage, bottomTileImage, min, max, defaultVal) {
        var container = new Panel(0, 0, 70, 340);
        var slider = new Slider(0, 0, 70, 180, onChange);
        slider.handleThickness = 15;
        slider.handleBorderThickness = 0;
        slider.layout = "vertical";
        slider.minValue = min;
        slider.maxValue = max;
        slider.value = defaultVal;
        container.layout = "vertical";
        container.AddChild(new Spacer(0, 0, 1, 1));
        container.AddChild(new ImageFromTile(0, 0, 50, 50, bottomTileImage));
        container.AddChild(slider);
        container.AddChild(new ImageFromTile(0, 0, 50, 50, topTileImage));
        container.AddChild(new Spacer(0, 0, 1, 1));
        this.scrollPanel.AddChild(container);
        this.scrollPanel.targetWidth += 70;
        this.scrollPanel.width += 70;
        return slider;
    };
    BackgroundLayerEditor.prototype.OnChange = function () {
        var _this = this;
        var bgLayer = currentMap.backgroundLayers[this.layerIndex];
        if (bgLayer.backgroundSource != this.selectedSource) {
            this.hslOffset = __assign({}, this.selectedSource.defaultRecolor);
            bgLayer.backgroundSource = this.selectedSource;
            this.colorEdit.SetColor(hslToRGB({
                h: this.hslOffset.h,
                s: this.hslOffset.s,
                l: this.hslOffset.l / 2
            }));
        }
        bgLayer.hslOffset = this.hslOffset;
        var scaleRatio = Math.pow(2, this.scalePower / 4);
        bgLayer.imageTiles = Object.values(this.selectedSource.imageTiles).map(function (a) { return a.GetRecolor(_this.hslOffset.h, _this.hslOffset.s, _this.hslOffset.l).Scale(scaleRatio, _this.horizontalFlip, _this.verticalFlip); });
        bgLayer.scale = this.scalePower;
        bgLayer.cameraScrollSpeed = this.depthSlider.value;
        bgLayer.verticalAnchor = this.verticalFlip ? (this.selectedSource.defaultVerticalAnchor == "top" ? "bottom" : "top") : this.selectedSource.defaultVerticalAnchor;
        bgLayer.horizontalFlip = this.horizontalFlip;
        if (this.xScrollSlider) {
            bgLayer.autoHorizontalScrollSpeed = this.xScrollSlider.value;
            this.xScrollPanel.isHidden = !bgLayer.backgroundSource.xLoop;
        }
        if (this.yScrollSlider) {
            bgLayer.autoVerticalScrollSpeed = this.yScrollSlider.value;
            this.yScrollPanel.isHidden = !bgLayer.backgroundSource.yLoop;
        }
    };
    return BackgroundLayerEditor;
}(Panel));
