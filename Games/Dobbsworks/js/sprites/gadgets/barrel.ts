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

    Update(): void { 
        this.frame = Math.floor(this.age / 10);
        if (this.frame >= 4) this.isActive = false;
    }
    
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["barrel"][this.frame + 4][1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

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
}