class Shrubbert extends Enemy {

    public height: number = 12;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    state: "normal" | "stunned" | "running" = "normal";
    isBurning = false;
    stunTimer = 0;
    maxStun = 32;

    stunFrameRow = 3;
    runFrameColStart = 0;
    turnAtLedges = true;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.state == "stunned") {
            this.stunTimer++;
            this.dx = 0;
            if (this.stunTimer >= this.maxStun) {
                this.state = "running";
            }
        } else {
            let speed = this.state == "normal" ? 0.3 : 0.6;
            if (this.stackedOn) speed = 0.3;
            if (this.isBurning) speed = 0.8;
            this.GroundPatrol(speed, this.turnAtLedges);
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();

        if (this.isInWater || this.isInWaterfall) {
            this.Extinguish();
        }

        this.canBeBouncedOn = !this.isBurning;
    }

    Extinguish(): void {
        if (this.isBurning) {
            this.isBurning = false;
            this.state = "stunned";
            this.stunTimer = 0;
            this.height -= 4;
            this.y += 4;
        }
    }

    OnStandInFire(): void {
        this.isBurning = true;
        if (this.height == 8) {
            this.height += 4;
            this.y -= 4;
        }
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }
    
    OnBounce(): void {
        if (this.state == "normal") {
            this.state = "stunned";
            this.height -= 4;
            this.y += 4;
        } else {
            this.isActive = false;
            let deadSprite = new DeadEnemy(this);
            this.layer.sprites.push(deadSprite);
            this.OnDead();
        }
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frameRow = 0;
        if (this.state == "stunned") frameRow = this.stunFrameRow;
        if (this.state == "running") frameRow = 1;

        let framesPerTile = this.state == "normal" ? 5 : 3;
        let frame = Math.floor(frameNum / framesPerTile) % 4 + this.runFrameColStart;

        if (this.state == "stunned") {
            frame = Math.floor(this.stunTimer / (this.maxStun / 8)) % 8;
        }

        if (this.isBurning) {
            return {
                imageTile: tiles["burningShrubbert"][frame % 4][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: 5,
                yOffset: 4
            };
        }

        return {
            imageTile: tiles["shrub"][frame][frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: this.state == "normal" ? 0 : 4
        };
    }
}

class OrangeShrubbert extends Shrubbert {
    stunFrameRow = 5;
    runFrameColStart = 4;
    turnAtLedges = false;
}