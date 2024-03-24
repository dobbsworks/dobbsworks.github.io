class LevelLayer {
    constructor(
        public layerType: TargetLayer
    ) {
        this.tileHeight = TileType.Air.imageTile.height;
        this.tileWidth = TileType.Air.imageTile.width;
    }

    public map: LevelMap | null = null;
    public tiles: LevelTile[][] = [];
    public cachedCanvas: HTMLCanvasElement = document.createElement("canvas");
    public spriteCanvas: HTMLCanvasElement = document.createElement("canvas");
    public isDirty = true;
    public sprites: Sprite[] = [];
    public tileHeight: number = 0;
    public tileWidth: number = 0;

    private isAnimatedTileListInitialized = false;
    private animatedTileList: LevelTile[] = [];
    public wireFlatMap: LevelTile[] = [];
    private isWireFlatMapInitialized = false;

    GetMaxX(): number {
        return this.tiles.length * this.tileWidth;
    }
    GetMaxY(): number {
        if (this.tiles.length == 0) return 0;
        return this.tiles[0].length * this.tileHeight;
    }

    DrawToCache(frameNum: number) {
        if (this.isDirty) {
            if (this.layerType == TargetLayer.water) this.UpdateWaterTiles();
            this.cachedCanvas = document.createElement("canvas");
            if (this.tiles.length) this.DrawSectionToCanvasWithOverdraw(this.cachedCanvas,
                0, 0, this.tiles.length - 1, this.tiles[0].length - 1);
            this.spriteCanvas.width = camera.canvas.width;
            this.spriteCanvas.height = camera.canvas.height;
        }
        this.isDirty = false;

        // only redraw animated tiles that are on-screen
        // for a small level covered in wind, drops the DrawLayers from 9.11ms to 1.69ms

        let minXTile = Math.floor(camera.GetLeftCameraEdge() / this.tileWidth);
        let minYTile = Math.floor(camera.GetTopCameraEdge() / this.tileHeight);
        let maxXTile = Math.ceil(camera.GetRightCameraEdge() / this.tileWidth);
        let maxYTile = Math.ceil(camera.GetBottomCameraEdge() / this.tileHeight);

        for (let tile of this.animatedTileList) {
            if (tile.tileX < minXTile) continue;
            if (tile.tileY < minYTile) continue;
            if (tile.tileX > maxXTile) continue;
            if (tile.tileY > maxYTile) continue;
            let tileType = <AnimatedTileType>tile.tileType;
            let imageTiles = tileType.imageTiles;
            if (imageTiles) {
                let index = Math.floor(frameNum / tileType.framesPerTile) % imageTiles.length;
                this.RedrawTile(tile.tileX, tile.tileY, imageTiles[index]);
            } else {
                this.RedrawTile(tile.tileX, tile.tileY, tileType.imageTile);
            }
        }
    }

    DrawSectionToCanvasWithOverdraw(canvas: HTMLCanvasElement, left: number, top: number, right: number, bottom: number): void {
        this.DrawSectionToCanvas(canvas, left, top, right, bottom, true)
    }

    DrawSectionToCanvas(canvas: HTMLCanvasElement, left: number, top: number, right: number, bottom: number, overdraw: boolean = false): void {
        let overdrawAmount = overdraw ? 1 : 0;

        let targetWidth = this.tileWidth * (right - left + 1 + 2 * overdrawAmount);
        if (canvas.width != targetWidth) canvas.width = targetWidth
        let targetHeight = this.tileHeight * (bottom - top + 1 + 2 * overdrawAmount); // extra 2 for drawing for screen shake
        if (canvas.height != targetHeight) canvas.height = targetHeight;
        let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");


        let x = 0;
        for (let colIndex = left - overdrawAmount; colIndex <= right + overdrawAmount; colIndex++, x++) {
            let col = this.tiles[colIndex];
            if (colIndex < 0) col = this.tiles[0];
            if (colIndex >= this.tiles.length) col = this.tiles[this.tiles.length - 1];
            if (!col) continue;
            let y = 0;
            for (let rowIndex = top - overdrawAmount; rowIndex <= bottom + overdrawAmount; rowIndex++, y++) {
                let tile = col[rowIndex];
                if (rowIndex < 0) tile = col[0];
                if (rowIndex >= col.length) tile = col[col.length - 1];
                if (!tile) continue;
                let imageTile = tile.tileType.imageTile;
                if (!imageTile) continue;

                for (let waterType of [TileType.Water, TileType.PurpleWater, TileType.Lava]) {
                    let img = waterType == TileType.Water ? "water" : (waterType == TileType.PurpleWater ? "purpleWater" : "lava");
                    if (this.layerType == TargetLayer.water && tile.tileType == waterType) {
                        let waterTiles = [waterType];
                        if (waterType == TileType.Water) waterTiles.push(TileType.Waterfall);
                        let isWaterLeft = waterTiles.indexOf(this.GetTileByIndex(colIndex - 1, rowIndex).tileType) > -1;
                        let isWaterRight = waterTiles.indexOf(this.GetTileByIndex(colIndex + 1, rowIndex).tileType) > -1;
                        let isWaterDown = waterTiles.indexOf(this.GetTileByIndex(colIndex, rowIndex + 1).tileType) > -1;
                        if (isWaterDown && isWaterLeft && !isWaterRight) imageTile = tiles[img][7][0];
                        if (isWaterDown && !isWaterLeft && isWaterRight) imageTile = tiles[img][5][0];
                        if (isWaterDown && !isWaterLeft && !isWaterRight) imageTile = tiles[img][6][0];
                        if (!isWaterDown && isWaterLeft && isWaterRight) imageTile = tiles[img][6][1];
                        if (!isWaterDown && isWaterLeft && !isWaterRight) imageTile = tiles[img][7][1];
                        if (!isWaterDown && !isWaterLeft && isWaterRight) imageTile = tiles[img][5][1];
                        if (!isWaterDown && !isWaterLeft && !isWaterRight) imageTile = tiles[img][4][1];
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
    }

    SetTile(xIndex: number, yIndex: number, tileType: TileType, isInitialMapSetup = false): boolean {
        if (this.map && (yIndex >= this.map?.mapHeight || yIndex < 0)) {
            new LevelTile(xIndex, yIndex, TileType.Air, this);
            return false;
        }

        if (this.map?.hasHorizontalWrap && !isInitialMapSetup) {
            if (xIndex < 0) xIndex += this.tiles.length;
            if (xIndex >= this.tiles.length) xIndex -= this.tiles.length;
        }

        let tileExists = !!(this.tiles[xIndex] && this.tiles[xIndex][yIndex]);
        let existingTile = this.GetTileByIndex(xIndex, yIndex);
        if (existingTile.tileType !== tileType || !tileExists) {
            this.wireFlatMap = this.wireFlatMap.filter(a => !(a.tileX == xIndex && a.tileY == yIndex));

            existingTile.tileType = tileType
            existingTile.SetPropertiesByTileType();
            let col = this.tiles[xIndex];
            if (!col) this.tiles[xIndex] = [];
            this.tiles[xIndex][yIndex] = existingTile;

            if (this.layerType == TargetLayer.water) {
                this.isDirty = true;
            }
            if (!tileType) console.error("Invalid tiletype!");
            this.RedrawTile(xIndex, yIndex, tileType.imageTile);
            if (tileType.autoChange) {
                currentMap.autoChangeTiles = currentMap.autoChangeTiles.filter(a => a.tile != existingTile);
                currentMap.autoChangeTiles.push({ tile: existingTile, standDuration: 0 });
            }

            let existingAnimatedEntry = this.animatedTileList.find(a => a.tileX == xIndex && a.tileY == yIndex);
            if (existingAnimatedEntry) this.animatedTileList = this.animatedTileList.filter(a => a != existingAnimatedEntry);
            if (tileType instanceof AnimatedTileType) {
                if (StorageService.GetPreferenceBool(Preference.AnimateTiles)) {
                    this.animatedTileList.push(existingTile);
                }
            }
            if (!isInitialMapSetup && this.layerType == TargetLayer.wire) this.wireFlatMap.push(existingTile);

            return true;
        }
        return false;
    }

    ExplodeTile(tile: LevelTile): void {
        let oldTileType = tile.tileType;
        this.SetTile(tile.tileX, tile.tileY, TileType.Air);
        if (oldTileType != TileType.Air) {
            // create shards
            for (let x of [-1, 1]) for (let y of [-1, 1]) {
                let shard = new BlockShard(tile.tileX * 12 + 6, tile.tileY * 12 + 6, this, []);
                shard.dx = x * 1;
                shard.dy = y * 0.5 - 1;
                shard.tilePortionX = x == -1 ? 0 : 1;
                shard.tilePortionY = y == -1 ? 0 : 1;
                shard.sourceTileType = oldTileType;
                this.sprites.push(shard);
            }
        }
    }

    UpdateWaterTiles(): void {
        for (let x = 0; x < this.tiles.length; x++) {
            for (let y = 0; y < this.tiles[0].length; y++) {
                let tile = this.GetTileByIndex(x, y);
                let tileAbove = this.GetTileByIndex(x, y - 1);
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
        this.animatedTileList = this.tiles.flatMap(a => a).filter(a => a.tileType instanceof AnimatedTileType);
    }

    RedrawTile(xIndex: number, yIndex: number, imageTile: ImageTile) {
        let cachedCtx = <CanvasRenderingContext2D>this.cachedCanvas.getContext("2d");
        let x = (xIndex + 1) * this.tileWidth;
        let y = (yIndex + 1) * this.tileHeight;
        cachedCtx.clearRect(x, y, this.tileWidth, this.tileHeight);
        imageTile.Draw(cachedCtx, x, y, 1);

        if (imageTile.yOffset != 0) {
            this.isDirty = true;
        }

        // if (this.map && this.map.silhoutteColor) {
        //     cachedCtx.globalCompositeOperation = "source-atop";
        //     cachedCtx.fillStyle = this.map.silhoutteColor;
        //     cachedCtx.fillRect(x, y, this.tileWidth, this.tileHeight);
        //     cachedCtx.globalCompositeOperation = "source-over";
        // }
    }

    Update(): void {
        if (!this.isAnimatedTileListInitialized) {
            this.animatedTileList = this.tiles.flatMap(a => a).filter(a => a.tileType instanceof AnimatedTileType);
            this.isAnimatedTileListInitialized = true;
        }
        if (this.layerType == TargetLayer.wire && !this.isWireFlatMapInitialized) {
            this.isWireFlatMapInitialized = true;
            this.wireFlatMap = this.tiles.flatMap(a => a);
        }
        this.sprites.forEach(a => a.updatedThisFrame = false);
        let motors = this.sprites.filter(a => a instanceof Motor || a instanceof Bigby);
        motors.sort((a, b) => a.y - b.y)
        let platforms = this.sprites.filter(a => a.isPlatform && !(a instanceof Motor || a instanceof Bigby));
        let players = this.sprites.filter(a => a instanceof Player);
        platforms.sort((a, b) => a.y - b.y)
        let orderedSprites = [
            ...motors,
            ...platforms,
            ...players,
            ...this.sprites.filter(a => !a.isPlatform && !(a instanceof Motor || a instanceof Bigby) && !(a instanceof Player)),
        ];
        this.sprites = orderedSprites;

        // using spread on orderedSprites to make sure we're iterating over a seaparte copy of the sprite list
        // iterating directly over orderedSprites is a problem because sprites is pointing to the same memory 
        // location, meaning that changes to the sprite list can affect which sprites are getting updated
        for (let sprite of [...orderedSprites]) {
            if (sprite.locked) continue;
            if (sprite.updatedThisFrame) continue;
            if (!sprite.isActive) continue;

            sprite.updatedThisFrame = true;
            sprite.SharedUpdate();
            sprite.Update();
            if (sprite instanceof Enemy) {
                sprite.EnemyUpdate();
            }
        }
        this.sprites = this.sprites.filter(a => a.isActive);
        if (this.map?.hasHorizontalWrap) {
            let offset = this.tiles.length * 12;
            for (let sprite of this.sprites) {
                if (sprite.xMid < 0) sprite.x += offset;
                if (sprite.xMid > offset) sprite.x -= offset;
            }
        }
    }

    GetTileByPixel(xPixel: number, yPixel: number, allowRedirect: boolean = true): LevelTile {
        let xTile = Math.floor(xPixel / this.tileWidth);
        let yTile = Math.floor(yPixel / this.tileHeight);
        if (!this.tiles) return new LevelTile(xTile, yTile, TileType.Air, this);
        if (!this.tiles[xTile]) {
            if (this.map?.hasHorizontalWrap && allowRedirect) {
                let offset = this.tiles.length * 12;
                let tile = (xPixel < 0) ?
                    this.GetTileByPixel(xPixel + offset, yPixel, false) :
                    this.GetTileByPixel(xPixel - offset, yPixel, false);
                return new LevelTile(xTile, yTile, tile.tileType, this);
            } else {
                return new LevelTile(xTile, yTile, TileType.Air, this);
            }
        }
        if (!this.tiles[xTile][yTile]) {
            if (yTile < 0) {
                if (this.layerType == TargetLayer.wire) return new LevelTile(xTile, yTile, TileType.Air, this);
                let topOfScreenTile = this.GetTileByPixel(xPixel, 0);
                return new LevelTile(xTile, yTile, topOfScreenTile.tileType, this);
            }
            return new LevelTile(xTile, yTile, TileType.Air, this);
        }
        return this.tiles[xTile][yTile];
    }

    GetTileByIndex(xTile: number, yTile: number): LevelTile {
        return this.GetTileByPixel(xTile * this.tileWidth, yTile * this.tileHeight);
    }

    AttemptToCoatTile(xIndex: number, yIndex: number, coatType: TileType) {
        let tile = this.GetTileByIndex(xIndex, yIndex);
        let semisolid = tile.GetSemisolidNeighbor();

        if (tile.tileType == TileType.Air) {
            if (semisolid && semisolid.tileType.solidity == Solidity.Top) {
                if (this.CanSlimeTile(semisolid)) {
                    semisolid.layer.SetTile(xIndex, yIndex, coatType);
                }
            }
        } else {
            if (tile.tileType.solidity == Solidity.Block && this.CanSlimeTile(tile)) {
                semisolid = tile.layer.map?.semisolidLayer.GetTileByIndex(xIndex, yIndex);
            }
        }

        if (semisolid) {

            if (coatType == TileType.FireTop && semisolid.uncoatedType == TileType.IceTop) {
                // fire melts away ice
                semisolid.layer.SetTile(xIndex, yIndex, semisolid.uncoatedType);
            } else if (false) {
                // TODO, more combos
            } else {
                semisolid.layer.SetTile(xIndex, yIndex, coatType);
            }
        }
    }

    ClearTile(xIndex: number, yIndex: number): void {
        let tile = this.GetTileByIndex(xIndex, yIndex);
        let semisolid = tile.GetSemisolidNeighbor();
        if (semisolid && this.map) {
            let oldTileType = this.map.semisolidLayer.GetTileByIndex(semisolid.tileX, semisolid.tileY).tileType;
            if (oldTileType != TileType.Air) {
                if ( oldTileType != semisolid.uncoatedType) {
                    this.map.semisolidLayer.SetTile(semisolid.tileX, semisolid.tileY, semisolid.uncoatedType);
                    this.map.semisolidLayer.isDirty = true;
                }
            }
        }
    }

    CanSlimeTile(tile: LevelTile): boolean {
        return !tile.tileType.isExemptFromSlime;
    }

    DrawTiles(camera: Camera, frameNum: number): void {
        this.DrawToCache(frameNum);
        let scale = camera.scale;
        camera.ctx.drawImage(this.cachedCanvas,
            -(camera.x + 12) * scale + camera.canvas.width / 2,
            -(camera.y + 12) * scale + camera.canvas.height / 2,
            this.cachedCanvas.width * scale, this.cachedCanvas.height * scale);
    }

    DrawSprites(camera: Camera, frameNum: number): void {
        // draw player on top of other sprites
        let orderedSprites = [...this.sprites];
        orderedSprites.sort((a, b) => a.zIndex - b.zIndex);
        for (let sprite of orderedSprites) {
            sprite.Draw(camera, frameNum);
        }
        for (let sprite of orderedSprites) {
            sprite.OnAfterAllSpritesDraw(camera, frameNum);
        }
    }

    public DrawFrame(frameData: FrameData, scale: number, sprite: Sprite) {
        let ctx = camera.ctx;
        if (this.map && this.map.silhoutteColor) {
            if (sprite.isExemptFromSilhoutte) {
                ctx = camera.ctx;
            } else {
                ctx = <CanvasRenderingContext2D>this.spriteCanvas.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.imageSmoothingEnabled = false;
            }
        }

        if (!ctx) return;
        let imgTile = frameData.imageTile;

        let xFlip = frameData.xFlip;
        if (SeasonalService.GetEvent() == SeasonalEvent.AprilFools) xFlip = !xFlip;

        imgTile.Draw(ctx,
            (sprite.x - camera.x - frameData.xOffset) * scale + camera.canvas.width / 2,
            (sprite.y - camera.y - frameData.yOffset) * scale + camera.canvas.height / 2,
            scale, xFlip, frameData.yFlip);

        if (debugMode) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#CCC";
            ctx.strokeRect(
                (sprite.x + sprite.dx - camera.x) * scale + camera.canvas.width / 2,
                (sprite.y + sprite.dy - camera.y) * scale + camera.canvas.height / 2,
                sprite.width * scale, sprite.height * scale);
            ctx.strokeRect(
                (sprite.x - camera.x) * scale + camera.canvas.width / 2,
                (sprite.y - camera.y) * scale + camera.canvas.height / 2,
                sprite.width * scale, sprite.height * scale);
        }

        if (this.map && this.map.silhoutteColor && !sprite.isExemptFromSilhoutte) {
            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = this.map.silhoutteColor;
            ctx.fillRect(0, 0, this.spriteCanvas.width, this.spriteCanvas.height);
            ctx.globalCompositeOperation = "source-over";
        }
        if (!sprite.isExemptFromSilhoutte) camera.ctx.drawImage(this.spriteCanvas, 0, 0);
    }

    ExportToString(numColumns = 0): string {
        let allTiles = <TileType[]>Object.values(TileType.TileMap);
        let availableTileTypes = allTiles.filter(a => a.targetLayer == this.layerType);
        if (availableTileTypes.indexOf(TileType.Air) == -1) availableTileTypes.unshift(TileType.Air);

        let tileIndeces = this.tiles.flatMap(a => a).map(a => availableTileTypes.indexOf(a.tileType));
        if (numColumns > 0) {
            tileIndeces = this.tiles.filter((a, i) => i < numColumns).flatMap(a => a).map(a => availableTileTypes.indexOf(a.tileType));
        }
        if (tileIndeces.some(a => a == -1)) {
            console.error("Layer includes invalid tile");
        }

        let b64EncodeStr = Utility.b64Str;

        // Going to combine like elements
        // AAbbbAAAAAbb becomes A2 b3 A5 b2
        let ret = "";
        for (let tileIndex = 0; tileIndex < tileIndeces.length;) {
            let id = tileIndeces[tileIndex];
            let numberInThisLine = tileIndeces.slice(tileIndex).findIndex(a => a != id);
            if (numberInThisLine == -1) numberInThisLine = tileIndeces.length - tileIndex;
            if (numberInThisLine > b64EncodeStr.length) numberInThisLine = b64EncodeStr.length;

            let encodedTileId = Utility.toTwoDigitB64(id);
            let encodedCount = b64EncodeStr[numberInThisLine - 1];

            ret += encodedTileId + encodedCount;
            tileIndex += numberInThisLine;
        }

        return ret;
    }

    static FromImportString(importStr: string, layerType: TargetLayer, mapHeight: number, map: LevelMap, xStart = 0, yStart = 0): LevelLayer {
        let ret = new LevelLayer(layerType);
        ret.layerType = layerType;
        ret.map = map;
        LevelLayer.ImportIntoLayer(ret, importStr, layerType, mapHeight, 0, 0);
        return ret;
    }

    static ImportIntoLayer(layer: LevelLayer, importStr: string, layerType: TargetLayer, mapHeight: number, xStart: number, yStart: number) {
        let allTiles = <TileType[]>Object.values(TileType.TileMap);
        let availableTileTypes = allTiles.filter(a => a.targetLayer == layerType);
        if (availableTileTypes.indexOf(TileType.Air) == -1) availableTileTypes.unshift(TileType.Air);

        let x = xStart;
        let y = yStart;
        let errorCount = 0;

        for (let i = 0; i < importStr.length; i += 3) {
            let tileChars = importStr[i] + importStr[i + 1];
            let tileIndex = Utility.IntFromB64(tileChars);
            let tileCount = Utility.IntFromB64(importStr[i + 2]) + 1;
            let tileType = availableTileTypes[tileIndex];
            for (let j = 0; j < tileCount; j++) {
                if (!tileType) {
                    console.error(`Import error at (${x}, ${y}): "${tileChars}" (tile ${tileIndex} of ${availableTileTypes.length}), layer ${TargetLayer[layerType]}`);
                    layer.SetTile(x, y, TileType.Air, true);
                    errorCount++;
                } else {
                    layer.SetTile(x, y, tileType, true);
                }
                y++;
                if (y >= mapHeight) {
                    x++;
                    y = 0;
                }
            }
        }
        if (errorCount) {
            UIDialog.Alert(`Heads up, there were some unexpected blocks in your level code (${errorCount} of them). We've done our best to work around it, but some level pieces might be missing.`, "Got it");
        }

        return layer;
    }
}