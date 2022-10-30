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
var UIText = /** @class */ (function (_super) {
    __extends(UIText, _super);
    function UIText(x, y, text, fontSize, fillColor) {
        var _this = _super.call(this, x, y) || this;
        _this.text = text;
        _this.fontSize = fontSize;
        _this.fillColor = fillColor;
        _this.width = 0;
        _this.textWidth = 0;
        _this.height = 0;
        _this.xOffset = 0;
        _this.yOffset = 0;
        _this.textAlign = "center";
        _this.strokeColor = "transparent";
        _this.strokeWidth = 4;
        _this.font = "grobold";
        camera.ctx.font = fontSize + "px sans-serif";
        camera.ctx.textAlign = "center";
        _this.width = camera.ctx.measureText(text).width;
        _this.textWidth = _this.width;
        _this.height = fontSize;
        return _this;
    }
    UIText.prototype.IsMouseOver = function () {
        return false;
    };
    UIText.prototype.GetMouseOverElement = function () { return null; };
    UIText.prototype.Draw = function (ctx) {
        ctx.textAlign = this.textAlign;
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        if (this.font == "grobold" && this.text.indexOf("#") > -1 && this.textAlign == "left") {
            //font doesn't include a # glyph for some reason???
            ctx.font = this.fontSize + "px " + "grobold";
            var segments = this.text.split("#");
            var x = this.x + this.xOffset;
            var poundLength = ctx.measureText("#").width;
            for (var i = 0; i < segments.length; i++) {
                var segment = segments[i];
                // todo, outline if ever needed
                ctx.font = this.fontSize + "px " + "grobold";
                ctx.fillText(segment, x, this.y + this.yOffset);
                x += (ctx.measureText(segment).width || 0);
                if (i < segments.length - 1) {
                    ctx.font = this.fontSize + "px " + "arial";
                    // bump # over by 5 px to line up better
                    ctx.fillText("#", x + 5, this.y + this.yOffset);
                    x += poundLength;
                }
            }
        }
        else {
            ctx.font = this.fontSize + "px " + this.font;
            if (this.strokeColor != "transparent") {
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeText(this.text, this.x + this.xOffset, this.y + this.yOffset);
            }
            ctx.fillText(this.text, this.x + this.xOffset, this.y + this.yOffset);
        }
    };
    return UIText;
}(UIElement));
var groboldFont = new FontFace('grobold', 'url(/fonts/GROBOLD.ttf)');
groboldFont.load();
groboldFont.loaded.then(function (a) {
    document.fonts.add(a);
}).catch(function (a) { return console.error(a); });
