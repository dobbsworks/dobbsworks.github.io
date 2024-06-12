//1.11.2;12;0;0;3;0;0|#003232,#415057,0.00,1.00,0.60;AB,#5959a5,0,0,0.05,-1,1,0;AB,#5959a5,0,0,0.1,0,1,0;AM,#b2ffff,0,0,0.2,0,1,0;AL,#ffffff,0,0.5,0.3,0,0,0;#1257eccc;#5e23b8cc;#cf2e16fe|AA/AARAGAAAKAGAAAWAGAAAKAGAAAWAGAAAKAGAAA/AAmAGDAAHAGDAAHAGDAAHAGDAAFAGFAAFAGFAAFAGFAA/AA/AA/AA/AA/AA/AAx|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAL|AAECDGAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAKCDAAAKCDAAAJCDBAAKCDAAAKCDAAAJCDBAAKCDAAAKCDAAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDBAAJCDB|AAEAGAAAPAGAAAKAGAAAKAGAAAKAGAAAKAGAAAiAGAAAiAGAAAiAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAGAGAAACAGAAAGAGAAACAGAAAGAGAAACAGAAAGAGAAACAGAAAEAGAAAAAGAAACAGAAAEAGAAAAAGAAACAGAAAEAGAAAAAGAAACAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAKAGAAAA|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAL|ABA3AI;CnAOAB;AEAXAJ;AEAZAJ;AEAbAJ;BqAIAJ

class KingSlush extends Enemy {
    public height: number = 36;
    public width: number = 30;
    public respectsSolidTiles: boolean = true;
    body: BigSnowmanBase | null = null;
    public canBeBouncedOn: boolean = true;
    public zIndex: number = 1;
    killedByProjectiles: boolean = false;
    immuneToSlideKill: boolean = true;

    Update(): void {
        if (!this.body) {
            this.body = new BigSnowmanBase(this.x - (72 - 30) / 2, this.y + this.height, this.layer, []);
            this.layer.sprites.push(this.body);
            this.stackedOn = this.body;
            this.body.head = this;
        }

    }
    GetFrameData(frameNum: number): FrameData {
        var frame = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["bigSnowmanHead"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 3,
            yOffset: 1
        }
    }

}

class BigSnowmanBase extends Hazard {
    public height: number = 72;
    public width: number = 72;
    public respectsSolidTiles: boolean = true;
    rolls = true;
    revealTimer = false;

    head: KingSlush | null = null;
    hurtsEnemies: boolean = true;

    Update(): void {
        super.Update();
        if (!this.WaitForOnScreen()) return;
        if (player && this.head) {
            this.head.direction = (player.xMid < this.xMid ? -1 : 1);
            this.AccelerateHorizontally(0.008, this.head.direction);
        }
        this.ApplyGravity();
        this.rotation += this.GetTotalDx()/2;
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }


    protected DoesPlayerOverlap(player: Player): boolean {
        // special override for round hitbox
        let x = player.x;
        if (player.x < this.xMid) x = this.xMid;
        if (player.xRight < this.xMid) x = player.xRight;

        let y = player.y;
        if (player.y < this.yMid) y = this.yMid;
        if (player.yBottom < this.yMid) y = player.yBottom;

        let distSquared = (x - this.xMid) ** 2 + (y - this.yMid) ** 2;
        return distSquared < (this.width / 2) ** 2;
    }
    IsHazardActive(): boolean {
        return true;
    }

    GetFrameData(frameNum: number): FrameData {
        let totalFrames = Object.keys(tiles["bigSnowball"]).length;
        let rot = ((this.rotation % (Math.PI*2)) + (Math.PI*2)) % (Math.PI*2);
        let frame = Math.floor(rot / (Math.PI*2) * totalFrames) || 0;
        if (frame < 0) frame = 0;
        return {
            imageTile: tiles["bigSnowball"][frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }
    }

}