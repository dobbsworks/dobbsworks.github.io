abstract class CameraScrollTrigger extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canMotorHold = false;
    abstract frameCol: number;
    frameRow: number = 1;

    abstract direction: Direction | null;

    Update(): void {
    }

    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["camera"][this.frameCol][this.frameRow],
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

class CameraScrollUp extends CameraScrollTrigger {
    direction = Direction.Up;
    frameCol = 0;
}

class CameraScrollDown extends CameraScrollTrigger {
    direction = Direction.Down;
    frameCol = 1;
}

class CameraScrollLeft extends CameraScrollTrigger {
    direction = Direction.Left;
    frameCol = 2;
}

class CameraScrollRight extends CameraScrollTrigger {
    direction = Direction.Right;
    frameCol = 3;
}

class CameraScrollReset extends CameraScrollTrigger {
    direction = null;
    frameCol = 0;
    frameRow = 2;
}


abstract class CameraZoomTrigger extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canMotorHold = false;
    abstract frameCol: number;

    abstract direction: "in" | "out";

    Update(): void {
    }

    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["camera"][this.frameCol][0],
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


class CameraZoomOut extends CameraZoomTrigger {
    direction: "in" | "out" = "out";
    frameCol = 2;
}
class CameraZoomIn extends CameraZoomTrigger {
    direction: "in" | "out" = "in";
    frameCol = 3;
}