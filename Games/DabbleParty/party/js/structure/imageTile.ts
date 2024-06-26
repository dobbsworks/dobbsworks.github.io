class ImageTile {
    constructor(
        public src: HTMLImageElement | HTMLCanvasElement,
        public xSrc: number,
        public ySrc: number,
        public width: number,
        public height: number,
        public tileMap: any
    ) { }

    // Image tile represents a rectangular slice of a larger image file

    public yOffset: number = 0;
    public xOffset: number = 0;

    Draw(camera: Camera,
        gameX: number, gameY: number, 
        xScale: number, yScale: number,
        xFlip: boolean, yFlip: boolean,
        rotation: number, scrollSpeed: number = 1
        ) {

        let ctx = camera.ctx;

        // destY += this.yOffset;
        // destX += this.xOffset;

        // first move the center of the canvas to the center of the object to be drawn
        // next, scale and rotate
        let scale = camera.scale;
        if (scrollSpeed != 1) {
            scale = 1 + (camera.scale - 1) * scrollSpeed;
        }
        ctx.translate(camera.canvas.width / 2 - (-gameX + camera.x) * camera.scale * scrollSpeed, camera.canvas.height / 2 - (-gameY + camera.y) * camera.scale * scrollSpeed);
        ctx.scale(xScale * scale * (xFlip ? -1 : 1), yScale * scale * (yFlip ? -1 : 1));
        ctx.rotate(rotation);


        // finally, draw and restore
        ctx.drawImage(this.src, this.xSrc + 0.1, this.ySrc + 0.1, this.width - 0.2, this.height - 0.2,
            -this.width/2, -this.height/2, this.width, this.height);
        ctx.setTransform(1,0,0,1,0,0);
    }

    DrawToScreen(ctx: CanvasRenderingContext2D, canvasX: number, canvasY: number, scale: number = 4) {
        canvasY += this.yOffset;
        canvasX += this.xOffset;
        ctx.drawImage(this.src, this.xSrc + 0.1, this.ySrc + 0.1, this.width - 0.2, this.height - 0.2,
            canvasX, canvasY, this.width * scale, this.height * scale);
    }

}