class LevelMap {
    constructor(
        public mainLayer: LevelLayer,
        public wireLayer: LevelLayer,
        public waterLayer: LevelLayer,
        public semisolidLayer: LevelLayer,
        public backdropLayer: LevelLayer
    ) {
        mainLayer.map = this;
        wireLayer.map = this;
        waterLayer.map = this;
        semisolidLayer.map = this;
        backdropLayer.map = this;

        let backgroundSources = BackgroundSource.GetSources();
        this.backgroundLayers = backgroundSources.filter((a, i) => i < 4).map(a => BackgroundLayer.FromDefaults(a));
        this.backgroundLayers[0].autoHorizontalScrollSpeed = -0.25;
    }

    backgroundLayers: BackgroundLayer[] = [];
    frameNum: number = 0;
    doorTransition: DoorTransition | null = null;
    fadeOutRatio: number = 0;
    bgColorTop: string = "#87cefa";
    bgColorBottom: string = "#ffffff";
    bgColorTopPositionRatio: number = 0;
    bgColorBottomPositionRatio: number = 1;
    overlayOpacity: number = 0.4;
    spriteWaterMode: boolean = false;
    playerWaterMode: boolean = false;
    mapHeight: number = 20;
    timerText: string = "";

    bgDarknessRatio = 0;
    fullDarknessRatio = 0;

    standChangeTiles: { tile: LevelTile, standDuration: number }[] = [];
    autoChangeTiles: { tile: LevelTile, standDuration: number }[] = [];

    waterLevel = new FluidLevel(TileType.WaterSurface, TileType.Water, 0);
    purpleWaterLevel = new FluidLevel(TileType.PurpleWaterSurface, TileType.PurpleWater, 1);
    lavaLevel = new FluidLevel(TileType.LavaSurface, TileType.Lava, 2);
    fluidLevels = [this.waterLevel, this.purpleWaterLevel, this.lavaLevel];
    songId: number = 0;
    isInitialized = false;

    cameraLocksHorizontal: CameraLockHorizontal[] = [];

    Update(): void {
        if (!this.isInitialized && player) {
            this.isInitialized = true;
            camera.SnapCamera();
            this.cameraLocksHorizontal = <CameraLockHorizontal[]>this.mainLayer.sprites.filter(a => a instanceof CameraLockHorizontal);
            this.cameraLocksHorizontal.forEach(a => a.isActive = false);
            this.cameraLocksHorizontal.sort((a,b) => a.x - b.x);
        }
        camera.Update();
        this.fluidLevels.forEach(a => {
            if (a.currentY == -1) a.currentY = (this.mapHeight + 1) * 12;
            a.Update();
        })
        player = <Player>(this.mainLayer.sprites.find(a => a instanceof Player));

        if (player) {
            for (let tile of player.standingOn) {
                if (tile instanceof LevelTile && tile.tileType.standChange) {
                    let existingStandChangeTile = this.standChangeTiles.find(a => a.tile === tile);
                    if (!existingStandChangeTile) {
                        this.standChangeTiles.push({ tile: tile, standDuration: 0 });
                    }
                }
            }
            for (let standChangeTile of this.standChangeTiles) {
                standChangeTile.standDuration++;
                let tile = standChangeTile.tile;
                let tileTypeChange = tile.tileType.standChange;
                if (tileTypeChange) {
                    if (standChangeTile.standDuration > tileTypeChange.delay) {
                        tile.layer.SetTile(tile.tileX, tile.tileY, (<any>TileType)[tileTypeChange.tileTypeName]);
                        this.standChangeTiles = this.standChangeTiles.filter(a => a !== standChangeTile);
                    }
                }
            }
            this.standChangeTiles = this.standChangeTiles.filter(a => player.standingOn.indexOf(a.tile) > -1);

            for (let autoChangeTile of this.autoChangeTiles) {
                autoChangeTile.standDuration++;
                let tile = autoChangeTile.tile;
                let tileTypeChange = tile.tileType.autoChange;
                if (tileTypeChange) {
                    if (autoChangeTile.standDuration > tileTypeChange.delay) {
                        tile.layer.SetTile(tile.tileX, tile.tileY, (<any>TileType)[tileTypeChange.tileTypeName]);
                        this.autoChangeTiles = this.autoChangeTiles.filter(a => a !== autoChangeTile);
                    }
                }
            }

        }

        if (camera.transitionTimer > 0) {
            // do not process any updates
        } else if (this.doorTransition) {
            this.ProcessDoorTransition(this.doorTransition)
        } else {
            BenchmarkService.Log("SpriteUpdate");
            this.mainLayer.Update();
            BenchmarkService.Log("CircuitUpdate");
            CircuitHandler.UpdateCircuits(this.wireLayer, this.mainLayer.sprites);
            BenchmarkService.Log("MapUpdateDone");
        }
        this.frameNum++;
    }

