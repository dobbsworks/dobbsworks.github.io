class PlayerShieldPellet extends PlayerBullet {
    radius = 10;
    damage = 1;
    knockback = 5;

    theta = 0;
    playerDist = 0;

    Initialize() {
        let deltaX = player.x - this.x;
        let deltaY = player.y - this.y;
        this.theta = Math.atan2(deltaY, deltaX);
        this.playerDist = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    }

    Update() {
        this.CheckExpiration();
        this.theta += 0.04;
        this.x = player.x + this.playerDist * Math.cos(this.theta);
        this.y = player.y + this.playerDist * Math.sin(this.theta);
        this.CheckForEnemyHits(true);
    }

    GetFrameData() {
        let timeLeft = this.duration - this.timer;
        let isRendered = timeLeft > 60 || timeLeft % 2;
        if (!isRendered) return null;
        return {
            tileset: tileset.pellets,
            frame: 2,
            xFlip: false,
        };
    }
}