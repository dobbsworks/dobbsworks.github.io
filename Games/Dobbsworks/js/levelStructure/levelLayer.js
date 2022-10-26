"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var LevelLayer = /** @class */ (function () {
    function LevelLayer(layerType) {
        this.layerType = layerType;
        this.map = null;
        this.tiles = [];
        this.cachedCanvas = document.createElement("canvas");
        this.spriteCanvas = document.createElement("canvas");
        this.isDirty = true;
        this.sprites = [];
        this.tileHeight = 0;
        this.tileWidth = 0;
        this.isAnimatedTileListInitialized = false;
        this.animatedTileList = [];
        this.wireFlatMap = [];
        this.isWireFlatMapInitialized = false;
        this.tileHeight = TileType.Air.imageTile.height;
        this.tileWidth = TileType.Air.imageTile.width;
    }
    LevelLayer.prototype.GetMaxX = function () {
        return this.tiles.length * this.tileWidth;
    };
    LevelLayer.prototype.GetMaxY = function () {
        if (this.tiles.length == 0)
            return 0;
        return this.tiles[0].length * this.tileHeight;
    };
    LevelLayer.prototype.DrawToCache = function (frameNum) {
        if (this.isDirty) {
            if (this.layerType == TargetLayer.water)
                this.UpdateWaterTiles();
            this.cachedCanvas = document.createElement("canvas");
            if (this.tiles.length)
                this.DrawSectionToCanvas(this.cachedCanvas, 0, 0, this.tiles.length - 1, this.tiles[0].length - 1);
            this.spriteCanvas.width = camera.canvas.width;
            this.spriteCanvas.height = camera.canvas.height;
        }
        this.isDirty = false;
        for (var _i = 0, _a = this.animatedTileList; _i < _a.length; _i++) {
            var tile = _a[_i];
            var tileType = tile.tileType;
            var imageTiles = tileType.imageTiles;
            if (imageTiles) {
                var index = Math.floor(frameNum / tileType.framesPerTile) % imageTiles.length;
                this.RedrawTile(tile.tileX, tile.tileY, imageTiles[index]);
            }
            else {
                this.RedrawTile(tile.tileX, tile.tileY, tileType.imageTile);
            }
        }
    };
    LevelLayer.prototype.DrawSectionToCanvas = function (canvas, left, top, right, bottom) {
        var targetWidth = this.tileWidth * (right - left + 1);
        if (canvas.width != targetWidth)
            canvas.width = targetWidth;
        var targetHeight = this.tileHeight * (bottom - top + 1);
        if (canvas.height != targetHeight)
            canvas.height = targetHeight;
        var ctx = canvas.getContext("2d");
        var waterTiles = [TileType.Water, TileType.Waterfall, TileType.PurpleWater, TileType.Lava];
        var x = 0;
        for (var colIndex = left; colIndex <= right; colIndex++, x++) {
            var col = this.tiles[colIndex];
            if (!col)
                continue;
            var y = 0;
            for (var rowIndex = top; rowIndex <= bottom; rowIndex++, y++) {
                var tile = col[rowIndex];
                if (!tile)
                    continue;
                var imageTile = tile.tileType.imageTile;
                if (!imageTile)
                    continue;
                for (var _i = 0, _a = [TileType.Water, TileType.PurpleWater, TileType.Lava]; _i < _a.length; _i++) {
                    var waterType = _a[_i];
                    var baseRow = (waterType == TileType.Water ? 0 : 3);
                    if (waterType == TileType.Lava)
                        baseRow = 5;
                    if (this.layerType == TargetLayer.water && tile.tileType == waterType) {
                        var isWaterLeft = waterTiles.indexOf(this.GetTileByIndex(x - 1, y).tileType) > -1;
                        var isWaterRight = waterTiles.indexOf(this.GetTileByIndex(x + 1, y).tileType) > -1;
                        var isWaterDown = waterTiles.indexOf(this.GetTileByIndex(x, y + 1).tileType) > -1;
                        if (isWaterDown && isWaterLeft && !isWaterRight)
                            imageTile = tiles["water"][7][baseRow];
                        if (isWaterDown && !isWaterLeft && isWaterRight)
                            imageTile = tiles["water"][5][baseRow];
                        if (isWaterDown && !isWaterLeft && !isWaterRight)
                            imageTile = tiles["water"][6][baseRow];
                        if (!isWaterDown && isWaterLeft && isWaterRight)
                            imageTile = tiles["water"][6][1 + baseRow];
                        if (!isWaterDown && isWaterLeft && !isWaterRight)
                            imageTile = tiles["water"][7][1 + baseRow];
                        if (!isWaterDown && !isWaterLeft && isWaterRight)
                            imageTile = tiles["water"][5][1 + baseRow];
                        if (!isWaterDown && !isWaterLeft && !isWaterRight)
                            imageTile = tiles["water"][4][1 + baseRow];
                    }
                }
                imageTile.Draw(ctx, x * this.tileWidth, y * this.tileHeight, 1);
            }
        }
        if (this.map && this.map.silhoutteColor) {
            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = this.map.silhoutteColor;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalCompositeOperation = "source-over";
        }
    };
    LevelLayer.prototype.SetTile = function (xIndex, yIndex, tileType, isInitialMapSetup) {
        var _a;
        if (isInitialMapSetup === void 0) { isInitialMapSetup = false; }
        if (this.map && yIndex >= ((_a = this.map) === null || _a === void 0 ? void 0 : _a.mapHeight)) {
            new LevelTile(xIndex, yIndex, TileType.Air, this);
            return false;
        }
        var tileExists = !!(this.tiles[xIndex] && this.tiles[xIndex][yIndex]);
        var existingTile = this.GetTileByIndex(xIndex, yIndex);
        if (existingTile.tileType !== tileType || !tileExists) {
            this.wireFlatMap = this.wireFlatMap.filter(function (a) { return !(a.tileX == xIndex && a.tileY == yIndex); });
            existingTile.tileType = tileType;
            existingTile.SetPropertiesByTileType();
            var col = this.tiles[xIndex];
            if (!col)
                this.tiles[xIndex] = [];
            this.tiles[xIndex][yIndex] = existingTile;
            if (this.layerType == TargetLayer.water) {
                this.isDirty = true;
            }
            this.RedrawTile(xIndex, yIndex, tileType.imageTile);
            if (tileType.autoChange) {
                currentMap.autoChangeTiles.push({ tile: existingTile, standDuration: 0 });
            }
            var existingAnimatedEntry_1 = this.animatedTileList.find(function (a) { return a.tileX == xIndex && a.tileY == yIndex; });
            if (existingAnimatedEntry_1)
                this.animatedTileList = this.animatedTileList.filter(function (a) { return a != existingAnimatedEntry_1; });
            if (tileType instanceof AnimatedTileType)
                this.animatedTileList.push(existingTile);
            if (!isInitialMapSetup && this.layerType == TargetLayer.wire)
                this.wireFlatMap.push(existingTile);
            return true;
        }
        return false;
    };
    LevelLayer.prototype.UpdateWaterTiles = function () {
        for (var x = 0; x < this.tiles.length; x++) {
            for (var y = 0; y < this.tiles[0].length; y++) {
                var tile = this.GetTileByIndex(x, y);
                var tileAbove = this.GetTileByIndex(x, y - 1);
                if (tile.tileType == TileType.WaterSurface || tile.tileType == TileType.PurpleWaterSurface || tile.tileType == TileType.LavaSurface) {
                    tile.tileType = TileType.Air;
                }
                if (y > 0 && (tile.tileType == TileType.Water || tile.tileType == TileType.Waterfall) && tileAbove.tileType == TileType.Air) {
                    tileAbove.tileType = TileType.WaterSurface;
                }
                if (y > 0 && (tile.tileType == TileType.PurpleWater) && tileAbove.tileType == TileType.Air) {
                    tileAbove.tileType = TileType.PurpleWaterSurface;
                }
                if (y > 0 && (tile.tileType == TileType.Lava) && tileAbove.tileType == TileType.Air) {
                    tileAbove.tileType = TileType.LavaSurface;
                }
            }
        }
        this.animatedTileList = this.tiles.flatMap(function (a) { return a; }).filter(function (a) { return a.tileType instanceof AnimatedTileType; });
    };
    LevelLayer.prototype.RedrawTile = function (xIndex, yIndex, imageTile) {
        var cachedCtx = this.cachedCanvas.getContext("2d");
        cachedCtx.clearRect(xIndex * this.tileWidth, yIndex * this.tileHeight, this.tileWidth, this.tileHeight);
        imageTile.Draw(cachedCtx, xIndex * this.tileWidth, yIndex * this.tileHeight, 1);
        if (imageTile.yOffset != 0) {
            this.isDirty = true;
        }
        if (this.map && this.map.silhoutteColor) {
            cachedCtx.globalCompositeOperation = "source-atop";
            cachedCtx.fillStyle = this.map.silhoutteColor;
            cachedCtx.fillRect(xIndex * this.tileWidth, yIndex * this.tileHeight, this.tileWidth, this.tileHeight);
            cachedCtx.globalCompositeOperation = "source-over";
        }
    };
    LevelLayer.prototype.Update = function () {
        if (!this.isAnimatedTileListInitialized) {
            this.animatedTileList = this.tiles.flatMap(function (a) { return a; }).filter(function (a) { return a.tileType instanceof AnimatedTileType; });
            this.isAnimatedTileListInitialized = true;
        }
        if (this.layerType == TargetLayer.wire && !this.isWireFlatMapInitialized) {
            this.isWireFlatMapInitialized = true;
            this.wireFlatMap = this.tiles.flatMap(function (a) { return a; });
        }
        this.sprites.forEach(function (a) { return a.updatedThisFrame = false; });
        var platforms = this.sprites.filter(function (a) { return a.isPlatform; });
        var motors = this.sprites.filter(function (a) { return a instanceof Motor; });
        var players = this.sprites.filter(function (a) { return a instanceof Player; });
        platforms.sort(function (a, b) { return a.y - b.y; });
        var orderedSprites = __spreadArrays(motors, platforms, players, this.sprites.filter(function (a) { return !a.isPlatform && !(a instanceof Motor) && !(a instanceof Player); }));
        this.sprites = orderedSprites;
        for (var _i = 0, orderedSprites_1 = orderedSprites; _i < orderedSprites_1.length; _i++) {
            var sprite = orderedSprites_1[_i];
            if (sprite.locked)
                continue;
            if (sprite.updatedThisFrame)
                continue;
            if (!sprite.isActive)
                continue;
            sprite.updatedThisFrame = true;
            sprite.SharedUpdate();
            sprite.Update();
            if (sprite instanceof Enemy) {
                sprite.EnemyUpdate();
            }
        }
        this.sprites = this.sprites.filter(function (a) { return a.isActive; });
    };
    LevelLayer.prototype.GetTileByPixel = function (xPixel, yPixel) {
        var xTile = Math.floor(xPixel / this.tileWidth);
        var yTile = Math.floor(yPixel / this.tileHeight);
        if (!this.tiles)
            return new LevelTile(xTile, yTile, TileType.Air, this);
        if (!this.tiles[xTile])
            return new LevelTile(xTile, yTile, TileType.Air, this);
        if (!this.tiles[xTile][yTile]) {
            if (yTile < 0) {
                var topOfScreenTile = this.GetTileByPixel(xPixel, 0);
                return new LevelTile(xTile, yTile, topOfScreenTile.tileType, this);
            }
            return new LevelTile(xTile, yTile, TileType.Air, this);
        }
        return this.tiles[xTile][yTile];
    };
    LevelLayer.prototype.GetTileByIndex = function (xTile, yTile) {
        return this.GetTileByPixel(xTile * this.tileWidth, yTile * this.tileHeight);
    };
    LevelLayer.prototype.DrawTiles = function (camera, frameNum) {
        this.DrawToCache(frameNum);
        var scale = camera.scale;
        camera.ctx.drawImage(this.cachedCanvas, -camera.x * scale + camera.canvas.width / 2, -camera.y * scale + camera.canvas.height / 2, this.cachedCanvas.width * scale, this.cachedCanvas.height * scale);
    };
    LevelLayer.prototype.DrawSprites = function (camera, frameNum) {
        // draw player on top of other sprites
        var orderedSprites = __spreadArrays(this.sprites);
        orderedSprites.sort(function (a, b) { return a.zIndex - b.zIndex; });
        for (var _i = 0, orderedSprites_2 = orderedSprites; _i < orderedSprites_2.length; _i++) {
            var sprite = orderedSprites_2[_i];
            this.DrawSprite(sprite, camera, frameNum);
        }
    };
    LevelLayer.prototype.DrawSprite = function (sprite, camera, frameNum) {
        sprite.OnBeforeDraw(camera);
        var frameData = sprite.GetFrameData(frameNum);
        if ('xFlip' in frameData) {
            this.DrawFrame(frameData, camera.scale, sprite);
        }
        else {
            for (var _i = 0, _a = frameData; _i < _a.length; _i++) {
                var fd = _a[_i];
                this.DrawFrame(fd, camera.scale, sprite);
            }
        }
        sprite.OnAfterDraw(camera);
    };
    LevelLayer.prototype.DrawFrame = function (frameData, scale, sprite) {
        var ctx = camera.ctx;
        if (this.map && this.map.silhoutteColor) {
            if (sprite.isExemptFromSilhoutte) {
                ctx = camera.ctx;
            }
            else {
                ctx = this.spriteCanvas.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.imageSmoothingEnabled = false;
            }
        }
        if (!ctx)
            return;
        var imgTile = frameData.imageTile;
        imgTile.Draw(ctx, (sprite.x - camera.x - frameData.xOffset) * scale + camera.canvas.width / 2, (sprite.y - camera.y - frameData.yOffset) * scale + camera.canvas.height / 2, scale, frameData.xFlip, frameData.yFlip);
        if (debugMode) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#CCC";
            ctx.strokeRect((sprite.x + sprite.dx - camera.x) * scale + camera.canvas.width / 2, (sprite.y + sprite.dy - camera.y) * scale + camera.canvas.height / 2, sprite.width * scale, sprite.height * scale);
            ctx.strokeRect((sprite.x - camera.x) * scale + camera.canvas.width / 2, (sprite.y - camera.y) * scale + camera.canvas.height / 2, sprite.width * scale, sprite.height * scale);
        }
        if (this.map && this.map.silhoutteColor && !sprite.isExemptFromSilhoutte) {
            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = this.map.silhoutteColor;
            ctx.fillRect(0, 0, this.spriteCanvas.width, this.spriteCanvas.height);
            ctx.globalCompositeOperation = "source-over";
        }
        if (!sprite.isExemptFromSilhoutte)
            camera.ctx.drawImage(this.spriteCanvas, 0, 0);
    };
    LevelLayer.prototype.ExportToString = function (numColumns) {
        var _this = this;
        if (numColumns === void 0) { numColumns = 0; }
        var allTiles = Object.values(TileType.TileMap);
        var availableTileTypes = allTiles.filter(function (a) { return a.targetLayer == _this.layerType; });
        if (availableTileTypes.indexOf(TileType.Air) == -1)
            availableTileTypes.unshift(TileType.Air);
        var tileIndeces = this.tiles.flatMap(function (a) { return a; }).map(function (a) { return availableTileTypes.indexOf(a.tileType); });
        if (numColumns > 0) {
            tileIndeces = this.tiles.filter(function (a, i) { return i < numColumns; }).flatMap(function (a) { return a; }).map(function (a) { return availableTileTypes.indexOf(a.tileType); });
        }
        if (tileIndeces.some(function (a) { return a == -1; })) {
            console.error("Layer includes invalid tile");
        }
        var b64EncodeStr = Utility.b64Str;
        // Going to combine like elements
        // AAbbbAAAAAbb becomes A2 b3 A5 b2
        var ret = "";
        var _loop_1 = function (tileIndex) {
            var id = tileIndeces[tileIndex];
            var numberInThisLine = tileIndeces.slice(tileIndex).findIndex(function (a) { return a != id; });
            if (numberInThisLine == -1)
                numberInThisLine = tileIndeces.length - tileIndex;
            if (numberInThisLine > b64EncodeStr.length)
                numberInThisLine = b64EncodeStr.length;
            var encodedTileId = Utility.toTwoDigitB64(id);
            var encodedCount = b64EncodeStr[numberInThisLine - 1];
            ret += encodedTileId + encodedCount;
            tileIndex += numberInThisLine;
            out_tileIndex_1 = tileIndex;
        };
        var out_tileIndex_1;
        for (var tileIndex = 0; tileIndex < tileIndeces.length;) {
            _loop_1(tileIndex);
            tileIndex = out_tileIndex_1;
        }
        return ret;
    };
    LevelLayer.FromImportString = function (importStr, layerType, mapHeight, map) {
        var allTiles = Object.values(TileType.TileMap);
        var availableTileTypes = allTiles.filter(function (a) { return a.targetLayer == layerType; });
        if (availableTileTypes.indexOf(TileType.Air) == -1)
            availableTileTypes.unshift(TileType.Air);
        var ret = new LevelLayer(layerType);
        ret.layerType = layerType;
        ret.map = map;
        var x = 0;
        var y = 0;
        for (var i = 0; i < importStr.length; i += 3) {
            var tileChars = importStr[i] + importStr[i + 1];
            var tileIndex = Utility.IntFromB64(tileChars);
            var tileCount = Utility.IntFromB64(importStr[i + 2]) + 1;
            var tileType = availableTileTypes[tileIndex];
            for (var j = 0; j < tileCount; j++) {
                ret.SetTile(x, y, tileType, true);
                y++;
                if (y >= mapHeight) {
                    x++;
                    y = 0;
                }
            }
        }
        return ret;
    };
    return LevelLayer;
}());