    Draw(camera: Camera): void {
        let ctx = camera.ctx;
        BenchmarkService.Log("DrawBackdrop");
        var grd = camera.ctx.createLinearGradient(0, 0, 0, camera.canvas.height);
        grd.addColorStop(this.bgColorTopPositionRatio, this.bgColorTop);
        grd.addColorStop(this.bgColorBottomPositionRatio, this.bgColorBottom);
        camera.ctx.fillStyle = grd;
        camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        this.backgroundLayers.forEach(a => a.Draw(camera, this.frameNum));
        if (this.overlayOpacity > 0) {
            let opacityHex = this.overlayOpacity.toString(16).substring(2, 4).padEnd(2, "0");
            if (this.overlayOpacity == 1) opacityHex = "FF";
            var grd2 = camera.ctx.createLinearGradient(0, 0, 0, camera.canvas.height);
            grd2.addColorStop(this.bgColorTopPositionRatio, this.bgColorTop + opacityHex);
            grd2.addColorStop(this.bgColorBottomPositionRatio, this.bgColorBottom + opacityHex);
            camera.ctx.fillStyle = grd2;
            camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        }

        if (this.bgDarknessRatio > 0) {
            let opacityHex = this.bgDarknessRatio.toString(16).substring(2, 4).padEnd(2, "0");
            if (this.bgDarknessRatio >= 1) opacityHex = "FF";
            camera.ctx.fillStyle = "#000000" + opacityHex;
            camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        }

        BenchmarkService.Log("DrawLayers");
        this.backdropLayer.DrawTiles(camera, this.frameNum);
        this.waterLayer.DrawTiles(camera, this.frameNum);
        this.mainLayer.DrawTiles(camera, this.frameNum);
        this.wireLayer.DrawTiles(camera, this.frameNum);
        this.semisolidLayer.DrawTiles(camera, this.frameNum);
        this.fluidLevels.forEach(a => a.Draw(camera));
        this.mainLayer.DrawSprites(camera, this.frameNum);

        if (this.fadeOutRatio) {
            camera.ctx.fillStyle = `rgba(0,0,0,${this.fadeOutRatio.toFixed(2)})`;
            camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
        }
        BenchmarkService.Log("DrawDone");

        if (player) {
            this.timerText = Utility.FramesToTimeText(player.age + (player.isActive ? editorHandler.bankedCheckpointTime : 0));
        }
        if (this.timerText && !editorHandler.isEditorAllowed && currentLevelCode != "") {
            let fontsize = 16;
            ctx.textAlign = "left";
            ctx.font = `${fontsize}px grobold`;
            ctx.strokeStyle = "#0008"
            ctx.fillStyle = "#FFF9"
            ctx.lineWidth = 4;
            ctx.strokeText(this.timerText, 10, 10 + fontsize);
            ctx.fillText(this.timerText, 10, 10 + fontsize);

            if (this.fullDarknessRatio > 0) {
                let opacityHex = this.fullDarknessRatio.toString(16).substring(2, 4).padEnd(2, "0");
                if (this.fullDarknessRatio >= 1) opacityHex = "FF";
                camera.ctx.fillStyle = "#000000" + opacityHex;
                camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
            }
        }
    }

    CanPause(): boolean {
        let levelGears = <GoldGear[]>this.mainLayer.sprites.filter(a => a instanceof GoldGear);
        if (levelGears.some(a => a.spinMode)) return false;
        return true;
    }

    StartDoorTransition(spriteToMove: Player, startDoor: Door, destinationDoor: Door): void {
        spriteToMove.heldItem = null;
        spriteToMove.dx = 0;
        spriteToMove.dy = 0;
        this.doorTransition = new DoorTransition(spriteToMove, startDoor, destinationDoor);
    }

    ProcessDoorTransition(doorTransition: DoorTransition): void {
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
            this.mainLayer.sprites = this.mainLayer.sprites.filter(a => a != doorTransition.doorAnimation);
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
    }

