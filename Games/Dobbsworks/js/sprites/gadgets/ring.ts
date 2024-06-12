class Ring extends Sprite {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = false;
    rowNum = 0;
    canHangFrom = true;
    isMovedByWind = false;


    Update(): void {
        let parentMotor = this.GetParentMotor();
        if (!parentMotor) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
        this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData {
        let frames = [0,0,1,1,1,2,2,2,2,1,1,1,0,0,3,3,3,4,4,4,4,3,3,3];
        let frameIndex = Math.floor(frameNum / 10) % frames.length;
        let frame = frames[frameIndex]
        return {
            imageTile: tiles["ring"][frame][this.rowNum],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}

class PullSwitch extends Ring {
    height = 7;
    rowNum = 1;
    isOn = false;
    anchor = Direction.Up;
    isPowerSource = true;

    Update(): void {
        let parentMotor = this.GetParentMotor();
        if (!parentMotor) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
        this.MoveByVelocity();

        this.isOn = (player && player.heldItem == this);
    }
    
    GetPowerPoints(): Pixel[] { 
        if (this.isOn) {
            return [
                {xPixel: this.xMid, yPixel: this.y - 1}
            ]; 
        } else return [];
    }
}

class SpringRing extends Sprite {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = false;
    isMovedByWind = false;

    handle: Sprite | null = null;

    GetThumbnail(): ImageTile {
        return tiles["ring"][0][2];
    }

    Update(): void {
        if (this.handle == null) {
            let handle = new SpringRingHandle(this.x, this.y, this.layer, []);
            this.handle = handle;
            handle.chainAnchor = this;
            this.layer.sprites.push(handle);
        }

        let parentMotor = this.GetParentMotor();
        if (!parentMotor) {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
    }
    
    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["ring"][0][2],
                xFlip: false,
                yFlip: false,
                xOffset: 1,
                yOffset: 1
            };
        }
        return {
            imageTile: tiles["ring"][1][2],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}

class SpringRingHandle extends Sprite {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = false;
    rowNum = 0;
    canHangFrom = true;
    isMovedByWind = false;
    maxHoldDistance = 5;

    chainAnchor: Sprite | null = null;

    isHeld = false;
    incomingPlayerDx = 0;
    
    OnPickup(): Sprite { 
        this.incomingPlayerDx = 0;
        if (player) this.incomingPlayerDx = player.dx / 2;
        return this; 
    }

    Update(): void {
        if (this.chainAnchor == null || !this.chainAnchor.isActive) {
            this.isActive = false;
            return;
        }

        let wasHeld = this.isHeld;
        this.isHeld = player && player.heldItem == this;
        if (!wasHeld && this.isHeld) {
            this.dy = 1.5;
            this.dx = (this.incomingPlayerDx);
        }

        this.dy -= (this.y - (this.chainAnchor.y + 12)) / 80;
        this.dx -= (this.x - this.chainAnchor.x) / 200;

        if (this.isHeld) {
            let maxSpeed = 0.5;
            let accel = 0.02;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && this.dx > -maxSpeed) this.dx -= accel;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && this.dx < maxSpeed) this.dx += accel;
        }

        if (!this.isHeld) {
            this.dx *= 0.98;
            this.dy *= 0.98;
        }

        this.MoveByVelocity();
    }
    
    GetFrameData(frameNum: number): FrameData[] {
        let chainCount = 3;
        let ret: FrameData[] = [];

        if (this.chainAnchor) {
            for (let i = 1; i < chainCount; i++) {
                let ratio = i / chainCount;
                ret.push({
                    imageTile: tiles["ring"][1][2],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 1 - (this.chainAnchor.x - this.x) * ratio,
                    yOffset: 1 - (this.chainAnchor.y - this.y) * ratio,
                });
            }
        }


        ret.push({
            imageTile: tiles["ring"][0][2],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        });
        return ret;
    }
}