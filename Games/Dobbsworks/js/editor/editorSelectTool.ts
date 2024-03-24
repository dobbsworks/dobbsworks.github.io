class EditorSelectTool extends EditorTool {
    selectionAreaCorner1: TileCoordinate | null = null;
    selectionAreaCorner2: TileCoordinate | null = null;
    singleSpriteMoverTool: SpritePlacer | null = null;
    selectionMoverTool: EditorSelectionMover | null = null;

    Reset(): void {
        this.selectionAreaCorner1 = null;
        this.selectionAreaCorner2 = null;
        this.selectedTiles = [];
        this.selectionMoverTool = null;
        this.singleSpriteMoverTool = null;
    }

    OnInitialClick(tileCoord: TileCoordinate): void {
        this.selectionMoverTool = null;
        this.singleSpriteMoverTool = null;
        if (this.selectionAreaCorner1 == null || this.selectionAreaCorner2 == null) {
            let existingSpriteOnTile = editorHandler.sprites.find(a => a.ContainsTile(tileCoord));
            if (existingSpriteOnTile) {
                this.singleSpriteMoverTool = new SpritePlacer(existingSpriteOnTile.spriteType);
                this.singleSpriteMoverTool.OnInitialClick(tileCoord);
            } else {
                this.selectionAreaCorner1 = tileCoord;
            }
        } else {
            let isSelectedTileWithinSelection =
                tileCoord.tileX <= Math.max(this.selectionAreaCorner1.tileX, this.selectionAreaCorner2.tileX)
                && tileCoord.tileX >= Math.min(this.selectionAreaCorner1.tileX, this.selectionAreaCorner2.tileX)
                && tileCoord.tileY <= Math.max(this.selectionAreaCorner1.tileY, this.selectionAreaCorner2.tileY)
                && tileCoord.tileY >= Math.min(this.selectionAreaCorner1.tileY, this.selectionAreaCorner2.tileY);
            if (isSelectedTileWithinSelection) {
                this.selectionMoverTool = new EditorSelectionMover(
                    this.selectionAreaCorner1.tileX, this.selectionAreaCorner1.tileY,
                    this.selectionAreaCorner2.tileX, this.selectionAreaCorner2.tileY);

                this.selectionMoverTool.OnInitialClick(tileCoord);

                let sprites = editorHandler.sprites.filter(spr => this.selectedTiles.some(tile => spr.ContainsTile(tile)));
                this.selectionMoverTool.sprites = sprites.map(a => a.Copy());
                this.selectionMoverTool.spritesInitialCoords = this.selectionMoverTool.sprites.map(a => ({ ...a.tileCoord }));

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
            } else {
                this.selectionAreaCorner1 = tileCoord;
            }
        }
    };
    OnClickOver(tileCoord: TileCoordinate): void {
        if (this.singleSpriteMoverTool) {
            this.singleSpriteMoverTool.OnClickOver(tileCoord);
        } else if (this.selectionMoverTool) {
            let offset = { tileX: this.selectionMoverTool.xOffset, tileY: this.selectionMoverTool.yOffset };
            this.selectionAreaCorner1 = AddCoords(this.selectionMoverTool.upperLeftSelectionStart, offset);
            this.selectionAreaCorner2 = AddCoords(this.selectionAreaCorner1, { tileX: this.selectionMoverTool.containedTiles.length - 1, tileY: this.selectionMoverTool.containedTiles[0].length - 1 });
            this.UpdateSelection();
            this.selectionMoverTool.OnClickOver(tileCoord);
        } else if (this.selectionAreaCorner1) {
            this.selectionAreaCorner2 = tileCoord;
            this.UpdateSelection();
        }
    };
    OnReleaseClick(): void {
        if (this.singleSpriteMoverTool) {
            this.singleSpriteMoverTool.OnReleaseClick();
        } else if (this.selectionMoverTool) {
            this.selectionMoverTool.OnReleaseClick();
        }
        this.selectionMoverTool = null;
        this.singleSpriteMoverTool = null;

        editorHandler.sprites.
            filter(spr => this.selectedTiles.some(tile => spr.ContainsTile(tile))).
            forEach(spr => spr.Wiggle(0));
    };
    OnCancel(): void {
        if (this.singleSpriteMoverTool) {
            this.singleSpriteMoverTool.OnCancel();
        } else if (this.selectionMoverTool) {
            this.selectionMoverTool.OnCancel();
        }
        this.Reset();
    };



    UpdateSelection(): void {
        this.selectedTiles = [];
        let left = Math.min(this.selectionAreaCorner1?.tileX || 0, this.selectionAreaCorner2?.tileX || 0);
        let right = Math.max(this.selectionAreaCorner1?.tileX || 0, this.selectionAreaCorner2?.tileX || 0);
        let top = Math.min(this.selectionAreaCorner1?.tileY || 0, this.selectionAreaCorner2?.tileY || 0);
        let bottom = Math.max(this.selectionAreaCorner1?.tileY || 0, this.selectionAreaCorner2?.tileY || 0);
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                this.selectedTiles.push({ tileX: x, tileY: y });
            }
        }
    }

    DeleteSelectedTiles(): void {
        let layers = currentMap.GetLayerList();
        for (let tile of this.selectedTiles) {
            layers.forEach(a => a.SetTile(tile.tileX, tile.tileY, TileType.Air));
        }
        editorHandler.sprites = editorHandler.sprites.filter(spr => !this.selectedTiles.some(tile => spr.ContainsTile(tile)) || spr.spriteInstance.isRequired);
    }
}


