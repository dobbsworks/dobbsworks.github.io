var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Renderer = (function () {
    function Renderer() {
    }
    Renderer.prototype.GetColor = function (light, normal, position, colorStops) {
        return this.GetColorForPoint(light, normal, position, colorStops);
    };
    return Renderer;
}());
var GlobalLightColorRenderer = (function (_super) {
    __extends(GlobalLightColorRenderer, _super);
    function GlobalLightColorRenderer() {
        return _super.apply(this, arguments) || this;
    }
    GlobalLightColorRenderer.prototype.GetColorForPoint = function (light, normal, position, colorStops) {
        var angle = light.AngleBetween(normal);
        var colorRatio = (1 - angle / Math.PI);
        if (position.z <= 0)
            colorRatio = 0;
        return GetColorFromLightRatio(colorRatio, colorStops);
    };
    return GlobalLightColorRenderer;
}(Renderer));
var GlobalLightGrayscaleRenderer = (function (_super) {
    __extends(GlobalLightGrayscaleRenderer, _super);
    function GlobalLightGrayscaleRenderer() {
        return _super.apply(this, arguments) || this;
    }
    GlobalLightGrayscaleRenderer.prototype.GetColorForPoint = function (light, normal, position, colorStops) {
        var angle = light.AngleBetween(normal);
        var colorRatio = (1 - angle / Math.PI);
        if (position.z <= 0)
            colorRatio = 0;
        return GetGrayscaleColorFromLightRatio(colorRatio);
    };
    return GlobalLightGrayscaleRenderer;
}(Renderer));
var PointLightColorRenderer = (function (_super) {
    __extends(PointLightColorRenderer, _super);
    function PointLightColorRenderer() {
        return _super.apply(this, arguments) || this;
    }
    PointLightColorRenderer.prototype.GetColorForPoint = function (light, normal, position, colorStops) {
        var colorRatio = 0;
        if (position.z > 0)
            colorRatio = GetPointLightColorRatio(light, normal, position);
        return GetColorFromLightRatio(colorRatio, colorStops);
    };
    return PointLightColorRenderer;
}(Renderer));
var PointLightGrayscaleRenderer = (function (_super) {
    __extends(PointLightGrayscaleRenderer, _super);
    function PointLightGrayscaleRenderer() {
        return _super.apply(this, arguments) || this;
    }
    PointLightGrayscaleRenderer.prototype.GetColorForPoint = function (light, normal, position, colorStops) {
        var colorRatio = 0;
        if (position.z > 0)
            colorRatio = GetPointLightColorRatio(light, normal, position);
        return GetGrayscaleColorFromLightRatio(colorRatio);
    };
    return PointLightGrayscaleRenderer;
}(Renderer));
var HeightMapColorRenderer = (function (_super) {
    __extends(HeightMapColorRenderer, _super);
    function HeightMapColorRenderer() {
        return _super.apply(this, arguments) || this;
    }
    HeightMapColorRenderer.prototype.GetColorForPoint = function (light, normal, position, colorStops) {
        return GetColorFromLightRatio(position.z, colorStops);
    };
    return HeightMapColorRenderer;
}(Renderer));
var HeightMapGrayscaleRenderer = (function (_super) {
    __extends(HeightMapGrayscaleRenderer, _super);
    function HeightMapGrayscaleRenderer() {
        return _super.apply(this, arguments) || this;
    }
    HeightMapGrayscaleRenderer.prototype.GetColorForPoint = function (light, normal, position, colorStops) {
        var c = Math.floor(position.z * 255);
        return RgbToHex(c, c, c);
    };
    return HeightMapGrayscaleRenderer;
}(Renderer));
var UVMapRenderer = (function (_super) {
    __extends(UVMapRenderer, _super);
    function UVMapRenderer() {
        return _super.apply(this, arguments) || this;
    }
    UVMapRenderer.prototype.GetColorForPoint = function (light, normal, position, colorStops) {
        var r = 255 * (normal.x + 1) / 2;
        var g = 255 * (-normal.y + 1) / 2;
        var b = 255 * (normal.z + 1) / 2;
        return RgbToHex(r, g, b);
    };
    return UVMapRenderer;
}(Renderer));
function GetGrayscaleColorFromLightRatio(ratio) {
    var d = Math.floor(ratio * 255);
    var color = RgbToHex(d, d, d);
    return color;
}
function GetPointLightColorRatio(light, normal, position) {
    var difference = position.Scale(-1).Add(light);
    var angle = difference.AngleBetween(normal);
    var colorRatio = (1 - angle / Math.PI);
    if (position.z === 0)
        colorRatio = 0;
    return colorRatio;
}
//# sourceMappingURL=renderer.js.map