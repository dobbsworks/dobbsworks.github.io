class MusicChangeTrigger extends Sprite {

    constructor(x: number, y: number, layer: LevelLayer, editorProps: string[]) {
        super(x, y, layer, editorProps);
        this.songIndex = +(editorProps[0]);
        if (isNaN(this.songIndex)) this.songIndex = -1;
    }

    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canMotorHold = false;

    uiArrowIndex = 6;
    crossfadeSpeed = 1;
    songIndex = -1;
    
    GetThumbnail(): ImageTile {
        return tiles["editor"][6][9];
    }

    Update(): void {
        if (this.IsOnScreen(0)) {
            if (this.songIndex >= 0) {
                audioHandler.SetCrossfadeBackgroundMusic(audioHandler.levelSongList[this.songIndex])
                audioHandler.crossfadeSpeed = this.crossfadeSpeed;
            }
            this.isActive = false;
        }
    }

    GetFrameData(frameNum: number): FrameData[] {
        if (editorHandler.isInEditMode) {
            if (this.songIndex == -1) {
                return [{
                    imageTile: tiles["editor"][6][9],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 0,
                    yOffset: 0
                }];
            }
            return [{
                imageTile: tiles["musicnotes"][this.songIndex % 6][Math.floor(this.songIndex / 6)],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }, {
                imageTile: tiles["editor"][this.uiArrowIndex][2],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }];
        } else {
            return [{
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            }];
        }
    }
}

class MusicFadeTrigger extends MusicChangeTrigger {
    uiArrowIndex = 2;
    crossfadeSpeed = 0.01;
}