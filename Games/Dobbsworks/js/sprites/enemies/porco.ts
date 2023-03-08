class PorcoRosso extends Enemy {

    public height: number = 12;
    public width: number = 13;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    squishTimer = 0;
    frameRow = 0;
    direction: -1|1 = -1;

    animationSpeed = 0.2;
    bounceSoundId: string = "oink";

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        if (this.squishTimer > 0) {
            this.squishTimer++;
            this.ApplyGravity();
            if (this.standingOn.length > 0 || (this.stackedOn && this.squishTimer > 20)) {
                this.ReplaceWithSpriteType(Piggle);
            }
        } else {
            this.PorcoMovement();
            this.ApplyInertia();
            this.dy *= 0.9;
            this.ReactToWater();
        }
        this.ReactToVerticalWind();
    }

    PorcoMovement(): void {
        this.SkyPatrol(0.3);
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }
    
    OnBounce(): void {
        this.squishTimer = 1;
        this.dy = 0.5;
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 4) % 2;
        if (this.squishTimer > 0) frame += 2;
        return {
            imageTile: tiles["aviator"][frame][this.frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 2
        };
    }
}

class PorcoBlu extends PorcoRosso {
    frameRow = 1;
    PorcoMovement(): void {
        this.SkyPatrol(1);
    }
}

class PorcoVerde extends PorcoRosso {
    frameRow = 2;
    PorcoMovement(): void {
        this.SkyPatrol(0.3);
    }
}