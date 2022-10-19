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
            this.layer.sprites.filter(a => a.x < this.xRight && a.xRight > this.x && a.y > this.yBottom && a.canMotorHold) :
            this.layer.sprites.filter(a => a.x < this.xRight && a.xRight > this.x && a.yBottom < this.y && a.canMotorHold);
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

        this.MoveConnectedSprite();
    }

    MoveConnectedSprite(): void {
        if (!this.connectedSprite) return;
        if (!this.connectedSprite.updatedThisFrame) {
            this.connectedSprite.SharedUpdate();
            this.connectedSprite.Update();
            if (this.connectedSprite instanceof Enemy) {
                this.connectedSprite.EnemyUpdate();
            }
            this.connectedSprite.updatedThisFrame = true;
        }

        let player = <Player>this.layer.sprites.find(a => a instanceof Player);
        if (player) {
            if (player.heldItem == this.connectedSprite && player.heldItem.canBeHeld) {
                this.connectedSprite = null;
                return;
            }
        }

        if (this.connectedSprite instanceof Enemy) {
            this.connectedSprite.direction = this.horizontalDirection;
        }

        this.connectedSprite.x = this.xMid - this.connectedSprite.width / 2;
        this.connectedSprite.y = this.y + this.connectionDistance;
        this.connectedSprite.dx = this.dx;
        this.connectedSprite.dy = this.dy;
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

    OnAfterDraw(camera: Camera): void {
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
    protected connectionDirectionY: -1|1 = -1
}