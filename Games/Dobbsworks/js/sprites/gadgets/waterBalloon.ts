class WaterBalloon extends Sprite {

    public height: number = 5;
    public width: number = 6;
    respectsSolidTiles = true;
    rolls = false;
    canBeHeld = true;
    floatsInWater = true;
    isThrown = false;
    hurtsEnemies = true;

    OnThrow(thrower: Sprite, direction: 1 | -1): void {
        super.OnThrow(thrower, direction);
        this.isThrown = true;
    }

    OnUpThrow(thrower: Sprite, direction: 1 | -1): void {
        super.OnUpThrow(thrower, direction);
        this.isThrown = true;
    }

    OnPickup(): Sprite {
        this.isThrown = false;
        return this;
    }

    public OnStrikeEnemy(enemy: Enemy): void {
        this.Explode();
    }

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

        if (this.isThrown) {
            if (this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0 || this.isOnGround) {
                this.Explode();
            }
        }
    }

    Explode(): void {
        this.isActive = false;

        // create explosions
        audioHandler.PlaySound("splash", false);
        let speed = 1;
        for (let theta = 0; theta < Math.PI*2; theta += Math.PI / 4) {
            let poof = new WaterBalloonSplash(this.x - 1, this.y - 1, this.layer, []);
            this.layer.sprites.push(poof);
            poof.dx = speed * Math.cos(theta);
            poof.dy = speed * Math.sin(theta);
            poof.x += poof.dx * 4;
            poof.y += poof.dy * 4;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["waterBalloon"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 3
        };
    }
}



class WaterBalloonSplash extends Sprite {
    public height: number = 12;
    public width: number  = 12;
    public respectsSolidTiles: boolean = false;
    isExemptFromSilhoutte = true;

    Update(): void {
        this.MoveByVelocity();
        this.ApplyGravity();
        let velocityDampen = 0.96;
        this.dx *= velocityDampen;
        this.dy *= velocityDampen;
        if (this.age > 25) this.isActive = false;

        let overlapSprites = this.layer.sprites.filter(a => !(a instanceof WaterBalloonSplash) && a.Overlaps(this));
        for (let sprite of overlapSprites) {
            if (sprite instanceof Shrubbert && sprite.isBurning) {
                sprite.Extinguish();
            }
            if (sprite instanceof RubySnail) {
                sprite.ReplaceWithSpriteType(Snail);
            }
            if (sprite instanceof SpicyJelly) {
                sprite.ReplaceWithSpriteType(LittleJelly);
            }
            if (sprite instanceof Bomb && sprite.isIgnited) {
                sprite.ResetFuse();
                sprite.isIgnited = false;
            }
        }

        this.layer.ClearTile(Math.floor(this.xMid / 12), Math.floor(this.yMid / 12));
    }

    GetFrameData(frameNum: number): FrameData {
        let col = [0, 1, 1, 2, 2, 2, 3, 3, -1, 3, -1, 3, -1][Math.floor(this.age/2)];
        if (col == -1) {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }

        return {
            imageTile: tiles["water"][col][2],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}