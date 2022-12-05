class Ring extends Sprite {

    public height: number = 10;
    public width: number = 10;
    respectsSolidTiles = false;
    rowNum = 0;
    canHangFrom = true;


    Update(): void {
        let parentMotor = <Motor>this.layer.sprites.find(a => a instanceof Motor && a.connectedSprite == this);
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
        let parentMotor = <Motor>this.layer.sprites.find(a => a instanceof Motor && a.connectedSprite == this);
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