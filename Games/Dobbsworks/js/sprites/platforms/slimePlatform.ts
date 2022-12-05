class Splatform extends BasePlatform {

    public tilesetRow: number = 1;
    protected sourceImage = "platform2";

    public isStarted = false;
    private isInitialized = false;
    private motor: Motor | null = null;
    private targetY!: number;

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            let motor = <Motor>this.layer.sprites.find(a => a instanceof Motor && a.connectedSprite == this);
            if (motor) {
                this.motor = motor;
                motor.motorSpeedRatio = 0;
            }
            this.targetY = this.y;
        }

        if (!this.motor) {
            this.dy = 0;
            let remainingDistance = this.targetY - this.y;
            if (remainingDistance < 0.2) {
                this.dy = remainingDistance;
            } else {
                this.dy = remainingDistance / 10;
            }
        }

        if (this.motor && player && player.parentSprite == this) {
            // player on this platform
            let remainingSpeed = this.motor.motorSpeedRatio;
            if (remainingSpeed < 0.02) {
                this.motor.motorSpeedRatio = 0;
            } else {
                this.motor.motorSpeedRatio = remainingSpeed * 0.98;
            }
        }

        this.MoveByVelocity();
    }

    PlayerAttemptJump(): void {
        if (this.motor) {
            if (player && player.parentSprite == this) {
                // player on this platform
                this.motor.motorSpeedRatio = 1;
            }
        } else {
            if (this.targetY == this.y) {
                this.targetY += 12;
            }
        }
    }
}