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
    public name = "";
    public age = 0;

    public abstract width: number;
    public abstract height: number;

    public xScale = 1;
    public yScale = 1;

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
    Overlaps(sprite: Sprite): boolean {
        if (!this.isActive) return false;
        if (!sprite.isActive) return false;
        return this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y;
    }
    DistanceBetweenCenters(sprite: Sprite): number {
        return Math.sqrt( (this.x - sprite.x)**2 + (this.y - sprite.y)**2 );
    }
}

class SimpleSprite extends Sprite {
    constructor(x: number, y: number, public imageTile: ImageTile, private logic: (self: Sprite) => void = () => { }) {
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
    public Animate(animationSpeed: number): void {
        if (currentMinigame && this.imageTile) {
            let totalFrames = this.imageTile.tileMap.rows * this.imageTile.tileMap.cols;
            let frameIndex = Math.floor(animationSpeed * currentMinigame.timer) % totalFrames;
            let col = frameIndex % this.imageTile.tileMap.cols;
            let row = Math.floor(frameIndex / this.imageTile.tileMap.cols);
            this.imageTile = this.imageTile.tileMap[col][row];
        }
    }
}

class ScoreSprite extends Sprite {
    constructor(x: number, y: number, private index: number = 0) {
        super(x,y);
    }
    public width = 0;
    public height = 0;

    Update(): void {
            this.y -= 2;
            if (this.age >= 33) this.isActive = false;
        
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["texts"][0][this.index],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}