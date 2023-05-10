class Camera {
    constructor(
        public canvas: HTMLCanvasElement
    ) {
        this.ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }

    public ctx: CanvasRenderingContext2D;
    public x: number = 0;
    public y: number = 0;
    public prevX: number = 0;
    public prevY: number = 0;
    public targetX = 0;
    public targetY = 0;
    public maxX: number = 0;
    public maxY: number = 0;
    public minX: number = 0;
    public minY: number = 0;
    public scale: number = 1;
    public targetScale: number = 1;


    public Update(): void {
        this.prevX = this.x;
        this.prevY = this.y;

        if (this.targetScale < 1) this.targetScale = 1;
        if (this.targetScale > 8) this.targetScale = 8;
        if (this.scale != this.targetScale) {
            if (Math.abs(this.scale - this.targetScale) < 0.03) this.scale = this.targetScale;
            else this.scale += (this.targetScale - this.scale) * 0.01;
        }

        this.x = this.targetX;
        this.y = this.targetY;
    }


    public SnapCamera(): void {
        this.x = this.targetX;
        this.y = this.targetY;
    }

    // public GetLeftCameraEdge(): number {
    //     return this.targetX - this.canvas.width / 2 / this.scale;
    // }
    // public GetRightCameraEdge(): number {
    //     return this.targetX + this.canvas.width / 2 / this.scale;
    // }
    // public GetTopCameraEdge(): number {
    //     return this.targetY - this.canvas.height / 2 / this.scale;
    // }
    // public GetBottomCameraEdge(): number {
    //     return this.targetY + this.canvas.height / 2 / this.scale;
    // }

    public Clear(): void {
        this.ctx.save();
        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}
