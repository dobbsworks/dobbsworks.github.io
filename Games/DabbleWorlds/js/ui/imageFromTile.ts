class ImageFromTile extends UIElement {

    zoom: number = 4;
    xOffset: number = 0;
    yOffset: number = 0;

    constructor(x: number, y: number, public width: number, public height: number, public imageTile: ImageTile) {
        super(x, y);
    }

    IsMouseOver(): boolean {
        return mouseHandler.GetCanvasMousePixel().xPixel >= this.x && mouseHandler.GetCanvasMousePixel().xPixel <= this.x + this.width &&
            mouseHandler.GetCanvasMousePixel().yPixel >= this.y && mouseHandler.GetCanvasMousePixel().yPixel <= this.y + this.height;
    }

    GetMouseOverElement(): UIElement | null { return null; }

    Update(): void { }

    Draw(ctx: CanvasRenderingContext2D): void {
        let zoom = this.zoom;
        //this.imageTile.Draw(ctx, this.x, this.y, 4, false, false);
        let fullImageWidth = this.imageTile.width * zoom;
        let widthClipScale = Math.min(1, this.width / fullImageWidth);
        let fullImageHeight = this.imageTile.height * zoom;
        let heightClipScale = Math.min(1, this.height / fullImageHeight);

        let drawWidth = Math.min(this.width, fullImageWidth);
        let drawHeight = Math.min(this.height, fullImageHeight);
        let offsetX = (this.width - drawWidth) / 2 + this.xOffset;
        let offsetY = (this.height - drawHeight) / 2 + this.yOffset;

        try {
            ctx.drawImage(this.imageTile.src, this.imageTile.xSrc + 0.1, this.imageTile.ySrc + 0.1,
                (this.imageTile.width - 0.2) * widthClipScale,
                (this.imageTile.height - 0.2) * heightClipScale,
                this.x + offsetX, this.y + offsetY,
                drawWidth, drawHeight);
        } catch (e) {
            console.error(this.imageTile.src, e)
        }
    }
}