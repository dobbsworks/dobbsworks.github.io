function Cannonblast(x, y, dir) {
    ParticleEffectBase.call(this, x, y);
    this.dir = dir;

    switch (dir) {
        case direction.right:
            this.imageSource = document.getElementById("Cannonblast");
            this.width = 8;
            this.height = 16;
            break;
        case direction.left:
            this.imageSource = document.getElementById("Cannonblast-left");
            this.width = 8;
            this.height = 16;
            break;
        case direction.down:
            this.imageSource = document.getElementById("Cannonblast-down");
            this.width = 16;
            this.height = 8;
            break;
        case direction.up:
            this.imageSource = document.getElementById("Cannonblast-up");
            this.width = 16;
            this.height = 8;
            break;
    }

    this.animationCount = 0;

    this.draw = function () {
        var x = parseInt(this.animationCount / 2) * this.width;
        this.camera.drawImage(this.imageSource, x, 0, this.width, this.height, this.getLeft(), this.getTop(), this.width, this.height);
        this.animationCount++;
        if (this.animationCount > 16) this.kill();
    }
}
Cannonblast.prototype = new ParticleEffectBase();
Cannonblast.prototype.constructor = Cannonblast;