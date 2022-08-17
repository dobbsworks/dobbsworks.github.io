class DeadEnemy extends Sprite {
    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    frameData: FrameData|null = null;

    constructor(sourceSprite: Sprite) {
        super(sourceSprite.x, sourceSprite.y, sourceSprite.layer, []);
        this.width = sourceSprite.width;
        this.height = sourceSprite.height;
        this.frameData = <FrameData>sourceSprite.GetFrameData(0);
        this.frameData.yFlip = true;
        this.dx = Math.cos(sourceSprite.age + sourceSprite.layer.sprites.indexOf(sourceSprite)) / 2;
        this.dy = -1 - Math.cos(sourceSprite.age + sourceSprite.layer.sprites.indexOf(sourceSprite)) / 5;
    }
    
    Update(): void {
        this.ApplyGravity();
        this.MoveByVelocity();
        if (this.y > 9999) this.isActive = false;
    }

    GetFrameData(frameNum: number): FrameData {
        return this.frameData || {
            imageTile: tiles["snail"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}