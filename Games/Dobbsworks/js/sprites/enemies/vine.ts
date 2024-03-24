class Vinedicator extends Enemy {

    public height: number = 10;
    public width: number = 8;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    killedByProjectiles = false;
    immuneToSlideKill = true;
    canSpinBounceOn = true;

    hitTimer = 0;

    shootTimer = 0;
    baseSpeed = 1;
    colOffset = 0;

    Update(): void {
        if (player) {
            this.direction = player.x < this.x ? -1 : 1;
            let playerDistance = Math.abs(this.xMid - player.xMid);
            if (playerDistance < 12 * 8) {
                this.shootTimer++;
                if (this.shootTimer > 180) {
                    // shoot
                    let bullet = new VineProjectile(this.xMid - 3 + this.direction * 6, this.y + 4, this.layer, []);
                    bullet.colOffset = this.colOffset;
                    bullet.dx = this.direction * 0.5;
                    this.layer.sprites.push(bullet);
                    this.shootTimer = 0;
                    audioHandler.PlaySound("stuck-jump", false);
                }
            } else {
                this.shootTimer = 0;
            }

            let verticalDistance = player.y - this.y;
            let isHeadInWater = this.layer.map?.waterLayer.GetTileByPixel(this.xMid, this.y + 6 + this.floatingPointOffset).tileType.isSwimmable || false;
            let vineSpeed = (isHeadInWater ? 0.5 : 1) * this.baseSpeed;
            if (this.hitTimer > 0) {
                this.hitTimer--;
                vineSpeed *= 0.5;
                this.shootTimer = 0;
            }
            if (verticalDistance > 0.5 || this.hitTimer > 0) {
                if (this.height > 10) {
                    this.y += vineSpeed;
                    this.height -= vineSpeed;
                }
            } else if (verticalDistance < -0.5) {
                let solidHeight = this.GetHeightOfSolid(0, -1);
                if (solidHeight.yPixel < this.y - 1) {
                    this.y -= vineSpeed;
                    this.height += vineSpeed;
                }
            }
        }
        this.ApplyGravity();
        this.ApplyInertia();
    }

    OnHitByProjectile = (enemy: Enemy, projectile: Sprite) => {
        (enemy as Vinedicator).hitTimer = 60;
        projectile.isActive = false;
        audioHandler.PlaySound("plink", true);
    }

    GetFrameData(frameNum: number): FrameData[] {
        let headFrame = Math.floor(frameNum / 12) % 4;
        if (headFrame == 3) headFrame = 1;
        let row = this.shootTimer > 120 ? 1 : 0;
        let head = {
            imageTile: tiles["vine"][headFrame + this.colOffset][row],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 1
        };
        if (!this.IsOnScreen()) return [head];
        let stemBase = {
            imageTile: tiles["vine"][3 + this.colOffset][2],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 12 - this.height
        };
        let stems: FrameData[] = [];
        for (let y = 24; y <= this.height; y += 12) {
            let row = y % 24 == 0 ? 1 : 0;
            let xFlip = Math.floor(y / 24) % 2 == 0;
            stems.push({
                imageTile: tiles["vine"][3 + this.colOffset][row],
                xFlip: xFlip,
                yFlip: false,
                xOffset: 2,
                yOffset: y - this.height
            });
        }
        return [stemBase, ...stems, head];
    }
}

class GrayGrowth extends Vinedicator {
    baseSpeed = 0.5;
    colOffset = 4;
}

class VineProjectile extends Enemy {
    public height: number = 4;
    public width: number = 4;
    public respectsSolidTiles: boolean = true;
    killedByProjectiles = false;
    immuneToSlideKill = true;
    canBeBouncedOn = true;
    colOffset = 0;
    Update(): void {
        if (this.isTouchingLeftWall || this.isTouchingRightWall || this.isOnCeiling || this.standingOn.length) {
            this.ReplaceWithSpriteType(Poof);
        }
        this.ReactToVerticalWind();
    }
    OnBounce(): void {
        this.ReplaceWithSpriteType(Poof);
        this.OnDead();
    }
    GetFrameData(frameNum: number): FrameData | FrameData[] {
        let col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["vine"][col + this.colOffset][2],
            xFlip: false,
            yFlip: false,
            xOffset: 4,
            yOffset: 4
        };
    }
    
}