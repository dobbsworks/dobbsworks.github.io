class Bernie extends Enemy {

    public height: number = 11;
    public width: number = 24;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    canSpinBounceOn = true;

    isInitialized = false;
    flameTimer = 0;
    isPatrolling = true;

    Update(): void {
        if (!this.WaitForOnScreen()) {
            return; 
        }

        if (this.isPatrolling) {
            this.GroundPatrol(0.3, true);
            if (this.IsPlayerInLineOfSight()) {
                this.isPatrolling = false;
                this.dx = 0;
                this.flameTimer = -30;
            }
        } else {
            this.flameTimer++;
            if (this.flameTimer > 0) {
                let fire = new SingleFireBreath((this.direction == -1 ? this.x - 2 : this.xRight + 2) - 3, this.y + 1, this.layer, []);
                fire.dx = 1.6 * this.direction;
                fire.dy = Math.random() / 2 - 0.25;
                this.layer.sprites.push(fire);
            } 
            if (this.flameTimer > 30) {
                if (this.IsPlayerInLineOfSight()) {
                    this.flameTimer = -45;
                } else {
                    this.isPatrolling = true;
                }
            }
        }
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    }
    
    GetFrameData(frameNum: number): FrameData {

        let frameRow = Math.floor(frameNum / 10) % 3;
        if (!this.isPatrolling) frameRow = 3;

        return {
            imageTile: tiles["babyDragon"][0][frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 0,
            yOffset: 2
        };
    }
}