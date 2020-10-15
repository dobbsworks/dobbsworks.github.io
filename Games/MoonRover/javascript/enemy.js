class Enemy extends Sprite {
    direction = 1;
    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.some(x => x instanceof LeftWall)) {
            this.direction = 1;
        }
        if (touchedBorders.some(x => x instanceof RightWall)) {
            this.direction = -1;
        }
        this.dx = this.direction * 2;
    }
}