class Pumpkin extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    rolls = false;
    canBeHeld = true;
    floatsInWater = true;
    isPlatform = true;

    hurtsEnemies = true;
    breakTimer = 0;

    OnThrow(thrower: Sprite, direction: -1|1) {
        super.OnThrow(thrower, direction);
    }
    OnDownThrow(thrower: Sprite, direction: -1|1) {
        super.OnDownThrow(thrower, direction);
    }
    OnUpThrow(thrower: Sprite, direction: -1|1) {
        super.OnUpThrow(thrower, direction);
    }

    Update(): void {
        if (this.breakTimer == 0) {
            let isHeld = (player && player.heldItem == this);
            
            this.hurtsEnemies = !isHeld;
            this.ApplyGravity();
            this.ApplyInertia();
            this.ReactToWater();
            this.ReactToPlatformsAndSolids();
            this.MoveByVelocity();
    
            if (!isHeld && (this.isOnCeiling || this.standingOn.length || this.touchedLeftWalls.length || this.touchedRightWalls.length)) {
                this.breakTimer = 1;
                this.canBeHeld = false;
                this.hurtsEnemies = false;
            }
        } else {
            this.breakTimer += 4;
            if (this.breakTimer >= 75) this.isActive = false;
        }
    }
    OnStrikeEnemy(enemy: Enemy): void {
        this.breakTimer = 1;
        this.canBeHeld = false;
        this.hurtsEnemies = false;
    }
    
    GetFrameData(frameNum: number): FrameData {
        if (this.breakTimer == 0) {
            return {
                imageTile: tiles["pumpkin"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        let col = Math.floor(this.breakTimer / 10);
        return {
            imageTile: tiles["pumpkin"][col][1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}