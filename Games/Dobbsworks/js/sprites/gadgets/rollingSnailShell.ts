class RollingSnailShell extends Enemy {

    public height: number = 8;
    public width: number = 8;
    respectsSolidTiles = true;
    rolls = true;
    canBeBouncedOn = true;
    public direction: -1 | 1 = 1;
    wallBounceTimer = 0;
    floatsInWater = true;
    hurtsEnemies = true;


    Update(): void {
        this.ApplyGravity();
        if (this.isTouchingLeftWall) {
            this.direction = 1;
            this.ledgeGrabDistance = 1;
            this.wallBounceTimer = 0;
        } else if (this.isTouchingRightWall) {
            this.direction = -1;
            this.ledgeGrabDistance = 1;
            this.wallBounceTimer = 0;
        }
        this.wallBounceTimer++;
        if (this.wallBounceTimer > 3) {
            this.ledgeGrabDistance = 3;
        }

        let baseSpeed = 1.2; //should be equal to player run speed

        if (this.age < 12) {
            this.dx = this.direction * 1.5 * baseSpeed;
        } else if (this.age < 22) {
            this.dx = this.direction * 1.3 * baseSpeed;
        } else if (this.age < 30) {
            this.dx = this.direction * 1.15 * baseSpeed;
        } else {
            this.dx = this.direction * baseSpeed;
        }
        this.ApplyInertia();
        this.ReactToWater();

        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        } else {
            this.rotation -= this.GetTotalDx() / 2
        }
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }

    OnBounce(): void {
        this.isActive = false;
        let shell = new SnailShell(this.x, this.y, this.layer, []);
        this.layer.sprites.push(shell);
    }

    GetFrameData(frameNum: number): FrameData {
        let totalFrames = Object.keys(tiles["snail"]).length - 2;
        let rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        let frame = 9 - Math.floor(rot / (Math.PI * 2) * totalFrames) || 1;
        if (frame < 0) frame = 0;
        let row = this.framesSinceThrown < 25 ? 1 : 0;
        return {
            imageTile: tiles["snail"][frame][row],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}