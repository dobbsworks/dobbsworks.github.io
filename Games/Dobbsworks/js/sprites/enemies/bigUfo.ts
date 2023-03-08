class BigYufo extends Enemy {

    public height: number = 6;
    public width: number = 36;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    isPlatform = true;
    canStandOn = true;
    killedByProjectiles = false;
    zIndex = 1;

    tractorTiles = 8;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        this.SkyPatrol(0.5);
        this.dy *= 0.94;
        this.ReactToVerticalWind();
    }

    IsSpriteInTractorBeam(sprite: Sprite): boolean {
        return sprite.x < this.xRight &&
            sprite.xRight > this.x &&
            sprite.y < this.yBottom + (12 * this.tractorTiles)
            && sprite.yBottom > this.yBottom;
    }

    GetFrameData(frameNum: number): FrameData[] {
        let gusts = [0, 1, 2, 3, 4, 5, 6, 7].map(a => ({
            imageTile: tiles["tractorBeam"][a == 7 ? 1 : 0][Math.floor((frameNum / 2 + a) % 12)],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: -a * 12 - 6
        }));
        return [...gusts, {
            imageTile: tiles["bigUfo"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        }];
    }
}
