class SnailShell extends Sprite {

    public height: number = 8;
    public width: number = 8;
    respectsSolidTiles = true;
    rolls = true;
    canBeHeld = true;
    canMotorHold = false;


    Update(): void {
        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        } else {
            this.rotation -= this.GetTotalDx() / 2
        }

        if (this.age > 10) {
            let players = <Player[]>(this.layer.sprites.filter(a => a instanceof Player));
            for (let player of players) {
                if (player && player.heldItem != this && player.Overlaps(this)) {
                    let oldDy = this.dy;
                    let newShell = this.OnThrow(player, player.x < this.x ? 1 : -1);
                    newShell.dy = oldDy;
                }
            }
        }

        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }

    OnDownThrow(thrower: Sprite, direction: -1 | 1) {
        super.OnDownThrow(thrower, direction);
        this.age = 0;
    }

    OnUpThrow(thrower: Sprite, direction: -1 | 1) {
        super.OnUpThrow(thrower, direction);
        this.age = 0;
    }

    OnThrow(thrower: Sprite, direction: -1 | 1): Sprite {
        this.isActive = false;
        let shell = <RollingSnailShell>this.ReplaceWithSpriteType(RollingSnailShell);
        shell.age = 0;
        shell.framesSinceThrown = 0;
        shell.direction = direction;
        if (!(thrower instanceof Player)) shell.framesSinceThrown = 100;
        return shell;
    }

    GetFrameData(frameNum: number): FrameData {
        let totalFrames = Object.keys(tiles["snail"]).length - 2;
        let rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        let frame = 9 - Math.floor(rot / (Math.PI * 2) * totalFrames) || 1;
        if (frame < 0) frame = 0;
        return {
            imageTile: tiles["snail"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}