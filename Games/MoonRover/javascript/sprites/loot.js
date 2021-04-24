class Loot extends Sprite {
    color = "#FFFF00";
    value = 1;
    radius = 20;
    isFloating = false;
    magnetTimer = 0;

    Initialize() {
        if (!this.isFloating) {
            let angle = Math.random() * Math.PI / 2
                + Math.PI / 4;
            let force = 2;
            this.dx = force * Math.cos(angle);
            this.dy = force * -Math.sin(angle);
            this.frame = Math.floor(Math.random() * 4 * tileset.coin.tiles.length);
        }
    }

    Update() {
        if (!this.isFloating) this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (this.magnetTimer > 0) {
            this.isFloating = false;
            let playerAngle = Math.atan2(player.y - this.y, player.x - this.x);
            let accel = 0.2;
            this.dx += accel * Math.cos(playerAngle);
            this.dy += accel * Math.sin(playerAngle);
            let isOnSemisolids = touchedBorders.some(x => x instanceof Platform);
            if (isOnSemisolids && player.y > this.y) {
                this.y++;
            }
            this.magnetTimer--;
        }
    }

    GetFrameData() {
        return {
            tileset: tileset.coin,
            frame: Math.floor(this.frame / 4) % tileset.coin.tiles.length,
            xFlip: false,
        };
    }
}