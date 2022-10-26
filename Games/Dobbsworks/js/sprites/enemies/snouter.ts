class Snouter extends Enemy {

    public height: number = 11;
    public width: number = 15;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    ammo: SpriteType = SnouterBullet;

    squishTimer = 0;
    shootTimer = 0;
    startShootingTimer = 180;
    endShootingTimer = 210;

    animationSpeed = 0.2;
    frameCol = 0;
    turnAtLedges = true;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {
            this.shootTimer++;
            if (this.shootTimer > this.startShootingTimer) {
                if (this.shootTimer > this.endShootingTimer) {
                    this.shootTimer = 0;
                    let bullet = new this.ammo(this.x + this.direction * 10, this.y, this.layer, []);
                    bullet.dx = this.direction * 1;
                    this.layer.sprites.push(bullet);
                }
            } else {
                this.GroundPatrol(0.3, this.turnAtLedges);
            }

            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
        }
    }

    OnBounce(): void {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
        this.OnDead();
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0, 1];
        if (this.shootTimer > this.startShootingTimer) {
            frames = [2, 3];
        }
        let frame = frames[Math.floor(frameNum * this.animationSpeed) % frames.length];

        if (this.isInDeathAnimation) frame = 4;
        return {
            imageTile: tiles["snouter"][this.frameCol][frame],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 0,
            yOffset: 2
        };
    }
}