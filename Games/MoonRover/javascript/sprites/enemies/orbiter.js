class EnemyOrbiter extends Enemy {
    maxHp = 10;
    direction = 1;
    timer = 0;
    
    state = 0;
    states = {
        idle: 0,
        orbiting: 1,
        aiming: 2,
        lunging: 3
    }


    Update() {
        this.UpdatePosition();

        if (this.state === this.states.idle) {
            this.dx *= 0.95;
            this.dy *= 0.95;
            let playerDistSq = (this.x - player.x)**2 + (this.y - player.y)**2;
            if (playerDistSq < 700**2) {
                this.state = this.states.orbiting;
            }
        } else if (this.state === this.states.orbiting) {
            this.timer++;
            let targetOrbit = 400;
            let theta = Math.atan2(-player.y + this.y, -player.x + this.x);
            theta += 0.03; // target slightly clockwise of current position
            
            let targetX = player.x + targetOrbit * Math.cos(theta);
            let targetY = player.y + targetOrbit * Math.sin(theta);
            let deltaX = targetX - this.x;
            let deltaY = targetY - this.y;

            this.dx *= 0.99;
            this.dy *= 0.99;

            this.dx += deltaX / 200;
            this.dy += deltaY / 200;

            let maxSpeed = 5;
            this.dx = Math.min(Math.max(this.dx, -maxSpeed), maxSpeed);
            this.dy = Math.min(Math.max(this.dy, -maxSpeed), maxSpeed);

            if (this.timer > 60 * 8) {
                this.timer = 0;
                this.state = this.states.aiming;
            }
        } else if (this.state === this.states.aiming) {
            this.timer++;
            this.frame += 2;
            this.dx *= 0.9;
            this.dy *= 0.9;
            if (this.timer > 60) {
                this.timer = 0;
                this.state = this.states.lunging;
                this.Lunge();
            }
        } else if (this.state === this.states.lunging) {
            this.timer++;
            if (this.timer > 60 * 2) {
                this.state = this.states.idle;
            }
        }
    }

    Lunge() {
        let theta = Math.atan2(player.y - this.y, player.x - this.x);
        this.dx += 7 * Math.cos(theta);
        this.dy += 7 * Math.sin(theta);
    }


    GetFrameData() {
        return {
            tileset: tileset.cyanbot,
            frame: this.AnimateByFrame(tileset.cyanbot),
            xFlip: false,
        };
    }
}