abstract class EditorTool {
    selectedTiles: TileCoordinate[] = [];
    invalidTiles: TileCoordinate[] = [];
    initiallyClicked = false;
    abstract OnInitialClick(tileCoord: TileCoordinate): void;
    abstract OnClickOver(tileCoord: TileCoordinate): void;
    abstract OnReleaseClick(): void;
    abstract OnCancel(): void;
}

class Eraser extends EditorTool {
    constructor() { super(); }
    OnInitialClick(tileCoord: TileCoordinate): void { };
    OnClickOver(tileCoord: TileCoordinate): void {
        let erased: boolean[] = [];
        if (editorHandler.enableEraseSprites) {
            let existingSpriteOnTile = editorHandler.sprites.find(a => a.ContainsTile(tileCoord));
            if (existingSpriteOnTile && existingSpriteOnTile.spriteType != Player) {
                editorHandler.sprites = editorHandler.sprites.filter(a => a != existingSpriteOnTile);
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
        if (erased.some(a => a)) audioHandler.PlaySound("erase", true);
    };
    OnReleaseClick(): void { };
    OnCancel(): void { };
}

class SpritePlacer extends EditorTool {
    private heldSprite: EditorSprite | null = null;
    private xHoldOffset: number = 0;
    private yHoldOffset: number = 0;
    private isResizing: boolean = false;
    private previousPosition!: TileCoordinate;
    private resizeSide: -1 | 1 = -1;
    constructor(public spriteType: SpriteType) { 
        super(); 
        if (spriteTypes.indexOf(spriteType) == -1) {
            console.error("Sprite type missing from ordered list: " + spriteType.name);
        }
    }
    OnInitialClick(tileCoord: TileCoordinate): void {
        this.previousPosition = tileCoord;
        let existingSpriteOnTile = editorHandler.sprites.find(a => a.ContainsTile(tileCoord));
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
        } else {
            this.heldSprite = new EditorSprite(this.spriteType, tileCoord);
            this.xHoldOffset = 0;
            this.yHoldOffset = 0;
            editorHandler.sprites.push(this.heldSprite);
        }
        this.heldSprite.isHeld = true;
    };
    OnClickOver(tileCoord: TileCoordinate): void {
        if (this.heldSprite) {
            if (this.isResizing) {
                let dx = tileCoord.tileX - this.previousPosition.tileX;
                if (dx != 0) {
                    let widthChange = dx * this.resizeSide;
                    if (this.heldSprite.width + widthChange < 2) {
                        widthChange = 2 - this.heldSprite.width;
                    }
                    this.heldSprite.width += widthChange;
                    if (!this.heldSprite.editorProps[0]) this.heldSprite.editorProps[0] = 3;
                    this.heldSprite.editorProps[0] += widthChange;
                    if (this.resizeSide == -1) {
                        this.heldSprite.tileCoord.tileX -= widthChange;
                    }
                    this.heldSprite.ResetSprite();
                }
            } else {
                this.heldSprite.SetPosition({tileX: tileCoord.tileX - this.xHoldOffset, tileY: tileCoord.tileY - this.yHoldOffset});
            }
        }
        this.previousPosition = tileCoord;
    };
    OnReleaseClick(): void {
        this.isResizing = false;
        if (this.heldSprite) {
            let spriteAlreadyThere = editorHandler.sprites.find(a => this.heldSprite && a.OverlapsSprite(this.heldSprite));
            if (spriteAlreadyThere && spriteAlreadyThere.spriteType != Player) {
                // TODO special case for giftbox
                editorHandler.sprites = editorHandler.sprites.filter(a => a !== spriteAlreadyThere);
                let deadSprite = new DeadEnemy(spriteAlreadyThere.spriteInstance);
                currentMap.mainLayer.sprites.push(deadSprite);
            }
            
            let maxAllowed = this.heldSprite.spriteInstance.maxAllowed;
            if (maxAllowed > 0) {
                let spritesOnMap = editorHandler.sprites.filter(a => {
                    if (!this.heldSprite) return false;
                    if (a.spriteType == Player && this.heldSprite.spriteType == HoverPlayer) return true;
                    if (a.spriteType == HoverPlayer && this.heldSprite.spriteType == Player) return true;
                    return a.spriteType == this.heldSprite.spriteType
                });
                if (spritesOnMap.length > maxAllowed) {
                    let numberToRemove = spritesOnMap.length - maxAllowed;
                    let spritesToRemove = spritesOnMap.slice(0, numberToRemove);
                    editorHandler.sprites = editorHandler.sprites.filter(a => spritesToRemove.indexOf(a) == -1);
                }
            }

            this.heldSprite.StackWiggle(0, 0);
            this.heldSprite.isHeld = false;

        }
        this.heldSprite = null;
    };
    OnCancel(): void {
        this.isResizing = false;
        editorHandler.sprites = editorHandler.sprites.filter(a => a !== this.heldSprite);
        this.heldSprite = null;
    };
}

abstract class FillBrush extends EditorTool {
    constructor(public fillType: FillType) { super(); }
    OnReleaseClick(): void {
        if (this.fillType) this.fillType.FillTiles(this.selectedTiles);
        if (this.selectedTiles.length) audioHandler.PlaySound("thump", true);
        this.selectedTiles = [];
    }
    OnCancel(): void {
        if (this.selectedTiles.length) audioHandler.PlaySound("error", true);
        this.selectedTiles = [];
    }
}

class FreeformBrush extends FillBrush {
    private AddTile(tileCoord: TileCoordinate): void {
        if (!this.selectedTiles.some(a => a.tileX == tileCoord.tileX && a.tileY == tileCoord.tileY)) {
            this.selectedTiles.push(tileCoord);
        }
    }
    OnInitialClick(tileCoord: TileCoordinate): void { }
    OnClickOver(tileCoord: TileCoordinate): void {
        this.AddTile(tileCoord);
    }
}

abstract class CornerToCornerBrush extends FillBrush {
    protected corner1: TileCoordinate | null = null;
    protected corner2: TileCoordinate | null = null;
    abstract UpdateSelection(): void;
    OnInitialClick(tileCoord: TileCoordinate): void {
        this.corner1 = tileCoord;
    }
    OnClickOver(tileCoord: TileCoordinate): void {
        this.corner2 = tileCoord;
        this.UpdateSelection();
    }
}

class LineBrush extends CornerToCornerBrush {
    UpdateSelection(): void {
        this.selectedTiles = [];
        let left = Math.min(this.corner1?.tileX || 0, this.corner2?.tileX || 0);
        let right = Math.max(this.corner1?.tileX || 0, this.corner2?.tileX || 0);
        let top = Math.min(this.corner1?.tileY || 0, this.corner2?.tileY || 0);
        let bottom = Math.max(this.corner1?.tileY || 0, this.corner2?.tileY || 0);

        if (right - left > bottom - top) {
            for (let x = left; x <= right; x++) {
                if (top == bottom) {
                    this.selectedTiles.push({ tileX: x, tileY: top });
                } else {
                    let m = ((this.corner1?.tileY || 0) - (this.corner2?.tileY || 0)) / ((this.corner1?.tileX || 0) - (this.corner2?.tileX || 0));
                    let b = (this.corner1?.tileY || 0) - m * (this.corner1?.tileX || 0);
                    let y = +((m * x + b).toFixed(0));
                    this.selectedTiles.push({ tileX: x, tileY: y });
                }
            }
        } else {
            for (let y = top; y <= bottom; y++) {
                if (left == right) {
                    this.selectedTiles.push({ tileX: left, tileY: y });
                } else {
                    let m = ((this.corner1?.tileY || 0) - (this.corner2?.tileY || 0)) / ((this.corner1?.tileX || 0) - (this.corner2?.tileX || 0));
                    let b = (this.corner1?.tileY || 0) - m * (this.corner1?.tileX || 0);
                    let x = +(((y - b) / m).toFixed(0));
                    this.selectedTiles.push({ tileX: x, tileY: y });
                }
            }
        }
    }
}

class RectangleBrush extends CornerToCornerBrush {
    UpdateSelection(): void {
        this.selectedTiles = [];
        let left = Math.min(this.corner1?.tileX || 0, this.corner2?.tileX || 0);
        let right = Math.max(this.corner1?.tileX || 0, this.corner2?.tileX || 0);
        let top = Math.min(this.corner1?.tileY || 0, this.corner2?.tileY || 0);
        let bottom = Math.max(this.corner1?.tileY || 0, this.corner2?.tileY || 0);
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                this.selectedTiles.push({ tileX: x, tileY: y });
            }
        }
    }
}

