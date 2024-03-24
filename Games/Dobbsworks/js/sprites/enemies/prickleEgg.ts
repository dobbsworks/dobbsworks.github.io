class PrickleShell extends Enemy {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    canSpinBounceOn = true;

    jumpTimer = 0;

    Update(): void {
        if (this.isOnGround || this.parentSprite) {
            this.direction *= -1;
            this.dy = -1;
            this.parentSprite = null;
            this.jumpTimer = 0;
        }
        if (this.isOnCeiling) {
            this.jumpTimer = 9999;
        }

        this.jumpTimer++;
        if (this.jumpTimer > 24) {
            this.ApplyGravity();
        } else {
            this.ReactToVerticalWind();
        }

        // removing inertia, let em ride
        //this.ApplyInertia();
        this.ReactToWater();
    }
    
    frameCols = [0,1,2,3,2,1];
    frameRow = 0;
    GetFrameData(frameNum: number): FrameData {
        let frames = this.frameCols;
        let frame = frames[Math.floor(frameNum / 5) % frames.length];
        return {
            imageTile: tiles["prickle-egg"][frame][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}

class PrickleEgg extends PrickleShell {
    OnBounce(): void {
        if (this.frameRow === 2) {
            this.Crumble();
        }

        if (this.frameRow === 1) {
            this.frameRow = 2;
        }
    }

    Crumble(): void {
        this.isActive = false;
        let crumble = new PrickleEggCrumble(this.x, this.y, this.layer, []);
        crumble.dy = this.dy;
        this.layer.sprites.push(crumble);
        this.OnDead();
    }

    canBeBouncedOn = true;
    frameCols = [0,1,2,3];
    frameRow = 1;
}

class PrickleEggCrumble extends Sprite {
    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles: boolean = false;

    Update(): void {
        if (this.age > 20) this.isActive = false;
    }
    GetFrameData(frameNum: number): FrameData {
        let frame = Math.min(Math.floor(this.age / 5), 3);
        return {
            imageTile: tiles["prickle-egg"][frame][3],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }

}

class PrickleRock extends Enemy {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    initialized = false;
    killedByProjectiles = false;
    immuneToSlideKill = true;
    canSpinBounceOn = true;

    Update(): void {
        if (!this.initialized && player) {
            this.initialized = true;
            this.direction = player.x < this.x ? -1 : 1;
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    }
    
    GetFrameData(frameNum: number): FrameData {
        let a = this.age % 231;
        let frame = (a != 0 && a <= 4) ? 2 : 1;
        return {
            imageTile: tiles["prickle-egg"][frame][4],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}