class RollingSnailShell extends Enemy {

    public height: number = 8;
    public width: number = 8;
    respectsSolidTiles = true;
    rolls = true;
    canBeBouncedOn = true;
    public direction: -1 | 1 = 1;
    floatsInWater = true;
    hurtsEnemies = true;

    Update(): void {
        this.ApplyGravity();
        this.ReactToPlatformsAndSolids();
        if (this.isTouchingLeftWall) {
            this.direction = 1;
        } else if (this.isTouchingRightWall) {
            this.direction = -1;
        }

        if (this.age < 12) {
            this.dx = this.direction * 1.5 / 2;
        } else if (this.age < 22) {
            this.dx = this.direction * 1.3 / 2;
        } else if (this.age < 30) {
            this.dx = this.direction * 1.15 / 2;
        } else {
            this.dx = this.direction * 1 / 2;
        }
        this.ApplyInertia();
        this.ReactToWater();

        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        } else {
            this.rotation -= this.GetTotalDx() / 2
        }

        this.MoveByVelocity();
    }

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
        return {
            imageTile: tiles["snail"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}