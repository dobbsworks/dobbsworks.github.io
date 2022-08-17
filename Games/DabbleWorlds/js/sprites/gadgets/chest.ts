class Chest extends Sprite {

    public height: number = 9;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeHeld = false;
    isInThrowMode = false; 
    isBreaking = false;
    contents: SpriteType = Key;
    breakTimer = 0;
    maxBreakTime = 20;

    Update(): void {
        if (!this.isBreaking) {
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
            this.ReactToPlatformsAndSolids();
            this.MoveByVelocity();

            let key = <Key>this.layer.sprites.find(a => a instanceof Key && a.IsGoingToOverlapSprite(this));
            if (key) {
                key.Disappear();
                this.isBreaking = true;
            }
        }

        if (this.isBreaking) {
            if (this.breakTimer == 0) {
                let newSprite = new this.contents(this.x, this.y, this.layer, []);
                this.layer.sprites.push(newSprite);
                newSprite.GentlyEjectFromSolids();
            }

            this.breakTimer++;

            if (this.breakTimer >= this.maxBreakTime) {
                this.isActive = false;
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = 0;
        if (this.breakTimer) {
            let time = Math.min(this.maxBreakTime, this.breakTimer);
            frame = Math.ceil(5 * time / this.maxBreakTime);
        }
        return {
            imageTile: tiles["chest"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 2
        };
    }

    OnThrow(thrower: Sprite, direction: -1 | 1) {
        this.isInThrowMode = true;
        super.OnThrow(thrower, direction);
    }

    OnUpThrow(thrower: Sprite, direction: -1 | 1) {
        this.isInThrowMode = true;
        super.OnUpThrow(thrower, direction);
    }
}