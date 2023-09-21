"use strict";
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
var WaterRecolor = /** @class */ (function () {
    function WaterRecolor() {
    }
    WaterRecolor.prototype.ApplyRecolors = function () {
        this.ApplyRecolor(tiles["water"][0][0].src, rgbaStringToHSLA(currentMap.waterColor), 0);
        this.ApplyRecolor(tiles["purpleWater"][0][0].src, rgbaStringToHSLA(currentMap.purpleWaterColor), 0);
        this.ApplyRecolor(tiles["lava"][0][0].src, rgbaStringToHSLA(currentMap.lavaColor), 18);
    };
    WaterRecolor.prototype.ApplyRecolor = function (targetImage, color, stripeOffset) {
        var sourceImage = tiles["waterSourceImage"][0][0].src;
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = sourceImage.width;
        tempCanvas.height = sourceImage.height;
        var tempCtx = tempCanvas.getContext("2d");
        var blue = 255;
        var red = (Math.pow(256, 2)) * 255;
        var magenta = (Math.pow(256, 2)) * 255 + 255;
        var yellow = (Math.pow(256, 2)) * 255 + (256) * 255;
        var white = (Math.pow(256, 2)) * 255 + (256) * 255 + 255;
        var cyan = (256) * 255 + 255;
        var lime = (256) * 255;
        var black = 0;
        var mainColor = hslaToRGBA(color);
        var stripe = __assign({}, color);
        stripe.h += stripeOffset;
        if (stripeOffset != 0) {
            stripe.a = 1;
        }
        var stripeColor = hslaToRGBA(stripe);
        var waterfallMainColor = mainColor;
        var waterfallStripe = __assign({}, color);
        waterfallStripe.s *= 0.42;
        waterfallStripe.l = (waterfallStripe.l + 1) / 2;
        waterfallStripe.a = 1;
        var waterfallStripeColor = hslaToRGBA(waterfallStripe);
        var surfaceColor = "#FFFFFFEE";
        if (stripeOffset != 0) {
            var lavaSurface = __assign({}, color);
            lavaSurface.h += stripeOffset * 2;
            if (stripeOffset != 0) {
                lavaSurface.a = 1;
            }
            surfaceColor = hslaToRGBA(lavaSurface);
        }
        var edge1 = __assign({}, color);
        edge1.l *= 0.83;
        edge1.a = 1;
        var edge1Color = hslaToRGBA(edge1);
        var edge2 = __assign({}, color);
        edge2.l *= 0.71;
        edge2.a = 1;
        var edge2Color = hslaToRGBA(edge2);
        try {
            tempCtx === null || tempCtx === void 0 ? void 0 : tempCtx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);
            var imageData = tempCtx === null || tempCtx === void 0 ? void 0 : tempCtx.getImageData(0, 0, sourceImage.width, sourceImage.height);
            if ((imageData === null || imageData === void 0 ? void 0 : imageData.data) && tempCtx) {
                tempCtx.clearRect(0, 0, sourceImage.width, sourceImage.height);
                for (var y = 0; y < sourceImage.height; y++) {
                    for (var x = 0; x < sourceImage.width; x++) {
                        var pos = y * sourceImage.width + x;
                        var r = imageData.data[pos * 4 + 0];
                        var g = imageData.data[pos * 4 + 1];
                        var b = imageData.data[pos * 4 + 2];
                        var a = imageData.data[pos * 4 + 3];
                        var colorSum = r * (Math.pow(256, 2)) + g * 256 + b;
                        if (colorSum == blue)
                            tempCtx.fillStyle = mainColor;
                        else if (colorSum == red)
                            tempCtx.fillStyle = stripeColor;
                        else if (colorSum == magenta)
                            tempCtx.fillStyle = waterfallMainColor;
                        else if (colorSum == yellow)
                            tempCtx.fillStyle = waterfallStripeColor;
                        else if (colorSum == white)
                            tempCtx.fillStyle = surfaceColor;
                        else if (colorSum == cyan)
                            tempCtx.fillStyle = edge1Color;
                        else if (colorSum == lime)
                            tempCtx.fillStyle = edge2Color;
                        else {
                            tempCtx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a / 255 + ")";
                        }
                        if (tempCtx.fillStyle != "#FFF0") {
                            tempCtx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            }
            if (debugMode)
                document.body.appendChild(tempCanvas);
            targetImage.width = tempCanvas.width;
            targetImage.height = tempCanvas.height;
            targetImage.src = tempCanvas.toDataURL();
        }
        catch (e) {
            console.error(e);
        }
    };
    return WaterRecolor;
}());
