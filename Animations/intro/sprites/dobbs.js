class Dobbs extends Sprite {
    constructor(x, y) {
        super(images.dobbs, x, y);
    }

    scale = 10;
    Update(frameNum) {
        this.tile = Math.floor(frameNum / musicBeat) % 2 ? 1 : 2;
        this.x += Math.cos(frameNum / 50);

        if (this.isJump) {
            this.tile = 3;
            this.y += this.dy;
            this.dy += 0.2;
            if (this.y > this.initialY) {
                this.y = this.initialY;
                this.dy = 0;
                this.isJump = false;
            }
        }
        if (this.isFly && !this.isFall) {
            this.tile = 11;
            this.rotation += 0.1;
            this.y -= 15;
            if (this.y < -400) {
                this.isFall = true;
                this.scale *= 1.5;
            }
        }
        if (this.isFall) {
            this.tile = 11;
            this.y += 10;
            this.rotation += 0.1;
            if (this.y > 300) this.isActive = false;
        }
    }

    Jump() {
        this.isJump = true;
        this.dy = -8;
    }

    Fly() {
        this.isFly = true;
    }
}
