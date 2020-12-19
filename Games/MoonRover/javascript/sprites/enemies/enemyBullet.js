class EnemyBullet extends Enemy {
    color = "#F00";
    radius = 5;
    Update() {
        //this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.some(x => x instanceof LeftWall)) {
            this.direction = 1;
        }
        if (touchedBorders.some(x => x instanceof RightWall)) {
            this.direction = -1;
        }
        if (touchedBorders.length > 0) {
            this.isActive = false;
        }
    }
}