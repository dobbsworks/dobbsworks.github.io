class AFish extends Enemy {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeBouncedOn = true;

    lastX = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        let wasInWater = this.isInWater;
        this.ReactToWater();
        if (wasInWater && !this.isInWater) {
            this.x = this.lastX;
            this.direction *= -1;
            this.ReactToWater();
        }
        
        this.lastX = this.x;
        if (this.isInWater) {
            this.ApplyInertia();
            if (Math.abs(this.dy) > 0.035) this.dy *= 0.9;
            if (this.direction == 1 && this.isTouchingRightWall) {
                this.direction = -1;
            }
            if (this.direction == -1 && this.isTouchingLeftWall) {
                this.direction = 1;
            }
            let targetDx = this.direction * 0.3;
            if (this.direction == 1 && this.dx < 0) this.dx = 0;
            if (this.direction == -1 && this.dx > 0) this.dx = 0;
            if (this.dx != targetDx) {
                this.dx += (targetDx - this.dx) * 0.1;
            }
            this.dy += Math.cos(this.age / 30) / 1000;
        } else {
            this.ApplyGravity();
            this.ReplaceWithSpriteType(FloppingFish);
        }

        this.canBeBouncedOn = (player && !player.isInWater);
    }

    OnBounce(): void {
        this.ReplaceWithSprite(new DeadEnemy(this));
        this.OnDead();
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["fish"][col][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    }
}

class FloppingFish extends Sprite {

    public height: number = 6;
    public width: number = 12;
    respectsSolidTiles = true;
    direction: -1 | 1 = 1;

    Update(): void {
        this.ApplyGravity();
        this.ReactToPlatformsAndSolids();
        this.ReactToWater();
        this.ApplyInertia();
        this.MoveByVelocity();
        if (this.isInWater) {
            this.ReplaceWithSpriteType(AFish);
        }

        if (this.standingOn.length) {
            this.dy = -1;
            this.direction *= -1;
            this.dx = this.direction * 0.5;
        }

        if (player && this.IsGoingToOverlapSprite(player)) {
            let dead = this.ReplaceWithSprite(new DeadEnemy(this));
            dead.dy = -1;
            dead.dx = 0.5;
            this.OnDead();
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 2;
        let yFlip = Math.floor(frameNum / 10) % 2 == 0;
        return {
            imageTile: tiles["fish"][col][0],
            xFlip: false,
            yFlip: yFlip,
            xOffset: 2,
            yOffset: 6
        };
    }
}