class CircleBrush extends CornerToCornerBrush {
    UpdateSelection(): void {
        this.selectedTiles = [];
        let left = Math.min(this.corner1?.tileX || 0, this.corner2?.tileX || 0);
        let right = Math.max(this.corner1?.tileX || 0, this.corner2?.tileX || 0);
        let top = Math.min(this.corner1?.tileY || 0, this.corner2?.tileY || 0);
        let bottom = Math.max(this.corner1?.tileY || 0, this.corner2?.tileY || 0);
        let centerX = (left + right) / 2;
        let centerY = (top + bottom) / 2;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                let xRatio = (centerX - x) / ((right - left + 1) / 2);
                let yRatio = (centerY - y) / ((bottom - top + 1) / 2);
                if (xRatio ** 2 + yRatio ** 2 <= 1) this.selectedTiles.push({ tileX: x, tileY: y });
            }
        }
    }
}


abstract class FillType {
    abstract FillTiles(tileCoordinates: TileCoordinate[]): void;
}

class SimpleFill extends FillType {
    constructor(public fillTile: TileType) { super(); }
    FillTiles(tileCoordinates: TileCoordinate[]): void {
        for (let tileCoord of tileCoordinates) {
            if (this.fillTile.targetLayer == TargetLayer.backdrop) currentMap.backdropLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
            if (this.fillTile.targetLayer == TargetLayer.main) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
            if (this.fillTile.targetLayer == TargetLayer.semisolid) currentMap.semisolidLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
            if (this.fillTile.targetLayer == TargetLayer.water) currentMap.waterLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
            if (this.fillTile.targetLayer == TargetLayer.wire) currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.fillTile);
        }
    }
}

