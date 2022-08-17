abstract class BasePlatform extends Sprite {

    constructor(x: number, y: number, layer: LevelLayer, editorProps: number[]) {
        super(x, y, layer, editorProps);
        let numTiles = editorProps[0] || 3;
        this.width = numTiles * layer.tileWidth;
    }

    protected sourceImage = "platform";
    public height: number = 2;
    public width!: number;
    public isPlatform: boolean = true;
    respectsSolidTiles = false;
    public abstract tilesetRow: number;
    public xRenderOffset: number = 0;
    public yRenderOffset: number = 0;
    public anchor: Direction = Direction.Up;


    IsPlayerStandingOn(): boolean {
        return this.layer.sprites.some(a => a instanceof Player && a.parentSprite == this && a.standingOn.length == 0);
    }

    GetFullRiders(): Sprite[] {
        return this.layer.sprites.filter(a => a.parentSprite == this && a.standingOn.length == 0);
    }

    GetFullRiderCount(): number {
        return this.GetFullRiders().length;
    }
    GetOneFootRiderCount(): number {
        return this.layer.sprites.filter(a => a.parentSprite == this && (a.standingOn.length > 0 || (a instanceof Player && a.isClimbing))).length;
    }

    GetFrameData(frameNum: number): FrameData[] {
        if (this.width <= 12) {
            return [{
                imageTile: tiles[this.sourceImage][0][this.tilesetRow],
                xFlip: false,
                yFlip: false,
                xOffset: 0 + this.xRenderOffset,
                yOffset: 0 + this.yRenderOffset
            }]
        }
        let frames = [{
            imageTile: tiles[this.sourceImage][1][this.tilesetRow],
            xFlip: false,
            yFlip: false,
            xOffset: 0 + this.xRenderOffset,
            yOffset: 0 + this.yRenderOffset
        }, {
            imageTile: tiles[this.sourceImage][3][this.tilesetRow],
            xFlip: false,
            yFlip: false,
            xOffset: -(this.width - 12) + this.xRenderOffset,
            yOffset: 0 + this.yRenderOffset
        }];
        for (let x = 12; x < this.width - 12; x += 12) {
            frames.push({
                imageTile: tiles[this.sourceImage][2][this.tilesetRow],
                xFlip: false,
                yFlip: false,
                xOffset: -x + this.xRenderOffset,
                yOffset: 0 + this.yRenderOffset
            });
        }

        return frames;
    }
}