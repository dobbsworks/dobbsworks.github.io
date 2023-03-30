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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var EditorTool = /** @class */ (function () {
    function EditorTool() {
        this.selectedTiles = [];
        this.invalidTiles = [];
        this.initiallyClicked = false;
    }
    return EditorTool;
}());
var Eraser = /** @class */ (function (_super) {
    __extends(Eraser, _super);
    function Eraser() {
        return _super.call(this) || this;
    }
    Eraser.prototype.OnInitialClick = function (tileCoord) { };
    ;
    Eraser.prototype.OnClickOver = function (tileCoord) {
        var erased = [];
        if (editorHandler.enableEraseSprites) {
            var existingSpriteOnTile_1 = editorHandler.sprites.find(function (a) { return a.ContainsTile(tileCoord); });
            if (existingSpriteOnTile_1 && existingSpriteOnTile_1.spriteType != Player) {
                editorHandler.sprites = editorHandler.sprites.filter(function (a) { return a != existingSpriteOnTile_1; });
            }
        }
        if (editorHandler.enableEraseTiles) {
            erased.push(currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.Air));
            erased.push(currentMap.semisolidLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.Air));
        }
        if (editorHandler.enableEraseWires) {
            erased.push(currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.Air));
        }
        if (editorHandler.enableEraseBackdrop) {
            erased.push(currentMap.backdropLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.Air));
        }
        if (editorHandler.enableEraseWater) {
            erased.push(currentMap.waterLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.Air));
        }
        if (erased.some(function (a) { return a; }))
            audioHandler.PlaySound("erase", true);
    };
    ;
    Eraser.prototype.OnReleaseClick = function () { };
    ;
    Eraser.prototype.OnCancel = function () { };
    ;
    return Eraser;
}(EditorTool));
var SpritePlacer = /** @class */ (function (_super) {
    __extends(SpritePlacer, _super);
    function SpritePlacer(spriteType) {
        var _this = _super.call(this) || this;
        _this.spriteType = spriteType;
        _this.heldSprite = null;
        _this.xHoldOffset = 0;
        _this.yHoldOffset = 0;
        _this.isResizing = false;
        _this.resizeSide = -1;
        if (spriteTypes.indexOf(spriteType) == -1) {
            console.error("Sprite type missing from ordered list: " + spriteType.name);
        }
        return _this;
    }
    SpritePlacer.prototype.OnInitialClick = function (tileCoord) {
        this.previousPosition = tileCoord;
        var existingSpriteOnTile = editorHandler.sprites.find(function (a) { return a.ContainsTile(tileCoord); });
        if (existingSpriteOnTile) {
            this.heldSprite = existingSpriteOnTile;
            this.xHoldOffset = tileCoord.tileX - existingSpriteOnTile.tileCoord.tileX;
            this.yHoldOffset = tileCoord.tileY - existingSpriteOnTile.tileCoord.tileY;
            this.heldSprite.StackWiggle(0, 0);
            if (existingSpriteOnTile.spriteInstance instanceof BasePlatform) {
                if (AreCoordsEqual(tileCoord, existingSpriteOnTile.tileCoord)) {
                    this.resizeSide = -1;
                    this.isResizing = true;
                }
                if (AreCoordsEqual(tileCoord, existingSpriteOnTile.GetTopRightCoord())) {
                    this.resizeSide = 1;
                    this.isResizing = true;
                }
            }
        }
        else {
            this.heldSprite = new EditorSprite(this.spriteType, tileCoord);
            this.xHoldOffset = 0;
            this.yHoldOffset = 0;
            editorHandler.sprites.push(this.heldSprite);
        }
        this.heldSprite.isHeld = true;
    };
    ;
    SpritePlacer.prototype.OnClickOver = function (tileCoord) {
        if (this.heldSprite) {
            if (this.isResizing) {
                var dx = tileCoord.tileX - this.previousPosition.tileX;
                if (dx != 0) {
                    var widthChange = dx * this.resizeSide;
                    if (this.heldSprite.width + widthChange < 2) {
                        widthChange = 2 - this.heldSprite.width;
                    }
                    this.heldSprite.width += widthChange;
                    if (!this.heldSprite.editorProps[0])
                        this.heldSprite.editorProps[0] = 3;
                    this.heldSprite.editorProps[0] += widthChange;
                    if (this.resizeSide == -1) {
                        this.heldSprite.tileCoord.tileX -= widthChange;
                    }
                    this.heldSprite.ResetSprite();
                }
            }
            else {
                this.heldSprite.SetPosition({ tileX: tileCoord.tileX - this.xHoldOffset, tileY: tileCoord.tileY - this.yHoldOffset });
            }
        }
        this.previousPosition = tileCoord;
    };
    ;
    SpritePlacer.prototype.OnReleaseClick = function () {
        var _this = this;
        this.isResizing = false;
        if (this.heldSprite) {
            var spriteAlreadyThere_1 = editorHandler.sprites.find(function (a) { return _this.heldSprite && a.OverlapsSprite(_this.heldSprite); });
            if (spriteAlreadyThere_1 && spriteAlreadyThere_1.spriteType != Player) {
                // TODO special case for giftbox
                editorHandler.sprites = editorHandler.sprites.filter(function (a) { return a !== spriteAlreadyThere_1; });
                var deadSprite = new DeadEnemy(spriteAlreadyThere_1.spriteInstance);
                currentMap.mainLayer.sprites.push(deadSprite);
            }
            var maxAllowed = this.heldSprite.spriteInstance.maxAllowed;
            if (maxAllowed > 0) {
                var spritesOnMap = editorHandler.sprites.filter(function (a) {
                    if (!_this.heldSprite)
                        return false;
                    if (a.spriteType == Player && _this.heldSprite.spriteType == HoverPlayer)
                        return true;
                    if (a.spriteType == HoverPlayer && _this.heldSprite.spriteType == Player)
                        return true;
                    return a.spriteType == _this.heldSprite.spriteType;
                });
                if (spritesOnMap.length > maxAllowed) {
                    var numberToRemove = spritesOnMap.length - maxAllowed;
                    var spritesToRemove_1 = spritesOnMap.slice(0, numberToRemove);
                    editorHandler.sprites = editorHandler.sprites.filter(function (a) { return spritesToRemove_1.indexOf(a) == -1; });
                }
            }
            this.heldSprite.StackWiggle(0, 0);
            this.heldSprite.isHeld = false;
        }
        this.heldSprite = null;
    };
    ;
    SpritePlacer.prototype.OnCancel = function () {
        var _this = this;
        this.isResizing = false;
        editorHandler.sprites = editorHandler.sprites.filter(function (a) { return a !== _this.heldSprite; });
        this.heldSprite = null;
    };
    ;
    return SpritePlacer;
}(EditorTool));
var FillBrush = /** @class */ (function (_super) {
    __extends(FillBrush, _super);
    function FillBrush(fillType) {
        var _this = _super.call(this) || this;
        _this.fillType = fillType;
        return _this;
    }
    FillBrush.prototype.OnReleaseClick = function () {
        if (this.fillType)
            this.fillType.FillTiles(this.selectedTiles);
        if (this.selectedTiles.length)
            audioHandler.PlaySound("thump", true);
        this.selectedTiles = [];
    };
    FillBrush.prototype.OnCancel = function () {
        if (this.selectedTiles.length)
            audioHandler.PlaySound("error", true);
        this.selectedTiles = [];
    };
    return FillBrush;
}(EditorTool));
var FreeformBrush = /** @class */ (function (_super) {
    __extends(FreeformBrush, _super);
    function FreeformBrush() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FreeformBrush.prototype.AddTile = function (tileCoord) {
        if (!this.selectedTiles.some(function (a) { return a.tileX == tileCoord.tileX && a.tileY == tileCoord.tileY; })) {
            this.selectedTiles.push(tileCoord);
        }
    };
    FreeformBrush.prototype.OnInitialClick = function (tileCoord) { };
    FreeformBrush.prototype.OnClickOver = function (tileCoord) {
        this.AddTile(tileCoord);
    };
    return FreeformBrush;
}(FillBrush));
var CornerToCornerBrush = /** @class */ (function (_super) {
    __extends(CornerToCornerBrush, _super);
    function CornerToCornerBrush() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.corner1 = null;
        _this.corner2 = null;
        return _this;
    }
    CornerToCornerBrush.prototype.OnInitialClick = function (tileCoord) {
        this.corner1 = tileCoord;
    };
    CornerToCornerBrush.prototype.OnClickOver = function (tileCoord) {
        this.corner2 = tileCoord;
        this.UpdateSelection();
    };
    return CornerToCornerBrush;
}(FillBrush));
var LineBrush = /** @class */ (function (_super) {
    __extends(LineBrush, _super);
    function LineBrush() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineBrush.prototype.UpdateSelection = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        this.selectedTiles = [];
        var left = Math.min(((_a = this.corner1) === null || _a === void 0 ? void 0 : _a.tileX) || 0, ((_b = this.corner2) === null || _b === void 0 ? void 0 : _b.tileX) || 0);
        var right = Math.max(((_c = this.corner1) === null || _c === void 0 ? void 0 : _c.tileX) || 0, ((_d = this.corner2) === null || _d === void 0 ? void 0 : _d.tileX) || 0);
        var top = Math.min(((_e = this.corner1) === null || _e === void 0 ? void 0 : _e.tileY) || 0, ((_f = this.corner2) === null || _f === void 0 ? void 0 : _f.tileY) || 0);
        var bottom = Math.max(((_g = this.corner1) === null || _g === void 0 ? void 0 : _g.tileY) || 0, ((_h = this.corner2) === null || _h === void 0 ? void 0 : _h.tileY) || 0);
        if (right - left > bottom - top) {
            for (var x = left; x <= right; x++) {
                if (top == bottom) {
                    this.selectedTiles.push({ tileX: x, tileY: top });
                }
                else {
                    var m = ((((_j = this.corner1) === null || _j === void 0 ? void 0 : _j.tileY) || 0) - (((_k = this.corner2) === null || _k === void 0 ? void 0 : _k.tileY) || 0)) / ((((_l = this.corner1) === null || _l === void 0 ? void 0 : _l.tileX) || 0) - (((_m = this.corner2) === null || _m === void 0 ? void 0 : _m.tileX) || 0));
                    var b = (((_o = this.corner1) === null || _o === void 0 ? void 0 : _o.tileY) || 0) - m * (((_p = this.corner1) === null || _p === void 0 ? void 0 : _p.tileX) || 0);
                    var y = +((m * x + b).toFixed(0));
                    this.selectedTiles.push({ tileX: x, tileY: y });
                }
            }
        }
        else {
            for (var y = top; y <= bottom; y++) {
                if (left == right) {
                    this.selectedTiles.push({ tileX: left, tileY: y });
                }
                else {
                    var m = ((((_q = this.corner1) === null || _q === void 0 ? void 0 : _q.tileY) || 0) - (((_r = this.corner2) === null || _r === void 0 ? void 0 : _r.tileY) || 0)) / ((((_s = this.corner1) === null || _s === void 0 ? void 0 : _s.tileX) || 0) - (((_t = this.corner2) === null || _t === void 0 ? void 0 : _t.tileX) || 0));
                    var b = (((_u = this.corner1) === null || _u === void 0 ? void 0 : _u.tileY) || 0) - m * (((_v = this.corner1) === null || _v === void 0 ? void 0 : _v.tileX) || 0);
                    var x = +(((y - b) / m).toFixed(0));
                    this.selectedTiles.push({ tileX: x, tileY: y });
                }
            }
        }
    };
    return LineBrush;
}(CornerToCornerBrush));
var RectangleBrush = /** @class */ (function (_super) {
    __extends(RectangleBrush, _super);
    function RectangleBrush() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RectangleBrush.prototype.UpdateSelection = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.selectedTiles = [];
        var left = Math.min(((_a = this.corner1) === null || _a === void 0 ? void 0 : _a.tileX) || 0, ((_b = this.corner2) === null || _b === void 0 ? void 0 : _b.tileX) || 0);
        var right = Math.max(((_c = this.corner1) === null || _c === void 0 ? void 0 : _c.tileX) || 0, ((_d = this.corner2) === null || _d === void 0 ? void 0 : _d.tileX) || 0);
        var top = Math.min(((_e = this.corner1) === null || _e === void 0 ? void 0 : _e.tileY) || 0, ((_f = this.corner2) === null || _f === void 0 ? void 0 : _f.tileY) || 0);
        var bottom = Math.max(((_g = this.corner1) === null || _g === void 0 ? void 0 : _g.tileY) || 0, ((_h = this.corner2) === null || _h === void 0 ? void 0 : _h.tileY) || 0);
        for (var x = left; x <= right; x++) {
            for (var y = top; y <= bottom; y++) {
                this.selectedTiles.push({ tileX: x, tileY: y });
            }
        }
    };
    return RectangleBrush;
}(CornerToCornerBrush));
var CircleBrush = /** @class */ (function (_super) {
    __extends(CircleBrush, _super);
    function CircleBrush() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CircleBrush.prototype.UpdateSelection = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.selectedTiles = [];
        var left = Math.min(((_a = this.corner1) === null || _a === void 0 ? void 0 : _a.tileX) || 0, ((_b = this.corner2) === null || _b === void 0 ? void 0 : _b.tileX) || 0);
        var right = Math.max(((_c = this.corner1) === null || _c === void 0 ? void 0 : _c.tileX) || 0, ((_d = this.corner2) === null || _d === void 0 ? void 0 : _d.tileX) || 0);
        var top = Math.min(((_e = this.corner1) === null || _e === void 0 ? void 0 : _e.tileY) || 0, ((_f = this.corner2) === null || _f === void 0 ? void 0 : _f.tileY) || 0);
        var bottom = Math.max(((_g = this.corner1) === null || _g === void 0 ? void 0 : _g.tileY) || 0, ((_h = this.corner2) === null || _h === void 0 ? void 0 : _h.tileY) || 0);
        var centerX = (left + right) / 2;
        var centerY = (top + bottom) / 2;
        for (var x = left; x <= right; x++) {
            for (var y = top; y <= bottom; y++) {
                var xRatio = (centerX - x) / ((right - left + 1) / 2);
                var yRatio = (centerY - y) / ((bottom - top + 1) / 2);
                if (Math.pow(xRatio, 2) + Math.pow(yRatio, 2) <= 1)
                    this.selectedTiles.push({ tileX: x, tileY: y });
            }
        }
    };
    return CircleBrush;
}(CornerToCornerBrush));
var FillType = /** @class */ (function () {
    function FillType() {
    }
    return FillType;
}());
var SimpleFill = /** @class */ (function (_super) {
    __extends(SimpleFill, _super);
    function SimpleFill(fillTile) {
        var _this = _super.call(this) || this;
        _this.fillTile = fillTile;
        return _this;
    }
    SimpleFill.prototype.FillTiles = function (tileCoordinates) {
        for (var _i = 0, tileCoordinates_1 = tileCoordinates; _i < tileCoordinates_1.length; _i++) {
            var tileCoord = tileCoordinates_1[_i];
            if (this.fillTile.targetLayer == TargetLayer.backdrop)
                currentMap.backdropLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
            if (this.fillTile.targetLayer == TargetLayer.main)
                currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
            if (this.fillTile.targetLayer == TargetLayer.semisolid)
                currentMap.semisolidLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
            if (this.fillTile.targetLayer == TargetLayer.water)
                currentMap.waterLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
            if (this.fillTile.targetLayer == TargetLayer.wire)
                currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
        }
    };
    return SimpleFill;
}(FillType));
var SlopePen = /** @class */ (function (_super) {
    __extends(SlopePen, _super);
    function SlopePen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SlopePen.prototype.UpdateSelection = function () {
        var _a, _b;
        _super.prototype.UpdateSelection.call(this);
        if (this.selectedTiles.length > 1) {
            var last = this.selectedTiles.splice(this.selectedTiles.length - 1)[0];
            this.selectedTiles.splice(1, 0, last);
            // [1st, last, 2nd, 3rd...]
        }
        var minY = Math.min.apply(Math, this.selectedTiles.map(function (a) { return a.tileY; }));
        var maxY = Math.max.apply(Math, this.selectedTiles.map(function (a) { return a.tileY; }));
        var minX = Math.min.apply(Math, this.selectedTiles.map(function (a) { return a.tileX; }));
        var maxX = Math.max.apply(Math, this.selectedTiles.map(function (a) { return a.tileX; }));
        var rise = maxY - minY + 1;
        var run = maxX - minX + 1;
        var slope = rise / run;
        if (Math.abs(slope) !== 1 && Math.abs(slope) !== 0.5 && Math.abs(slope) !== 2) {
            this.invalidTiles = __spreadArrays(this.selectedTiles);
            this.selectedTiles = [];
            return;
        }
        this.invalidTiles = [];
        if (Math.abs(slope) == 1 || Math.abs(slope) == 0.5) {
            var upperLine = this.selectedTiles.filter(function (a) { return a.tileY != minY; }).map(function (a) { return ({ tileX: a.tileX, tileY: a.tileY - 1 }); });
            var lowerLine = this.selectedTiles.filter(function (a) { return a.tileY != maxY; }).map(function (a) { return ({ tileX: a.tileX, tileY: a.tileY + 1 }); });
            (_a = this.selectedTiles).push.apply(_a, __spreadArrays(upperLine, lowerLine));
        }
        if (Math.abs(slope) == 2) {
            var leftLine = this.selectedTiles.filter(function (a) { return a.tileX != minX; }).map(function (a) { return ({ tileX: a.tileX - 1, tileY: a.tileY }); });
            var rightLine = this.selectedTiles.filter(function (a) { return a.tileX != maxX; }).map(function (a) { return ({ tileX: a.tileX + 1, tileY: a.tileY }); });
            (_b = this.selectedTiles).push.apply(_b, __spreadArrays(leftLine, rightLine));
        }
    };
    return SlopePen;
}(LineBrush));
var SlopeFill = /** @class */ (function (_super) {
    __extends(SlopeFill, _super);
    function SlopeFill(slopeTileKey, innerTileType) {
        var _this = _super.call(this) || this;
        _this.slopeTileKey = slopeTileKey;
        _this.innerTileType = innerTileType;
        return _this;
    }
    SlopeFill.prototype.GetThumbnailImage = function () {
        return TileType.GetTileTypeFromKey(this.slopeTileKey + "SteepSlopeUp").imageTile;
    };
    SlopeFill.prototype.FillTiles = function (tileCoordinates) {
        // need to make sure to send start of pen drag as first tile
        // to differentiate between mirrorable arrangements
        // second tile is endpoint of line to extrapolate direction and slope
        var initialPoint = tileCoordinates[0];
        if (!initialPoint)
            return;
        currentMap.mainLayer.SetTile(initialPoint.tileX, initialPoint.tileY, this.innerTileType);
        if (tileCoordinates.length == 1) {
            return;
        }
        var endPoint = tileCoordinates[1];
        var dx = initialPoint.tileX - endPoint.tileX;
        var dy = initialPoint.tileY - endPoint.tileY;
        tileCoordinates.splice(0, 1);
        var slope = dy / dx;
        var isSlopePositive = slope < 0;
        if (Math.abs(slope) == 1) {
            // 45 degree slope
            var upperTile = TileType.GetTileTypeFromKey(this.slopeTileKey + "SteepSlope" + (isSlopePositive ? "Up" : "Down"));
            var lowerTile = TileType.GetTileTypeFromKey(this.slopeTileKey + "SteepCeiling" + (isSlopePositive ? "Up" : "Down"));
            for (var _i = 0, tileCoordinates_2 = tileCoordinates; _i < tileCoordinates_2.length; _i++) {
                var tileCoord = tileCoordinates_2[_i];
                var slopeFromHere = (tileCoord.tileY - initialPoint.tileY) / (tileCoord.tileX - initialPoint.tileX);
                if (Math.abs(slopeFromHere) == 1) {
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.innerTileType);
                }
                else if (Math.abs(slopeFromHere) < 1) {
                    // above the center line
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, upperTile);
                }
                else {
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, lowerTile);
                }
            }
        }
        else if (Math.abs(slope) < 1) {
            // ~35 degree slope
            var upperTileSmall = TileType.GetTileTypeFromKey(this.slopeTileKey + "HalfSlope" + (isSlopePositive ? "UpLeft" : "DownRight"));
            var upperTileLarge = TileType.GetTileTypeFromKey(this.slopeTileKey + "HalfSlope" + (isSlopePositive ? "UpRight" : "DownLeft"));
            var lowerTileLarge = TileType.GetTileTypeFromKey(this.slopeTileKey + "HalfCeiling" + (isSlopePositive ? "UpLeft" : "DownRight"));
            var lowerTileSmall = TileType.GetTileTypeFromKey(this.slopeTileKey + "HalfCeiling" + (isSlopePositive ? "UpRight" : "DownLeft"));
            for (var _a = 0, tileCoordinates_3 = tileCoordinates; _a < tileCoordinates_3.length; _a++) {
                var tileCoord = tileCoordinates_3[_a];
                var dxTest = Math.floor(Math.abs(tileCoord.tileX - initialPoint.tileX) / 2);
                var parity = Math.abs(tileCoord.tileX - initialPoint.tileX) % 2 == 0;
                var dyFromInit = tileCoord.tileY - initialPoint.tileY;
                if (Math.abs(dyFromInit) == dxTest) {
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.innerTileType);
                }
                else if (Math.abs(dyFromInit) > dxTest) {
                    if (isSlopePositive)
                        currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? upperTileSmall : upperTileLarge);
                    if (!isSlopePositive)
                        currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? lowerTileSmall : lowerTileLarge);
                }
                else if (Math.abs(dyFromInit) < dxTest) {
                    if (isSlopePositive)
                        currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? lowerTileLarge : lowerTileSmall);
                    if (!isSlopePositive)
                        currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? upperTileLarge : upperTileSmall);
                }
            }
        }
        else {
            // ~70 degree slope
            var upperTileLower = TileType.GetTileTypeFromKey(this.slopeTileKey + "DoubleSlope" + (isSlopePositive ? "UpLower" : "DownLower"));
            var upperTileUpper = TileType.GetTileTypeFromKey(this.slopeTileKey + "DoubleSlope" + (isSlopePositive ? "UpUpper" : "DownUpper"));
            var lowerTileA = TileType.GetTileTypeFromKey(this.slopeTileKey + "DoubleCeiling" + (!isSlopePositive ? "UpUpper" : "DownUpper"));
            var lowerTileB = TileType.GetTileTypeFromKey(this.slopeTileKey + "DoubleCeiling" + (!isSlopePositive ? "UpLower" : "DownLower"));
            for (var _b = 0, tileCoordinates_4 = tileCoordinates; _b < tileCoordinates_4.length; _b++) {
                var tileCoord = tileCoordinates_4[_b];
                var dyTest = Math.floor(Math.abs(tileCoord.tileY - initialPoint.tileY) / 2);
                var parity = Math.abs(tileCoord.tileY - initialPoint.tileY) % 2 == 0;
                var dxFromInit = tileCoord.tileX - initialPoint.tileX;
                if (Math.abs(dxFromInit) == dyTest) {
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.innerTileType);
                }
                else if (Math.abs(dxFromInit) > dyTest) {
                    if (isSlopePositive)
                        currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? upperTileUpper : upperTileLower);
                    if (!isSlopePositive)
                        currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? upperTileUpper : upperTileLower);
                }
                else if (Math.abs(dxFromInit) < dyTest) {
                    if (!isSlopePositive)
                        currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? lowerTileA : lowerTileB);
                    if (isSlopePositive)
                        currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? lowerTileA : lowerTileB);
                }
            }
        }
    };
    return SlopeFill;
}(FillType));
var TrackPlacer = /** @class */ (function (_super) {
    __extends(TrackPlacer, _super);
    function TrackPlacer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrackPlacer.prototype.FillTiles = function (tileCoordinates) {
        var retryList = [];
        var _loop_1 = function (tileCoord) {
            // Which ways can this tile connect?
            var connectableDirections = Direction.All.filter(function (dir) {
                if (tileCoordinates.some(function (a) { return a.tileX == tileCoord.tileX + dir.x && a.tileY == tileCoord.tileY + dir.y; }))
                    return true;
                var trackNeighbor = currentMap.wireLayer.GetTileByIndex(tileCoord.tileX + dir.x, tileCoord.tileY + dir.y);
                if (trackNeighbor.tileType.trackDirections.length == 1)
                    return true;
                if (trackNeighbor.tileType.trackDirections.indexOf(dir.Opposite()) > -1)
                    return true;
                return false;
            });
            if (connectableDirections.length == 0) {
                currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.TrackHorizontal);
            }
            else if (connectableDirections.length == 1) {
                var targetTrackType = Object.values(TileType.TileMap).find(function (a) { return a.trackDirections.length == 1 && a.trackDirections[0] == connectableDirections[0]; });
                if (targetTrackType) {
                    currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, targetTrackType);
                }
                else {
                    console.error("Uh oh, missing track type?");
                }
            }
            else if (connectableDirections.length == 2) {
                var targetTrackType = Object.values(TileType.TileMap).find(function (a) { return a.trackDirections.length == 2 && a.trackDirections.indexOf(connectableDirections[0]) > -1 && a.trackDirections.indexOf(connectableDirections[1]) > -1; });
                if (targetTrackType) {
                    currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, targetTrackType);
                }
                else {
                    console.error("Uh oh, missing track type?");
                }
            }
            else if (connectableDirections.length == 4) {
                currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.TrackBridge);
            }
            else {
                retryList.push(tileCoord);
            }
            var _loop_2 = function (dir) {
                // look at each neighbor and see if we can connect them
                var trackNeighbor = currentMap.wireLayer.GetTileByIndex(tileCoord.tileX + dir.x, tileCoord.tileY + dir.y);
                if (tileCoordinates.some(function (a) { return a.tileX == trackNeighbor.tileX && a.tileY == trackNeighbor.tileY; }))
                    return "continue";
                if (trackNeighbor.tileType.trackDirections.length == 1) {
                    var targetTrackType = Object.values(TileType.TileMap).find(function (a) { return a.trackDirections.length == 2 &&
                        a.trackDirections.indexOf(dir.Opposite()) > -1 && a.trackDirections.indexOf(trackNeighbor.tileType.trackDirections[0]) > -1; });
                    if (targetTrackType) {
                        currentMap.wireLayer.SetTile(trackNeighbor.tileX, trackNeighbor.tileY, targetTrackType);
                    }
                    else {
                        console.error("Uh oh, missing track type?");
                    }
                }
            };
            for (var _i = 0, connectableDirections_1 = connectableDirections; _i < connectableDirections_1.length; _i++) {
                var dir = connectableDirections_1[_i];
                _loop_2(dir);
            }
        };
        for (var _i = 0, tileCoordinates_5 = tileCoordinates; _i < tileCoordinates_5.length; _i++) {
            var tileCoord = tileCoordinates_5[_i];
            _loop_1(tileCoord);
        }
        if (retryList.length != tileCoordinates.length) {
            this.FillTiles(retryList);
        }
    };
    return TrackPlacer;
}(FillType));