class SlopePen extends LineBrush {
    UpdateSelection(): void {
        super.UpdateSelection();
        if (this.selectedTiles.length > 1) {
            let last = this.selectedTiles.splice(this.selectedTiles.length - 1)[0];
            this.selectedTiles.splice(1, 0, last);
            // [1st, last, 2nd, 3rd...]
        }
        let minY = Math.min(...this.selectedTiles.map(a => a.tileY));
        let maxY = Math.max(...this.selectedTiles.map(a => a.tileY));
        let minX = Math.min(...this.selectedTiles.map(a => a.tileX));
        let maxX = Math.max(...this.selectedTiles.map(a => a.tileX));
        let rise = maxY - minY + 1;
        let run = maxX - minX + 1;
        let slope = rise / run;
        if (Math.abs(slope) !== 1 && Math.abs(slope) !== 0.5  && Math.abs(slope) !== 2 ) {
            this.invalidTiles = [...this.selectedTiles];
            this.selectedTiles = [];
            return;
        }
        this.invalidTiles = [];

        if (Math.abs(slope) == 1 || Math.abs(slope) == 0.5) {
            let upperLine = this.selectedTiles.filter(a => a.tileY != minY).map(a => ({tileX: a.tileX, tileY: a.tileY - 1}));
            let lowerLine = this.selectedTiles.filter(a => a.tileY != maxY).map(a => ({tileX: a.tileX, tileY: a.tileY + 1}));
            this.selectedTiles.push(...upperLine, ...lowerLine);
        }
        if (Math.abs(slope) == 2) {
            let leftLine = this.selectedTiles.filter(a => a.tileX != minX).map(a => ({tileX: a.tileX - 1, tileY: a.tileY}));
            let rightLine = this.selectedTiles.filter(a => a.tileX != maxX).map(a => ({tileX: a.tileX + 1, tileY: a.tileY}));
            this.selectedTiles.push(...leftLine, ...rightLine);
        }

    }
}

