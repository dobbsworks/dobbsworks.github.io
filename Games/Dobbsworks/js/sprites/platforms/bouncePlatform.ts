class BouncePlatform extends BasePlatform {

    public tilesetRow: number = 9;
    public originalY: number = -9999;
    canMotorHold = false;

    Update(): void {
        if (this.originalY == -9999) this.originalY = this.y;

        let isCompressing = this.IsPlayerStandingOn();

        let yDelta = this.y - this.originalY ;
        if (isCompressing && yDelta < 4) {
            this.dy = 0.5;
        }
        if (yDelta >= 4 && this.dy >= 0) {
            this.dy = 0;
        }
        if (!isCompressing) {
            this.dy = -1;
        }
        this.dx *= 0.95;
        this.MoveByVelocity();

        if (yDelta >= 4 && isCompressing) {
            this.y = this.originalY + 4;
            let player = this.layer.sprites.find(a => a instanceof Player && a.parentSprite == this && a.standingOn.length == 0);
            if (player) {
                player.dyFromPlatform = -3;
            }
        }
        if (yDelta <= 0 && !isCompressing) {
            this.y = this.originalY;
            this.dy = 0;
        }
    }
}