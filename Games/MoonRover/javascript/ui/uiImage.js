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

    Draw() {
        ctx.drawImage(this.image, this.x, this.y, this.image.width * this.scale, this.image.height * this.scale)
        if (this.isSilhoutte) {
            ctx.globalCompositeOperation = "xor";
            ctx.drawImage(this.image, this.x, this.y);
            ctx.globalCompositeOperation = "source-over";
        }
    }


}