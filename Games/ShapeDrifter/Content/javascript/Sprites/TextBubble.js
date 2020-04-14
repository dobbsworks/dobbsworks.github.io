function TextBubble(x, y, text, showTail, delay) {
    SpriteBase.call(this, x, y);
    this.text = text;
    this.color = new Color(222, 222, 255, 1.0);
    this.textColor = new Color(30, 30, 50, 1.0);

    this.fontsize = 30;
    this.width = 250;
    this.height = 100;
    this.cornerRadius = 20;

    this.includeTail = showTail;

    this.timer = 0;
    this.delay = delay;

    this.executeRules = function () {
        this.timer++;
        if (this.timer > this.delay) {
            var ratio = this.timer > 100 ? 0.9 : 0.98;
            this.color.a *= ratio;
            this.textColor.a *= ratio;

            this.fontsize *= ratio;

            this.width *= ratio;
            this.height *= ratio;
            this.cornerRadius *= ratio;

            this.includeTail = false;
        }
        if (this.timer > this.delay + 40) this.active = false;
    }

    this.draw = function () {
        gameViewContext.font = this.fontsize + "px monospace";
        var width = gameViewContext.measureText(this.text).width;
        if (width > this.width + this.cornerRadius * 2) {
            this.width = width + this.cornerRadius * 2;
        }

        if (this.includeTail) {
            shapes.diamond.draw(this.x + this.width * 8 / 25, this.y + this.height / 2, this.cornerRadius, null, null, this.color, null); 3
        }
        shapes.roundedRectangle.draw(this.x, this.y, this.width, this.height, this.cornerRadius, null, null, this.color, null);
        gameViewContext.fillStyle = this.textColor.toString();
        gameViewContext.fillText(this.text, this.x - width / 2, this.y + 0.25 * this.fontsize);

    }
}
TextBubble.prototype = new SpriteBase();
TextBubble.prototype.constructor = TextBubble;