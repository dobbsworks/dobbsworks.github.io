"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var LevelMap = /** @class */ (function () {
    function LevelMap(mainLayer, wireLayer, waterLayer, semisolidLayer, backdropLayer) {
        this.mainLayer = mainLayer;
        this.wireLayer = wireLayer;
        this.waterLayer = waterLayer;
        this.semisolidLayer = semisolidLayer;
        this.backdropLayer = backdropLayer;
        this.mapVersion = "";
        this.backgroundLayers = [];
        this.frameNum = 0;
        this.doorTransition = null;
        this.fadeOutRatio = 1;
        this.bgColorTop = "#87cefa";
        this.bgColorBottom = "#ffffff";
        this.bgColorTopPositionRatio = 0;
        this.bgColorBottomPositionRatio = 1;
        this.overlayOpacity = 0.4;
        this.spriteWaterMode = false;
        this.playerWaterMode = false;
        this.mapHeight = 20;
        this.timerText = "";
        this.silhoutteColor = ""; //"#000" //"#867e1dee" // "#000F";
        this.bgDarknessRatio = 0;
        this.fullDarknessRatio = 0;
        this.standChangeTiles = [];
        this.autoChangeTiles = [];
        this.waterLevel = new FluidLevel(TileType.WaterSurface, TileType.Water, 0);
        this.purpleWaterLevel = new FluidLevel(TileType.PurpleWaterSurface, TileType.PurpleWater, 1);
        this.lavaLevel = new FluidLevel(TileType.LavaSurface, TileType.Lava, 2);
        this.fluidLevels = [this.waterLevel, this.purpleWaterLevel, this.lavaLevel];
        this.songId = 0;
        this.isInitialized = false;
        this.cameraLocksHorizontal = [];
        this.spriteKillerCheckComplete = false;
        this.hasSpriteKillers = false;
        mainLayer.map = this;
        wireLayer.map = this;
        waterLayer.map = this;
        semisolidLayer.map = this;
        backdropLayer.map = this;
        var backgroundSources = BackgroundSource.GetSources();
        this.backgroundLayers = backgroundSources.filter(function (a, i) { return i < 4; }).map(function (a) { return BackgroundLayer.FromDefaults(a); });
        this.backgroundLayers[0].autoHorizontalScrollSpeed = -0.25;
    }
    LevelMap.prototype.Update = function () {
        var _this = this;
        BenchmarkService.Log("MapUpdate");
        if (!this.isInitialized && player) {
            this.isInitialized = true;
            camera.SnapCamera();
            this.cameraLocksHorizontal = this.mainLayer.sprites.filter(function (a) { return a instanceof CameraLockHorizontal; });
            this.cameraLocksHorizontal.forEach(function (a) { return a.isActive = false; });
            this.cameraLocksHorizontal.sort(function (a, b) { return a.x - b.x; });
        }
        if (this.fadeOutRatio > 0) {
            this.fadeOutRatio -= 0.2;
        }
        if (this.fadeOutRatio < 0)
            this.fadeOutRatio = 0;
        camera.Update();
        this.fluidLevels.forEach(function (a) {
            if (a.currentY == -1)
                a.currentY = (_this.mapHeight + 1) * 12;
            a.Update();
        });
        player = (this.mainLayer.sprites.find(function (a) { return a instanceof Player; }));
        if (player) {
            var _loop_1 = function (tile) {
                if (tile instanceof LevelTile && tile.tileType.standChange) {
                    var existingStandChangeTile = this_1.standChangeTiles.find(function (a) { return a.tile === tile; });
                    if (!existingStandChangeTile) {
                        this_1.standChangeTiles.push({ tile: tile, standDuration: 0 });
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = player.standingOn; _i < _a.length; _i++) {
                var tile = _a[_i];
                _loop_1(tile);
            }
            var _loop_2 = function (standChangeTile) {
                standChangeTile.standDuration++;
                var tile = standChangeTile.tile;
                var tileTypeChange = tile.tileType.standChange;
                if (tileTypeChange) {
                    if (standChangeTile.standDuration > tileTypeChange.delay) {
                        tile.layer.SetTile(tile.tileX, tile.tileY, TileType[tileTypeChange.tileTypeName]);
                        this_2.standChangeTiles = this_2.standChangeTiles.filter(function (a) { return a !== standChangeTile; });
                    }
                }
            };
            var this_2 = this;
            for (var _b = 0, _c = this.standChangeTiles; _b < _c.length; _b++) {
                var standChangeTile = _c[_b];
                _loop_2(standChangeTile);
            }
            this.standChangeTiles = this.standChangeTiles.filter(function (a) { return player.standingOn.indexOf(a.tile) > -1; });
            var _loop_3 = function (autoChangeTile) {
                autoChangeTile.standDuration++;
                var tile = autoChangeTile.tile;
                var tileTypeChange = tile.tileType.autoChange;
                if (tileTypeChange) {
                    if (autoChangeTile.standDuration > tileTypeChange.delay) {
                        tile.layer.SetTile(tile.tileX, tile.tileY, TileType[tileTypeChange.tileTypeName]);
                        this_3.autoChangeTiles = this_3.autoChangeTiles.filter(function (a) { return a !== autoChangeTile; });
                    }
                }
            };
            var this_3 = this;
            for (var _d = 0, _e = this.autoChangeTiles; _d < _e.length; _d++) {
                var autoChangeTile = _e[_d];
                _loop_3(autoChangeTile);
            }
            if (!this.spriteKillerCheckComplete) {
                this.spriteKillerCheckComplete = true;
                this.hasSpriteKillers = this.mainLayer.tiles.flatMap(function (a) { return a; }).some(function (a) { return a.tileType == TileType.SpriteKiller; });
            }
            if (this.hasSpriteKillers) {
                var onScreenSprites = this.mainLayer.sprites.filter(function (a) { return a.IsOnScreen(); });
                var deletedSprite = false;
                for (var _f = 0, onScreenSprites_1 = onScreenSprites; _f < onScreenSprites_1.length; _f++) {
                    var sprite = onScreenSprites_1[_f];
                    if (sprite instanceof Player || sprite instanceof DeadPlayer || sprite instanceof Poof || sprite instanceof KeyDomino)
                        continue;
                    var xs = [sprite.x, sprite.xRight, sprite.xMid].map(function (a) { return Math.floor(a / _this.mainLayer.tileWidth); }).filter(Utility.OnlyUnique);
                    var ys = [sprite.y, sprite.yBottom, sprite.yMid].map(function (a) { return Math.floor(a / _this.mainLayer.tileHeight); }).filter(Utility.OnlyUnique);
                    for (var _g = 0, xs_1 = xs; _g < xs_1.length; _g++) {
                        var tileX = xs_1[_g];
                        for (var _h = 0, ys_1 = ys; _h < ys_1.length; _h++) {
                            var tileY = ys_1[_h];
                            var tile = this.mainLayer.GetTileByIndex(tileX, tileY);
                            if (tile.tileType == TileType.SpriteKiller) {
                                sprite.ReplaceWithSpriteType(Poof);
                                deletedSprite = true;
                            }
                        }
                    }
                }
                if (deletedSprite)
                    audioHandler.PlaySound("erase", true);
            }
        }
        if (camera.transitionTimer > 0) {
            // do not process any updates
        }
        else if (this.doorTransition) {
            this.ProcessDoorTransition(this.doorTransition);
        }
        else {
            BenchmarkService.Log("SpriteUpdate");
            this.mainLayer.Update();
            BenchmarkService.Log("CircuitUpdate");
            CircuitHandler.UpdateCircuits(this.wireLayer, this.mainLayer.sprites);
            BenchmarkService.Log("MapUpdateDone");
        }
        this.frameNum++;
    };
    LevelMap.prototype.Draw = function (camera) {
        var _this = this;
        var ctx = camera.ctx;
        BenchmarkService.Log("DrawBackdrop");
        var grd = camera.ctx.createLinearGradient(0, 0, 0, camera.canvas.height);
        grd.addColorStop(this.bgColorTopPositionRatio, this.bgColorTop);
        grd.addColorStop(this.bgColorBottomPositionRatio, this.bgColorBottom);
        camera.ctx.fillStyle = grd;
        camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        this.backgroundLayers.forEach(function (a) { return a.Draw(camera, _this.frameNum); });
        if (this.overlayOpacity > 0) {
            var opacityHex = this.overlayOpacity.toString(16).substring(2, 4).padEnd(2, "0");
            if (this.overlayOpacity == 1)
                opacityHex = "FF";
            var grd2 = camera.ctx.createLinearGradient(0, 0, 0, camera.canvas.height);
            grd2.addColorStop(this.bgColorTopPositionRatio, this.bgColorTop + opacityHex);
            grd2.addColorStop(this.bgColorBottomPositionRatio, this.bgColorBottom + opacityHex);
            camera.ctx.fillStyle = grd2;
            camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        }
        if (this.bgDarknessRatio > 0) {
            var opacityHex = this.bgDarknessRatio.toString(16).substring(2, 4).padEnd(2, "0");
            if (this.bgDarknessRatio >= 1)
                opacityHex = "FF";
            camera.ctx.fillStyle = "#000000" + opacityHex;
            camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        }
        BenchmarkService.Log("DrawLayers");
        this.backdropLayer.DrawTiles(camera, this.frameNum);
        this.waterLayer.DrawTiles(camera, this.frameNum);
        this.mainLayer.DrawTiles(camera, this.frameNum);
        this.wireLayer.DrawTiles(camera, this.frameNum);
        this.semisolidLayer.DrawTiles(camera, this.frameNum);
        this.fluidLevels.forEach(function (a) { return a.Draw(camera); });
        BenchmarkService.Log("DrawSprites");
        this.mainLayer.DrawSprites(camera, this.frameNum);
        if (this.fadeOutRatio && !editorHandler.isInEditMode) {
            camera.ctx.fillStyle = "rgba(0,0,0," + this.fadeOutRatio.toFixed(2) + ")";
            camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
            var deadPlayer = this.mainLayer.sprites.find(function (a) { return a instanceof DeadPlayer; });
            if (deadPlayer) {
                this.mainLayer.DrawSprite(deadPlayer, camera, this.frameNum);
            }
        }
        BenchmarkService.Log("DrawDone");
        if (player) {
            this.timerText = Utility.FramesToTimeText(player.age + (player.isActive ? editorHandler.bankedCheckpointTime : 0));
        }
        if (this.timerText && !editorHandler.isEditorAllowed && currentLevelCode != "") {
            var fontsize = 16;
            ctx.textAlign = "left";
            ctx.font = fontsize + "px grobold";
            ctx.strokeStyle = "#0008";
            ctx.fillStyle = "#FFF9";
            ctx.lineWidth = 4;
            ctx.strokeText(this.timerText, 10, 10 + fontsize);
            ctx.fillText(this.timerText, 10, 10 + fontsize);
            if (this.fullDarknessRatio > 0) {
                var opacityHex = this.fullDarknessRatio.toString(16).substring(2, 4).padEnd(2, "0");
                if (this.fullDarknessRatio >= 1)
                    opacityHex = "FF";
                camera.ctx.fillStyle = "#000000" + opacityHex;
                camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
            }
        }
    };
    LevelMap.prototype.CanPause = function () {
        var levelGears = this.mainLayer.sprites.filter(function (a) { return a instanceof GoldGear; });
        if (levelGears.some(function (a) { return a.spinMode; }))
            return false;
        return true;
    };
    LevelMap.prototype.StartDoorTransition = function (spriteToMove, startDoor, destinationDoor) {
        spriteToMove.heldItem = null;
        spriteToMove.dx = 0;
        spriteToMove.dy = 0;
        this.doorTransition = new DoorTransition(spriteToMove, startDoor, destinationDoor);
    };
    LevelMap.prototype.ProcessDoorTransition = function (doorTransition) {
        // open door
        if (doorTransition.timer >= 0 && doorTransition.timer <= 10) {
            doorTransition.startDoor.frame = Math.floor(doorTransition.timer / 2);
            doorTransition.spriteToMove.x -= (doorTransition.spriteToMove.xMid - doorTransition.startDoor.xMid) / 2;
        }
        // close door
        if (doorTransition.timer >= 10 && doorTransition.timer <= 20) {
            if (!doorTransition.doorAnimation) {
                doorTransition.doorAnimation = new DoorAnimation(doorTransition.startDoor.x, doorTransition.startDoor.y, doorTransition.startDoor.layer, []);
                this.mainLayer.sprites.push(doorTransition.doorAnimation);
            }
            doorTransition.startDoor.frame = 5 - Math.floor((doorTransition.timer - 10) / 2);
        }
        // fade out
        if (doorTransition.timer >= 20 && doorTransition.timer <= 30) {
            this.fadeOutRatio = (doorTransition.timer - 20) / 10;
        }
        // move elements
        if (doorTransition.timer == 30 && doorTransition.doorAnimation) {
            doorTransition.doorAnimation.x = doorTransition.destinationDoor.x;
            doorTransition.doorAnimation.y = doorTransition.destinationDoor.y;
            doorTransition.spriteToMove.x = doorTransition.destinationDoor.xMid - doorTransition.spriteToMove.width / 2;
            doorTransition.spriteToMove.y = doorTransition.destinationDoor.yBottom - doorTransition.spriteToMove.height;
            doorTransition.destinationDoor.frame = 5;
        }
        // fade in
        if (doorTransition.timer >= 30 && doorTransition.timer <= 40) {
            this.fadeOutRatio = 1 - (doorTransition.timer - 30) / 10;
        }
        // open door
        if (doorTransition.timer >= 40 && doorTransition.timer <= 50) {
            doorTransition.destinationDoor.frame = Math.floor((doorTransition.timer - 40) / 2);
        }
        // remove door animation
        if (doorTransition.timer == 50 && doorTransition.doorAnimation) {
            this.mainLayer.sprites = this.mainLayer.sprites.filter(function (a) { return a != doorTransition.doorAnimation; });
        }
        // close door
        if (doorTransition.timer >= 50 && doorTransition.timer <= 60) {
            doorTransition.destinationDoor.frame = 5 - Math.floor((doorTransition.timer - 50) / 2);
        }
        doorTransition.timer++;
        if (doorTransition.timer > 60) {
            doorTransition.startDoor.frame = 0;
            this.doorTransition = null;
        }
    };
    LevelMap.prototype.GetExportString = function () {
        var spriteList = [];
        for (var _i = 0, _a = editorHandler.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            var spriteIndex = spriteTypes.indexOf(sprite.spriteType);
            var x = sprite.tileCoord.tileX;
            var y = sprite.tileCoord.tileY;
            var additionalProps = sprite.editorProps || [];
            var spriteStr = __spreadArrays([spriteIndex, x, y], additionalProps).map(function (a) { return Utility.toTwoDigitB64(a); });
            spriteList.push(spriteStr.join(''));
        }
        var layers = this.GetLayerList().map(function (a) { return a.ExportToString(); });
        var properties = [
            Version.Current,
            this.mapHeight,
            this.playerWaterMode ? 1 : 0,
            this.spriteWaterMode ? 1 : 0,
            this.songId,
        ];
        return __spreadArrays([
            properties.join(";"),
            this.GetBackgroundExportString()
        ], layers, [
            spriteList.join(";"),
        ]).join("|");
    };
    LevelMap.prototype.LoadBackgroundsFromImportString = function (importStr) {
        var importedSections = importStr.split(";");
        var skyData = importedSections.shift();
        if (skyData) {
            var skyDataPieces = skyData.split(",");
            this.bgColorTop = skyDataPieces[0];
            this.bgColorTopPositionRatio = parseFloat(skyDataPieces[2]);
            this.bgColorBottomPositionRatio = parseFloat(skyDataPieces[3]);
            this.overlayOpacity = parseFloat(skyDataPieces[4]);
            editorHandler.skyEditor.topColorPanel.SetColor(this.bgColorTop);
            this.bgColorBottom = skyDataPieces[1];
            editorHandler.skyEditor.bottomColorPanel.SetColor(this.bgColorBottom);
        }
        for (var i = 0; i < importedSections.length; i++) {
            this.backgroundLayers[i] = BackgroundLayer.FromImportString(i, importedSections[i]);
        }
    };
    LevelMap.prototype.GetBackgroundExportString = function () {
        this.GenerateThumbnail();
        var skyString = [
            this.bgColorTop,
            this.bgColorBottom,
            this.bgColorTopPositionRatio.toFixed(2),
            this.bgColorBottomPositionRatio.toFixed(2),
            this.overlayOpacity.toFixed(2)
        ].join(",");
        return skyString + ";" + this.backgroundLayers.map(function (a) { return a.ExportToString(); }).join(";");
    };
    LevelMap.prototype.GenerateThumbnail = function () {
        var canvas = document.createElement("canvas");
        canvas.width = camera.canvas.width / 24;
        canvas.height = camera.canvas.height / 24;
        var ctx = canvas.getContext("2d");
        currentMap.Draw(camera);
        editorHandler.DrawSprites(camera);
        ctx.drawImage(camera.canvas, 0, 0, canvas.width, canvas.height);
        return canvas;
    };
    LevelMap.prototype.GetLayerList = function () {
        this.mainLayer.layerType = TargetLayer.main;
        this.backdropLayer.layerType = TargetLayer.backdrop;
        this.waterLayer.layerType = TargetLayer.water;
        this.wireLayer.layerType = TargetLayer.wire;
        this.semisolidLayer.layerType = TargetLayer.semisolid;
        return [
            this.backdropLayer,
            this.waterLayer,
            this.mainLayer,
            this.semisolidLayer,
            this.wireLayer,
        ];
    };
    LevelMap.FromImportString = function (importStr, keepGhostFrames) {
        if (keepGhostFrames === void 0) { keepGhostFrames = false; }
        var importSegments = importStr.split("|");
        var properties = importSegments[0].split(";");
        var dummyLayer = new LevelLayer(TargetLayer.main);
        var ret = new LevelMap(dummyLayer, dummyLayer, dummyLayer, dummyLayer, dummyLayer);
        ret.mapVersion = properties[0];
        var mapHeight = parseInt(properties[1]);
        ret.mapHeight = mapHeight;
        // 134ms
        ret.LoadBackgroundsFromImportString(importSegments[1]);
        // 482ms
        ret.GetLayerList().forEach(function (layer, index) {
            var newLayer = LevelLayer.FromImportString(importSegments[index + 2], index, mapHeight, ret);
            (ret[TargetLayer[index] + "Layer"]) = newLayer;
        });
        // 2947ms
        editorHandler.sprites = [];
        for (var _i = 0, _a = importSegments[7].split(";"); _i < _a.length; _i++) {
            var spriteStr = _a[_i];
            if (!spriteStr)
                continue;
            var spriteIndex = Utility.IntFromB64(spriteStr.slice(0, 2));
            var spriteX = Utility.IntFromB64(spriteStr.slice(2, 4));
            var spriteY = Utility.IntFromB64(spriteStr.slice(4, 6));
            var spriteType = spriteTypes[spriteIndex];
            var rawPropsStr = spriteStr.slice(6);
            var additionalProps = [];
            for (var i = 0; i < rawPropsStr.length; i += 2) {
                var propB64 = rawPropsStr.slice(i, 2);
                var propNum = Utility.IntFromB64(propB64);
                additionalProps.push(propNum);
            }
            var editorSprite = new EditorSprite(spriteType, { tileX: spriteX, tileY: spriteY });
            editorSprite.editorProps = additionalProps;
            if (editorSprite.spriteInstance instanceof BasePlatform) {
                if (additionalProps[0])
                    editorSprite.width = additionalProps[0];
            }
            editorHandler.sprites.push(editorSprite);
            editorSprite.ResetSprite();
        }
        ret.playerWaterMode = properties[2] == "1";
        ret.spriteWaterMode = properties[3] == "1";
        if (editorHandler) {
            if (editorHandler.playerWaterModeToggle) {
                editorHandler.playerWaterModeToggle.isSelected = ret.playerWaterMode;
            }
            if (editorHandler.spriteWaterModeToggle) {
                editorHandler.spriteWaterModeToggle.isSelected = ret.spriteWaterMode;
            }
        }
        ret.songId = +(properties[4] || "0");
        var songName = audioHandler.levelSongList[ret.songId];
        audioHandler.SetBackgroundMusic(songName);
        editorHandler.CloseDrawers();
        if (!keepGhostFrames)
            editorHandler.playerFrames = [];
        return ret;
    };
    LevelMap.BlankOutMap = function () {
        editorHandler.playerWaterModeToggle.isSelected = false;
        editorHandler.spriteWaterModeToggle.isSelected = false;
        currentMap.playerWaterMode = false;
        currentMap.spriteWaterMode = false;
        currentMap.mapHeight = 12;
        editorHandler.sprites = [];
        currentMap.GetLayerList().forEach(function (layer, index) {
            var newLayer = LevelLayer.FromImportString("AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP", index, currentMap.mapHeight, currentMap);
            (currentMap[TargetLayer[index] + "Layer"]) = newLayer;
        });
        editorHandler.sprites.push(new EditorSprite(Player, { tileX: 4, tileY: 8 }));
        editorHandler.sprites.push(new EditorSprite(GoldGear, { tileX: 55, tileY: 8 }));
        editorHandler.playerFrames = [];
        editorHandler.history.RecordHistory();
    };
    return LevelMap;
}());
var DoorTransition = /** @class */ (function () {
    function DoorTransition(spriteToMove, startDoor, destinationDoor) {
        this.spriteToMove = spriteToMove;
        this.startDoor = startDoor;
        this.destinationDoor = destinationDoor;
        this.timer = 0;
        this.doorAnimation = null;
    }
    return DoorTransition;
}());
var FluidLevel = /** @class */ (function () {
    function FluidLevel(surfaceTile, mainTile, fluidTypeIndex) {
        this.surfaceTile = surfaceTile;
        this.mainTile = mainTile;
        this.fluidTypeIndex = fluidTypeIndex;
        this.currentY = -1;
        //public targetY: number = -1;
        this.currentSpeed = 0;
        this.animationCounter = 0;
        this.isInitialized = false;
        this.drains = [];
        this.flowSourceTiles = [];
    }
    FluidLevel.prototype.AddFlowSource = function (levelTile) {
        var alreadyIn = this.flowSourceTiles.some(function (a) { return a.tileX === levelTile.tileX && a.tileY === levelTile.tileY; });
        if (!alreadyIn) {
            this.flowSourceTiles.push(levelTile);
        }
    };
    FluidLevel.prototype.RemoveFlowSource = function (levelTile) {
        this.flowSourceTiles = this.flowSourceTiles.filter(function (a) { return !(a.tileX === levelTile.tileX && a.tileY === levelTile.tileY); });
    };
    FluidLevel.prototype.Initialize = function () {
        if (currentMap) {
            for (var _i = 0, _a = currentMap.mainLayer.tiles; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, col_1 = col; _b < col_1.length; _b++) {
                    var tile = col_1[_b];
                    if (tile.tileType == TileType.Drain) {
                        this.drains.push(tile);
                    }
                    if (tile.tileType == TileType.InitialWaterLevel) {
                        currentMap.mainLayer.SetTile(tile.tileX, tile.tileY, TileType.Air);
                        currentMap.waterLevel.currentY = tile.GetTopPixel();
                    }
                    if (tile.tileType == TileType.InitialPurpleWaterLevel) {
                        currentMap.mainLayer.SetTile(tile.tileX, tile.tileY, TileType.Air);
                        currentMap.purpleWaterLevel.currentY = tile.GetTopPixel();
                    }
                    if (tile.tileType == TileType.InitialLavaLevel) {
                        currentMap.mainLayer.SetTile(tile.tileX, tile.tileY, TileType.Air);
                        currentMap.lavaLevel.currentY = tile.GetTopPixel();
                    }
                }
            }
        }
    };
    FluidLevel.prototype.Update = function () {
        var _this = this;
        if (!this.isInitialized) {
            this.Initialize();
            this.isInitialized = true;
        }
        var flowsAboveWaterLevel = this.flowSourceTiles.filter(function (a) { return (a.tileY + 1) * a.layer.tileHeight < _this.currentY; });
        var drainsBelowWaterLevel = this.drains.filter(function (a) { return (a.tileY + 0.5) * a.layer.tileHeight > _this.currentY; });
        var netFlow = drainsBelowWaterLevel.length - flowsAboveWaterLevel.length * 2;
        var dy = netFlow * 0.1;
        this.currentY += dy;
        this.animationCounter++;
    };
    FluidLevel.prototype.Draw = function (camera) {
        if (this.currentY == -1)
            return;
        var imageTileMain = this.mainTile.imageTile;
        var imageTileSurface = this.surfaceTile.imageTiles[Math.floor(this.animationCounter / this.surfaceTile.framesPerTile) % this.surfaceTile.imageTiles.length];
        var destY = (this.currentY - camera.y) * camera.scale + camera.canvas.height / 2;
        camera.ctx.drawImage(imageTileMain.src, imageTileMain.xSrc + 0.1, imageTileMain.ySrc + 0.1, imageTileMain.width - 0.2, imageTileMain.height - 0.2, 0, destY, camera.canvas.width, camera.canvas.height - destY + 10);
        for (var x = -(camera.x % 12) * camera.scale; x < camera.canvas.width; x += 12 * camera.scale) {
            camera.ctx.drawImage(imageTileSurface.src, imageTileSurface.xSrc + 0.1, imageTileSurface.ySrc + 0.1, imageTileSurface.width - 0.2, imageTileSurface.height - 0.2, x, destY - (12 * camera.scale), imageTileSurface.width * camera.scale, imageTileSurface.height * camera.scale);
        }
        var imageTileFall = tiles["pipes"][this.fluidTypeIndex * 2][1];
        for (var _i = 0, _a = this.flowSourceTiles; _i < _a.length; _i++) {
            var sourceTile = _a[_i];
            var flowX = (sourceTile.tileX * sourceTile.layer.tileWidth - camera.x) * camera.scale + camera.canvas.width / 2;
            var flowY = (sourceTile.tileY * sourceTile.layer.tileHeight - camera.y) * camera.scale + camera.canvas.height / 2;
            var flowBottom = Math.min(camera.canvas.height, destY - 14 * camera.scale);
            camera.ctx.drawImage(imageTileFall.src, imageTileFall.xSrc + 0.1, imageTileFall.ySrc + 0.1, imageTileFall.width - 0.2, imageTileFall.height - 0.2, flowX, flowY + (12 * camera.scale), imageTileFall.width * camera.scale, flowBottom - flowY);
        }
    };
    return FluidLevel;
}());
