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
var Spacer = /** @class */ (function (_super) {
    __extends(Spacer, _super);
    function Spacer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.backColor = "#4440";
        return _this;
    }
    Spacer.prototype.IsMouseOver = function () { return false; };
    Spacer.prototype.GetMouseOverElement = function () { return null; };
    Spacer.prototype.Update = function () {
        this.ApproachTargetValue("x", "targetX");
        this.ApproachTargetValue("y", "targetY");
        this.ApproachTargetValue("width", "targetWidth");
        this.ApproachTargetValue("height", "targetHeight");
    };
    Spacer.prototype.Draw = function (ctx) {
        if (this.isHidden)
            return;
        ctx.fillStyle = this.backColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Spacer;
}(Panel));
