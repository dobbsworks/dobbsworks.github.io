class EnemyBullet extends Enemy {
    color = "#F00";
    radius = 5;
    Update() {
        //this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.length > 0) {
            this.isActive = false;
        }
    }

    GetFrameData() {
        return {
            tileset: tileset.pellets,
            frame: 1,
            xFlip: false,
        };
    }
}