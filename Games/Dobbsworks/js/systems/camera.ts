class Camera {
    constructor (
        public canvas: HTMLCanvasElement
    ) {
        this.ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }

    public ctx: CanvasRenderingContext2D;
    public x: number = 0;
    public y: number = 9999;
    public maxX: number = 0;
    public maxY: number = 0;
    public minX: number = 0;
    public minY: number = 0;
    public scale: number = 4;
    public target: Sprite|null = null;
    public targetScale: number = 4;
    public defaultScale: number = 4;

    public Update(): void {
        if (this.target) {
            this.x = this.target.xMid;
            this.y = this.target.yBottom - 12;
        }

        if (this.targetScale < 1) this.targetScale = 1;
        if (this.targetScale > 8) this.targetScale = 8;
        if (this.scale != this.targetScale) {
            if (Math.abs(this.scale - this.targetScale) < 0.03) this.scale = this.targetScale;
            else {
                if (editorHandler.isInEditMode) {
                    this.scale += (this.targetScale - this.scale) * 0.05;
                } else {
                    this.scale += (this.targetScale - this.scale) * 0.01;
                }
            }
        }

        if (currentMap) {
            let minScaleForY = camera.canvas.height / currentMap.mainLayer.GetMaxY();
            let minScaleForX = camera.canvas.width / currentMap.mainLayer.GetMaxX();
            let minScale = Math.max(minScaleForX, minScaleForY);
            if (this.targetScale < minScale) this.targetScale = minScale;
            if (this.scale < minScale) this.scale = minScale;

            this.maxX = currentMap.mainLayer.GetMaxX() - this.canvas.width / 2 / this.scale;
            this.maxY = currentMap.mainLayer.GetMaxY() - this.canvas.height / 2 / this.scale;
            if (this.x > this.maxX) this.x = this.maxX;
            if (this.y > this.maxY) this.y = this.maxY;
            
            this.minX = this.canvas.width / 2 / this.scale;
            this.minY = this.canvas.height / 2 / this.scale;
            if (this.x < this.minX) this.x = this.minX;
            if (this.y < this.minY) this.y = this.minY;
        }
    }

    public Clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}