class EditorSelectionMover extends EditorTool {
    constructor(x1: number, y1: number, x2: number, y2: number) {
        super();

        let left = Math.min(x1, x2);
        let right = Math.max(x1, x2);
        let top = Math.min(y1, y2);
        let bottom = Math.max(y1, y2);
        this.upperLeftSelectionStart = { tileX: left, tileY: top };

        for (let x = left; x <= right; x++) {
            let col: TileType[][] = [];
            for (let y = top; y <= bottom; y++) {
                let cell = currentMap.GetLayerList().map(layer => layer.GetTileByIndex(x, y).tileType)
                col.push(cell);
            }
            this.containedTiles.push(col);
        }

        let canvas = document.createElement("canvas");
        currentMap.GetLayerList().forEach(a => a.DrawSectionToCanvas(canvas, left, top, right, bottom));
        let imageTile = new ImageTile(<any>canvas, 0, 0, canvas.width, canvas.height);
        this.frameData = {
            imageTile: imageTile,
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }
    }

    frameData!: FrameData;
    upperLeftSelectionStart!: TileCoordinate;
    containedTiles: TileType[][][] = [];
    initialClickTile!: TileCoordinate;
    xOffset: number = 0;
    yOffset: number = 0;
    sprites: EditorSprite[] = [];
    spritesInitialCoords: TileCoordinate[] = [];

    OnInitialClick(tileCoord: TileCoordinate): void {
        this.initialClickTile = tileCoord;
    }
    OnClickOver(tileCoord: TileCoordinate): void {
        this.xOffset = tileCoord.tileX - this.initialClickTile.tileX;
        this.yOffset = tileCoord.tileY - this.initialClickTile.tileY;

        // bounds check
        let left = this.upperLeftSelectionStart.tileX + this.xOffset;
        if (left < 0) this.xOffset = -this.upperLeftSelectionStart.tileX;
        let top = this.upperLeftSelectionStart.tileY + this.yOffset;
        if (top < 0) this.yOffset = -this.upperLeftSelectionStart.tileY;
        let right = this.upperLeftSelectionStart.tileX + this.xOffset + this.containedTiles.length - 1;
        if (right > currentMap.mainLayer.tiles.length - 1)
            this.xOffset = currentMap.mainLayer.tiles.length - this.upperLeftSelectionStart.tileX - this.containedTiles.length;
        let bottom = this.upperLeftSelectionStart.tileY + this.yOffset + this.containedTiles[0].length - 1;
        if (bottom > currentMap.mainLayer.tiles[0].length - 1)
            this.yOffset = currentMap.mainLayer.tiles[0].length - this.upperLeftSelectionStart.tileY - this.containedTiles[0].length;

        for (let i = 0; i < this.sprites.length; i++) {
            let coord = this.spritesInitialCoords[i];
            this.sprites[i].SetPosition({ tileX: coord.tileX + this.xOffset, tileY: coord.tileY + this.yOffset });
        }
    }
    OnReleaseClick(): void {
        let upperLeftPaste = { tileX: this.upperLeftSelectionStart.tileX + this.xOffset, tileY: this.upperLeftSelectionStart.tileY + this.yOffset };
        let x = upperLeftPaste.tileX;
        let layers = currentMap.GetLayerList();
        for (let col of this.containedTiles) {
            let y = upperLeftPaste.tileY;
            for (let cell of col) {
                let layerIndex = 0;
                for (let tileType of cell) {
                    if (tileType != TileType.Air) {
                        layers[layerIndex].SetTile(x, y, tileType);
                    }
                    layerIndex++;
                }
                y++;
            }
            x++;
        }
        for (let sprite of this.sprites) {
            let spriteAlreadyThere = editorHandler.sprites.find(a => a.OverlapsSprite(sprite));
            if (spriteAlreadyThere) {
                editorHandler.sprites = editorHandler.sprites.filter(a => a !== spriteAlreadyThere);
                let deadSprite = new DeadEnemy(spriteAlreadyThere.spriteInstance);
                currentMap.mainLayer.sprites.push(deadSprite);
            }
            editorHandler.sprites.push(sprite);
            sprite.ResetSprite();
            let maxAllowed = sprite.spriteInstance.maxAllowed;
            if (maxAllowed > 0) {
                let spritesOnMap = editorHandler.sprites.filter(a => a.spriteType == sprite.spriteType);
                if (spritesOnMap.length > maxAllowed) {
                    let numberToRemove = spritesOnMap.length - maxAllowed;
                    let spritesToRemove = spritesOnMap.slice(0, numberToRemove);
                    editorHandler.sprites = editorHandler.sprites.filter(a => spritesToRemove.indexOf(a) == -1);
                }
            }
        }
    }
    OnCancel(): void {
        let upperLeftPaste = { tileX: this.upperLeftSelectionStart.tileX, tileY: this.upperLeftSelectionStart.tileY };
        let x = upperLeftPaste.tileX;
        let layers = currentMap.GetLayerList();
        for (let col of this.containedTiles) {
            let y = upperLeftPaste.tileY;
            for (let cell of col) {
                let layerIndex = 0;
                for (let tileType of cell) {
                    if (tileType != TileType.Air) {
                        layers[layerIndex].SetTile(x, y, tileType);
                    }
                    layerIndex++;
                }
                y++;
            }
            x++;
        }
        for (let i = 0; i < this.sprites.length; i++) {
            let coord = this.spritesInitialCoords[i];
            this.sprites[i].SetPosition({ tileX: coord.tileX, tileY: coord.tileY});
            editorHandler.sprites.push(this.sprites[i]);
        }
    }
}