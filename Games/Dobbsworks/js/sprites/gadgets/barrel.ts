class Barrel extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    rolls = true;
    canBeHeld = true;
    floatsInWater = true;
    isPlatform = true;

    hurtsEnemies = false;
    frameRow = 0;
    rollingBarrelType: SpriteType = RollingBarrel;

    OnThrow(thrower: Sprite, direction: -1|1) {
        super.OnThrow(thrower, direction);
        this.ReplaceWithRollingBarrel();
    }
    OnDownThrow(thrower: Sprite, direction: -1|1) {
        super.OnDownThrow(thrower, direction);
        this.ReplaceWithRollingBarrel();
    }
    OnUpThrow(thrower: Sprite, direction: -1|1) {
        super.OnUpThrow(thrower, direction);
        this.ReplaceWithRollingBarrel();
    }

    ReplaceWithRollingBarrel(): void {
        this.ReplaceWithSpriteType(this.rollingBarrelType);
    }

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["barrel"][0][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}

class RollingBarrel extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    rolls = true;
    canBeHeld = true;
    floatsInWater = true;
    isPlatform = true;

    hurtsEnemies = true;
    frameRow = 1;

    OnStrikeEnemy(enemy: Enemy): void {
        this.Break();
    }

    Break(): void {
        let breakingAnimation = new BreakingBarrel(this.x, this.y, this.layer, []);
        this.isActive = false;
        this.layer.sprites.push(breakingAnimation);
    }

    OnPickup(): Sprite { 
        return this.ReplaceWithSpriteType(Barrel);
    }

    Update(): void {
        this.ApplyGravity();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        
        this.rotation -= this.GetTotalDx()/2;
        if (this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0) { 
            this.Break();
        } else if (this.isInWater) {
            this.Float();
        }
    }

    Float() {
        this.ReplaceWithSpriteType(Barrel);
    }
    
    GetFrameData(frameNum: number): FrameData {
        let totalFrames = 4;
        let rot = ((this.rotation % (Math.PI*2)) + (Math.PI*2)) % (Math.PI*2);
        let frame = Math.floor(rot / (Math.PI*2) * totalFrames) || 1;
        if (frame < 0) frame = 0;

        return {
            imageTile: tiles["barrel"][frame][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}

class BreakingBarrel extends Sprite {
    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    canBeHeld = false;
    frame = 0;
    frameRow = 1;

    Update(): void { 
        this.frame = Math.floor(this.age / 10);
        if (this.frame >= 4) this.isActive = false;
    }
    
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["barrel"][this.frame + 4][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}
class BreakingSteelBarrel extends BreakingBarrel {
    frameRow = 3;
}

class SteelBarrel extends Barrel {
    frameRow = 2;
    rollingBarrelType: SpriteType = RollingSteelBarrel;
}

class RollingSteelBarrel extends RollingBarrel {
    frameRow = 3;
    OnStrikeEnemy(enemy: Enemy): void { }
    Break(): void {
        this.dx = 0;
        this.dy = -1;
        this.ReplaceWithSpriteType(SteelBarrel);
    }
    Float() {
        this.ReplaceWithSpriteType(SteelBarrel);
    }
    OnPickup(): Sprite { 
        return this.ReplaceWithSpriteType(SteelBarrel);
    }
}

class EmptyBarrel extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeHeld = true;
    blocksDamage = true;
    holdRatio = 0; // 0 held high, 1 held over player
    frameCol = 0;
    blockType: HeldDamageBlockType = HeldDamageBlockType.Iframe;
    breakSprite = BreakingBarrel;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

        if (player) {
            if (player.heldItem == this) {
                if (player.isOnGround) {
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                        this.holdRatio = Utility.Approach(this.holdRatio, 1.0, 0.1);
                    } else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                        this.holdRatio = Utility.Approach(this.holdRatio, 0.0, 0.1);
                    } else {
                        this.holdRatio = Utility.Approach(this.holdRatio, 0.8, 0.1);
                    }
                } else {
                    this.holdRatio = Utility.Approach(this.holdRatio, 0.8, 0.1);
                }
                if (this.holdRatio > 0.5) player.dx *= 0.9;
            } else {
                this.holdRatio = 0;
            }
        } else {
            this.holdRatio = 0;
        }

    }

    OnHolderTakeDamage(): HeldDamageBlockType {
        if (this.holdRatio == 1) {
            return HeldDamageBlockType.Invincible;
        } else if (this.holdRatio > 0.5) {
            this.ReplaceWithSpriteType(this.breakSprite);
            return HeldDamageBlockType.Iframe;
        }
        return HeldDamageBlockType.Vulnerable;
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["barrel"][this.frameCol][4],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: this.holdRatio * -9
        };
    }
}

class EmptySteelBarrel extends EmptyBarrel {
    frameCol = 1;
    breakSprite = BreakingSteelBarrel;
}