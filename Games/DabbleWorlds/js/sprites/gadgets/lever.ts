class Lever extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    isPowerSource = true;
    isOn: boolean = false;

    Update(): void {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action2, true)) {
            // action button pressed
            let player = this.layer.sprites.find(a => a instanceof Player);
            if (player) {
                let distance = Math.abs(this.xMid - player.xMid) + Math.abs(this.yMid - player.yMid);
                if (distance < 9) {
                    this.isOn = !this.isOn;
                    audioHandler.PlaySound("erase", true);
                }
            }
        }
    }
    
    GetPowerPoints(): Pixel[] { 
        if (this.isOn) {
            return [
                {xPixel: this.xMid, yPixel: this.yBottom + 1}
            ]; 
        } else return [];
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["misc"][this.isOn ? 1 : 0][1],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}