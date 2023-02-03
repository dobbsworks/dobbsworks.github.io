class Saw extends Hazard {
    public height = 36;
    public width = 36;
    public respectsSolidTiles = false;
    anchor = null;

    radius = 18;
    imageSource = "saw";

    Update(): void {
        super.Update();
    }

    IsHazardActive(): boolean {
        return true;
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
        return distSquared < this.radius ** 2;
    }
    

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(frameNum / 2.5) % 3;
        return {
            imageTile: tiles[this.imageSource][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    }
}


class SmallSaw extends Saw {
    public height = 24;
    public width = 24;
    radius = 12;
    imageSource = "smallSaw";
}