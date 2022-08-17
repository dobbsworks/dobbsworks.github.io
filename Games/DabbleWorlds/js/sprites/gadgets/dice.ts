class Dice extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    //rolls = true;
    canBeHeld = true;
    displayedValue = 1; // [1,6]
    spin = 0; // [0,5]
    spinSpeed = 0; 

    get value(): number {
        if (this.spinSpeed) return 0;
        return this.displayedValue;
    }


    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

        if (this.spinSpeed) {
            this.spin += this.spinSpeed;
            if (this.spin >= 6) {
                this.spin %= 6;
                this.displayedValue += 1;
                if (this.displayedValue >= 7) this.displayedValue -= 6;
            }
            if (this.isOnGround) {
                this.spinSpeed -= 0.1;
                if (this.spinSpeed <= 0) {
                    this.spinSpeed = 0;
                    if (Math.floor(this.spin)) {
                        this.spinSpeed = 0.1;
                    }
                }
            }
        } else {
            this.canBeHeld = true;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["dice"][Math.floor(this.spin)][this.displayedValue - 1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

    OnThrow(thrower: Sprite, direction: -1 | 1) {
        this.spinSpeed = 1;
        this.displayedValue = 1 + this.age % 6;
        this.spin = Math.floor(this.age / 7) % 6;
        this.canBeHeld = false;
        super.OnThrow(thrower, direction);
    }
}