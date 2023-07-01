class Spurpider extends Enemy {

    public height: number = 8;
    public width: number = 8;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    frameRow = 0;
    maxSquishTimer = 30;

    state: "rest" | "drop" | "pause" | "rise" = "rest";

    targetY = -9999;
    pauseTimer = 0;
    riseTimer = 0;
    riseDys = [-1, -1.5, -1, -1, -0.5, -0.5, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0, -0.5];
    squishTimer = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > this.maxSquishTimer) {
                this.isActive = false;
            }
        } else {

            if (this.state == "rest") {
                this.targetY = this.y;
                let isPlayerNearAndBelow = this.layer.sprites.some(p => p instanceof Player && Math.abs(this.x - p.x) < 20 && p.y > this.y - 3 && p.y < this.y + 150);
                if (isPlayerNearAndBelow) {
                    this.state = "drop";
                    this.dy += 0.05;
                }
            }

            if (this.state == "drop" && this.dy == 0) this.state = "pause";
            if (this.state == "drop") {
                this.dy += 0.05;
                if (this.dy > 1.5) this.dy = 1.5;
            }

            if (this.state == "pause") {
                this.pauseTimer++;
                if (this.pauseTimer > 30) {
                    this.state = "rise";
                    this.pauseTimer = 0;
                }
            }

            if (this.state == "rise") {
                this.riseTimer = (this.riseTimer + 1) % this.riseDys.length;
                this.dy = this.riseDys[Math.floor(this.riseTimer / 2)] / 1;

                if (this.y < this.targetY) {
                    this.state = "rest";
                    this.y = this.targetY;
                    this.dy = 0;
                }
            }

            this.ReactToWater();
            this.ReactToVerticalWind();
        }
    }

    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }

    OnBounce(): void {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.OnDead();
    }

    GetFrameData(frameNum: number): FrameData {
        let frameCol = 0;
        if (!this.isInDeathAnimation) {
            if (this.dy > 0) frameCol = 1;
            if (this.dy < 0) frameCol = 2;
            if (this.state == "rest") frameCol = 3;
        } else {
            frameCol = 4;
        }

        return {
            imageTile: tiles["spider"][frameCol][this.frameRow],
            xFlip: Math.floor((frameNum % 20) / 10) == 0,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    }
}

class ClimbingSpurpider extends Spurpider {
    respectsSolidTiles = false;
    isInitialized: boolean = false;
    webTopY: number = 0;
    webBottomY: number = 0;
    verticalDirection: 1 | -1 = 1;
    anchorX: number = 0;
    frameRow = 1;
    anchor = null;

    Initialize(): void {
        if (!this.isInitialized) {
            if (this.GetParentMotor()) return;

            this.isInitialized = true;
            this.anchorX = this.x;
            this.webTopY = this.y;
            this.webBottomY = this.yBottom;

            let startTile = this.layer.GetTileByPixel(this.xMid, this.yMid);
            for (let y = startTile.tileY; y >= 0; y--) {
                this.webTopY = (y + 1) * 12;
                let tile = this.layer.GetTileByIndex(startTile.tileX, y);
                if (tile.tileType.solidity == Solidity.Block) break;
                if (tile.tileType.solidity == Solidity.SolidForNonplayer) break;
                if (tile.tileType.solidity == Solidity.Bottom) break;
                if (tile.tileType.solidity instanceof SlopeSolidity) {
                    if (tile.tileType.solidity.verticalSolidDirection == 1) break;
                    let ratio = tile.tileType.solidity.slopeFunc(0.5);
                    this.webTopY = y * 12 + 12 * ratio;
                    break;
                }
                this.webTopY = y * 12;
            }
            for (let y = startTile.tileY; y < currentMap.mapHeight; y++) {
                this.webBottomY = y * 12;
                let tile = this.layer.GetTileByIndex(startTile.tileX, y);
                if (tile.tileType.solidity == Solidity.Block) break;
                if (tile.tileType.solidity == Solidity.SolidForNonplayer) break;
                if (tile.tileType.solidity == Solidity.Top) break;
                if (tile.tileType.solidity instanceof SlopeSolidity) {
                    if (tile.tileType.solidity.verticalSolidDirection == -1) break;
                    let ratio = tile.tileType.solidity.slopeFunc(0.5);
                    this.webBottomY = y * 12 + 12 * ratio;
                    break;
                }
                this.webBottomY = (y + 1) * 12;
            }
        }
    }

    Update(): void {
        if (this.stackedOn) return;

        this.Initialize();
        
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            this.dy = 0;
            this.dx = 0;
            if (this.squishTimer > this.maxSquishTimer) {
                this.isActive = false;
            }
        } else {
            let speed = 0.3;
            let accel = 0.05;
            let targetDy = speed * this.verticalDirection;
            this.AccelerateVertically(accel, targetDy);
    
            if (this.y > this.webBottomY - this.height) {
                this.verticalDirection = -1;
                if (this.dy > 0) this.dy = 0;
            }
            if (this.y < this.webTopY) {
                this.verticalDirection = 1;
                if (this.dy < 0) this.dy = 0;
            }

            let targetDx = (this.anchorX - this.x) / 10;
            this.AccelerateHorizontally(Math.abs(targetDx), targetDx);
            this.dx *= 0.98;
        }
    }

    OnBeforeDraw(camera: Camera): void {
        if (!this.isInitialized) return;
        camera.ctx.fillStyle = "#FFF";
        let destX = (this.anchorX + this.width/2 - camera.x) * camera.scale + camera.canvas.width / 2;
        let destXSpider = (this.xMid - camera.x) * camera.scale + camera.canvas.width / 2;
        let destY1 = (this.webTopY - camera.y) * camera.scale + camera.canvas.height / 2;
        let destY2 = (this.webBottomY - camera.y) * camera.scale + camera.canvas.height / 2;
        let destYSpider = (this.yMid - camera.y) * camera.scale + camera.canvas.height / 2;
        camera.ctx.lineWidth = camera.scale / 2;
        camera.ctx.strokeStyle = "#FFF";
        camera.ctx.beginPath();
        camera.ctx.moveTo(destX, destY1);
        camera.ctx.lineTo(destXSpider, destYSpider);
        camera.ctx.lineTo(destX, destY2);
        camera.ctx.stroke();
    }
}