
class BossLaserCannon extends BossPartBase {
    color = "#06A";
    maxHp = 5;
    timer = 0;
    targetTime = 60 * 10;
    lockInTime = 60 * 7;
    bossWeapon = true;

    targetX = 0;
    targetY = 0;

    Update() {
        this.timer++;
        this.BossPartUpdate();

        if (this.timer < this.lockInTime) {
            let reticuleSpeed = 3;
            let theta = Math.atan2(player.y - this.targetY, player.x - this.targetX);
            this.targetX += reticuleSpeed * Math.cos(theta);
            this.targetY += reticuleSpeed * Math.sin(theta);
        }

        if (this.timer >= this.targetTime) {
            this.timer = 0;
            let bullet = new EnemyLaserCannonBullet(this.x, this.y);
            let bulletTheta = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            bullet.dx = 4 * Math.cos(bulletTheta);
            bullet.dy = 4 * Math.sin(bulletTheta);
            sprites.push(bullet);
        }
    }

    OnBeforeDraw() {
        let distantX = this.x + (this.targetX - this.x) * 100;
        let distantY = this.y + (this.targetY - this.y) * 100;

        let glowAmount = (this.timer - this.lockInTime) / (this.targetTime - this.lockInTime);
        if (glowAmount > 0) {
            let lineThickness = 1 + glowAmount * 2;
            ctx.strokeStyle = `rgba(255,255,255,${glowAmount})`;
            renderer.Line(this.x, this.y, distantX, distantY, lineThickness);
        }

        let chargeAmount = this.timer / this.targetTime;
        ctx.strokeStyle = `rgba(0,192,255,${chargeAmount})`;
        renderer.Line(this.x, this.y, distantX, distantY);
    }

    GetFrameData() {
        return {
            tileset: tileset.bluecore,
            frame: 0,
            xFlip: this.direction > 0,
        };
    }
}

class EnemyLaserCannonBullet extends EnemyBullet {
    color = "transparent";
    Update() {
        let updateCount = 20;
        for (let i=0; i<updateCount; i++) 
            EnemyBullet.prototype.Update.apply(this);
    }
}