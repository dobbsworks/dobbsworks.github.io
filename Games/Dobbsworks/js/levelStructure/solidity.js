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
var BaseSolidity = /** @class */ (function () {
    function BaseSolidity() {
    }
    BaseSolidity.prototype.IsSolidFromTop = function (spriteDirection) {
        // for red koopa style movement
        if (this == Solidity.None)
            return false;
        if (this == Solidity.Top)
            return true;
        if (this == Solidity.Block)
            return true;
        if (this == Solidity.SolidForNonplayer)
            return true;
        if (this instanceof SlopeSolidity) {
            if (spriteDirection == 0)
                return this.verticalSolidDirection == -1;
            return this.verticalSolidDirection == -1 || this.horizontalSolidDirection == -spriteDirection;
        }
        return false;
    };
    return BaseSolidity;
}());
var SlopeSolidity = /** @class */ (function (_super) {
    __extends(SlopeSolidity, _super);
    function SlopeSolidity(slopeFunc, 
    // slopefunc is for tile (0,0) ie top left tile of map
    verticalSolidDirection, horizontalSolidDirection, absoluteSlope) {
        var _this = _super.call(this) || this;
        _this.slopeFunc = slopeFunc;
        _this.verticalSolidDirection = verticalSolidDirection;
        _this.horizontalSolidDirection = horizontalSolidDirection;
        _this.absoluteSlope = absoluteSlope;
        return _this;
    }
    SlopeSolidity.prototype.GetSlopePoint = function (x, layer, tile) {
        var tileXPixel = tile.tileX * layer.tileWidth;
        var xRatioInTile = (x - tileXPixel) / layer.tileWidth;
        var yRatioInTile = this.slopeFunc(xRatioInTile);
        var yPixel = (yRatioInTile + tile.tileY) * layer.tileHeight;
        return yPixel;
    };
    SlopeSolidity.prototype.GetIsPointInSolidSide = function (x, y, layer, tile) {
        var slopePoint = Utility.Round(this.GetSlopePoint(x, layer, tile));
        var testY = Utility.Round(y);
        if (this.verticalSolidDirection == -1)
            return slopePoint > testY;
        else
            return slopePoint < testY;
    };
    return SlopeSolidity;
}(BaseSolidity));
var Solidity = /** @class */ (function () {
    function Solidity() {
    }
    Solidity.Block = new BaseSolidity();
    Solidity.SolidForPlayer = new BaseSolidity();
    Solidity.SolidForNonplayer = new BaseSolidity();
    Solidity.None = new BaseSolidity();
    Solidity.Top = new BaseSolidity();
    Solidity.Bottom = new BaseSolidity();
    Solidity.LeftWall = new BaseSolidity();
    Solidity.RightWall = new BaseSolidity();
    Solidity.SteepSlopeUp = new SlopeSolidity(function (x) { return 1 - x; }, 1, 1, 1);
    Solidity.SteepSlopeDown = new SlopeSolidity(function (x) { return x; }, 1, -1, 1);
    Solidity.SteepCeilingUp = new SlopeSolidity(function (x) { return 1 - x; }, -1, -1, 1);
    Solidity.SteepCeilingDown = new SlopeSolidity(function (x) { return x; }, -1, 1, 1);
    Solidity.HalfSlopeUpLeft = new SlopeSolidity(function (x) { return 1 - x / 2; }, 1, 1, 0.5);
    Solidity.HalfSlopeUpRight = new SlopeSolidity(function (x) { return 0.5 - x / 2; }, 1, 1, 0.5);
    Solidity.HalfSlopeDownLeft = new SlopeSolidity(function (x) { return x / 2; }, 1, -1, 0.5);
    Solidity.HalfSlopeDownRight = new SlopeSolidity(function (x) { return x / 2 + 0.5; }, 1, -1, 0.5);
    Solidity.HalfCeilingUpLeft = new SlopeSolidity(function (x) { return 1 - x / 2; }, -1, -1, 0.5);
    Solidity.HalfCeilingUpRight = new SlopeSolidity(function (x) { return 0.5 - x / 2; }, -1, -1, 0.5);
    Solidity.HalfCeilingDownLeft = new SlopeSolidity(function (x) { return x / 2; }, -1, 1, 0.5);
    Solidity.HalfCeilingDownRight = new SlopeSolidity(function (x) { return x / 2 + 0.5; }, -1, 1, 0.5);
    Solidity.DoubleSlopeUpLower = new SlopeSolidity(function (x) { return 1 - 2 * x; }, 1, 1, 2);
    Solidity.DoubleSlopeUpUpper = new SlopeSolidity(function (x) { return 2 - 2 * x; }, 1, 1, 2);
    Solidity.DoubleSlopeDownUpper = new SlopeSolidity(function (x) { return 2 * x; }, 1, -1, 2);
    Solidity.DoubleSlopeDownLower = new SlopeSolidity(function (x) { return 2 * x - 1; }, 1, -1, 2);
    Solidity.DoubleCeilingUpUpper = new SlopeSolidity(function (x) { return 2 * x; }, -1, 1, 2);
    Solidity.DoubleCeilingUpLower = new SlopeSolidity(function (x) { return 2 * x - 1; }, -1, 1, 2);
    Solidity.DoubleCeilingDownLower = new SlopeSolidity(function (x) { return 1 - 2 * x; }, -1, -1, 2);
    Solidity.DoubleCeilingDownUpper = new SlopeSolidity(function (x) { return 2 - 2 * x; }, -1, -1, 2);
    return Solidity;
}());