    GetExportString(): string {
        let spriteList: string[] = [];
        for (let sprite of editorHandler.sprites) {
            let spriteIndex = spriteTypes.indexOf(sprite.spriteType);
            let x = sprite.tileCoord.tileX;
            let y = sprite.tileCoord.tileY;
            let additionalProps = sprite.editorProps || [];

            let spriteStr = [spriteIndex, x, y, ...additionalProps].map(a => Utility.toTwoDigitB64(a));
            spriteList.push(spriteStr.join(''));
        }

        let layers = this.GetLayerList().map(a => a.ExportToString());

        let properties = [
            version,
            this.mapHeight,
            this.playerWaterMode ? 1 : 0,
            this.spriteWaterMode ? 1 : 0,
            this.songId,
        ];

        return [
            properties.join(";"),
            this.GetBackgroundExportString(),
            ...layers,
            spriteList.join(";"),
        ].join("|");
    }

    LoadBackgroundsFromImportString(importStr: string): void {
        let importedSections = importStr.split(";");
        let skyData = importedSections.shift();
        if (skyData) {
            let skyDataPieces = skyData.split(",");
            this.bgColorTop = skyDataPieces[0];
            this.bgColorTopPositionRatio = parseFloat(skyDataPieces[2]);
            this.bgColorBottomPositionRatio = parseFloat(skyDataPieces[3]);
            this.overlayOpacity = parseFloat(skyDataPieces[4]);
            editorHandler.skyEditor.topColorPanel.SetColor(this.bgColorTop);
            this.bgColorBottom = skyDataPieces[1];
            editorHandler.skyEditor.bottomColorPanel.SetColor(this.bgColorBottom);
        }
        for (let i = 0; i < importedSections.length; i++) {
            this.backgroundLayers[i] = BackgroundLayer.FromImportString(i, importedSections[i]);
        }
    }

    GetBackgroundExportString(): string {
        this.GenerateThumbnail();
        let skyString = [
            this.bgColorTop,
            this.bgColorBottom,
            this.bgColorTopPositionRatio.toFixed(2),
            this.bgColorBottomPositionRatio.toFixed(2),
            this.overlayOpacity.toFixed(2)
        ].join(",");
        return skyString + ";" + this.backgroundLayers.map(a => a.ExportToString()).join(";");
    }

    GenerateThumbnail(): HTMLCanvasElement {
        let canvas = document.createElement("canvas");
        canvas.width = camera.canvas.width / 24;
        canvas.height = camera.canvas.height / 24;
        let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        currentMap.Draw(camera);
        editorHandler.DrawSprites(camera);
        ctx.drawImage(camera.canvas, 0, 0, canvas.width, canvas.height);
        return canvas;
    }

