class EditorSprite {
    constructor(
        public spriteType: SpriteType,
        public tileCoord: TileCoordinate,
    ) {
        if (currentMap) {
            this.ResetSprite();
            this.frameData = this.spriteInstance.GetFrameData(0);
            this.SetSize();
        }
    }
    frameData!: FrameData | FrameData[];
    spriteInstance!: Sprite;
    width: number = 1;
    height: number = 1;
    isHeld: boolean = false;
    wiggle: number = 0; // used for animation when a sprite is dropped onto the editor
    editorProps: number[] = [];

    GetTopRightCoord(): TileCoordinate {
        return { tileX: this.tileCoord.tileX + this.width - 1, tileY: this.tileCoord.tileY };
    }

    SetPosition(newTileCoord: TileCoordinate) {
        this.tileCoord = newTileCoord;
        let tileWidth = this.spriteInstance.layer.tileWidth;
        let tileHeight = this.spriteInstance.layer.tileHeight;
        let anchor = this.spriteInstance.anchor;
        let midX = newTileCoord.tileX * tileWidth + (this.width * tileWidth - this.spriteInstance.width) / 2;
        let midY = newTileCoord.tileY * tileHeight + (this.height * tileHeight - this.spriteInstance.height) / 2;
        if (anchor == Direction.Up) {
            this.spriteInstance.x = midX;
            this.spriteInstance.y = newTileCoord.tileY * tileHeight;
        } else if (anchor == Direction.Down) {
            this.spriteInstance.x = midX;
            this.spriteInstance.y = (newTileCoord.tileY + this.height) * tileHeight - this.spriteInstance.height;
        } else if (anchor == Direction.Left) {
            this.spriteInstance.x = newTileCoord.tileX * tileWidth;
            this.spriteInstance.y = midY;
        } else if (anchor == Direction.Right) {
            this.spriteInstance.x = (newTileCoord.tileX + this.width) * tileWidth - this.spriteInstance.width;
            this.spriteInstance.y = midY;
        } else {
            this.spriteInstance.x = midX;
            this.spriteInstance.y = midY;
        }
    }
    
    SetSize(): void {
        this.width = Math.max(1, Math.ceil((this.spriteInstance.width - 5) / currentMap.mainLayer.tileWidth));
        this.height = Math.max(1, Math.ceil((this.spriteInstance.height - 5) / currentMap.mainLayer.tileHeight));
    }

    ResetSprite(): void {
        let tileWidth = currentMap.mainLayer.tileWidth;
        let tileHeight = currentMap.mainLayer.tileHeight;
        this.spriteInstance = new this.spriteType(this.tileCoord.tileX * tileWidth, this.tileCoord.tileY * tileHeight, currentMap.mainLayer, this.editorProps);
        this.SetPosition(this.tileCoord);
        this.frameData = this.spriteInstance.GetFrameData(0);
    }

    ResetStack(): void {
        if (this.spriteInstance instanceof Enemy) {
            let belowCoords: TileCoordinate[] = [];
            for (let xOff = 0; xOff < this.width; xOff++) {
                belowCoords.push({tileX: this.tileCoord.tileX + xOff, tileY: this.tileCoord.tileY + this.height});
            }
            for (let belowCoord of belowCoords) {
                let spriteBelow = editorHandler.sprites.find(a => a.ContainsTile(belowCoord));
                if (spriteBelow && spriteBelow.spriteInstance && spriteBelow.spriteInstance instanceof Enemy) {
                    this.spriteInstance.stackedOn = spriteBelow.spriteInstance;
                    break;
                }
            }
            this.SetSize();
        }
    }

    ContainsTile(tileCoord: TileCoordinate) {
        let xOffset = tileCoord.tileX - this.tileCoord.tileX;
        let yOffset = tileCoord.tileY - this.tileCoord.tileY;
        return (xOffset >= 0 && xOffset < this.width && yOffset >= 0 && yOffset < this.height);
    }

    OverlapsSprite(sprite: EditorSprite): boolean {
        return sprite != this
            && this.tileCoord.tileX < sprite.tileCoord.tileX + sprite.width
            && this.tileCoord.tileX + this.width > sprite.tileCoord.tileX
            && this.tileCoord.tileY < sprite.tileCoord.tileY + sprite.height
            && this.tileCoord.tileY + this.height > sprite.tileCoord.tileY;
    }

    Update(): void {
        if (this.wiggle > 0) this.wiggle -= 0.05;
        if (this.wiggle < 0) this.wiggle = 0;
    }

    Wiggle(timing: number): void {
        this.wiggle = 0.3 + timing * 0.1;
    }

    StackWiggle(direction: 0 | -1 | 1, timing: number): void {
        this.Wiggle(timing);
        //this.ResetSprite();
        if (this.spriteInstance instanceof Enemy) {
            if (direction == 1 || direction == 0) {
                let spriteBelow = editorHandler.sprites.find(a => a.tileCoord.tileX == this.tileCoord.tileX && a.tileCoord.tileY == this.tileCoord.tileY + this.height);
                if (spriteBelow && spriteBelow.spriteInstance && spriteBelow.spriteInstance instanceof Enemy) spriteBelow.StackWiggle(1, timing + 1);
            }
            if (direction == -1 || direction == 0) {
                let spriteAbove = editorHandler.sprites.find(a => a.tileCoord.tileX == this.tileCoord.tileX && a.tileCoord.tileY + a.height == this.tileCoord.tileY);
                if (spriteAbove && spriteAbove.spriteInstance && spriteAbove.spriteInstance instanceof Enemy) spriteAbove.StackWiggle(-1, timing + 1);
            }
        }
    }

    Draw(frameNum: number): void {
        let frameData = this.frameData;
        let totalWiggle = this.wiggle > 0.3 ? 0 : this.wiggle;
        if (this.isHeld) {
            totalWiggle += (Math.sin(frameNum / 15) + 1) / 15;
        }
        if ('xFlip' in frameData) {
            let imgTile = frameData.imageTile;
            imgTile.Draw(camera.ctx,
                (this.spriteInstance.x - camera.x - frameData.xOffset + this.spriteInstance.width / 2 * totalWiggle) * camera.scale + camera.canvas.width / 2,
                (this.spriteInstance.y - camera.y - frameData.yOffset - this.spriteInstance.height / 2 * totalWiggle) * camera.scale + camera.canvas.height / 2,
                camera.scale, frameData.xFlip, frameData.yFlip, 1 + totalWiggle);
        } else {
            for (let fd of <FrameData[]>frameData) {
                let imgTile = fd.imageTile;
                imgTile.Draw(camera.ctx,
                    (this.spriteInstance.x - camera.x - fd.xOffset + imgTile.width / 2 * totalWiggle) * camera.scale + camera.canvas.width / 2,
                    (this.spriteInstance.y - camera.y - fd.yOffset - imgTile.height / 2 * totalWiggle) * camera.scale + camera.canvas.height / 2,
                    camera.scale, fd.xFlip, fd.yFlip, 1 + totalWiggle);
            }
        }

        // camera.ctx.strokeStyle = "#F008";
        // camera.ctx.strokeRect(
        //     (this.tileCoord.tileX * 12 - camera.x) * camera.scale + camera.canvas.width / 2,
        //     (this.tileCoord.tileY * 12 - camera.y) * camera.scale + camera.canvas.height / 2,
        //     12 * camera.scale, 12 * camera.scale);
    }

    Copy(): EditorSprite {
        return new EditorSprite(this.spriteType, { ...this.tileCoord });
    }
}



// todo: list of overwrite values (snowman length), gift contents