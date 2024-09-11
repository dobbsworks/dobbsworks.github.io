class Drakkie extends Rideable {

    public height: number = 11;
    public width: number = 18;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    canSpinBounceOn = true;
    isPlatform = true;
    zIndex = 2;

    isInitialized = false;
    flameTimer = 0;
    public direction: -1 | 1 = 1;
    targetDx = 0;
    ridingYOffset = 5;
    speed = 1.2;

    isGliding = false;
    glideTimer = 0;

    OnTryJump(p: Player): boolean {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.dy = 0;
            return true;
        }
        if (this.isOnGround || this.parentSprite) {
            this.dy -= 2.2;
            this.parentSprite = null;
        } else {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && this.glideTimer == 0) {
                this.isGliding = true;
                this.glideTimer = 1;
            }
        }

        return false;
    }

    OnRiderTakeDamage(): boolean { 
        return true; // yes, rider takes damage
    }

    Update(): void {
        if (!this.WaitForOnScreen()) {
            return; 
        }

        if (this.isGliding || this.glideTimer < 0) this.glideTimer++;

        if (this.isOnGround) this.isGliding = false;

        this.targetDx = 0;

        if (player && player.parentSprite == this) {
            player.x = Utility.Approach(player.x, this.xMid - player.width / 2, 1);

            if (this.isGliding) {
                this.targetDx = this.direction * this.speed * 1.5;
            }

            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) {
                if (this.isGliding) {
                    if (this.direction == -1) {
                        this.targetDx = -this.speed / 2;
                    }
                } else {
                    this.targetDx = this.speed;
                    this.direction = 1;
                }
            } else if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) {
                if (this.isGliding) {
                    if (this.direction == 1) {
                        this.targetDx = this.speed / 2;
                    }
                } else {
                    this.targetDx = -this.speed;
                    this.direction = -1;
                }
            } else {
                this.ApplyInertia();
            }
            
            
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true) || KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                if (this.glideTimer > 3) {
                    this.isGliding = false;
                    this.glideTimer = -2;
                }
            }
            player.direction = this.direction;
        }
        this.AccelerateHorizontally(0.05, this.targetDx);

        this.ApplyGravity();

        if (this.isGliding && this.GetTotalDy() > 0) this.dy *= 0.7;

        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData {

        let frameRow = Math.floor(frameNum / 10) % 3;
        if (this.targetDx == 0) frameRow = 3;
        if (!this.isOnGround) frameRow = 4;

        return {
            imageTile: tiles["babyDragon"][1][frameRow],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 2
        };
    }
}