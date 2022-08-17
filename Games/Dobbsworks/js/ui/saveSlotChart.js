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
var SaveSlotChart = /** @class */ (function (_super) {
    __extends(SaveSlotChart, _super);
    function SaveSlotChart(x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.width = width;
        _this.height = height;
        _this.numSlotsLive = 0;
        _this.numSlotsCleared = 0;
        _this.numSlotsPending = 0;
        _this.numSlotsTotal = 0;
        return _this;
    }
    SaveSlotChart.prototype.Update = function () {
        _super.prototype.Update.call(this);
    };
    SaveSlotChart.prototype.Draw = function (ctx) {
        if (this.isHidden)
            return;
        _super.prototype.Draw.call(this, ctx);
        var totalChartWidth = this.width - this.margin * 2;
        var totalChartHeight = 15;
        var liveColor = "#75b3ff";
        var pendingColor = "#ff7575";
        var readyColor = "#75ff82";
        var freeColor = "#999";
        var liveWidth = this.numSlotsLive / this.numSlotsTotal * totalChartWidth;
        var pendingWidth = this.numSlotsPending / this.numSlotsTotal * totalChartWidth;
        var readyWidth = this.numSlotsCleared / this.numSlotsTotal * totalChartWidth;
        var x = this.x + this.margin;
        var y = this.y + this.margin;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.fillStyle = freeColor;
        ctx.fillRect(x, y, totalChartWidth, totalChartHeight);
        ctx.strokeRect(x, y, totalChartWidth, totalChartHeight);
        ctx.fillStyle = liveColor;
        ctx.fillRect(x, y, liveWidth, totalChartHeight);
        ctx.strokeRect(x, y, liveWidth, totalChartHeight);
        ctx.fillStyle = readyColor;
        ctx.fillRect(x + liveWidth, y, readyWidth, totalChartHeight);
        ctx.strokeRect(x + liveWidth, y, readyWidth, totalChartHeight);
        ctx.fillStyle = pendingColor;
        ctx.fillRect(x + liveWidth + readyWidth, y, pendingWidth, totalChartHeight);
        ctx.strokeRect(x + liveWidth + readyWidth, y, pendingWidth, totalChartHeight);
        ctx.strokeRect(x + liveWidth, y, pendingWidth, totalChartHeight);
        ctx.strokeRect(x, y, totalChartWidth, totalChartHeight);
        var boxWidth = totalChartWidth / this.numSlotsTotal;
        for (var i = 0; i < this.numSlotsTotal; i++) {
            ctx.strokeRect(x + i * boxWidth, y, boxWidth, totalChartHeight);
        }
        // and then text:
        var fontSize = 14;
        y = this.y + this.margin * 2 + totalChartHeight + fontSize;
        x = this.x + this.margin;
        ctx.font = fontSize + "px Arial";
        function DrawText(text) {
            ctx.fillText(text, x, y);
            x += ctx.measureText(text).width + 10;
        }
        ctx.fillStyle = liveColor;
        DrawText(this.numSlotsLive + " live");
        if (this.numSlotsCleared > 0) {
            x = Math.max(x, this.x + this.margin + liveWidth);
            ctx.fillStyle = readyColor;
            DrawText(this.numSlotsCleared + " ready to publish");
        }
        if (this.numSlotsPending > 0) {
            x = Math.max(x, this.x + this.margin + liveWidth + readyWidth);
            ctx.fillStyle = pendingColor;
            DrawText(this.numSlotsPending + " pending");
        }
        ctx.fillStyle = freeColor;
        var numAvailable = this.numSlotsTotal - this.numSlotsLive - this.numSlotsPending - this.numSlotsCleared;
        if (numAvailable > 0) {
            x = Math.max(x, this.x + this.margin + liveWidth + readyWidth + pendingWidth);
            DrawText(numAvailable + " free upload slot" + (numAvailable == 1 ? "" : "s"));
        }
    };
    return SaveSlotChart;
}(Panel));
