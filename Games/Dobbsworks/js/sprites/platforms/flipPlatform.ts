class FlipPlatform extends BasePlatform {

    public tilesetRow: number = 1;
    protected sourceImage = "flipPlatform";
    public leftCapCol: number = 0;
    public rightCapCol: number = 0;
    public middleCol: number = 0;
    private isInitialized = false;
    private motor: Motor | null = null;
    public SegmentType = FlipPlatformSection;

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            let motor = this.GetParentMotor();
            if (motor instanceof Motor) {
                this.motor = motor;
                motor.motorSpeedRatio = 0;
            }
            if (!motor) {
                this.isActive = false;
                for (let x = this.x; x < this.xRight; x += 12) {
                    let segment = new this.SegmentType(x, this.y, this.layer, []);
                    segment.width = 12;
                    this.layer.sprites.push(segment);
                }
            }
        }
    }
}

class FlipPlatformSection extends FlipPlatform {

    falling = false;
    timer = 0;
    dropTime = 5;

    Update() {
        if (this.IsPlayerStandingOn()) {
            this.falling = true;
        }

        if (this.falling) this.timer++;
        else this.timer--;
        if (this.timer < 0) this.timer = 0;
        if (this.timer > 120) this.falling = false;

        this.isPlatform = this.timer < this.dropTime;
        if (!this.isPlatform) {
            let riders = this.layer.sprites.filter(a => a.parentSprite == this);
            riders.forEach(a => a.parentSprite = null);
        }

    }

    GetFrameData(frameNum: number): FrameData[] {
        let frame = 0;
        if (this.timer > 0) {
            frame = Math.floor(this.timer / 2) % 2
            if (this.timer >= this.dropTime) frame = 2;
            if (this.timer >= this.dropTime + 3) frame = Math.floor(this.timer / 10) % 3 + 3;
        }
        
        return [{
            imageTile: tiles[this.sourceImage][frame][this.tilesetRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }];
    }
}

class SlowFlipPlatform extends FlipPlatform {
    tilesetRow: number = 0;
    SegmentType = SlowFlipPlatformSection;
}

class SlowFlipPlatformSection extends FlipPlatformSection {
    dropTime = 12;
    tilesetRow: number = 0;
}