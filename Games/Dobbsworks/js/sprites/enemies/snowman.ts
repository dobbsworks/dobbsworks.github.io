class SnowtemPole extends Enemy {

    numLowerParts: number = 5;
    public height: number = this.numLowerParts * 6 + 9;
    public width: number = 9;
    respectsSolidTiles = true;
    canBeBouncedOn = true;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.height = this.numLowerParts * 6 + 9;
        this.GroundPatrol(0.3, true);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    }
    
    OnBounce(): void {
        if (this.numLowerParts > 0) {
            this.numLowerParts--;
            this.height -= 6;
            this.y += 6;
        } else {
            this.isActive = false;
        }

        let deadBody = new SnowmanWormBody(this.x, this.yBottom - 6, this.layer, []);
        let spr = new DeadEnemy(deadBody);
        this.layer.sprites.push(spr);
    }

    GetFrameData(frameNum: number): FrameData[] {
        let frames = [{
            imageTile: tiles["snowman"][1][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: (this.direction == 1 ? 3 : 0) + Math.sin(this.age/10 -1/2),
            yOffset: 0
        }];

        for (let i = 0; i < this.numLowerParts; i++) {
            frames.unshift({
                imageTile: tiles["snowman"][0][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: (this.direction == 1 ? 3 : 0) + Math.sin(this.age/10 + i/2),
                yOffset: -(i+1) * 6
            })
        }

        return frames;
    }
}