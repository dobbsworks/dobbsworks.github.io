class Nimby extends Enemy {
    public height: number = 10;
    public width: number = 18;
    respectsSolidTiles = false;
    canBeBouncedOn = true;
    timer = 0;
    zIndex = 1;
    
    state: "patrol" | "charging" | "striking" | "resetting" = "patrol";

    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }

    OnBounce(): void {
        this.dx = 0;
        this.dy = 0;
        this.OnDead();
        this.isActive = false;
        // add particle poofs

        for (let i = 0; i < 10; i++) {
            let cloudBit = new CloudBit(this.xMid, this.yMid, this.layer, []);
            cloudBit.dx = (Math.random() - 0.5) / 1;
            cloudBit.dy = (Math.random() - 0.5) / 1;
            this.layer.sprites.push(cloudBit);
        }

    }

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        this.timer++;
        
        if (player && this.WaitForOnScreen()) {

            if (this.state == "patrol") {
                // particle
                if (this.age % 8 == 0) {
                    let cloudBit = new CloudBit(this.xMid, this.yMid, this.layer, []);
                    cloudBit.dx = -this.dx / 2;
                    cloudBit.dy = -this.dy / 2 + (Math.random() - 0.5) / 4;
                    this.layer.sprites.push(cloudBit);
                }

                let oldDx = this.dx;
                this.AccelerateHorizontally(0.03, this.direction * 2);
                if (oldDx == this.dx) {
                    // achieved maxSpeed
                    this.direction = (player.xMid < this.xMid ? -1 : 1);
                }

                if (this.timer > 120 && Math.abs(this.xMid - player.xMid) < 5 && player.y > this.yBottom) {
                    this.timer = 0;
                    this.state = "charging";
                    this.dx = 0;
                }
                    
            } else if (this.state == "charging") {
                if (this.timer > 30) {
                    this.timer = 0;
                    this.state = "striking";

                    let lightning = new LightningStrike(this.x, this.y, this.layer, []);
                    lightning.x = this.xMid - lightning.width/2;
                    lightning.y = this.yBottom;
                    this.layer.sprites.push(lightning);

                    audioHandler.PlaySound("lightning", false);

                    if (!currentMap.targetSky) {
                        currentMap.targetSky = currentMap.sky;
                    }

                    currentMap.sky = new Sky();
                    currentMap.sky.bgColorTop = "#FFFFFF";
                    currentMap.sky.bgColorBottom = "#FFFFFF";
                }
            } else if (this.state == "striking") {
                if (this.timer > 30) {
                    this.timer = 0;
                    this.state = "resetting";
                }
            } else if (this.state == "resetting") {
                if (this.timer > 30) {
                    this.timer = 0;
                    this.state = "patrol";
                }
            }
            
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0, 1];
        let frame = frames[Math.floor(frameNum * 0.05) % frames.length];
        let xFlip = this.direction == 1;
        
        if (this.state == "charging") {
            frame = 2;
            xFlip = Math.floor(frameNum / 5) % 2 == 0;
        }
        if (this.state == "striking") frame = 3;
        if (this.state == "resetting") frame = 2;

        return {
            imageTile: tiles["cloud"][frame][0],
            xFlip: xFlip,
            yFlip: false,
            xOffset: 3,
            yOffset: 3
        };
    }
}

class LightningStrike extends Hazard {
    public height: number = 0;
    public width: number = 6;
    public respectsSolidTiles: boolean = false;
    isPowerSource = true;

    
    GetPowerPoints(): Pixel[] { 
        let ret: Pixel[] = [];

        for (let y = this.yBottom + 1; y > this.y; y -= 12) {
            ret.push({xPixel: this.xMid, yPixel: y});
        }
        ret.push({xPixel: this.xMid, yPixel: this.y - 1});

        return ret;
    }

    Update(): void {
        if (this.height == 0) {
            var heightOfFloor = this.GetHeightOfSolid(0, 1, 20).yPixel;
            if (heightOfFloor < this.y) heightOfFloor = this.y + 20 * 12;
            var tilesHeight = Math.floor((heightOfFloor - this.yBottom) / 12);
            this.y = heightOfFloor - tilesHeight * 12;
            this.height = tilesHeight * 12;
        }

        super.Update();
        if (this.age > 30) this.isActive = false;
    }

    IsHazardActive(): boolean {
        return true;
    }
    GetFrameData(frameNum: number): FrameData[] {
        var ret = [];

        for (let y = 0; y < this.height; y += 12) {
            let f = (y / 12 + Math.floor(frameNum / 4)) % 8;
            ret.push({
                imageTile: tiles["lightning"][f % 4][0],
                xFlip: f % 2 == 0,
                yFlip: false,
                xOffset: 3,
                yOffset: 0 - y
            });
        }

        return ret;
    }
}