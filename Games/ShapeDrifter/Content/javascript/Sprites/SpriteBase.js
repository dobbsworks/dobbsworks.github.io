function SpriteBase(x, y) {
    this.active = true;

    this.x = x;
    this.y = y;
    this.height = 0;
    this.width = 0;

    this.dx = 0;
    this.dy = 0;

    this.shadowColor = "white";
    this.shadowBlur = 0;

    this.executeRules = function () { };

    this.prepareDraw = function () {
        gameViewContext.shadowBlur = this.shadowBlur;
        gameViewContext.shadowColor = this.shadowColor;
    }

    this.draw = function () {
        if (!this.active) return;
    }

    this.kill = function () {
        if (this.onKill) this.onKill();
        this.active = false;
    }

    this.delete = function () {
        sprites.splice(sprites.indexOf(this), 1);
    }

    this.getIndex = function () {
        return sprites.indexOf(this);
    }

    this.getTop = function () { return this.y - this.height / 2; }
    this.getBottom = function () { return this.y + this.height / 2; }
    this.getLeft = function () { return this.x - this.width / 2; }
    this.getRight = function () { return this.x + this.width / 2; }
    this.setTop = function (y) { this.y = y + this.height / 2; }
    this.setBottom = function (y) { this.y = y - this.height / 2; }
    this.setLeft = function (x) { this.x = x + this.width / 2; }
    this.setRight = function (x) { this.x = x - this.width / 2; }
}