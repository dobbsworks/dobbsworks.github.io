class Yufo extends Enemy {

    public height: number = 4;
    public width: number = 16;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    zIndex = 1;

    private frameRow = 0;
    private numParkedFrames = 180;
    private numTravelFrames = 240
    private numFlippingFrames = 60;
    private numFlippedFrames = 240;

    stateTimer = 60;
    state: "travel" | "park" | "flipping" | "flipped" = "travel";

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        if (this.touchedLeftWalls.length) this.direction = 1;
        if (this.touchedRightWalls.length) this.direction = -1;

        if (this.stateTimer <= 0) {
            // move to next state
            if (this.state == "travel") {
                this.state = "park";
                this.stateTimer = this.numParkedFrames;
                this.frameRow = 0;
            } else if (this.state == "park") {
                this.state = "travel";
                this.stateTimer = this.numTravelFrames;
                this.frameRow = 1;
            } else if (this.state == "flipping") {
                this.state = "flipped";
                this.stateTimer = this.numFlippedFrames;
                this.frameRow = 2;
            } else if (this.state == "flipped") {
                this.state = "travel";
                this.stateTimer = this.numTravelFrames;
                this.frameRow = 0;
            }
        } else {
            this.stateTimer--;

            // behavior in each state
            if (this.state == "travel") {
                this.dx = this.direction * 0.75;
                if (this.stateTimer < 60) {
                    this.frameRow = Math.floor(this.stateTimer / 5) % 2 == 0 ? 1: 2;
                }
            } else if (this.state == "park") {
                this.dx = 0;
                if (this.stateTimer < 60) {
                    this.frameRow = Math.floor(this.stateTimer / 5) % 2 == 0 ? 0: 2;
                }
                if (this.stateTimer == 60) {
                    // pew pew!
                    let laser = new YufoLaser(this.xMid - 1, this.yBottom, this.layer, []);
                    this.layer.sprites.push(laser);
                }
            } else if (this.state == "flipping") {
                this.dx *= 0.96;
            } else if (this.state == "flipped") {
                this.dx = 0;
                if (this.stateTimer < 60) {
                    this.frameRow = Math.floor(this.stateTimer / 5) % 2 == 0 ? 1: 2;
                }
            }

        }
    }
    
    OnBounce(): void {
        if (this.state == "flipped" && player) {
            player.forcedJumpTimer = 28;
            player.dy = -3.8;
            player.jumpTimer = -1;
            player.coyoteTimer = 0;
            this.stateTimer = this.numFlippedFrames;
        } else if (this.state == "flipping") {
            // keep on keeping on
        } else {
            this.state = "flipping";
            this.stateTimer = this.numFlippingFrames;
        }
    }
    
    GetFrameData(frameNum: number): FrameData {
        let col = 0;
        if (this.state == "flipping") {
            col = 6 - Math.floor(this.stateTimer / this.numFlippingFrames * 6);
        }
        if (this.state == "flipped") {
            col = 6;
            if (this.stateTimer < 60) {
                col = Math.floor(this.stateTimer / 10);
            }
        }
        return {
            imageTile: tiles["ufo"][col][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 6
        };
    }
}

class YufoLaser extends Enemy {
    public height: number = 8;
    public width: number = 2;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    killedByProjectiles = false;

    Update(): void {
        this.dy = 2;
        if (this.standingOn.length > 0 || this.parentSprite) {
            this.isActive = false;
        }

        let umbrellas = this.layer.sprites.filter(a => a instanceof Umbrella);
        for (let umbrella of umbrellas) {
            if (this.Overlaps(umbrella)) {
                this.isActive = false;
                return;
            }
        }
    }

    GetFrameData(frameNum: number): FrameData | FrameData[] {
        let row = Math.floor(frameNum / 3) % 3;
        return {
            imageTile: tiles["ufo"][7][row],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 7,
            yOffset: 0
        };
    }
}