class Hat extends Sprite {

    constructor(tileX, tileY) {
        super(
            tileX * cellWidth,
            tileY * cellHeight,
            images.art);
        this.tile = 2;
        this.tileX = tileX;
        this.tileY = tileY;
    }

    framesPerMove = 20;

    Update() {
        this.HandleMovement();

        if (keyState.action1) {
            let existingSnowman = sprites.filter(a => a instanceof Snowman);
            if (!existingSnowman.some(a => a.tileX === this.tileX && a.tileY === this.tileY)) {
                sprites.push(new Snowman(this.tileX, this.tileY));
            }
        }
    }

    HandleMovement() {
        let targetX = this.tileX * cellWidth;
        let targetY = this.tileY * cellHeight;
        if (targetX === this.x && targetY === this.y) {
            //TODO bound-check
            if (keyState.up) this.tileY -= 1;
            if (keyState.down) this.tileY += 1;
            if (keyState.left) this.tileX -= 1;
            if (keyState.right) this.tileX += 1;
        }
        targetX = this.tileX * cellWidth;
        targetY = this.tileY * cellHeight;

        if (targetX !== this.x) {
            let moveSpeed = cellWidth / this.framesPerMove;
            if (Math.abs(this.x - targetX) < moveSpeed) {
                this.x = targetX;
            } else {
                this.x += moveSpeed * (this.x < targetX ? 1 : -1);
            }
        }
        if (targetY !== this.y) {
            let moveSpeed = cellHeight / this.framesPerMove;
            if (Math.abs(this.y - targetY) < moveSpeed) {
                this.y = targetY;
            } else {
                this.y += moveSpeed * (this.y < targetY ? 1 : -1);
            }
        }
    }

}