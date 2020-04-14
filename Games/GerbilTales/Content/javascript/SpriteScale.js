function Scale(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.originalY = this.y;
    this.targetDy = 0;
    this.minY = 90;
    this.sumDistance = 0;

    this.width = width;
    this.height = height;

    this.weight = 5;
    this.ridingWeight = 0;
    this.paired = null;

    this.color = new Color(128, 128, 160, 1.0);
    this.borderColor = new Color(100, 100, 100, 1.0);

    this.executeRules = function () {
        if (this.sumDistance == 0) this.sumDistance = this.y + this.paired.y;
        if (this.paired && this.paired.x < this.x) return;

        var riders = this.getCumulativeRiders();
        var sumWeight = 0;
        for (var i = 0; i < riders.length; i++) sumWeight += riders[i].weight;

        var pairRiders = this.paired.getCumulativeRiders();
        var pairSumWeight = 0;
        for (var i = 0; i < pairRiders.length; i++) pairSumWeight += pairRiders[i].weight;

        if (riders.length > 0 || pairRiders.length > 0) {
            this.paired.cameraFocus = true;
            this.cameraFocus = true;
            this.cameraCounter = 50;
        }
        this.cameraCounter -= 1;
        if (this.cameraCounter < 0) {
            this.paired.cameraFocus = false;
            this.cameraFocus = false;
        }

        this.ridingWeight = sumWeight;
        this.targetDy = (sumWeight - pairSumWeight) / 10;
        var rewinding = false;
        if (this.targetDy == 0 && this.ridingWeight == 0) {
            this.targetDy = (this.originalY - this.y) / 5;
            if (Math.abs(this.targetDy) > .25) this.targetDy = this.targetDy > 0 ? .25 : -.25;
            rewinding = true;
        }
        this.dy = (4 * this.dy + this.targetDy) / 5;
        var dy = this.dy;

        this.blockMovement(true);
        this.paired.blockMovement(true);
        if (rewinding && dy && this.dy == 0) this.dy = dy;

        this.y += this.dy;
        this.paired.y -= this.dy;
        for (var i = 0; i < riders.length; i++) riders[i].y += this.dy;
        for (var i = 0; i < pairRiders.length; i++) pairRiders[i].y -= this.dy;
        if (sumWeight >= pairSumWeight) this.paired.y = this.sumDistance - this.y;
        else this.y = this.sumDistance - this.paired.y;

        this.isStanding = true;
        this.paired.isStanding = true;
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }

        var drawX = this.x;
        var drawY = this.getTop() - 30;
        if (!this.paired || (this.paired && this.paired.x > this.x)) {
            while (drawY > this.minY) {
                this.camera.strokeRect(drawX - 6, drawY - 6, 12, 12);
                drawY -= 30;
            }
        }
        if (this.paired && this.paired.x > this.x) {
            drawX += (this.minY - drawY);
            drawY = this.minY;
            while (drawX < this.paired.x) {
                this.camera.strokeRect(drawX - 6, drawY - 6, 12, 12);
                drawX += 30;
            }
            drawY += (drawX - this.paired.x);
            drawX = this.paired.x;
            while (drawY < this.paired.getTop()) {
                this.camera.strokeRect(drawX - 6, drawY - 6, 12, 12);
                drawY += 30;
            }
        }

    }

    this.pair = function (sprite) {
        if (this.paired) this.paired.paired = null;
        this.paired = sprite;
        sprite.paired = this;
    }
}
Scale.prototype = new SpriteBase();
Scale.prototype.constructor = Scale;