class SlopeFill extends FillType {
    constructor(private slopeTileKey: string, public innerTileType: TileType) { super(); }
    GetThumbnailImage(): ImageTile {
        return TileType.GetTileTypeFromKey(this.slopeTileKey + "SteepSlopeUp").imageTile;
    }
    FillTiles(tileCoordinates: TileCoordinate[]): void {
        // need to make sure to send start of pen drag as first tile
        // to differentiate between mirrorable arrangements
        // second tile is endpoint of line to extrapolate direction and slope

        let initialPoint = tileCoordinates[0];
        if (!initialPoint) return;
        currentMap.mainLayer.SetTile(initialPoint.tileX, initialPoint.tileY, this.innerTileType);
        if (tileCoordinates.length == 1) {
            return;
        }

        let endPoint = tileCoordinates[1];
        let dx = initialPoint.tileX - endPoint.tileX;
        let dy = initialPoint.tileY - endPoint.tileY;
        tileCoordinates.splice(0, 1);

        let slope = dy / dx;
        let isSlopePositive = slope < 0;
        if (Math.abs(slope) == 1) {
            // 45 degree slope

            let upperTile = TileType.GetTileTypeFromKey(this.slopeTileKey + "SteepSlope" + (isSlopePositive ? "Up" : "Down"));
            let lowerTile = TileType.GetTileTypeFromKey(this.slopeTileKey + "SteepCeiling" + (isSlopePositive ? "Up" : "Down"));

            for (let tileCoord of tileCoordinates) {
                let slopeFromHere = (tileCoord.tileY - initialPoint.tileY) / (tileCoord.tileX - initialPoint.tileX);
                if (Math.abs(slopeFromHere) == 1) {
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.innerTileType);
                } else if (Math.abs(slopeFromHere) < 1) {
                    // above the center line
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, upperTile);
                } else {
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, lowerTile);
                }
            }
        } else if (Math.abs(slope) < 1) {
            // ~35 degree slope
            
            let upperTileSmall = TileType.GetTileTypeFromKey(this.slopeTileKey + "HalfSlope" + (isSlopePositive ? "UpLeft" : "DownRight"));
            let upperTileLarge = TileType.GetTileTypeFromKey(this.slopeTileKey + "HalfSlope" + (isSlopePositive ? "UpRight" : "DownLeft"));
            let lowerTileLarge = TileType.GetTileTypeFromKey(this.slopeTileKey + "HalfCeiling" + (isSlopePositive ? "UpLeft" : "DownRight"));
            let lowerTileSmall = TileType.GetTileTypeFromKey(this.slopeTileKey + "HalfCeiling" + (isSlopePositive ? "UpRight" : "DownLeft"));

            for (let tileCoord of tileCoordinates) {
                let dxTest = Math.floor(Math.abs(tileCoord.tileX - initialPoint.tileX) / 2);
                let parity = Math.abs(tileCoord.tileX - initialPoint.tileX) % 2 == 0;
                let dyFromInit = tileCoord.tileY - initialPoint.tileY;
                if (Math.abs(dyFromInit) == dxTest) {
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.innerTileType);
                } else if (Math.abs(dyFromInit) > dxTest) {
                    if (isSlopePositive) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? upperTileSmall : upperTileLarge);
                    if (!isSlopePositive) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? lowerTileSmall : lowerTileLarge);
                } else if (Math.abs(dyFromInit) < dxTest) {
                    if (isSlopePositive) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? lowerTileLarge : lowerTileSmall);
                    if (!isSlopePositive) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? upperTileLarge : upperTileSmall);
                }
            }
        } else {
            // ~70 degree slope
            
            let upperTileLower = TileType.GetTileTypeFromKey(this.slopeTileKey + "DoubleSlope" + (isSlopePositive ? "UpLower" : "DownLower"));
            let upperTileUpper = TileType.GetTileTypeFromKey(this.slopeTileKey + "DoubleSlope" + (isSlopePositive ? "UpUpper" : "DownUpper"));
            let lowerTileA = TileType.GetTileTypeFromKey(this.slopeTileKey + "DoubleCeiling" + (!isSlopePositive ? "UpUpper" : "DownUpper"));
            let lowerTileB = TileType.GetTileTypeFromKey(this.slopeTileKey + "DoubleCeiling" + (!isSlopePositive ? "UpLower" : "DownLower"));

            for (let tileCoord of tileCoordinates) {
                let dyTest = Math.floor(Math.abs(tileCoord.tileY - initialPoint.tileY) / 2);
                let parity = Math.abs(tileCoord.tileY - initialPoint.tileY) % 2 == 0;
                let dxFromInit = tileCoord.tileX - initialPoint.tileX;
                if (Math.abs(dxFromInit) == dyTest) {
                    currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, this.innerTileType);
                } else if (Math.abs(dxFromInit) > dyTest) {
                    if (isSlopePositive) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? upperTileUpper : upperTileLower);
                    if (!isSlopePositive) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? upperTileUpper : upperTileLower);
                } else if (Math.abs(dxFromInit) < dyTest) {
                    if (!isSlopePositive) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? lowerTileA : lowerTileB);
                    if (isSlopePositive) currentMap.mainLayer.SetTile(tileCoord.tileX, tileCoord.tileY, parity ? lowerTileA : lowerTileB);
                }
            }
        }
    }
}

