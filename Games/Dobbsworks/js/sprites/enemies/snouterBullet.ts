class SnouterBullet extends Enemy {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    bumpsEnemies = false;

    Update(): void {
        this.ApplyInertia();
        this.ReactToWater();
        if (this.isTouchingLeftWall || this.isTouchingRightWall) {
            this.Crumble();
        }
        this.ReactToVerticalWind();
    }

    OnBounce(): void {
        this.Crumble();
    }

    Crumble(): void {
        this.isActive = false;
        let crumble = new PrickleEggCrumble(this.x, this.y, this.layer, []);
        crumble.dy = this.dy;
        this.layer.sprites.push(crumble);
    }
    
    frameCols = [0,1,2,3];
    frameRow = 1;
    GetFrameData(frameNum: number): FrameData {
        let frames = this.frameCols;
        let frame = frames[Math.floor(frameNum / 5) % frames.length];
        return {
            imageTile: tiles["prickle-egg"][frame][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}

class PricklySnouterBullet extends SnouterBullet {
    frameCols = [0,1,2,3,2,1];
    frameRow = 0;
    canBeBouncedOn = false;
    canSpinBounceOn = true;
}