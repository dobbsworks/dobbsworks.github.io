class StaticText extends Sprite {
    constructor(text, scale, color, outline, x, y) {
        super("#0000", x, y);
        this.scale = scale;
        this.text = text;
        this.color = color;
        this.outline = outline;
    }

    lineWidth = 4;

    Draw(ctx, frameNum) {
        ctx.save();
        ctx.transform(1, 0, 0, 1, this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.outline;
        ctx.font = this.scale.toFixed(1) + "px Grobold";
        ctx.textBaseline = "middle";

        ctx.lineWidth = this.lineWidth;
        ctx.textAlign = "center";
        ctx.strokeText(this.text, 0, 0);
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
}
