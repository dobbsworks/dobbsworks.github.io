abstract class Rideable extends Sprite {
    OnTryJump(p: Player): boolean {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            return true;
        }
        if (this.isOnGround || this.parentSprite) {
            this.dy -= 2.2;
        }
        return false;
    }

    OnRiderTakeDamage(): boolean { 
        return true; // yes, rider takes damage
    }
}

class Minecart extends Rideable {
    public height: number = 10;
    public width: number = 17;
    respectsSolidTiles = true;
    rolls = true;
    canBeHeld = false;
    floatsInWater = false;
    isPlatform = true;
    zIndex = 2;
    ridingYOffset = 5;

    hurtsEnemies = false;


    Update(): void {
        if (player && player.parentSprite == this) {
            player.x = Utility.Approach(player.x, this.xMid - player.width / 2, 1);

            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) this.AccelerateHorizontally(0.02, 1.5);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) this.AccelerateHorizontally(0.02, -1.5);
        }

        
        this.ridingYOffset = 5;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) this.ridingYOffset = 7;

        this.ApplyGravity();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["minecart"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    }
}

class Teacup extends Rideable {
    public height: number = 10;
    public width: number = 17;
    respectsSolidTiles = true;
    rolls = false;
    canBeHeld = true;
    isPlatform = true;
    zIndex = 2;
    ridingYOffset = 5;
    floatsInWater = true;
    floatsInLava = true;
    groundTime = 0;


    OnRiderTakeDamage(): boolean { 
        if (player && player.parentSprite == this) {
            player.parentSprite = null;
            this.ReplaceWithSpriteType(BrokenTeacup);
            // TODO shatter sound
        }
        return false; 
    }

    OnTryJump(p: Player): boolean {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            return true;
        }
        if (this.groundTime < 10) {
            this.groundTime = 11;
            this.dy = -2.2;
            this.isOnGround = false;
            this.parentSprite = null;
        }
        return false;
    }

    Update(): void {

        if (this.isOnGround || this.parentSprite) {
            this.groundTime = 0;
        } else {
            this.groundTime++;
        }

        if (player && player.parentSprite == this) {
            player.x = Utility.Approach(player.x, this.xMid - player.width / 2, 1);

            var dir = 0;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) dir = 1;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) dir = -1;

            if (dir != 0) {
                if (this.isInWater) {
                    this.AccelerateHorizontally(0.03, dir * 1.0);
                } else if (this.groundTime < 10) {
                    this.AccelerateHorizontally(0.03, dir * 1.0);
                    if (this.isOnGround || this.parentSprite) this.dy = -.5;
                } else {
                    this.AccelerateHorizontally(0.01, dir * 1.0);
                }
            }
        }
        
        this.ridingYOffset = 5;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) this.ridingYOffset = 7;

        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["minecart"][0][1],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    }
}

class BrokenTeacup extends Sprite {
    public height: number = 10;
    public width: number = 17;
    public respectsSolidTiles: boolean = false;
    Update(): void {
        this.ApplyGravity();
        this.MoveByVelocity();
    }
    GetFrameData(frameNum: number): FrameData | FrameData[] {
        if (frameNum % 10 < 5) 
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        return {
            imageTile: tiles["minecart"][0][1],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    }

}