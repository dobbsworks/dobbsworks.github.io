
class BossMissileLauncher extends BossPartBase {
    color = "#B90";
    maxHp = 3;
    timer = 0;
    bossWeapon = true;

    Update() {
        this.timer++;
        this.BossPartUpdate();
        if (this.timer > 600) {
            this.timer = 0;
            this.FireBullet();
        }
    }

    FireBullet() {
        let bullet = new BossMissile(this.x, this.y);
        sprites.push(bullet);
        
    }

    GetFrameData() {
        return {
            tileset: tileset.purplecore,
            frame: 0,
            xFlip: this.direction > 0,
        };
    }
}

class BossMissile extends Enemy {
    maxHp = 1;
    radius = 10;
    direction = 0;
    speed = 4;
    maxSpeed = 4;
    minSpeed = 1;
    loot = 0;

    Initialize() {
        this.direction = Math.atan2(player.y - this.y, player.x - this.x);
    }

    Update() {
        let playerDirection = Math.atan2(player.y - this.y, player.x - this.x);
        let directionDiff = playerDirection - this.direction;
        directionDiff %= (Math.PI*2);
        // directionDiff in [-2π,2π]

        if (directionDiff > Math.PI) directionDiff -= (Math.PI*2);
        if (directionDiff < -Math.PI) directionDiff += (Math.PI*2);

        this.direction += directionDiff/36;

        if (Math.abs(directionDiff) > Math.PI/12) {
            this.speed *= 0.99;
            if (this.speed < this.minSpeed) this.speed = this.minSpeed;
        } else {
            let missingSpeed = this.maxSpeed - this.speed;
            this.speed += missingSpeed * 0.01;
        }

        this.dx = this.speed * Math.cos(this.direction);
        this.dy = this.speed * Math.sin(this.direction);
        
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.length > 0) {
            this.isActive = false;
        }
    }

    OnTouchPlayer() {
        this.isActive = false;
    }
}