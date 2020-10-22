class EnemyGoomba extends Enemy {
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
        let speed = 1;
        this.dx = this.direction * speed;
        this.SharedEnemyUpdate();
    }
}