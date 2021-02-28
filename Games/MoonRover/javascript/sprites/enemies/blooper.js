class EnemyBlooper extends Enemy {
    maxHp = 5;
    direction = 1;
    timer = 0;
    aimTimer = 0;
    reloadTimer = 0;

    Initialize() {
        this.direction = (Math.random() > 0.5 ? -1 : 1);
    }

    Update() {
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();

        // find platforms above and below
        let platformYs = borders.filter(a => (a.x1 <= this.x && a.x2 >= this.x) || a instanceof Floor || a instanceof Ceiling).map(a => a.y);
        let floorBound = Math.min(...platformYs.filter(y => y > this.y));
        let ceilBound = Math.max(...platformYs.filter(y => y < this.y));
        let targetY = (floorBound + ceilBound) / 2;
        this.dy += (this.y > targetY ? -1 : 1) * 0.02;
        
        this.timer++;
        if (this.timer > 6 * 60) {
            this.timer = 0;
            this.direction *= -1;
            this.dx += 0.4 * this.direction;
        }

        if (Math.abs(this.dx) > 3) {
            this.dx *= 0.98;
        }

        this.reloadTimer++;
        let playerDistSq = (this.x - player.x)**2 + (this.y - player.y)**2;
        if (playerDistSq < 400**2) {
            this.aimTimer++; 
            this.frame += 3;
            if (this.aimTimer > 60 && this.reloadTimer > 60*3) {
                this.reloadTimer = 0;
                this.Lunge();
            }
        } else {
            this.aimTimer = 0;
        }
    }

    Lunge() {
        let theta = Math.atan2(player.y - this.y, player.x - this.x);
        this.dx += 5 * Math.cos(theta);
        this.dy += 5 * Math.sin(theta);
    }

    GetFrameData() {
        return {
            tileset: tileset.limebot,
            frame: this.AnimateByFrame(tileset.limebot),
            xFlip: false,
        };
    }
}