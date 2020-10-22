class EnemyWisper extends Enemy {
    Update() {
        this.dy += 0.05 * Math.sin(this.frame / 20);
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