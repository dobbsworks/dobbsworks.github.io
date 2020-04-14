function Zone(x, y, width, height) {
    SpriteBase.call(this, x + width/2, y + height/2);
    this.width = width;
    this.height = height;
        
    this.color = new Color(100, 128, 128, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.inside = [];
    this.needed = 3;
    this.power = 0;

    this.executeRules = function () {
        this.inside = [];
        for (var i = 0; i < sprites.length; i++) {
            if (this.doesOverlapSprite(sprites[i]) && this != sprites[i]) {
                this.inside.push(sprites[i]);
            }
        }

        var powerDelta = this.inside.length / this.needed * 0.01;
        this.power += powerDelta;
        if (this.power > this.inside.length / this.needed) this.power = this.inside.length / this.needed;
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        if (this.inside.length) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.centerText(this.inside.length + "/" + this.needed, this.x, this.getTop() - 10);
        }

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
Zone.prototype = new SpriteBase();
Zone.prototype.constructor = Zone;