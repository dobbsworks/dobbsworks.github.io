class WeightedPlatform extends BasePlatform {

    public tilesetRow: number = 1;
    public weightThreshold: number = -1;
    public originalY: number = -9999;
    public speed: number = 0.2;

    private isInitialized = false;
    private motor: Motor | null = null;

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            let motor = <Motor>this.layer.sprites.find(a => a instanceof Motor && a.connectedSprite == this);
            if (motor) {
                this.motor = motor;
                motor.motorSpeedRatio = 0;
            }
            this.weightThreshold = Math.max(1, Math.floor(this.width / 24));
        }

        if (this.motor == null) {
            this.MoveByVelocity();
            if (this.originalY == -9999) this.originalY = this.y;
            let numberOfFullRiders = this.GetFullRiderCount();
            let partialRiderCount = this.GetOneFootRiderCount();
            let hasPartialRider = partialRiderCount > 0;

            if (numberOfFullRiders >= this.weightThreshold) {
                this.tilesetRow = 4;
                this.dy = this.speed;
            } else {
                if (this.y == this.originalY) {
                    this.tilesetRow = 1;
                    this.dy = 0;
                    if (numberOfFullRiders > 0 || hasPartialRider) {
                        this.tilesetRow = 3;
                    }
                } else {
                    this.tilesetRow = 2;
                    this.dy = -this.speed;
                    if (numberOfFullRiders + partialRiderCount >= this.weightThreshold) {
                        this.tilesetRow = 3;
                        this.dy = 0;
                    }
                }
            }

            if (this.y < this.originalY) {
                this.y = this.originalY;
            }
        } else {
            let targetSpeed = 0;
            let numberOfFullRiders = this.GetFullRiderCount();
            if (numberOfFullRiders > 0 && this.tilesetRow == 1) {
                // initial touch
                this.tilesetRow = 2;
                targetSpeed = 1;
            }
            if (this.tilesetRow != 1) {
                if (numberOfFullRiders < this.weightThreshold) {
                    this.tilesetRow = 2;
                    targetSpeed = 1;
                }
                if (numberOfFullRiders == this.weightThreshold) {
                    this.tilesetRow = 3;
                    targetSpeed = 0;
                }
                if (numberOfFullRiders > this.weightThreshold) {
                    this.tilesetRow = 4;
                    targetSpeed = -0.5;
                }

                // approach motor speed
                if (this.motor.motorSpeedRatio < targetSpeed) {
                    this.motor.motorSpeedRatio += 0.02;
                }
                if (this.motor.motorSpeedRatio > targetSpeed) {
                    this.motor.motorSpeedRatio -= 0.02;
                }
                if (this.motor.motorSpeedRatio > 1) this.motor.motorSpeedRatio = 1;
                if (this.motor.motorSpeedRatio < -0.5) this.motor.motorSpeedRatio = -0.5;
                if (targetSpeed == 0 && Math.abs(this.motor.motorSpeedRatio) < 0.02) this.motor.motorSpeedRatio = 0;

            }
        }
    }
}