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
var EditorButtonBackgroundLoad = /** @class */ (function (_super) {
    __extends(EditorButtonBackgroundLoad, _super);
    function EditorButtonBackgroundLoad(name, number, backgroundPreload) {
        var _this = _super.call(this, EditorButtonBackgroundLoad.CreateBgThumb(backgroundPreload, number), "Use preset background") || this;
        _this.backgroundPreload = backgroundPreload;
        _this.onClickEvents.push(function () {
            currentMap.LoadBackgroundsFromImportString(_this.backgroundPreload);
        });
        return _this;
    }
    EditorButtonBackgroundLoad.prototype.Update = function () {
        _super.prototype.Update.call(this);
    };
    EditorButtonBackgroundLoad.CreateBgThumb = function (importStr, number) {
        var row = Math.floor(number / 4);
        var col = number % 4;
        return tiles["bgThumbs"][col][row];
        var importedSections = importStr.split(";");
        var skyData = importedSections.shift();
        var skyElements = (skyData === null || skyData === void 0 ? void 0 : skyData.split(",")) || [];
        var canvas = document.createElement("canvas");
        canvas.width = camera.canvas.height;
        canvas.height = camera.canvas.height;
        var dummyCamera = new Camera(canvas);
        dummyCamera.y = 0;
        var grd = dummyCamera.ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(parseFloat(skyElements[2] || "0"), skyElements[0]);
        grd.addColorStop(parseFloat(skyElements[3] || "0"), skyElements[1]);
        dummyCamera.ctx.fillStyle = grd;
        dummyCamera.ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < importedSections.length; i++) {
            var bgLayer = BackgroundLayer.FromImportString(i, importedSections[i]);
            bgLayer.Draw(dummyCamera, 0, true);
        }
        var opacityHex = parseFloat(skyElements[4] || "0").toString(16).substring(2, 4).padEnd(2, "0");
        var grd2 = dummyCamera.ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd2.addColorStop(parseFloat(skyElements[2] || "0"), skyElements[0] + opacityHex);
        grd2.addColorStop(parseFloat(skyElements[3] || "0"), skyElements[1] + opacityHex);
        dummyCamera.ctx.fillStyle = grd2;
        dummyCamera.ctx.fillRect(0, 0, canvas.width, canvas.height);
        //document.body.appendChild(canvas)
        return new ImageTile(canvas, 0, 0, canvas.width, canvas.height).Scale(50 / canvas.width / 4, false, false);
    };
    return EditorButtonBackgroundLoad;
}(EditorButton));
