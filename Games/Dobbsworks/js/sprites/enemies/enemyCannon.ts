class Blaster extends Enemy {
    public height: number = 6;
    public width: number = 6;
    public respectsSolidTiles: boolean = false;
    damagesPlayer = false;
    anchor = null;
    isPlatform = true;
    canStandOn = true;
    killedByProjectiles = false;
    immuneToSlideKill = true;

    timer = 0;
    stateNum = 0;
    // 0 for right, 1 for upright pre fire, 2 for upright post fire


    Update(): void {
        this.timer++;
        if (this.timer > 40) {
            this.timer = 0;
            this.stateNum++;
            if (this.stateNum > 11) this.stateNum = 0;
            if (this.stateNum % 3 == 2) this.Fire();
        }
    }

    Fire(): void {
        let poof = new Poof(this.xMid, this.yMid, this.layer, []);
        poof.x -= poof.width / 2;
        poof.y -= poof.height / 2;
        this.layer.sprites.push(poof);
        if (this.stateNum == 2 || this.stateNum == 5) poof.dy = -1;
        if (this.stateNum == 8 || this.stateNum == 11) poof.dy = 1;
        if (this.stateNum == 2 || this.stateNum == 11) poof.dx = 1;
        if (this.stateNum == 5 || this.stateNum == 8) poof.dx = -1;
        poof.x += poof.dx * 6;
        poof.y += poof.dy * 6;

        let bullet = new BlasterBullet(this.xMid, this.yMid, this.layer, []);
        bullet.x = poof.xMid - bullet.width/2;
        bullet.y = poof.yMid - bullet.height/2;
        bullet.dx = poof.dx;
        bullet.dy = poof.dy;
        this.layer.sprites.push(bullet);
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 1;
        let horizFlip = false;
        let vertFlip = false;
        if (this.stateNum % 6 == 0) col = 0;
        if (this.stateNum % 6 == 3) col = 2;
        if (this.stateNum == 4 || this.stateNum == 5) horizFlip = true;
        if (this.stateNum == 6) horizFlip = true;
        if (this.stateNum == 7 || this.stateNum == 8) { horizFlip = true; vertFlip = true; }
        if (this.stateNum == 9) vertFlip = true;
        if (this.stateNum == 10 || this.stateNum == 11) vertFlip = true;

        return {
            imageTile: tiles["enemyCannon"][col][0],
            xFlip: horizFlip,
            yFlip: vertFlip,
            xOffset: 3,
            yOffset: 3
        };
    }
}

class BlasterBullet extends Enemy {
    public height: number = 4;
    public width: number = 4;
    public respectsSolidTiles: boolean = true;
    killedByProjectiles = false;
    Update(): void {
        if (this.isTouchingLeftWall || this.isTouchingRightWall || this.isOnCeiling || this.standingOn.length) {
            this.ReplaceWithSpriteType(Poof);
        }
        this.ReactToVerticalWind();
    }
    GetFrameData(frameNum: number): FrameData | FrameData[] {
        let col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["enemyCannon"][col][1],
            xFlip: false,
            yFlip: false,
            xOffset: 4,
            yOffset: 4
        };
    }
    
}