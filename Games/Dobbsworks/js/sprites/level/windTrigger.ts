abstract class WindTrigger extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canMotorHold = false;
    abstract frameCol: number;
    frameRow: number = 3;

    abstract direction: Direction | null;

    Update(): void {
    }

    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["gust"][this.frameCol][this.frameRow],
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

class WindTriggerUp extends WindTrigger {
    direction = Direction.Up;
    frameCol = 1;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return WindTriggerRight; }
}

class WindTriggerDown extends WindTrigger {
    direction = Direction.Down;
    frameCol = 3;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return WindTriggerLeft; }
}

class WindTriggerLeft extends WindTrigger {
    direction = Direction.Left;
    frameCol = 2;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return WindTriggerUp; }
}

class WindTriggerRight extends WindTrigger {
    direction = Direction.Right;
    frameCol = 0;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return WindTriggerDown; }
}

class WindTriggerReset extends WindTrigger {
    direction = null;
    frameCol = 4;
}