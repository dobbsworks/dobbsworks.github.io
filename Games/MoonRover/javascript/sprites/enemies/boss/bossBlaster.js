
class BossBlaster extends BossPartBase {
    color = "#609";
    maxHp = 3;
    timer = 0;

    Update() {
        this.timer++;
        this.BossPartUpdate();
        if (this.timer > 300) {
            this.timer = 0;
            this.FireBullet();
        }
    }

    FireBullet() {
        let bullet = new EnemyBullet(this.x, this.y);
        sprites.push(bullet);
        
        bullet.radius = 10;
        let bulletSpeed = 3;
        let playerDirection = Math.atan2(player.y - this.y, player.x - this.x);
        bullet.dx = bulletSpeed * Math.cos(playerDirection);
        bullet.dy = bulletSpeed * Math.sin(playerDirection);
    }

    GetFrameData() {
        return {
            tileset: tileset.magentacore,
            frame: 0,
            xFlip: this.direction > 0,
        };
    }
}