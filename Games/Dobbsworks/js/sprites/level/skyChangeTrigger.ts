class SkyChangeTrigger extends Sprite {

    constructor(x: number, y: number, layer: LevelLayer, editorProps: string[]) {
        super(x, y, layer, editorProps);
        this.skyString = editorProps[0];
    }


    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canMotorHold = false;

    skyString = "";
    
    GetThumbnail(): ImageTile {
        return tiles["editor"][5][9];
    }

    Update(): void {
        if (this.IsOnScreen(0)) {
            if (this.skyString) {
                currentMap.targetSky = currentMap.LoadSkyFromString(this.skyString);
            }
            this.isActive = false;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["editor"][5][9],
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