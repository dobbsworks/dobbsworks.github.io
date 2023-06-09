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
        this.cameraLocksVertical = [];
        this.spriteKillerCheckComplete = false;
        this.hasSpriteKillers = false;
        this.globalWindX = 0;
        this.globalWindY = 0;
        this.windAnimationDx = 0;
        this.windAnimationDy = 0;
        this.windOpacity = 0;
        this.windParticles = [];
        this.hasHorizontalWrap = false;
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
            this.cameraLocksVertical = this.mainLayer.sprites.filter(function (a) { return a instanceof CameraLockVertical; });
            this.cameraLocksVertical.forEach(function (a) { return a.isActive = false; });
            this.cameraLocksVertical.sort(function (a, b) { return a.y - b.y; });
        }
        if (this.fadeOutRatio > 0) {
            this.fadeOutRatio -= 0.1;
        }
        if (this.fadeOutRatio < 0)
            this.fadeOutRatio = 0;
        camera.Update();
        this.fluidLevels.forEach(function (a) {
            if (a.currentY == -1)
                a.currentY = (_this.mapHeight + 10) * 12;
            a.Update();
        });
        player = (this.mainLayer.sprites.find(function (a) { return a instanceof Player; }));
        var _loop_1 = function (player_1) {
            var _loop_2 = function (tile) {
                if (tile instanceof LevelTile && tile.tileType.standChange) {
                    var existingStandChangeTile = this_1.standChangeTiles.find(function (a) { return a.tile === tile; });
                    if (!existingStandChangeTile) {
                        this_1.standChangeTiles.push({ tile: tile, standDuration: 0 });
                    }
                }
            };
            for (var _i = 0, _a = player_1.standingOn; _i < _a.length; _i++) {
                var tile = _a[_i];
                _loop_2(tile);
            }
            var _loop_3 = function (standChangeTile) {
                standChangeTile.standDuration++;
                var tile = standChangeTile.tile;
                var tileTypeChange = tile.tileType.standChange;
                if (tileTypeChange) {
                    if (standChangeTile.standDuration > tileTypeChange.delay) {
                        tile.layer.SetTile(tile.tileX, tile.tileY, TileType[tileTypeChange.tileTypeName]);
                        this_1.standChangeTiles = this_1.standChangeTiles.filter(function (a) { return a !== standChangeTile; });
                    }
                }
            };
            for (var _b = 0, _c = this_1.standChangeTiles; _b < _c.length; _b++) {
                var standChangeTile = _c[_b];
                _loop_3(standChangeTile);
            }
            this_1.standChangeTiles = this_1.standChangeTiles.filter(function (a) { return player_1.standingOn.indexOf(a.tile) > -1; });
            if (this_1.frameNum % 2 == 0) {
                // only check every other frame to cut down on shimmers
                var playerTouchingTiles = __spreadArrays(player_1.standingOn, player_1.touchedCeilings, player_1.touchedLeftWalls, player_1.touchedRightWalls).filter(function (a) { return a instanceof LevelTile; });
                for (var _d = 0, playerTouchingTiles_1 = playerTouchingTiles; _d < playerTouchingTiles_1.length; _d++) {
                    var tile = playerTouchingTiles_1[_d];
                    if (tile.tileType.shimmers) {
                        tile.layer.sprites.push(new Shimmer(tile.tileX * tile.layer.tileWidth, tile.tileY * tile.layer.tileHeight, tile.layer, []));
                    }
                }
            }
            if (player_1.justLanded && player_1.standingOn.some(function (a) { return a.tileType.shimmers; })) {
                // land down on shimmer
                var shimmerRipple = new ShimmerRipple(player_1.xMid, player_1.yBottom, player_1.layer, []);
                player_1.layer.sprites.push(shimmerRipple);
            }
            var _loop_4 = function (autoChangeTile) {
                autoChangeTile.standDuration++;
                var tile = autoChangeTile.tile;
                var tileTypeChange = tile.tileType.autoChange;
                if (tileTypeChange) {
                    if (autoChangeTile.standDuration > tileTypeChange.delay) {
                        tile.layer.SetTile(tile.tileX, tile.tileY, TileType[tileTypeChange.tileTypeName]);
                        this_1.autoChangeTiles = this_1.autoChangeTiles.filter(function (a) { return a !== autoChangeTile; });
                    }
                }
            };
            for (var _e = 0, _f = this_1.autoChangeTiles; _e < _f.length; _e++) {
                var autoChangeTile = _f[_e];
                _loop_4(autoChangeTile);
            }
            if (!this_1.spriteKillerCheckComplete) {
                this_1.spriteKillerCheckComplete = true;
                this_1.hasSpriteKillers = this_1.mainLayer.tiles.flatMap(function (a) { return a; }).some(function (a) { return a.tileType == TileType.SpriteKiller; });
            }
            if (this_1.hasSpriteKillers) {
                var onScreenSprites = this_1.mainLayer.sprites.filter(function (a) { return a.IsOnScreen(); });
                var deletedSprite = false;
                for (var _g = 0, onScreenSprites_1 = onScreenSprites; _g < onScreenSprites_1.length; _g++) {
                    var sprite = onScreenSprites_1[_g];
                    if (sprite instanceof Player || sprite instanceof DeadPlayer || sprite instanceof Poof || sprite instanceof KeyDomino || sprite instanceof ShimmerRipple)
                        continue;
                    if (sprite.DoesOverlapSpriteKiller()) {
                        sprite.ReplaceWithSpriteType(Poof);
                        deletedSprite = true;
                        if (sprite instanceof Enemy)
                            sprite.OnDead();
                    }
                }
                if (deletedSprite)
                    audioHandler.PlaySound("erase", true);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.mainLayer.sprites.filter(function (a) { return a instanceof Player; }); _i < _a.length; _i++) {
            var player_1 = _a[_i];
            _loop_1(player_1);
        }
        if (levelGenerator) {
            var gear = this.mainLayer.sprites.find(function (a) { return a instanceof GoldGear; });
            if (gear && !gear.isTouched) {
                this.fullDarknessRatio -= 0.02;
                if (this.fullDarknessRatio < 0)
                    this.fullDarknessRatio = 0;
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
        if (camera.leftLockTimer > 0) {
            var width = (1 - Math.cos((camera.leftLockTimer - 1) / 20)) * 12;
            var cameraLeftEdgeGradient = camera.ctx.createLinearGradient(0, 0, width, 0);
            cameraLeftEdgeGradient.addColorStop(0, "#FFFF");
            cameraLeftEdgeGradient.addColorStop(1, "#FFF0");
            camera.ctx.fillStyle = cameraLeftEdgeGradient;
            camera.ctx.fillRect(0, 0, width, camera.canvas.height);
        }
        if (camera.rightLockTimer > 0) {
            var width = (1 - Math.cos((camera.rightLockTimer - 1) / 20)) * 12;
            var cameraRightEdgeGradient = camera.ctx.createLinearGradient(camera.canvas.width, 0, camera.canvas.width - width, 0);
            cameraRightEdgeGradient.addColorStop(0, "#FFFF");
            cameraRightEdgeGradient.addColorStop(1, "#FFF0");
            camera.ctx.fillStyle = cameraRightEdgeGradient;
            camera.ctx.fillRect(camera.canvas.width, 0, -width, camera.canvas.height);
        }
        if (camera.upLockTimer > 0) {
            var height = (1 - Math.cos((camera.upLockTimer - 1) / 20)) * 12;
            var cameraTopEdgeGradient = camera.ctx.createLinearGradient(0, 0, 0, height);
            cameraTopEdgeGradient.addColorStop(0, "#FFFF");
            cameraTopEdgeGradient.addColorStop(1, "#FFF0");
            camera.ctx.fillStyle = cameraTopEdgeGradient;
            camera.ctx.fillRect(0, 0, camera.canvas.width, height);
        }
        if (camera.downLockTimer > 0) {
            var height = (1 - Math.cos((camera.downLockTimer - 1) / 20)) * 12;
            var cameraBottomEdgeGradient = camera.ctx.createLinearGradient(0, camera.canvas.height, 0, camera.canvas.height - height);
            cameraBottomEdgeGradient.addColorStop(0, "#FFFF");
            cameraBottomEdgeGradient.addColorStop(1, "#FFF0");
            camera.ctx.fillStyle = cameraBottomEdgeGradient;
            camera.ctx.fillRect(0, camera.canvas.height, camera.canvas.width, -height);
        }
        BenchmarkService.Log("DrawGlobalWind");
        this.DrawGlobalWind();
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
            var deadPlayers = this.mainLayer.sprites.filter(function (a) { return a instanceof DeadPlayer; });
            for (var _i = 0, deadPlayers_1 = deadPlayers; _i < deadPlayers_1.length; _i++) {
                var deadPlayer = deadPlayers_1[_i];
                if (deadPlayer.dooplicateDeath) {
                    new ImageFromTile(0, 0, 960, 576, tiles["bluescreen"][0][0]).Draw(ctx);
                }
                this.mainLayer.DrawSprite(deadPlayer, camera, this.frameNum);
            }
        }
        BenchmarkService.Log("DrawDone");
        var playerAge = player ? player.age : 0;
        var playerContainer = (this.mainLayer.sprites.find(function (a) { return a instanceof PipeContent && a.containedSprite instanceof Player; }));
        if (playerContainer)
            playerAge = playerContainer.age + playerContainer.storedAge;
        if (playerAge) {
            this.timerText = Utility.FramesToTimeText(playerAge + (player && player.isActive ? editorHandler.bankedCheckpointTime : 0));
            if (levelGenerator) {
                this.timerText = Utility.FramesToTimeText(playerAge + +((levelGenerator === null || levelGenerator === void 0 ? void 0 : levelGenerator.bankedClearTime) || 0));
            }
        }
        else {
            if (levelGenerator)
                this.timerText = "";
        }
        if (this.timerText && !editorHandler.isInEditMode && !(MenuHandler.CurrentMenu instanceof MainMenu)) {
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
    LevelMap.prototype.DrawGlobalWind = function () {
        this.windAnimationDx += (this.globalWindX - this.windAnimationDx) * 0.02;
        this.windAnimationDy += (this.globalWindY - this.windAnimationDy) * 0.02;
        if (Math.abs(this.windAnimationDx) < 0.01)
            this.windAnimationDx = 0;
        if (Math.abs(this.windAnimationDy) < 0.01)
            this.windAnimationDy = 0;
        if (this.windAnimationDx == 0 && this.windAnimationDy == 0) {
            this.windOpacity -= 0.01;
        }
        else {
            this.windOpacity += 0.01;
        }
        if (this.windOpacity > 1)
            this.windOpacity = 1;
        if (this.windOpacity < 0)
            this.windOpacity = 0;
        if (this.windOpacity == 0)
            return;
        var maxX = camera.canvas.width;
        var maxY = camera.canvas.height;
        if (this.windParticles.length == 0) {
            for (var i = 0; i < 100; i++) {
                this.windParticles.push({ x: maxX * Math.random(), y: maxY * Math.random(), offset: Math.random() * Math.PI });
            }
        }
        else {
            for (var _i = 0, _a = this.windParticles; _i < _a.length; _i++) {
                var particle = _a[_i];
                particle.x += this.windAnimationDx * 4 +
                    Math.cos(particle.offset + this.frameNum / 20) / 4 +
                    (camera.prevX - camera.x) * 1; //4 for no depth
                particle.y += this.windAnimationDy * 4 +
                    Math.cos(particle.offset + this.frameNum / 20) / 4 +
                    (camera.prevY - camera.y) * 1; //4 for no depth
                if (particle.x > maxX)
                    particle.x = particle.x % maxX - 5;
                if (particle.y > maxY)
                    particle.y = particle.y % maxY - 5;
                if (particle.x < -5)
                    particle.x += maxX + 5;
                if (particle.y < -5)
                    particle.y += maxY + 5;
            }
        }
        camera.ctx.fillStyle = "#FFFFFF" + Math.floor(this.windOpacity * 256 * 0.6).toString(16).padStart(2, "00");
        for (var _b = 0, _c = this.windParticles; _b < _c.length; _b++) {
            var particle = _c[_b];
            camera.ctx.fillRect(particle.x, particle.y, 4, 4);
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
            camera.Reset();
            if (player) {
                camera.targetX = player.xMid;
                camera.targetY = player.yBottom - 12;
                camera.y = camera.targetY;
                camera.x = camera.targetX;
            }
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
            this.hasHorizontalWrap ? 1 : 0,
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
    LevelMap.FromImportString = function (importStr, keepGhostFrames, isResettingLevel) {
        if (keepGhostFrames === void 0) { keepGhostFrames = false; }
        if (isResettingLevel === void 0) { isResettingLevel = false; }
        var importSegments = importStr.split("|");
        var properties = importSegments[0].split(";");
        var dummyLayer = new LevelLayer(TargetLayer.main);
        var oldMap = currentMap;
        var ret = new LevelMap(dummyLayer, dummyLayer, dummyLayer, dummyLayer, dummyLayer);
        ret.mapVersion = properties[0];
        var mapHeight = parseInt(properties[1]);
        ret.mapHeight = mapHeight;
        // 134ms
        if (isResettingLevel || true) {
            ret.LoadBackgroundsFromImportString(importSegments[1]);
        }
        else {
            // TODO : about 0.5 seconds available if we can recycle existing backgrounds
            // ret.backgroundLayers = oldMap.backgroundLayers;
            // ret.bgColorTop = oldMap.bgColorTop;
            // ret.bgColorTopPositionRatio = oldMap.bgColorTopPositionRatio;
            // ret.bgColorBottomPositionRatio = oldMap.bgColorBottomPositionRatio;
            // ret.overlayOpacity = oldMap.overlayOpacity;
            // ret.bgColorBottom = oldMap.bgColorBottom;
        }
        // 482ms
        ret.GetLayerList().forEach(function (layer, index) {
            var newLayer = LevelLayer.FromImportString(importSegments[index + 2], index, mapHeight, ret);
            (ret[TargetLayer[index] + "Layer"]) = newLayer;
        });
        // 2947ms
        editorHandler.sprites = [];
        LevelMap.ImportSprites(importSegments[7]);
        ret.playerWaterMode = properties[2] == "1";
        ret.spriteWaterMode = properties[3] == "1";
        ret.hasHorizontalWrap = properties[5] == "1";
        if (editorHandler) {
            if (editorHandler.playerWaterModeToggle) {
                editorHandler.playerWaterModeToggle.isSelected = ret.playerWaterMode;
            }
            if (editorHandler.spriteWaterModeToggle) {
                editorHandler.spriteWaterModeToggle.isSelected = ret.spriteWaterMode;
            }
            if (editorHandler.horizontalWrapToggle) {
                editorHandler.horizontalWrapToggle.isSelected = ret.hasHorizontalWrap;
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
    LevelMap.ImportSprites = function (importString, startX, startY) {
        if (startX === void 0) { startX = 0; }
        if (startY === void 0) { startY = 0; }
        for (var _i = 0, _a = importString.split(";"); _i < _a.length; _i++) {
            var spriteStr = _a[_i];
            if (!spriteStr)
                continue;
            var spriteIndex = Utility.IntFromB64(spriteStr.slice(0, 2));
            var spriteX = Utility.IntFromB64(spriteStr.slice(2, 4)) + startX;
            var spriteY = Utility.IntFromB64(spriteStr.slice(4, 6)) + startY;
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
    };
    LevelMap.BlankOutMap = function () {
        currentMap.waterLevel = new FluidLevel(TileType.WaterSurface, TileType.Water, 0);
        currentMap.purpleWaterLevel = new FluidLevel(TileType.PurpleWaterSurface, TileType.PurpleWater, 1);
        currentMap.lavaLevel = new FluidLevel(TileType.LavaSurface, TileType.Lava, 2);
        editorHandler.playerWaterModeToggle.isSelected = false;
        editorHandler.spriteWaterModeToggle.isSelected = false;
        editorHandler.horizontalWrapToggle.isSelected = false;
        currentMap.playerWaterMode = false;
        currentMap.spriteWaterMode = false;
        currentMap.hasHorizontalWrap = false;
        currentMap.mapHeight = 12;
        currentMap.cameraLocksHorizontal = [];
        currentMap.cameraLocksVertical = [];
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
    LevelMap.ClearAllTiles = function (width, height) {
        currentMap.GetLayerList().forEach(function (layer, index) {
            var newLayer = new LevelLayer(index);
            newLayer.layerType = index;
            newLayer.map = currentMap;
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    newLayer.SetTile(x, y, TileType.Air, true);
                }
            }
            (currentMap[TargetLayer[index] + "Layer"]) = newLayer;
        });
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
