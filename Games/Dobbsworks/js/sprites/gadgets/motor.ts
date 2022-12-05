class Motor extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;

    protected isInitialized = false;
    public connectedSprite: Sprite | null = null;
    protected connectionDistance: number = 0;
    private isOnTrack = false;

    protected motorSpeed = 0.5;
    protected wireColor = "#222";
    protected wireDrawBottomSpace: number = 11;
    protected connectionDirectionY: -1 | 1 = 1;
    public motorSpeedRatio = 1; // for connected sprite to slow down motor in some situations
    private trackTile: LevelTile | null = null;
    protected horizontalDirection: -1 | 1 = 1;
    private verticalDirection: -1 | 1 = -1;

    private frame: number = 0;
    protected frameX: number = 0;
    protected frameY: number = 0;

    Initialize(): void {
        let currentTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor();
        if (currentTile?.tileType.isTrack) this.isOnTrack = true;
        // find closest non-player sprite below motor
        let possibleConnectionSprites = this.connectionDirectionY == 1 ?
            this.layer.sprites.filter(a => a.x < this.xRight && a.xRight > this.x && a.y >= this.yBottom && a.canMotorHold) :
            this.layer.sprites.filter(a => a.x < this.xRight && a.xRight > this.x && a.yBottom <= this.y && a.canMotorHold);
        if (possibleConnectionSprites.length == 0) {
            return;
        }
        if (this.connectionDirectionY == 1) possibleConnectionSprites.sort((a, b) => a.y - b.y);
        if (this.connectionDirectionY == -1) possibleConnectionSprites.sort((a, b) => -a.y + b.y);
        this.connectedSprite = possibleConnectionSprites[0];
        this.connectionDistance = this.connectedSprite.y - this.y;
    }

    GetTileRatio(num: number): number {
        return (num % 12) / 12;
    }

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }

        let oldTrack = this.trackTile;
        this.trackTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor() || null;
        if (this.isOnTrack && this.trackTile?.tileType.isTrack) {
            if (oldTrack?.tileType != this.trackTile.tileType && oldTrack != null) {
                if (oldTrack.tileType == TileType.TrackVertical || oldTrack.tileType == TileType.TrackTopCap || oldTrack.tileType == TileType.TrackBottomCap) {
                    if (this.trackTile.tileType.trackCurveHorizontalDirection != 0) {
                        this.horizontalDirection = this.trackTile.tileType.trackCurveHorizontalDirection || 1;
                        this.verticalDirection = this.trackTile.tileType.trackCurveVerticalDirection == 1 ? -1 : 1;
                    }
                }
                if (oldTrack.tileType == TileType.TrackHorizontal || oldTrack.tileType == TileType.TrackLeftCap || oldTrack.tileType == TileType.TrackRightCap) {
                    if (this.trackTile.tileType.trackCurveHorizontalDirection != 0) {
                        this.verticalDirection = this.trackTile.tileType.trackCurveVerticalDirection || 1;
                        this.horizontalDirection = this.trackTile.tileType.trackCurveHorizontalDirection == 1 ? -1 : 1;
                    }
                }
                if (this.trackTile.tileType == TileType.TrackVertical || this.trackTile.tileType == TileType.TrackTopCap || this.trackTile.tileType == TileType.TrackBottomCap) {
                    this.verticalDirection = oldTrack.tileType.trackCurveVerticalDirection || this.verticalDirection;
                }
                if (this.trackTile.tileType == TileType.TrackHorizontal || this.trackTile.tileType == TileType.TrackLeftCap || this.trackTile.tileType == TileType.TrackRightCap) {
                    this.horizontalDirection = oldTrack.tileType.trackCurveHorizontalDirection || this.horizontalDirection;
                }
            }
            if (this.trackTile.tileType == TileType.TrackLeftCap && this.GetTileRatio(this.xMid) <= 0.5) {
                this.horizontalDirection = 1;
            }
            if (this.trackTile.tileType == TileType.TrackRightCap && this.GetTileRatio(this.xMid) >= 0.5) {
                this.horizontalDirection = -1;
            }
            if (this.trackTile.tileType == TileType.TrackBottomCap && this.GetTileRatio(this.yMid) >= 0.5) {
                this.verticalDirection = -1;
            }
            if (this.trackTile.tileType == TileType.TrackTopCap && this.GetTileRatio(this.yMid) <= 0.5) {
                this.verticalDirection = 1;
            }

            let targetSpeed = this.trackTile.tileType.trackDirectionEquation(this.GetTileRatio(this.xMid), this.GetTileRatio(this.yMid));

            let speedRatio = 1;
            if (this.trackTile.tileType.isTrackCap) {
                let distanceFromCenter = Math.abs(this.GetTileRatio(this.xMid) - 0.5) + Math.abs(this.GetTileRatio(this.yMid) - 0.5);
                distanceFromCenter = Math.max(0, Math.min(0.5, distanceFromCenter)) * 2; // distance is [0, 1]
                let distanceToCircleMap = Math.sqrt(-((distanceFromCenter - 1) ** 2) + 1.1);
                speedRatio = distanceToCircleMap;
            }
            speedRatio *= this.motorSpeed * this.motorSpeedRatio;
            let horizDir = this.horizontalDirection * (speedRatio >= 0 ? 1 : -1);
            let vertDir = this.verticalDirection * (speedRatio >= 0 ? 1 : -1);
            this.frame += speedRatio;

            let targetPoint = this.trackTile.tileType.trackEquation(
                this.GetTileRatio(this.xMid) + this.GetTileRatio(Math.abs(targetSpeed.dx * speedRatio) * horizDir),
                this.GetTileRatio(this.yMid) + this.GetTileRatio(Math.abs(targetSpeed.dy * speedRatio) * vertDir));
            this.dx = (this.xMid - this.xMid % 12) + targetPoint.x * 12 - this.xMid;
            this.dy = (this.yMid - this.yMid % 12) + targetPoint.y * 12 - this.yMid;
            this.MoveByVelocity();
        } else {
            this.isOnTrack = false;
            this.ApplyGravity();
            let oldX = this.x;
            let oldY = this.y;
            this.MoveByVelocity();

            if (this.trackTile?.tileType.isTrack) {
                let previousTile = this.layer.GetTileByPixel(oldX + this.width / 2, oldY + this.height / 2).GetWireNeighbor();
                if (this.trackTile == previousTile) {
                    // check if we "crossed" the track
                    let crossedTrack = this.trackTile.tileType.trackCrossedEquation(this.GetTileRatio(oldX), this.GetTileRatio(oldY), this.GetTileRatio(this.x), this.GetTileRatio(this.y));
                    if (crossedTrack) this.isOnTrack = true;
                }
            }
        }
        if (!this.trackTile) this.isOnTrack = false;

        if (this.connectedSprite) {
            this.UpdateConnectedSprite(this.connectedSprite);
            this.MoveConnectedSprite(this.connectedSprite);
            let playerGrabbed = this.HandlePlayerGrab(this.connectedSprite);
            if (playerGrabbed) {
                this.connectedSprite = null;
            } else {
                this.MoveConnectedSprite(this.connectedSprite);
            }
        }
    }

    UpdateConnectedSprite(sprite: Sprite): void {
        if (!sprite) return;
        if (!sprite.updatedThisFrame) {
            sprite.SharedUpdate();
            sprite.Update();
            if (sprite instanceof Enemy) {
                sprite.EnemyUpdate();
            }
            sprite.updatedThisFrame = true;
        }
    }

    HandlePlayerGrab(sprite: Sprite): boolean {
        let player = <Player>this.layer.sprites.find(a => a instanceof Player);
        if (player) {
            if (player.heldItem == sprite && player.heldItem.canBeHeld) {
                return true;
            }
        }
        return false;
    }

    MoveConnectedSprite(sprite: Sprite): void {
        if (sprite instanceof Enemy) {
            sprite.direction = this.horizontalDirection;
        }

        sprite.x = this.xMid - sprite.width / 2;
        sprite.y = this.y + this.connectionDistance;
        sprite.dx = this.dx;
        sprite.dy = this.dy;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(Math.abs(this.frame) / 4) % 2;
        return {
            imageTile: tiles["motorTrack"][col + this.frameX][this.frameY],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

    OnBeforeDraw(camera: Camera): void {
        if (this.connectionDistance == 0 || this.connectedSprite == null) return;
        let x = (this.xMid - camera.x) * camera.scale + camera.canvas.width / 2;
        let yGameStart = (this.connectionDirectionY == 1) ? (this.y + this.wireDrawBottomSpace) : this.y + 2;
        let y = (yGameStart - camera.y) * camera.scale + camera.canvas.height / 2;
        let yGameEnd = (this.connectionDirectionY == 1) ? this.connectedSprite.y : this.connectedSprite.yBottom;
        let drawHeight = (yGameEnd - yGameStart) * camera.scale;

        camera.ctx.fillStyle = this.wireColor;
        camera.ctx.fillRect(x - 0.5 * camera.scale, y, 1 * camera.scale, drawHeight);
    }

}

class SlowMotor extends Motor {
    protected motorSpeed: number = 0.25;
    protected frameX: number = 0;
    protected frameY: number = 3;
}

class FastMotor extends Motor {
    protected motorSpeed: number = 1;
    protected frameX: number = 2;
    protected frameY: number = 3;
}

class UpwardMotor extends Motor {
    protected motorSpeed: number = 0.5;
    protected frameX: number = 0;
    protected frameY: number = 4;
    protected connectionDirectionY: -1 | 1 = -1
}

class FerrisMotorRight extends Motor {
    public connectedSprites: (Sprite | null)[] = [];
    public angle = 0;
    private spinSpeed!: number; // rads per frame
    protected direction: number = 1;

    Initialize(): void {
        super.Initialize();

        if (this.connectedSprite) {
            if (!(this.connectedSprite instanceof Checkpoint)) {
                this.connectionDistance = this.connectedSprite.yMid - this.yMid;
                this.connectedSprites.push(this.connectedSprite);

                let spriteFromEditor = editorHandler.sprites.find(a => a.spriteInstance == this.connectedSprite);
                if (spriteFromEditor) {
                    for (let i = 1; i < 4; i++) {
                        let spriteType = <SpriteType>this.connectedSprite.constructor;
                        let instance = new spriteType(
                            spriteFromEditor.tileCoord.tileX * this.layer.tileWidth,
                            spriteFromEditor.tileCoord.tileY * this.layer.tileHeight,
                            currentMap.mainLayer, spriteFromEditor.editorProps);
                        this.connectedSprites.push(instance);
                        this.layer.sprites.push(instance);
                    }
                }
            }
            this.spinSpeed = 0.02 / this.connectionDistance * 24 * this.direction;
        }
    }

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }

        this.angle += this.spinSpeed;

        for (let sprite of this.connectedSprites) {
            if (!sprite) continue;
            this.UpdateConnectedSprite(sprite);
            this.MoveConnectedSprite(sprite);
            let spriteIndex = this.connectedSprites.indexOf(sprite);
            let playerGrabbed = this.HandlePlayerGrab(sprite);
            if (playerGrabbed) {
                this.connectedSprites[spriteIndex] = null;
            } else {
                this.MoveConnectedSpriteToAngle(sprite, this.angle + (Math.PI / 2 * spriteIndex));
            }
        }
    }

    MoveConnectedSpriteToAngle(sprite: Sprite, angle: number): void {
        let x = Math.cos(angle) * this.connectionDistance;
        let y = Math.sin(angle) * this.connectionDistance;
        let speed = this.connectionDistance * this.spinSpeed;
        let dx = Math.cos(angle + Math.PI / 2) * speed;
        let dy = Math.sin(angle + Math.PI / 2) * speed;

        if (sprite instanceof Enemy) {
            sprite.direction = dx > 0 ? 1 : -1;
        }

        sprite.x = this.xMid - sprite.width / 2 + x;
        sprite.y = this.yMid - sprite.height / 2 + y;
        sprite.dx = this.dx + dx;
        sprite.dy = this.dy + dy;
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["motorTrack"][2][4],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

    OnBeforeDraw(camera: Camera): void {
        if (this.connectionDistance == 0 || this.connectedSprites.length == 0) return;

        camera.ctx.fillStyle = "#724200";
        for (let i = 0; i < 4; i++) {
            let angle = this.angle + i * Math.PI / 2;
            //let sprite = this.connectedSprites[i];

            for (let r = 6; r < this.connectionDistance; r += 6) {
                let gameX = r * Math.cos(angle) + this.xMid - 1;
                let gameY = r * Math.sin(angle) + this.yMid - 1;

                let destX = (gameX - camera.x) * camera.scale + camera.canvas.width / 2;
                let destY = (gameY - camera.y) * camera.scale + camera.canvas.height / 2;

                camera.ctx.fillRect(destX, destY, 2 * camera.scale, 2 * camera.scale)
            }
        }
    }
}

class FerrisMotorLeft extends FerrisMotorRight {
    protected direction: number = -1;
}

class FastFerrisMotorLeft extends FerrisMotorRight {
    protected direction: number = -2;
}

class FastFerrisMotorRight extends FerrisMotorRight {
    protected direction: number = 2;
}