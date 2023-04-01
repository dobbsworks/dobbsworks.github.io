class Doopster extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeHeld = false;
    isSolidBox = true;

    hasRider = false;
    duplicationTimer = 0;
    sourceSprite: Sprite | null = null;
    duplicateSprite: Sprite | null = null;

    Update(): void {
        let riders = this.layer.sprites.filter(a => a.parentSprite == this);
        this.hasRider = riders.length > 0;
        if (!this.sourceSprite || !this.sourceSprite.isActive || !this.duplicateSprite || !this.duplicateSprite.isActive) {
            if (riders.length == 1) {
                let toDuplicate = riders[0];
                if (this.sourceSprite == toDuplicate) {
                    this.duplicationTimer++;
                } else {
                    this.duplicationTimer = 0;
                    this.sourceSprite = toDuplicate;
                }
                if (this.duplicationTimer >= 60) {
                    this.CreateDuplicate();
                    this.duplicationTimer = 0;
                }
            } else {
                this.duplicationTimer = 0;
            }
        }
        this.dx *= 0.9;
        this.dy *= 0.9;
    }

    CreateDuplicate(): void {
        if (this.sourceSprite) {
            let spriteType = <SpriteType>this.sourceSprite.constructor;
            this.duplicateSprite = new spriteType(this.xMid - this.sourceSprite.width/2, this.sourceSprite.y + 12 + this.sourceSprite.height, this.sourceSprite.layer, []);
            this.duplicateSprite.age = this.sourceSprite.age;
            this.duplicateSprite.isDuplicate = true;
            this.layer.sprites.push(this.duplicateSprite);
            this.layer.sprites.push(new Poof(this.duplicateSprite.xMid - 8, this.duplicateSprite.yMid - 8, this.layer, []));
            if (this.IsOnScreen()) {
                audioHandler.PlaySound("bap", true);
                audioHandler.PlaySound("pomp", true);
            }
        }
    }


    GetIsPowered(): boolean {
        let tile = this.layer.map?.wireLayer.GetTileByPixel(this.xMid, this.yMid);
        return tile?.isPowered() || false;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 0;
        if (this.duplicationTimer > 0) {
            col = Math.floor(this.duplicationTimer / 3) % 5 + 1;
        } else if (this.hasRider) {
            col = 6;
        }
        return {
            imageTile: tiles["doopster"][col][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 1
        };
    }
}