class Tile {
    constructor(image, x,y,width,height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Draw(context, targetX, targetY, scale) {
        if (!scale) scale = 1;
        let dw = this.width*scale;
        let dh = this.height*scale;
        context.drawImage(this.image, 
            this.x, this.y, this.width, this.height,
            targetX, targetY, dw, dh);
    }

    //TODO recolor
}