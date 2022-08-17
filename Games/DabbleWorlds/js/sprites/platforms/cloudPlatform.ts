class CloudPlatform extends BasePlatform {

    public tilesetRow: number = 7;
    public isFalling: boolean = false;

    Update(): void {
        if (this.isFalling) {
            let targetFallSpeed = 0.3;
            let fallAccel = 0.05;
            if (Math.abs(this.dy - targetFallSpeed) < fallAccel) {
                this.dy = targetFallSpeed;
            } else {
                if (this.dy > targetFallSpeed) this.dy -= Math.abs(fallAccel);
                else this.dy += Math.abs(fallAccel);
            }

            this.MoveByVelocity();
        } else {
            if (this.IsPlayerStandingOn()) {
                this.isFalling = true;
            }
        }
    }
}