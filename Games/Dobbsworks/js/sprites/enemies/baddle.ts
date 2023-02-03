class BaddleTrigger extends Sprite {
    public height: number = 36;
    public width: number = 36;
    public respectsSolidTiles: boolean = false;
    Update(): void {
        if (player) {
            if (player.Overlaps(this)) {
                this.isActive = false;
                // find target
                let target: Baddle | Player = player;
                while (this.layer.sprites.find(a => a instanceof Baddle && a.target == target)) {
                    target = <Baddle>this.layer.sprites.find(a => a instanceof Baddle && a.target == target);
                }

                // create Baddle
                let baddle = new Baddle(target.x, target.y, target.layer, []);
                baddle.target = target;
                this.layer.sprites.push(baddle);
            }
        }
    }
    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["baddleTrigger"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        } else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
    }

}

class Baddle extends Enemy {

    public height: number = 9;
    public width: number = 5;
    respectsSolidTiles = false;
    damagesPlayer = false;

    target: Baddle | Player | null = null;
    storedFrames: { fd: FrameData, x: number, y: number }[] = [];
    pulledFrame: FrameData | null = null;

    Update(): void {
        if (!this.target?.isActive) {
            this.ReplaceWithSpriteType(Poof);
        }

        if (this.target) {
            this.storedFrames.push({ fd: this.target.GetFrameData(currentMap.frameNum), x: this.target.x, y: this.target.y });

            let frameLength = (this.target instanceof Player ? 50 : 12);
            if (this.storedFrames.length >= frameLength) {
                this.damagesPlayer = true;
                let storedFrame = this.storedFrames.shift();
                if (storedFrame) {
                    this.pulledFrame = storedFrame.fd;
                    this.x = storedFrame.x;
                    this.y = storedFrame.y;
                }
            }
        }
    }


    GetFrameData(frameNum: number): FrameData {
        if (this.pulledFrame == null) {
            return {
                imageTile: tiles["baddle"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 1,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["baddle"][this.pulledFrame.imageTile.xSrc / 7][this.pulledFrame.imageTile.ySrc / 9],
            xFlip: this.pulledFrame.xFlip,
            yFlip: this.pulledFrame.yFlip,
            xOffset: 1,
            yOffset: 0
        };
    }
}