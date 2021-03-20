class EnemyFloater extends EnemyBlooper {
    maxHp = 8;
    vertAccel = 0.03;
    horizAccel = 0.8;
    inertia = 0.98;

    Lunge() {
        let theta = Math.atan2(player.y - this.y, player.x - this.x);
        let bulletSpeed = 4;
        let bullet = new EnemyBullet(this.x, this.y);
        bullet.dx = bulletSpeed * Math.cos(theta);
        bullet.dy = bulletSpeed * Math.sin(theta);
        sprites.push(bullet);
    }

    GetFrameData() {
        return {
            tileset: tileset.yellowbot,
            frame: this.AnimateByFrame(tileset.yellowbot),
            xFlip: false,
        };
    }
}