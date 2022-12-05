class Piggle extends Enemy {

    public height: number = 11;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    squishTimer = 0;
    imageSource = "pig";

    animationSpeed = 0.2;
    frameRow = (SeasonalService.GetEvent() == SeasonalEvent.Halloween) ? 2 : 0;
    turnAtLedges = true;
    bounceSoundId: string = "oink";

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            this.dx = 0;
            this.dy = 0;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {
            this.GroundPatrol(0.3, this.turnAtLedges);
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
        }
    }

    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }

    OnBounce(): void {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
        this.OnDead();
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0, 1, 2, 1, 0, 3, 4, 4, 3];
        let frame = frames[Math.floor(frameNum * this.animationSpeed) % frames.length];
        if (this.isInDeathAnimation) frame = 5;
        return {
            imageTile: tiles[this.imageSource][frame][this.frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 3
        };
    }
}

class PogoPiggle extends Enemy {

    public height: number = 15;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    squishTimer = 0;
    pogoTimer = 0;
    bounceSoundId: string = "oink";
    hasHelmet = true;
    iFrames = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {
            if (this.isOnGround) {
                this.pogoTimer++;
                this.dx *= 0.9;
                if (this.pogoTimer > 10) {
                    this.pogoTimer = 0;
                    this.dy = -2.5;
                    this.parentSprite = null;
                }
            }

            if (this.iFrames > 0) {
                this.iFrames--;
                if (this.iFrames == 0) this.damagesPlayer = true;
            }

            this.SkyPatrol(0.3);
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
        }
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }

    OnBounce(): void {
        if (this.iFrames > 0) {
            return;
        }
        if (this.hasHelmet) {
            this.hasHelmet = false;
            if (this.dy < 0) this.dy = 0;
            let helmet = new PogoHelmet(this.x, this.y, this.layer, []);
            helmet.dy = -1;
            this.layer.sprites.push(helmet);
            this.iFrames = 10;
            this.damagesPlayer = false;
        } else {
            this.canBeBouncedOn = false;
            this.isInDeathAnimation = true;
            this.dx = 0;
            this.dy = 0;
            this.OnDead();
        }
    }

    GetFrameData(frameNum: number): FrameData {
        if (this.isInDeathAnimation) {
            return {
                imageTile: tiles["pig"][5][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: 3,
                yOffset: 1
            };
        }
        let frame = this.pogoTimer > 0 ? 1 : 0;
        if (!this.hasHelmet) frame += 2;
        return {
            imageTile: tiles["pogo"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 1
        };
    }
}

class PogoHelmet extends Sprite {
    public height: number = 15;
    public width: number = 10;
    public respectsSolidTiles: boolean = false;
    public direction: -1 | 1 = 1;
    Update(): void {
        if (this.age > 30) this.isActive = false;
        this.ApplyGravity();
        this.MoveByVelocity();
    }
    GetFrameData(frameNum: number): FrameData {
        if (Math.floor(frameNum / 4) % 2 == 0) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["pogo"][4][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 1
        };
    }
    
}

class Hoggle extends Piggle {
    animationSpeed = 0.3;
    frameRow = 1;
    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {
            if (player && this.WaitForOnScreen()) {
                this.direction = (player.xMid < this.xMid ? -1 : 1);
                if (this.touchedLeftWalls.length > 0 && this.direction == -1) {
                    this.dx = 0.8;
                    this.dy = -0.7;
                }
                if (this.touchedRightWalls.length > 0 && this.direction == 1) {
                    this.dx = -0.8;
                    this.dy = -0.7;
                }
                this.AccelerateHorizontally(0.015, this.direction * 1);
            }

            this.ApplyGravity();
            this.ReactToWater();
        }
    }
}