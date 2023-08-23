class Snail extends Enemy {

    public height: number = 11;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = true;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.GroundPatrol(0.2, true);
        this.ApplyGravity();
        this.ApplyInertia();
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }
    
    OnBounce(): void {
        let shell = this.ReplaceWithSpriteType(SnailShell);
        shell.dx = 0;
        shell.dy = 0;
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["snail"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 0
        };
    }
}

class RubySnail extends Snail {
    canBeBouncedOn = false;

    Update(): void {
        super.Update();
        if (this.isOnGround) {
            for (let tile of this.standingOn) {
                this.layer.AttemptToCoatTile(tile.tileX, tile.tileY, TileType.FireTopDecay1);
            }
        }
        this.ReactToWater();
        if (this.isInWater) {
            this.ReplaceWithSpriteType(Snail);
            this.isInWater = false;
        }
    }
    

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 5) % 4;
        return {
            imageTile: tiles["rubySnail"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 3
        };
    }
}