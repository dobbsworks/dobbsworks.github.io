class UiImage extends UIElement {

    constructor(image, x, y) {
        super();
        this.targetX = x;
        this.targetY = y;
        this.x = x;
        this.y = y;
        this.image = image;
    }

    isSilhoutte = false;
    scale = 1;
    index = 0;
    animationSpeed = 1;

    Draw() {
        this.DrawTileOrImage();
        if (this.isSilhoutte) {
            ctx.globalCompositeOperation = "xor";
            this.DrawTileOrImage();
            ctx.globalCompositeOperation = "source-over";
        }
        ctx.filter = "none";
    }

    DrawTileOrImage() {
        if (this.image.length) {
            this.image[Math.floor(this.index)].Draw(ctx, this.x, this.y, this.scale);
            this.index += this.animationSpeed;
            if (this.index >= this.image.length) this.index = 0;
        } else if (this.image instanceof Tile) {
            this.image.Draw(ctx, this.x, this.y, this.scale);
        } else {
            ctx.drawImage(this.image, this.x, this.y, this.image.width * this.scale, this.image.height * this.scale);
        }
    }


}