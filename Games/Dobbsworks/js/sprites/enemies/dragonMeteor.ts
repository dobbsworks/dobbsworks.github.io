class SmallMeteor extends Enemy {
    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    willCoolOff = false;
    public zIndex: number = 1;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.dy *= 0.9;
        // todo fire effect

        if (this.isOnGround && this.age > 1) {
            this.dy = -1;
            if (this.willCoolOff) {
                this.ReplaceWithSpriteType(GrabbableMeteor);
            } else {
                this.dx = 0;
                this.dy = 0;
                this.ReplaceWithSpriteType(BrokenMeteor);
            }
        }

        if (this.age % 10 == 0) {
            let fireX = this.x + Math.random() * this.width - 3;
            let fireY = this.y + Math.random() * this.height - 3;
            let fire = new SingleFireBreath(fireX, fireY, this.layer, []);
            fire.hurtsPlayer = false;
            this.layer.sprites.push(fire);
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(Math.sin(this.x) * 10) % 2 == 0 ? 1 : 2;
        let xFlip = Math.floor(Math.sin(this.x) * 10 + Math.floor(frameNum / 10)) % 2 == 0;
        let yFlip = Math.floor(Math.cos(this.x) * 10 + Math.floor(frameNum / 10)) % 2 == 0;

        return {
            imageTile: tiles["smallMeteor"][frame][0],
            xFlip: xFlip,
            yFlip: yFlip,
            xOffset: 1,
            yOffset: 1
        }
    }
}

class GrabbableMeteor extends Sprite {
    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeHeld = true;

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }

    OnThrow(thrower: Sprite, direction: -1|1) {
        super.OnThrow(thrower, direction);
        this.ReplaceWithSpriteType(ThrownMeteor);
    }
    OnDownThrow(thrower: Sprite, direction: -1|1) {
        super.OnDownThrow(thrower, direction);
        this.ReplaceWithSpriteType(ThrownMeteor);
    }
    OnUpThrow(thrower: Sprite, direction: -1|1) {
        super.OnUpThrow(thrower, direction);
        this.ReplaceWithSpriteType(ThrownMeteor);
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["smallMeteor"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        }
    }
}

class ThrownMeteor extends Sprite {
    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    public hurtsEnemies: boolean = true;

    OnStrikeEnemy(enemy: Enemy): void {
        this.ReplaceWithSpriteType(BrokenMeteor);
    }

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

        if (this.isOnGround || this.isOnCeiling || this.isTouchingLeftWall || this.isTouchingRightWall) {
            this.dx = 0;
            this.dy = 0;
            this.ReplaceWithSpriteType(BrokenMeteor);
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["smallMeteor"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        }
    }
}

class BrokenMeteor extends Sprite {
    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = false;

    Update(): void {
        this.ApplyGravity();
        this.MoveByVelocity();
    }

    GetFrameData(frameNum: number): FrameData {
        if (Math.floor(frameNum / 2) % 2 == 0) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 1,
                yOffset: 1
            }
        }
        return {
            imageTile: tiles["smallMeteor"][3][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        }
    }
}

// falls, on land bounce, change to throwable
// on throw, change to break on solid