class TrackPlacer extends FillType {
    FillTiles(tileCoordinates: TileCoordinate[]): void {
        let retryList: TileCoordinate[] = [];
        for (let tileCoord of tileCoordinates) {
            // Which ways can this tile connect?
            let connectableDirections = Direction.All.filter(dir => {
                if (tileCoordinates.some(a => a.tileX == tileCoord.tileX + dir.x && a.tileY == tileCoord.tileY + dir.y)) return true;
                let trackNeighbor = currentMap.wireLayer.GetTileByIndex(tileCoord.tileX + dir.x, tileCoord.tileY + dir.y);
                if (trackNeighbor.tileType.trackDirections.length == 1) return true;
                if (trackNeighbor.tileType.trackDirections.indexOf(dir.Opposite()) > -1) return true;
                return false;
            });
            if (connectableDirections.length == 0) {
                currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.TrackHorizontal);
            } else if (connectableDirections.length == 1) {
                let targetTrackType = (Object.values(TileType.TileMap) as TileType[]).find(a => a.trackDirections.length == 1 && a.trackDirections[0] == connectableDirections[0]);
                if (targetTrackType) {
                    currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, targetTrackType);
                } else {
                    console.error("Uh oh, missing track type?");
                }
            } else if (connectableDirections.length == 2) {
                let targetTrackType = (Object.values(TileType.TileMap) as TileType[]).find(a => a.trackDirections.length == 2 && a.trackDirections.indexOf(connectableDirections[0]) > -1 && a.trackDirections.indexOf(connectableDirections[1]) > -1);
                if (targetTrackType) {
                    currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, targetTrackType);
                } else {
                    console.error("Uh oh, missing track type?");
                }
            } else if (connectableDirections.length == 4) {
                currentMap.wireLayer.SetTile(tileCoord.tileX, tileCoord.tileY, TileType.TrackBridge);
            } else {
                retryList.push(tileCoord);
            }

            for (let dir of connectableDirections) {
                // look at each neighbor and see if we can connect them
                let trackNeighbor = currentMap.wireLayer.GetTileByIndex(tileCoord.tileX + dir.x, tileCoord.tileY + dir.y);
                if (tileCoordinates.some(a => a.tileX == trackNeighbor.tileX && a.tileY == trackNeighbor.tileY)) continue;
                if (trackNeighbor.tileType.trackDirections.length == 1) {
                    let targetTrackType = (Object.values(TileType.TileMap) as TileType[]).find(a => a.trackDirections.length == 2 && 
                        a.trackDirections.indexOf(dir.Opposite()) > -1 && a.trackDirections.indexOf(trackNeighbor.tileType.trackDirections[0]) > -1);
                    if (targetTrackType) {
                        currentMap.wireLayer.SetTile(trackNeighbor.tileX, trackNeighbor.tileY, targetTrackType);
                    } else {
                        console.error("Uh oh, missing track type?");
                    }
                }
            }
        }
        if (retryList.length != tileCoordinates.length) {
            this.FillTiles(retryList);
        }
    }
}