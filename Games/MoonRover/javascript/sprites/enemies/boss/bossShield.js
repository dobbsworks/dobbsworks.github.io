
class BossShield extends BossPartBase {
    color = "#060";
    maxHp = 3;
    shieldTimer = 200;
    projection = null;

    Update() {
        this.shieldTimer++;
        this.BossPartUpdate();
        if (this.projection) {
            this.projection.x = this.x;
            this.projection.y = this.y;
        }
        if (this.shieldTimer > 300) {
            this.shieldTimer -= 300;
            this.CreateProjection();
        }
    }

    CreateProjection() {
        this.projection = new BossShieldProjection(this.x, this.y);
        sprites.push(this.projection);
    }

    OnDeath() {
        if (this.projection) this.projection.isActive = false;
    }

    GetFrameData() {
        return {
            tileset: tileset.limecore,
            frame: 0,
            xFlip: this.direction > 0,
        };
    }
}

class BossShieldProjection extends Enemy {
    color = "#0604";
    maxHp = Infinity;
    timer = 0;

    Update() {
        this.timer++;
        if (this.timer < 20) {
            this.radius *= 1.05;
        }
        if (this.timer > 200) {
            this.radius /= 1.05;
        }
        if (this.radius < 30) {
            this.isActive = false;
        }
    }
}
