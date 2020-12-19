class EnemyGoombud extends Enemy {
    direction = 1;
    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        let ground = touchedBorders.find(x => x instanceof Platform);

        if (touchedBorders.some(x => x instanceof LeftWall)) {
            this.direction = 1;
        } else if (touchedBorders.some(x => x instanceof RightWall)) {
            this.direction = -1;
        } else if (ground) {
            if (this.x <= ground.x1 + 5) this.direction = 1;
            if (this.x >= ground.x2 - 5) this.direction = -1;
        }
        let speed = 1;
        this.dx = this.direction * speed;
    }
}