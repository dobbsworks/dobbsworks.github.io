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
            if (this.tiles.length) this.DrawSectionToCanvas(this.cachedCanvas,
                0, 0, this.tiles.length - 1, this.tiles[0].length - 1);
            this.spriteCanvas.width = camera.canvas.width;
            this.spriteCanvas.height = camera.canvas.height;
        }
        this.isDirty = false;

        for (let tile of this.animatedTileList) {
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

    DrawSectionToCanvas(canvas: HTMLCanvasElement, left: number, top: number, right: number, bottom: number): void {
        let targetWidth = this.tileWidth * (right - left + 1);
        if (canvas.width != targetWidth) canvas.width = targetWidth
        let targetHeight = this.tileHeight * (bottom - top + 1);
        if (canvas.height != targetHeight) canvas.height = targetHeight;
        let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

        let waterTiles = [TileType.Water, TileType.Waterfall, TileType.PurpleWater, TileType.Lava];

        let x = 0;
        for (let colIndex = left; colIndex <= right; colIndex++, x++) {
            let col = this.tiles[colIndex];
            if (!col) continue;
            let y = 0;
            for (let rowIndex = top; rowIndex <= bottom; rowIndex++, y++) {
                let tile = col[rowIndex];
                if (!tile) continue;
                let imageTile = tile.tileType.imageTile;
                if (!imageTile) continue;

                for (let waterType of [TileType.Water, TileType.PurpleWater, TileType.Lava]) {
                    let baseRow = (waterType == TileType.Water ? 0 : 3);
                    if (waterType == TileType.Lava) baseRow = 5;
                    if (this.layerType == TargetLayer.water && tile.tileType == waterType) {
                        let isWaterLeft = waterTiles.indexOf(this.GetTileByIndex(x - 1, y).tileType) > -1;
                        let isWaterRight = waterTiles.indexOf(this.GetTileByIndex(x + 1, y).tileType) > -1;
                        let isWaterDown = waterTiles.indexOf(this.GetTileByIndex(x, y + 1).tileType) > -1;
                        if (isWaterDown && isWaterLeft && !isWaterRight) imageTile = tiles["water"][7][baseRow];
                        if (isWaterDown && !isWaterLeft && isWaterRight) imageTile = tiles["water"][5][baseRow];
                        if (isWaterDown && !isWaterLeft && !isWaterRight) imageTile = tiles["water"][6][baseRow];
                        if (!isWaterDown && isWaterLeft && isWaterRight) imageTile = tiles["water"][6][1 + baseRow];
                        if (!isWaterDown && isWaterLeft && !isWaterRight) imageTile = tiles["water"][7][1 + baseRow];
                        if (!isWaterDown && !isWaterLeft && isWaterRight) imageTile = tiles["water"][5][1 + baseRow];
                        if (!isWaterDown && !isWaterLeft && !isWaterRight) imageTile = tiles["water"][4][1 + baseRow];
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
            this.RedrawTile(xIndex, yIndex, tileType.imageTile);
            if (tileType.autoChange) {
                currentMap.autoChangeTiles.push({ tile: existingTile, standDuration: 0 });
            }

            let existingAnimatedEntry = this.animatedTileList.find(a => a.tileX == xIndex && a.tileY == yIndex);
            if (existingAnimatedEntry) this.animatedTileList = this.animatedTileList.filter(a => a != existingAnimatedEntry);
            if (tileType instanceof AnimatedTileType) this.animatedTileList.push(existingTile);
            if (!isInitialMapSetup && this.layerType == TargetLayer.wire) this.wireFlatMap.push(existingTile);

            return true;
        }
        return false;
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
        let motors = this.sprites.filter(a => a instanceof Motor);
        let platforms = this.sprites.filter(a => a.isPlatform && !(a instanceof Motor));
        let players = this.sprites.filter(a => a instanceof Player);
        platforms.sort((a, b) => a.y - b.y)
        let orderedSprites = [
            ...motors,
            ...platforms,
            ...players,
            ...this.sprites.filter(a => !a.isPlatform && !(a instanceof Motor) && !(a instanceof Player)),
        ];
        this.sprites = orderedSprites;

        for (let sprite of orderedSprites) {
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
    }

    GetTileByPixel(xPixel: number, yPixel: number): LevelTile {
        let xTile = Math.floor(xPixel / this.tileWidth);
        let yTile = Math.floor(yPixel / this.tileHeight);
        if (!this.tiles) return new LevelTile(xTile, yTile, TileType.Air, this);
        if (!this.tiles[xTile]) return new LevelTile(xTile, yTile, TileType.Air, this);
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

    DrawTiles(camera: Camera, frameNum: number): void {
        this.DrawToCache(frameNum);
        let scale = camera.scale;
        camera.ctx.drawImage(this.cachedCanvas,
            -camera.x * scale + camera.canvas.width / 2,
            -camera.y * scale + camera.canvas.height / 2,
            this.cachedCanvas.width * scale, this.cachedCanvas.height * scale);
    }

    DrawSprites(camera: Camera, frameNum: number): void {
        // draw player on top of other sprites
        let orderedSprites = [...this.sprites];
        orderedSprites.sort((a, b) => a.zIndex - b.zIndex);
        for (let sprite of orderedSprites) {
            this.DrawSprite(sprite, camera, frameNum);
        }
    }

    DrawSprite(sprite: Sprite, camera: Camera, frameNum: number): void {
        sprite.OnBeforeDraw(camera);
        let frameData = sprite.GetFrameData(frameNum);
        if ('xFlip' in frameData) {
            this.DrawFrame(frameData, camera.scale, sprite);
        } else {
            for (let fd of <FrameData[]>frameData) {
                this.DrawFrame(fd, camera.scale, sprite);
            }
        }
        sprite.OnAfterDraw(camera);

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
        //if (sprite.isInTractorBeam) frameData.yFlip = !frameData.yFlip;
        imgTile.Draw(ctx,
            (sprite.x - camera.x - frameData.xOffset) * scale + camera.canvas.width / 2,
            (sprite.y - camera.y - frameData.yOffset) * scale + camera.canvas.height / 2,
            scale, frameData.xFlip, frameData.yFlip);

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
            tileIndeces = this.tiles.filter((a,i) => i < numColumns).flatMap(a => a).map(a => availableTileTypes.indexOf(a.tileType));
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

        for (let i = 0; i < importStr.length; i += 3) {
            let tileChars = importStr[i] + importStr[i + 1];
            let tileIndex = Utility.IntFromB64(tileChars);
            let tileCount = Utility.IntFromB64(importStr[i + 2]) + 1;
            let tileType = availableTileTypes[tileIndex];
            for (let j = 0; j < tileCount; j++) {
                layer.SetTile(x, y, tileType, true);
                y++;
                if (y >= mapHeight) {
                    x++;
                    y = 0;
                }
            }
        }

        return layer;
    }
}