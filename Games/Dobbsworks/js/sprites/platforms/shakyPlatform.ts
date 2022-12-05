class ShakyPlatform extends BasePlatform {

    public tilesetRow: number = 0;
    public shakeCounter: number = 0;
    public isFalling: boolean = false;

    Update(): void {
        this.dx *= 0.95;
        if (this.isFalling) {
            this.ApplyGravity();
            this.MoveByVelocity();
        } else {
            if (this.IsPlayerStandingOn() || this.shakeCounter > 0) {
                this.shakeCounter++;
            }
            if (this.shakeCounter > 0) {
                this.xRenderOffset = Math.sin(this.age / 3);
                if (this.shakeCounter >= 20) {
                    this.xRenderOffset = 0;
                    this.isFalling = true;

                    let motors = <Motor[]>this.layer.sprites.filter(a => a instanceof Motor && a.connectedSprite == this);
                    motors.forEach(a => a.connectedSprite = null);
                }
            }
        }
    }
}