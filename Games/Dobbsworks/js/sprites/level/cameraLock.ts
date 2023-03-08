class CameraLockHorizontal extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canMotorHold = false;

    Update(): void {
    }

    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["camera"][0][0],
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
class CameraLockVertical extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canMotorHold = false;

    Update(): void {
    }

    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["camera"][1][0],
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