class SoccerBall extends Sprite {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    rolls = true;
    canBeHeld = false;

    floatsInWater = true;
    hurtsEnemies = false;


    OnStrikeEnemy(enemy: Enemy): void {
        this.dy -= 2;
        this.dx *= 0.5;
        audioHandler.PlaySound("soccer", true);
    }

    Update(): void {
        let overlappingPlayers = this.layer.sprites.filter(a => a instanceof Player && a.Overlaps(this));
        for (let overlappingPlayer of overlappingPlayers) {
            if (overlappingPlayer.xMid <= this.xMid) {
                // bounce right
                this.dx = 2;
            } else {
                // bounce left
                this.dx = -2;
            }
            this.dy = -3;
            audioHandler.PlaySound("soccer", true);
        }


        this.ApplyGravity();
        this.ApplyInertia();
        this.ApplyAirDrag();
        this.ReactToWater();

        if (this.parentSprite) {
            this.rotation -= (this.parentSprite.GetTotalDx() - this.GetTotalDx()) / 2;
        } else {
            this.rotation -= this.GetTotalDx() / 2
        }

        let oldDy = this.dy;
        this.ReactToPlatformsAndSolids();
        if (this.isOnGround) {
            if (oldDy > 0.2) {
                audioHandler.PlaySound("soccer", true);
                this.dy = -oldDy + 0.2;

                let slope = this.standingOn.map(a => a.tileType.solidity).find(a => a instanceof SlopeSolidity && a.verticalSolidDirection == 1) as (SlopeSolidity | undefined);
                if (slope) {
                    // bouncing on slope
                    let currentSpeed = Math.sqrt(this.dx ** 2 + this.dy ** 2);
                    let currentDir = Math.atan2(this.dy, this.dx);

                    let oppositeCurrentDir = Math.PI + currentDir;
                    let slopeAngle = Math.atan2(slope.absoluteSlope * slope.horizontalSolidDirection, 1);
                    let slopePerpendicular = slopeAngle - Math.PI / 2;
                    let newAngle = 2 * slopePerpendicular - oppositeCurrentDir;
                    this.dx = currentSpeed * Math.cos(newAngle);
                    this.dy = currentSpeed * Math.sin(newAngle);
                }
            }
        }

        this.ReactToVerticalWind();
        this.MoveByVelocity();
        let currentSpeed = Math.sqrt(this.dx ** 2 + this.dy ** 2);
        this.hurtsEnemies = currentSpeed > 1.6;
    }

    GetFrameData(frameNum: number): FrameData {
        let totalFrames = Object.keys(tiles["soccerball"]).length;
        let rot = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        let frame = 3 - (Math.floor(rot / (Math.PI * 2) * totalFrames) || 0);
        if (frame < 0) frame = 0;
        return {
            imageTile: tiles["soccerball"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}