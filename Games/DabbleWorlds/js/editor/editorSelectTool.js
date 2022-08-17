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
var EditorSelectTool = /** @class */ (function (_super) {
    __extends(EditorSelectTool, _super);
    function EditorSelectTool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectionAreaCorner1 = null;
        _this.selectionAreaCorner2 = null;
        _this.singleSpriteMoverTool = null;
        _this.selectionMoverTool = null;
        return _this;
    }
    EditorSelectTool.prototype.Reset = function () {
        this.selectionAreaCorner1 = null;
        this.selectionAreaCorner2 = null;
        this.selectedTiles = [];
        this.selectionMoverTool = null;
        this.singleSpriteMoverTool = null;
    };
    EditorSelectTool.prototype.OnInitialClick = function (tileCoord) {
        var _this = this;
        this.selectionMoverTool = null;
        this.singleSpriteMoverTool = null;
        if (this.selectionAreaCorner1 == null || this.selectionAreaCorner2 == null) {
            var existingSpriteOnTile = editorHandler.sprites.find(function (a) { return a.ContainsTile(tileCoord); });
            if (existingSpriteOnTile) {
                this.singleSpriteMoverTool = new SpritePlacer(existingSpriteOnTile.spriteType);
                this.singleSpriteMoverTool.OnInitialClick(tileCoord);
            }
            else {
                this.selectionAreaCorner1 = tileCoord;
            }
        }
        else {
            var isSelectedTileWithinSelection = tileCoord.tileX <= Math.max(this.selectionAreaCorner1.tileX, this.selectionAreaCorner2.tileX)
                && tileCoord.tileX >= Math.min(this.selectionAreaCorner1.tileX, this.selectionAreaCorner2.tileX)
                && tileCoord.tileY <= Math.max(this.selectionAreaCorner1.tileY, this.selectionAreaCorner2.tileY)
                && tileCoord.tileY >= Math.min(this.selectionAreaCorner1.tileY, this.selectionAreaCorner2.tileY);
            if (isSelectedTileWithinSelection) {
                this.selectionMoverTool = new EditorSelectionMover(this.selectionAreaCorner1.tileX, this.selectionAreaCorner1.tileY, this.selectionAreaCorner2.tileX, this.selectionAreaCorner2.tileY);
                this.selectionMoverTool.OnInitialClick(tileCoord);
                var sprites = editorHandler.sprites.filter(function (spr) { return _this.selectedTiles.some(function (tile) { return spr.ContainsTile(tile); }); });
                this.selectionMoverTool.sprites = sprites.map(function (a) { return a.Copy(); });
                this.selectionMoverTool.spritesInitialCoords = this.selectionMoverTool.sprites.map(function (a) { return (__assign({}, a.tileCoord)); });
                // holding control makes a copy
                // otherwise delete selected area
                if (!KeyboardHandler.IsKeyPressed(KeyAction.EditorPasteDrag, false)) {
                    this.DeleteSelectedTiles();
                }
                // let playerInSelection = editorHandler.sprites.find(spr => this.selectedTiles.some(tile => spr.ContainsTile(tile)) && spr.spriteType == Player);
                // if (playerInSelection) {
                //     editorHandler.sprites = editorHandler.sprites.filter(a => a !== playerInSelection)
                // }
                this.selectionAreaCorner1 = null;
                this.selectionAreaCorner2 = null;
                this.selectedTiles = [];
            }
            else {
                this.selectionAreaCorner1 = tileCoord;
            }
        }
    };
    ;
    EditorSelectTool.prototype.OnClickOver = function (tileCoord) {
        if (this.singleSpriteMoverTool) {
            this.singleSpriteMoverTool.OnClickOver(tileCoord);
        }
        else if (this.selectionMoverTool) {
            var offset = { tileX: this.selectionMoverTool.xOffset, tileY: this.selectionMoverTool.yOffset };
            this.selectionAreaCorner1 = AddCoords(this.selectionMoverTool.upperLeftSelectionStart, offset);
            this.selectionAreaCorner2 = AddCoords(this.selectionAreaCorner1, { tileX: this.selectionMoverTool.containedTiles.length - 1, tileY: this.selectionMoverTool.containedTiles[0].length - 1 });
            this.UpdateSelection();
            this.selectionMoverTool.OnClickOver(tileCoord);
        }
        else if (this.selectionAreaCorner1) {
            this.selectionAreaCorner2 = tileCoord;
            this.UpdateSelection();
        }
    };
    ;
    EditorSelectTool.prototype.OnReleaseClick = function () {
        var _this = this;
        if (this.singleSpriteMoverTool) {
            this.singleSpriteMoverTool.OnReleaseClick();
        }
        else if (this.selectionMoverTool) {
            this.selectionMoverTool.OnReleaseClick();
        }
        this.selectionMoverTool = null;
        this.singleSpriteMoverTool = null;
        editorHandler.sprites.
            filter(function (spr) { return _this.selectedTiles.some(function (tile) { return spr.ContainsTile(tile); }); }).
            forEach(function (spr) { return spr.Wiggle(0); });
    };
    ;
    EditorSelectTool.prototype.OnCancel = function () {
        if (this.singleSpriteMoverTool) {
            this.singleSpriteMoverTool.OnCancel();
        }
        else if (this.selectionMoverTool) {
            this.selectionMoverTool.OnCancel();
        }
        this.Reset();
    };
    ;
    EditorSelectTool.prototype.UpdateSelection = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.selectedTiles = [];
        var left = Math.min(((_a = this.selectionAreaCorner1) === null || _a === void 0 ? void 0 : _a.tileX) || 0, ((_b = this.selectionAreaCorner2) === null || _b === void 0 ? void 0 : _b.tileX) || 0);
        var right = Math.max(((_c = this.selectionAreaCorner1) === null || _c === void 0 ? void 0 : _c.tileX) || 0, ((_d = this.selectionAreaCorner2) === null || _d === void 0 ? void 0 : _d.tileX) || 0);
        var top = Math.min(((_e = this.selectionAreaCorner1) === null || _e === void 0 ? void 0 : _e.tileY) || 0, ((_f = this.selectionAreaCorner2) === null || _f === void 0 ? void 0 : _f.tileY) || 0);
        var bottom = Math.max(((_g = this.selectionAreaCorner1) === null || _g === void 0 ? void 0 : _g.tileY) || 0, ((_h = this.selectionAreaCorner2) === null || _h === void 0 ? void 0 : _h.tileY) || 0);
        for (var x = left; x <= right; x++) {
            for (var y = top; y <= bottom; y++) {
                this.selectedTiles.push({ tileX: x, tileY: y });
            }
        }
    };
    EditorSelectTool.prototype.DeleteSelectedTiles = function () {
        var _this = this;
        var layers = currentMap.GetLayerList();
        var _loop_1 = function (tile) {
            layers.forEach(function (a) { return a.SetTile(tile.tileX, tile.tileY, TileType.Air); });
        };
        for (var _i = 0, _a = this.selectedTiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            _loop_1(tile);
        }
        editorHandler.sprites = editorHandler.sprites.filter(function (spr) { return !_this.selectedTiles.some(function (tile) { return spr.ContainsTile(tile); }) || spr.spriteInstance.isRequired; });
    };
    return EditorSelectTool;
}(EditorTool));
var EditorSelectionMover = /** @class */ (function (_super) {
    __extends(EditorSelectionMover, _super);
    function EditorSelectionMover(x1, y1, x2, y2) {
        var _this = _super.call(this) || this;
        _this.containedTiles = [];
        _this.xOffset = 0;
        _this.yOffset = 0;
        _this.sprites = [];
        _this.spritesInitialCoords = [];
        var left = Math.min(x1, x2);
        var right = Math.max(x1, x2);
        var top = Math.min(y1, y2);
        var bottom = Math.max(y1, y2);
        _this.upperLeftSelectionStart = { tileX: left, tileY: top };
        var _loop_2 = function (x) {
            var col = [];
            var _loop_3 = function (y) {
                var cell = currentMap.GetLayerList().map(function (layer) { return layer.GetTileByIndex(x, y).tileType; });
                col.push(cell);
            };
            for (var y = top; y <= bottom; y++) {
                _loop_3(y);
            }
            this_1.containedTiles.push(col);
        };
        var this_1 = this;
        for (var x = left; x <= right; x++) {
            _loop_2(x);
        }
        var canvas = document.createElement("canvas");
        currentMap.GetLayerList().forEach(function (a) { return a.DrawSectionToCanvas(canvas, left, top, right, bottom); });
        var imageTile = new ImageTile(canvas, 0, 0, canvas.width, canvas.height);
        _this.frameData = {
            imageTile: imageTile,
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
        return _this;
    }
    EditorSelectionMover.prototype.OnInitialClick = function (tileCoord) {
        this.initialClickTile = tileCoord;
    };
    EditorSelectionMover.prototype.OnClickOver = function (tileCoord) {
        this.xOffset = tileCoord.tileX - this.initialClickTile.tileX;
        this.yOffset = tileCoord.tileY - this.initialClickTile.tileY;
        // bounds check
        var left = this.upperLeftSelectionStart.tileX + this.xOffset;
        if (left < 0)
            this.xOffset = -this.upperLeftSelectionStart.tileX;
        var top = this.upperLeftSelectionStart.tileY + this.yOffset;
        if (top < 0)
            this.yOffset = -this.upperLeftSelectionStart.tileY;
        var right = this.upperLeftSelectionStart.tileX + this.xOffset + this.containedTiles.length - 1;
        if (right > currentMap.mainLayer.tiles.length - 1)
            this.xOffset = currentMap.mainLayer.tiles.length - this.upperLeftSelectionStart.tileX - this.containedTiles.length;
        var bottom = this.upperLeftSelectionStart.tileY + this.yOffset + this.containedTiles[0].length - 1;
        if (bottom > currentMap.mainLayer.tiles[0].length - 1)
            this.yOffset = currentMap.mainLayer.tiles[0].length - this.upperLeftSelectionStart.tileY - this.containedTiles[0].length;
        for (var i = 0; i < this.sprites.length; i++) {
            var coord = this.spritesInitialCoords[i];
            this.sprites[i].SetPosition({ tileX: coord.tileX + this.xOffset, tileY: coord.tileY + this.yOffset });
        }
    };
    EditorSelectionMover.prototype.OnReleaseClick = function () {
        var upperLeftPaste = { tileX: this.upperLeftSelectionStart.tileX + this.xOffset, tileY: this.upperLeftSelectionStart.tileY + this.yOffset };
        var x = upperLeftPaste.tileX;
        var layers = currentMap.GetLayerList();
        for (var _i = 0, _a = this.containedTiles; _i < _a.length; _i++) {
            var col = _a[_i];
            var y = upperLeftPaste.tileY;
            for (var _b = 0, col_1 = col; _b < col_1.length; _b++) {
                var cell = col_1[_b];
                var layerIndex = 0;
                for (var _c = 0, cell_1 = cell; _c < cell_1.length; _c++) {
                    var tileType = cell_1[_c];
                    if (tileType != TileType.Air) {
                        layers[layerIndex].SetTile(x, y, tileType);
                    }
                    layerIndex++;
                }
                y++;
            }
            x++;
        }
        var _loop_4 = function (sprite) {
            var spriteAlreadyThere = editorHandler.sprites.find(function (a) { return a.OverlapsSprite(sprite); });
            if (spriteAlreadyThere) {
                editorHandler.sprites = editorHandler.sprites.filter(function (a) { return a !== spriteAlreadyThere; });
                var deadSprite = new DeadEnemy(spriteAlreadyThere.spriteInstance);
                currentMap.mainLayer.sprites.push(deadSprite);
            }
            editorHandler.sprites.push(sprite);
            var maxAllowed = sprite.spriteInstance.maxAllowed;
            if (maxAllowed > 0) {
                var spritesOnMap = editorHandler.sprites.filter(function (a) { return a.spriteType == sprite.spriteType; });
                if (spritesOnMap.length > maxAllowed) {
                    var numberToRemove = spritesOnMap.length - maxAllowed;
                    var spritesToRemove_1 = spritesOnMap.slice(0, numberToRemove);
                    editorHandler.sprites = editorHandler.sprites.filter(function (a) { return spritesToRemove_1.indexOf(a) == -1; });
                }
            }
        };
        for (var _d = 0, _e = this.sprites; _d < _e.length; _d++) {
            var sprite = _e[_d];
            _loop_4(sprite);
        }
    };
    EditorSelectionMover.prototype.OnCancel = function () {
        var upperLeftPaste = { tileX: this.upperLeftSelectionStart.tileX, tileY: this.upperLeftSelectionStart.tileY };
        var x = upperLeftPaste.tileX;
        var layers = currentMap.GetLayerList();
        for (var _i = 0, _a = this.containedTiles; _i < _a.length; _i++) {
            var col = _a[_i];
            var y = upperLeftPaste.tileY;
            for (var _b = 0, col_2 = col; _b < col_2.length; _b++) {
                var cell = col_2[_b];
                var layerIndex = 0;
                for (var _c = 0, cell_2 = cell; _c < cell_2.length; _c++) {
                    var tileType = cell_2[_c];
                    if (tileType != TileType.Air) {
                        layers[layerIndex].SetTile(x, y, tileType);
                    }
                    layerIndex++;
                }
                y++;
            }
            x++;
        }
        for (var i = 0; i < this.sprites.length; i++) {
            var coord = this.spritesInitialCoords[i];
            this.sprites[i].SetPosition({ tileX: coord.tileX, tileY: coord.tileY });
            editorHandler.sprites.push(this.sprites[i]);
        }
    };
    return EditorSelectionMover;
}(EditorTool));
