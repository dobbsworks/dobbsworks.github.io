class Coin extends Sprite {
    public height: number = 8;
    public width: number = 8;
    public respectsSolidTiles: boolean = false;

    isExemptFromSilhoutte = true;
    anchor = null;
    imageSource = "coin";
    border = 1;
    sound = "coin";
    isTouched = false;
    touchTimer = 0;

    Update(): void {
        if (this.isTouched) {
            this.touchTimer++;
            this.y -= 0.25;
            if (this.touchTimer > 60) this.isActive = false;
        } else {
            let players = this.layer.sprites.filter(a => a instanceof Player) as Player[];
            for (let player of players) {
                if (player.Overlaps(this)) {
                    this.isTouched = true;
                    audioHandler.PlaySound(this.sound, false);
                    if (this instanceof Dabbloon) {
                        this.layer.sprites.push(new Points(this.xMid - 15 / 2, this.y, this.layer, []));
                        player.gunHpCurrent += 10;
                    } else {
                        player.gunHpCurrent += 1;
                    }
                    if (player.gunHpCurrent > player.gunHpMax) {
                        player.gunHpCurrent = player.gunHpMax;
                    }
                }
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(frameNum / 10) % 6;
        let frameRow = 0;
        if (this.isTouched) {
            frame = Math.floor(frameNum / 3) % 6;
            frameRow = Math.ceil(this.touchTimer / 20);
            if (frameRow > 3) frameRow = 3;
        }
        return {
            imageTile: tiles[this.imageSource][frame][frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: this.border,
            yOffset: this.border
        };
    }

}

class Dabbloon extends Coin {
    public height: number = 14;
    public width: number = 14;
    border = 2;
    imageSource = "dobbloon";
    sound = "dobbloon";
}