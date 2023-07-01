class RisingPlatform extends BasePlatform {

    public tilesetRow: number = 6;
    public isStarted = false;
    private isInitialized = false;
    private motor: Motor | null = null;

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            let motor = this.GetParentMotor();
            if (motor instanceof Motor) {
                this.motor = motor;
                motor.motorSpeedRatio = 0;
            }
        }

        if (this.isStarted) {
            this.dy -= 0.04;
            if (this.dy < -1) this.dy = -1;
            if (this.motor && this.motor.motorSpeedRatio < 1) {
                this.motor.motorSpeedRatio += 0.05;
                if (this.motor.motorSpeedRatio > 1) this.motor.motorSpeedRatio = 1;
            }
        }
        if (!this.isStarted && this.IsPlayerStandingOn()) {
            this.isStarted = true;
            this.dy = 1.2;
        }
        this.dx *= 0.95;
        this.MoveByVelocity();
        if (this.y < (this.layer.tiles[0][0].tileY * this.layer.tileHeight) - 12) {
            this.isActive = false;
        }
    }
}