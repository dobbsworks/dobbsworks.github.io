class Rect extends Sprite {
    constructor(color, centerX, centerY, width, height) {
        super(color, centerX, centerY);
        this.xScale = width;
        this.yScale = height;
    }
}
