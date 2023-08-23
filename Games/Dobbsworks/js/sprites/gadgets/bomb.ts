class Bomb extends Sprite {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeHeld = true;

    frameRow = 0;

    floatsInWater = false;
    hurtsEnemies = false;

    isIgnited = false;
    fuseLeft = 238;

    OnStandInFire(): void {
        this.isIgnited = true;
    }

    OnThrow(thrower: Sprite, direction: -1 | 1) {
        this.isIgnited = true;
        super.OnThrow(thrower, direction);
    }

    OnUpThrow(thrower: Sprite, direction: -1 | 1) {
        super.OnUpThrow(thrower, direction);
    }

    OnDownThrow(thrower: Sprite, direction: -1 | 1) {
        super.OnDownThrow(thrower, direction);
    }
    
    OnPickup(): Sprite { 
        this.isIgnited = true;
        return this; 
    }

    ResetFuse(): void {
        this.fuseLeft = 238;
    }

    Update(): void {
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        
        this.ReactToPlatformsAndSolids();
        this.ReactToVerticalWind();
        this.MoveByVelocity();

        if (this.isIgnited) {
            this.fuseLeft--;

            if (this.fuseLeft <= 0) {
                this.Explode();
            }
        }

        if (this.isInWater || this.isInWaterfall) {
            this.ResetFuse();
            this.isIgnited = false;
        }
        if (this.IsInLava()) {
            this.Explode();
        }
    }

    public OnExitPipe(exitDirection: Direction): void { 
        this.ResetFuse();
    }

    Explode(): void {
        this.isActive = false;

        // create explosions
        audioHandler.PlaySound("erase", false);
        let speed = 1;
        for (let theta = 0; theta < Math.PI*2; theta += Math.PI / 4) {
            let poof = new ExplosionPoof(this.x - 1, this.y - 1, this.layer, []);
            this.layer.sprites.push(poof);
            poof.dx = speed * Math.cos(theta);
            poof.dy = speed * Math.sin(theta);
            poof.x += poof.dx * 4;
            poof.y += poof.dy * 4;
        }

        // destory blocks
        let bombXMid = Math.floor(this.xMid / 12) * 12 + 6
        let bombYMid = Math.floor(this.yMid / 12) * 12 + 6
        for (let x = bombXMid - 24; x <= bombXMid + 24; x += 12) {
            for (let y = bombYMid - 24; y <= bombYMid + 24; y += 12) {
                let tileXMid = Math.floor(x / 12) * 12 + 6;
                let tileYMid = Math.floor(y / 12) * 12 + 6;
                let distance = Math.sqrt( (tileXMid - bombXMid) **2 + (tileYMid - bombYMid)**2);
                if (distance > 28) continue;
                let tile = this.layer.GetTileByPixel(x, y);
                let wireTile = tile.GetWireNeighbor();
                if (wireTile && wireTile.tileType == TileType.Cracks) {
                    this.layer.map?.wireLayer.SetTile(tile.tileX, tile.tileY, TileType.Air);
                    this.layer.ExplodeTile(tile);
                }
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 0;
        if (this.isIgnited) {
            if (this.fuseLeft > 42 + 80) col = (this.fuseLeft - (42 + 80)) % 48 <= 20 ? 1 : 2;
            else if (this.fuseLeft > 42) col = (this.fuseLeft - (42)) % 32 <= 16 ? 2 : 1;
            else col = 3;
        }

        return {
            imageTile: tiles["bomb"][col][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 2
        };
    }
}

class SafetyBomb extends Bomb {
    frameRow: number = 3;
    OnPickup(): Sprite { 
        // do NOT ignite
        return this; 
    }
}

class ExplosionPoof extends Hazard {
    public height: number = 12;
    public width: number  = 12;
    public respectsSolidTiles: boolean = false;
    isExemptFromSilhoutte = true;
    hurtsEnemies = true;

    Update(): void {
        super.Update();
        this.MoveByVelocity();
        let velocityDampen = 0.96;
        this.dx *= velocityDampen;
        this.dy *= velocityDampen;
        if (this.age > 25) this.isActive = false;
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
            imageTile: tiles["bomb"][col][1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
    IsHazardActive(): boolean {
        return true;
    }

}

class BlockShard extends Sprite {
    public height: number = 6;
    public width: number = 6;
    public respectsSolidTiles: boolean = false;

    public sourceTileType!: TileType;
    public tilePortionX: 0|1 = 0;
    public tilePortionY: 0|1 = 0;

    Update(): void {
        this.dx *= 0.99;
        this.ApplyGravity();
        this.MoveByVelocity();

        if (!this.IsOnScreen()) this.isActive = false;
    }

    GetFrameData(frameNum: number): FrameData | FrameData[] {
        throw new Error("Method not implemented.");
    }
    
    
    Draw(camera: Camera, frameNum: number): void {
        if (frameNum % 2 == 0) return;

        let imageTile = this.sourceTileType.imageTile;
        camera.ctx.drawImage(imageTile.src, imageTile.xSrc + 0.1 + this.tilePortionX * 6, imageTile.ySrc + 0.1 + this.tilePortionY * 6, 
            imageTile.width/2 - 0.2, imageTile.height/2 - 0.2,
            (this.x - camera.x - 0) * camera.scale + camera.canvas.width / 2,
            (this.y - camera.y - 0) * camera.scale + camera.canvas.height / 2,
            imageTile.width * camera.scale / 2, imageTile.height * camera.scale / 2);
    }
}