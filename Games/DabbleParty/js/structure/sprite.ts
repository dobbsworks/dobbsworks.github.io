abstract class Sprite {
    public collides: boolean = false;

    constructor(
        public x: number,
        public y: number,
    ) { }

    public isActive: boolean = true;
    public rotation: number = 0;
    public dx: number = 0;
    public dy: number = 0;

    public abstract width: number;
    public abstract height: number;

    private xScale = 1;
    private yScale = 1;

    abstract Update(): void;
    abstract GetFrameData(frameNum: number): FrameData | null;
    Draw(camera: Camera): void {
        let fd = this.GetFrameData(0);
        if (fd) fd.imageTile.Draw(camera, this.x, this.y, this.xScale, this.yScale, fd.xFlip, fd.yFlip, this.rotation);
    }
    Scale(ratio: number): Sprite {
        this.width *= ratio;
        this.height *= ratio;
        this.xScale *= ratio;
        this.yScale *= ratio;
        return this;
    }
}

class SimpleSprite extends Sprite {
    constructor(x: number, y: number, private imageTile: ImageTile, private logic: (self: Sprite) => void = () => { }) {
        super(x, y);
        this.width = imageTile.width;
        this.height = imageTile.height;
    }
    public width!: number;
    public height!: number;

    Update(): void {
        this.logic(this);
    }
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: this.imageTile,
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}