class EnemyBullet extends Enemy {
    color = "#FF0055";
    radius = 5;
    hp = 1;

    Initialize() {
        sprites.push(new RadarPing(this, 200, false));
    }

    Update() {
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