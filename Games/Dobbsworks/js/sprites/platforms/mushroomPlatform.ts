class MushroomPlatform extends BasePlatform {

    public tilesetRow: number = 0;
    public shakeCounter: number = 0;
    public isFalling: boolean = false;
    protected sourceImage = "platform2";
    bouncetimer = 0;

    Update(): void {
        let riders = this.GetFullRiders();
        for (let rider of riders) {
            rider.dy = -3.8;
            if (rider instanceof Player) {
                rider.forcedJumpTimer = 28;
            }
            rider.parentSprite = null;
            this.bouncetimer = 30;
            audioHandler.PlaySound("boing", true);
        }
        if (this.bouncetimer > 0) {
            this.bouncetimer--;
            this.yRenderOffset = Math.sin( this.bouncetimer ) / (31 - this.bouncetimer) * 4;
        }
    }
}

class MushroomSpring extends Sprite {
    public height: number = 10;
    public width: number = 10;
    public respectsSolidTiles: boolean = true;
    public isPlatform: boolean = true;
    canBeHeld = true;

    bouncetimer = 0;
    yRenderOffset = 0;

    Update(): void {
        let riders = this.layer.sprites.filter(a => a.parentSprite == this);
        for (let rider of riders) {
            rider.dy = -3.3;
            if (rider instanceof Player) {
                rider.forcedJumpTimer = 28;
            }
            rider.parentSprite = null;
            this.bouncetimer = 30;
            audioHandler.PlaySound("boing", true);
        }
        if (this.bouncetimer > 0) {
            this.bouncetimer--;
            this.yRenderOffset = Math.floor(Math.sin( this.bouncetimer ) / (31 - this.bouncetimer) * 2);
        }
        this.dx *= 0.95;

        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 2 - this.yRenderOffset;
        return {
            imageTile: tiles["mushroomSpring"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 2
        };
    }

}