    GetLayerList(): LevelLayer[] {
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
        ]
    }

    static FromImportString(importStr: string, keepGhostFrames: boolean = false): LevelMap {
        let importSegments = importStr.split("|");
        let properties = importSegments[0].split(";");

        let dummyLayer = new LevelLayer(TargetLayer.main);
        let ret = new LevelMap(dummyLayer, dummyLayer, dummyLayer, dummyLayer, dummyLayer);
        let mapHeight = parseInt(properties[1]);
        ret.mapHeight = mapHeight;
        ret.LoadBackgroundsFromImportString(importSegments[1]);

        ret.GetLayerList().forEach((layer, index) => {
            let newLayer = LevelLayer.FromImportString(importSegments[index + 2], index, mapHeight, ret);
            ((<any>ret)[TargetLayer[index] + "Layer"]) = newLayer;
        })

        editorHandler.sprites = [];
        for (let spriteStr of importSegments[7].split(";")) {
            if (!spriteStr) continue;

            let spriteIndex = Utility.IntFromB64(spriteStr.slice(0, 2));
            let spriteX = Utility.IntFromB64(spriteStr.slice(2, 4));
            let spriteY = Utility.IntFromB64(spriteStr.slice(4, 6));

            let spriteType = spriteTypes[spriteIndex];
            let rawPropsStr = spriteStr.slice(6);

            let additionalProps: number[] = [];
            for (let i = 0; i < rawPropsStr.length; i += 2) {
                let propB64 = rawPropsStr.slice(i, 2);
                let propNum = Utility.IntFromB64(propB64);
                additionalProps.push(propNum);
            }

            let editorSprite = new EditorSprite(spriteType, { tileX: spriteX, tileY: spriteY });
            editorSprite.editorProps = additionalProps;
            if (editorSprite.spriteInstance instanceof BasePlatform) {
                if (additionalProps[0]) editorSprite.width = additionalProps[0];
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
        let songName = audioHandler.levelSongList[ret.songId];
        audioHandler.SetBackgroundMusic(songName);
        editorHandler.CloseDrawers();

        if (!keepGhostFrames) editorHandler.playerFrames = [];

        return ret;
    }

    static BlankOutMap(): void {
        editorHandler.playerWaterModeToggle.isSelected = false;
        editorHandler.spriteWaterModeToggle.isSelected = false;
        currentMap.playerWaterMode = false;
        currentMap.spriteWaterMode = false;
        currentMap.mapHeight = 24;
        editorHandler.sprites = [];

        currentMap.GetLayerList().forEach((layer, index) => {
            let newLayer = LevelLayer.FromImportString(`AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAf`, index, currentMap.mapHeight, currentMap);
            ((<any>currentMap)[TargetLayer[index] + "Layer"]) = newLayer;
        });

        editorHandler.sprites.push(new EditorSprite(Player, { tileX: 4, tileY: 20 }));
        editorHandler.sprites.push(new EditorSprite(GoldGear, { tileX: 55, tileY: 20 }));
        editorHandler.playerFrames = [];
        editorHandler.history.RecordHistory();
    }
}

class DoorTransition {
    constructor(public spriteToMove: Player, public startDoor: Door, public destinationDoor: Door) { }

    public timer: number = 0;
    public doorAnimation: DoorAnimation | null = null;
}

class FluidLevel {
    public currentY: number = -1;
    //public targetY: number = -1;
    public currentSpeed: number = 0;
    private animationCounter = 0;
    private isInitialized = false;
    private drains: LevelTile[] = [];
    constructor(public surfaceTile: AnimatedTileType, public mainTile: TileType, public fluidTypeIndex: number) { }

    private flowSourceTiles: LevelTile[] = [];

    AddFlowSource(levelTile: LevelTile): void {
        let alreadyIn = this.flowSourceTiles.some(a => a.tileX === levelTile.tileX && a.tileY === levelTile.tileY);
        if (!alreadyIn) {
            this.flowSourceTiles.push(levelTile);
        }
    }

    RemoveFlowSource(levelTile: LevelTile): void {
        this.flowSourceTiles = this.flowSourceTiles.filter(a => !(a.tileX === levelTile.tileX && a.tileY === levelTile.tileY));
    }

    Initialize(): void {
        if (currentMap) {
            for (let col of currentMap.mainLayer.tiles) {
                for (let tile of col) {
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
    }

    Update(): void {
        if (!this.isInitialized) {
            this.Initialize();
            this.isInitialized = true;
        }

        let flowsAboveWaterLevel = this.flowSourceTiles.filter(a => (a.tileY + 1) * a.layer.tileHeight < this.currentY);
        let drainsBelowWaterLevel = this.drains.filter(a => (a.tileY + 0.5) * a.layer.tileHeight > this.currentY);
        let netFlow = drainsBelowWaterLevel.length - flowsAboveWaterLevel.length * 2;

        let dy = netFlow * 0.1;
        this.currentY += dy;
        this.animationCounter++;
    }

    Draw(camera: Camera): void {
        if (this.currentY == -1) return;

        let imageTileMain = this.mainTile.imageTile;
        let imageTileSurface = this.surfaceTile.imageTiles[Math.floor(this.animationCounter / this.surfaceTile.framesPerTile) % this.surfaceTile.imageTiles.length];


        let destY = (this.currentY - camera.y) * camera.scale + camera.canvas.height / 2;
        camera.ctx.drawImage(imageTileMain.src, imageTileMain.xSrc + 0.1, imageTileMain.ySrc + 0.1, imageTileMain.width - 0.2, imageTileMain.height - 0.2,
            0, destY, camera.canvas.width, camera.canvas.height - destY + 10);

        for (let x = -(camera.x % 12) * camera.scale; x < camera.canvas.width; x += 12 * camera.scale) {
            camera.ctx.drawImage(imageTileSurface.src, imageTileSurface.xSrc + 0.1, imageTileSurface.ySrc + 0.1, imageTileSurface.width - 0.2, imageTileSurface.height - 0.2,
                x, destY - (12 * camera.scale), imageTileSurface.width * camera.scale, imageTileSurface.height * camera.scale);
        }

        let imageTileFall = tiles["pipes"][this.fluidTypeIndex * 2][1];
        for (let sourceTile of this.flowSourceTiles) {
            let flowX = (sourceTile.tileX * sourceTile.layer.tileWidth - camera.x) * camera.scale + camera.canvas.width / 2;
            let flowY = (sourceTile.tileY * sourceTile.layer.tileHeight - camera.y) * camera.scale + camera.canvas.height / 2;
            let flowBottom = Math.min(camera.canvas.height, destY - 14 * camera.scale);
            camera.ctx.drawImage(imageTileFall.src, imageTileFall.xSrc + 0.1, imageTileFall.ySrc + 0.1, imageTileFall.width - 0.2, imageTileFall.height - 0.2,
                flowX, flowY + (12 * camera.scale), imageTileFall.width * camera.scale, flowBottom - flowY);
        }
    }
}