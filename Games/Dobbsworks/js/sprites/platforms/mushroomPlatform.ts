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