"use strict";
var BackgroundSource = /** @class */ (function () {
    function BackgroundSource(imageTiles, defaultVerticalAnchor, xLoop, yLoop, defaultRecolor, defaultScrollSpeed) {
        this.imageTiles = imageTiles;
        this.defaultVerticalAnchor = defaultVerticalAnchor;
        this.xLoop = xLoop;
        this.yLoop = yLoop;
        this.defaultRecolor = defaultRecolor;
        this.defaultScrollSpeed = defaultScrollSpeed;
        this.thumbnail = imageTiles[0].GetSquareThumbnail().GetRecolor(defaultRecolor.h, defaultRecolor.s, defaultRecolor.l);
    }
    BackgroundSource.GetSources = function () {
        if (this.sources.length == 0) {
            this.sources.push(new BackgroundSource(tiles["bg_clouds1"][0], "top", true, false, { h: 240, s: 0.2, l: 2 }, 0.05), new BackgroundSource(tiles["bg_mountain1"][0], "bottom", true, false, { h: 240, s: 0.3, l: 1 }, 0.1), new BackgroundSource(tiles["bg_trees1"][0], "bottom", true, false, { h: 120, s: 0.8, l: 0.8 }, 0.2), new BackgroundSource(tiles["bg_trees2"][0], "bottom", true, false, { h: 120, s: 0.8, l: 0.7 }, 0.3), new BackgroundSource(tiles["bg_brambles"][0], "bottom", true, true, { h: 120, s: 0.8, l: 0.7 }, 0.5), new BackgroundSource(tiles["bg_pillars"][0], "bottom", true, true, { h: 36, s: 0.8, l: 0.3 }, 0.5), new BackgroundSource(tiles["bg_pillars2"][0], "bottom", true, true, { h: 36, s: 0.8, l: 0.3 }, 0.5), new BackgroundSource(tiles["bg_pillars3"][0], "bottom", true, true, { h: 36, s: 0.8, l: 0.3 }, 0.5), new BackgroundSource(tiles["bg_sea"][0], "bottom", true, false, { h: 240, s: 0.8, l: 1.0 }, 0.5), new BackgroundSource(tiles["bg_clouds2"][0], "bottom", true, false, { h: 180, s: 0.8, l: 1.3 }, 0.5), new BackgroundSource(tiles["bg_planet"][0], "top", false, false, { h: 180, s: 0.8, l: 1.3 }, 0.5), new BackgroundSource(tiles["bg_stars"][0], "top", true, true, { h: 180, s: 0.8, l: 1.3 }, 0.5), new BackgroundSource(tiles["bg_desert"][0], "bottom", true, false, { h: 33, s: 1, l: 0.65 }, 0.5), new BackgroundSource(tiles["bg_brickwall"][0], "bottom", true, true, { h: 33, s: 1, l: 0.65 }, 0.5), new BackgroundSource(tiles["bg_clubs"][0], "bottom", true, true, { h: 120, s: 1, l: 1 }, 0.5), new BackgroundSource(tiles["bg_spades"][0], "bottom", true, true, { h: 240, s: 1, l: 1 }, 0.5), new BackgroundSource(tiles["bg_hearts"][0], "bottom", true, true, { h: 0, s: 1, l: 1 }, 0.5), new BackgroundSource(tiles["bg_diamonds"][0], "bottom", true, true, { h: 60, s: 1, l: 1 }, 0.5), new BackgroundSource(tiles["bg_stars1"][0], "bottom", true, true, { h: 60, s: 1, l: 1 }, 0.5), new BackgroundSource(tiles["bg_stalactites"][0], "top", true, false, { h: 5, s: 1, l: 0.6 }, 0.4), new BackgroundSource(tiles["bg_circle"][0], "top", false, false, { h: 50, s: 1, l: 1 }, 0), new BackgroundSource(tiles["bg_circles"][0], "top", true, true, { h: 330, s: 1, l: 1 }, 0.5), new BackgroundSource(tiles["bg_checker"][0], "top", true, true, { h: 0, s: 1, l: 1 }, 0.5), new BackgroundSource(tiles["bg_towers"][0], "bottom", true, false, { h: 0, s: 0, l: 0.7 }, 0.4), new BackgroundSource(tiles["bg_towers2"][0], "bottom", true, false, { h: 0, s: 0, l: 0.7 }, 0.4), new BackgroundSource(tiles["bg_bricks"][0], "bottom", true, true, { h: 0, s: 0.7, l: 1 }, 0.4), new BackgroundSource(tiles["bg_chains1"][0], "top", true, true, { h: 0, s: 0, l: 0.7 }, 0.4), new BackgroundSource(tiles["bg_chains2"][0], "top", true, false, { h: 0, s: 0, l: 0.7 }, 0.4), new BackgroundSource(tiles["bg_gears"][0], "top", true, true, { h: 0, s: 0, l: 0.7 }, 0.4));
        }
        return this.sources;
    };
    BackgroundSource.sources = [];
    return BackgroundSource;
}());
var BackgroundLayer = /** @class */ (function () {
    function BackgroundLayer(backgroundSource, cameraScrollSpeed, hslOffset, verticalAnchor, autoHorizontalScrollSpeed, autoVerticalScrollSpeed, scale) {
        this.backgroundSource = backgroundSource;
        this.cameraScrollSpeed = cameraScrollSpeed;
        this.hslOffset = hslOffset;
        this.verticalAnchor = verticalAnchor;
        this.autoHorizontalScrollSpeed = autoHorizontalScrollSpeed;
        this.autoVerticalScrollSpeed = autoVerticalScrollSpeed;
        this.scale = scale;
        this.horizontalFlip = false;
        var scaleRatio = Math.pow(2, scale / 4);
        this.imageTiles = Object.values(backgroundSource.imageTiles).map(function (a) { return a.GetRecolor(hslOffset.h, hslOffset.s, hslOffset.l).Scale(scaleRatio, false, verticalAnchor != backgroundSource.defaultVerticalAnchor); });
    }
    BackgroundLayer.FromDefaults = function (backgroundSource) {
        return new BackgroundLayer(backgroundSource, backgroundSource.defaultScrollSpeed, backgroundSource.defaultRecolor, backgroundSource.defaultVerticalAnchor, 0, 0, 0);
    };
    BackgroundLayer.prototype.Draw = function (camera, frameNum, test) {
        if (test === void 0) { test = false; }
        var scale = 4;
        var dx = this.imageTiles[0].width * scale;
        var dy = this.imageTiles[0].height * scale;
        var initialX = (camera.minX - camera.x) * this.cameraScrollSpeed * 4;
        if (this.backgroundSource.xLoop) {
            initialX += frameNum * this.autoHorizontalScrollSpeed;
        }
        initialX %= dx;
        if (initialX > 0)
            initialX -= dx;
        var initialY = 0;
        if (this.verticalAnchor == "top") {
            initialY += (camera.minY - camera.y) * this.cameraScrollSpeed * 4;
        }
        else {
            initialY += (camera.maxY - camera.y) * this.cameraScrollSpeed * 4 + camera.canvas.height - this.imageTiles[0].height * scale;
        }
        if (this.backgroundSource.yLoop) {
            initialY += frameNum * this.autoVerticalScrollSpeed;
            initialY %= Math.abs(dy);
            if (initialY > 0)
                initialY -= Math.abs(dy);
        }
        var tileIndex = Math.floor(frameNum / 5) % this.imageTiles.length;
        for (var destX = initialX; destX < camera.canvas.width; destX += dx) {
            for (var destY = initialY; destY < camera.canvas.height && destY + Math.abs(dy) >= 0; destY += dy) {
                this.imageTiles[tileIndex].Draw(camera.ctx, destX, destY, scale);
                if (!this.backgroundSource.yLoop)
                    destY = 99999999;
            }
            if (!this.backgroundSource.xLoop)
                destX = 99999999;
        }
    };
    BackgroundLayer.prototype.ExportToString = function () {
        var sourceIndex = BackgroundSource.GetSources().indexOf(this.backgroundSource);
        var encodedSourceId = Utility.toTwoDigitB64(sourceIndex);
        var color = hslToRGB({ h: this.hslOffset.h, s: this.hslOffset.s, l: this.hslOffset.l / 2 });
        return [
            encodedSourceId,
            color,
            +(this.autoHorizontalScrollSpeed.toFixed(3)),
            +(this.autoVerticalScrollSpeed.toFixed(3)),
            +(this.cameraScrollSpeed.toFixed(3)),
            this.scale,
            (this.verticalAnchor == "top" ? 0 : 1),
            this.horizontalFlip ? 1 : 0
        ].join(",");
    };
    BackgroundLayer.FromImportString = function (layerNum, importStr) {
        var importVals = importStr.split(",");
        var sourceIndex = Utility.IntFromB64(importVals[0]);
        var rgbString = importVals[1];
        var hslOffset = rgbStringToHSL(rgbString);
        var editorPanel = editorHandler.backgroundLayerEditors[layerNum];
        editorPanel.selectedSource = BackgroundSource.GetSources()[sourceIndex];
        editorPanel.OnChange();
        //editorPanel.hslOffset = hslOffset;
        editorPanel.colorEdit.SetColor(rgbString);
        editorPanel.scaleSlider.value = parseFloat(importVals[5]);
        editorPanel.scalePower = parseFloat(importVals[5]);
        editorPanel.verticalFlip = (editorPanel.selectedSource.defaultVerticalAnchor !== (parseInt(importVals[6]) == 0 ? "top" : "bottom"));
        editorPanel.horizontalFlip = parseInt(importVals[7]) == 1;
        editorPanel.xScrollSlider.value = parseFloat(importVals[2]);
        editorPanel.yScrollSlider.value = parseFloat(importVals[3]);
        editorPanel.OnChange();
        return new BackgroundLayer(BackgroundSource.GetSources()[sourceIndex], parseFloat(importVals[4]), { h: hslOffset.h, s: hslOffset.s, l: hslOffset.l * 2 }, parseInt(importVals[6]) == 0 ? "top" : "bottom", parseFloat(importVals[2]), parseFloat(importVals[3]), parseFloat(importVals[5]));
    };
    return BackgroundLayer;
}());
var BackgroundDefaults = [
    '#00dddd,#eeeeff,0.00,1.00,0.40;AA,#ffffff,-0.25,0,0.05,0,0;AB,#5959a5,0,0,0.1,0,1;AC,#14b714,0,0,0.2,0,1;AD,#10a010,0,0,0.3,0,1',
    '#ffe565,#eeeeff,0.10,1.00,0.45;AB,#cbb130,0,0,0,-3,1;AI,#e5d418,0,0,0,-2,1;AA,#ffffff,-0.25,0,0,-5,0;AM,#c68605,0,0,0.3,-1,1',
    '#007f99,#000019,0.00,1.00,0.25;AH,#442c07,0,0,0.05,4,1;AG,#442c07,0,0,0.1,0,1;AG,#442c07,0,0,0.2,-2,0;AD,#29a010,0,0,0.3,1,0',
    '#00dddd,#eeeeff,0.00,1.00,0.75;AB,#5959a5,0,0,0.05,-1,1;AB,#5959a5,0,0,0.1,0,1;AM,#b2ffff,0,0,0.2,0,1;AL,#ffffff,0,0.5,0.3,0,0',
    '#00dddd,#eeeeff,0.00,1.00,0.40;AA,#ffffff,-0.5,0,0.05,0,0;AI,#1818e5,0,0,0.1,0,1;AI,#e5d418,0,0,0.2,-1,1;AA,#ffffff,-0.25,0,0.1,-2,0',
    '#190008,#0c0c26,0.00,1.00,0.50;AT,#190a00,0,0,0,8,1;AT,#190800,0,0,0.2,-4,0;AT,#321100,0,0,0.3,-2,1;AT,#2d1205,0,0,0.4,0,0',
    '#1919ff,#0000b2,0.00,1.00,0.00;AI,#1010a0,0,0,0.1,-5,1;AT,#14007f,0,0,0.2,-8,1;AL,#5e69ed,0,-0.25,0.7,-6,0;AL,#5e81ed,0,-0.25,0.9,-4,0',
    '#190000,#0c0c26,0.00,1.00,0.00;AL,#5eeded,0,0,0.1,-4,1,0;AK,#5eeded,0,0,0.3,8,0,0;AU,#bcd8db,0,0,0.200,-2,1,0;AK,#5eeded,0,0,0.400,5,1,0',
    '#19ffff,#eeeeff,0.00,0.70,0.40;AJ,#5eeded,-0.250,0,0.7,0,1,0;AJ,#5eeded,-0.5,0,0.6,-1,1,0;AJ,#5eeded,-0.750,0,0.8,-3,1,0;AJ,#5eeded,-1,0,0.9,-5,1,0',
    '#528a85,#b2bfff,0.00,1.00,0.60;AA,#ffffff,-0.250,0,0.050,0,0,0;AX,#191919,0,0,0.100,-2,1,0;AX,#3f3f3f,0,0,0.200,-1,1,1;AX,#595959,0,0,0.300,0,1,0',
    '#00ff15,#000000,0.00,1.00,0.35;AW,#000000,-0.250,-0.250,0.000,-10,1,1;AF,#000000,-0.500,0.500,0.000,-10,0,0;AV,#000000,-10.000,-10.000,0.200,-5,1,0;AV,#000000,10.000,10.000,0.000,-3,1,1',
];
// currentMap.backgroundLayers.map(a => a.ExportToString()).join(";")
