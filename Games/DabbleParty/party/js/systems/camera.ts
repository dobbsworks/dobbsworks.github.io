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

        if (this.targetScale < 0.421875) this.targetScale = 0.421875;
        if (this.targetScale > 8) this.targetScale = 8;

        if (this.scale != this.targetScale) {
            //this.scale = this.targetScale;
            // this.x = this.targetX;
            // this.y = this.targetY;
            if (Math.abs(this.scale - this.targetScale) < 0.001) this.scale = this.targetScale;
            else this.scale += (this.targetScale - this.scale) * 0.1;
        }

        if (this.x != this.targetX) {
            if (Math.abs(this.x - this.targetX) < 0.001) this.x = this.targetX;
            else this.x += (this.targetX - this.x) * 0.1;
        }
        if (this.y != this.targetY) {
            if (Math.abs(this.y - this.targetY) < 0.001) this.y = this.targetY;
            else this.y += (this.targetY - this.y) * 0.1;
        }
    }


    public SnapCamera(): void {
        this.x = this.targetX;
        this.y = this.targetY;
    }

    public GameCoordToCanvas(gameX: number, gameY: number): {canvasX: number, canvasY: number} {
        let x = camera.canvas.width / 2 - (-gameX + camera.x) * camera.scale;
        let y = camera.canvas.height / 2 - (-gameY + camera.y) * camera.scale;
        return {canvasX: x, canvasY: y};
    }

    public GetLeftCameraEdge(): number {
        return this.targetX - this.canvas.width / 2 / this.scale;
    }
    public SetLeftCameraEdge(value: number): void {
        this.targetX = value + this.canvas.width / 2 / this.scale;
    }
    public GetRightCameraEdge(): number {
        return this.targetX + this.canvas.width / 2 / this.scale;
    }
    public SetRightCameraEdge(value: number): void {
        this.targetX = value - this.canvas.width / 2 / this.scale;
    }
    public GetTopCameraEdge(): number {
        return this.targetY - this.canvas.height / 2 / this.scale;
    }
    public SetTopCameraEdge(value: number): void {
        this.targetY = value + this.canvas.height / 2 / this.scale;
    }
    public GetBottomCameraEdge(): number {
        return this.targetY + this.canvas.height / 2 / this.scale;
    }
    public SetBottomCameraEdge(value: number): void {
        this.targetY = value - this.canvas.height / 2 / this.scale;
    }

    public Clear(): void {
        this.ctx.save();
        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}
