class EnemyHopper extends Enemy {
    maxHp = 5;
    direction = 1;
    state = 0;
    states = {
        "patrol": 0,
        "aiming": 1,
        "leaping": 2,
        "landing": 3,
    }
    timer = 0;

    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        let ground = touchedBorders.find(x => x instanceof Platform);
        let isTouchingFloor = (ground || touchedBorders.some(x => x instanceof Floor))

        if (touchedBorders.some(x => x instanceof LeftWall)) {
            this.direction = 1;
        } else if (touchedBorders.some(x => x instanceof RightWall)) {
            this.direction = -1;
        } else if (ground) {
            if (this.x <= ground.x1 + 5) this.direction = 1;
            if (this.x >= ground.x2 - 5) this.direction = -1;
        }
        let speed = 1;

        let playerDistSq = (this.x - player.x)**2 + (this.y - player.y)**2;
        if (this.state === this.states.patrol) {
            this.dx = this.direction * speed;
            if (playerDistSq < 600**2) {
                this.state = this.states.aiming;
                this.timer = 0;
            }
        } else if (this.state === this.states.aiming) {
            if (isTouchingFloor) this.timer++;
            this.dx *= 0.95;
            if (this.timer > 60) {
                this.state = this.states.leaping;
                // HERE WE GO!
                let leapTheta = Math.atan2(player.y - this.y, player.x - this.x);
                let jumpForce = 7;
                this.dy = -2 - Math.abs(jumpForce * Math.sin(leapTheta));
                this.dx = jumpForce * Math.cos(leapTheta);
                this.timer = 0;
            }
        } else if (this.state === this.states.leaping) {
            this.timer++;
            if (this.timer > 5 && isTouchingFloor) {
                this.timer = 0;
                this.state = this.states.landing;
            }
        } else if (this.state === this.states.landing) {
            this.dx *= 0.95;
            this.state = this.states.patrol;
        }
    }

    GetFrameData() {
        let isFacingRight = this.direction > 0;
        if (this.state !== this.states.patrol) {
            isFacingRight = player.x > this.x;
        }
        return {
            tileset: tileset.tealbot,
            frame: this.AnimateByFrame(tileset.tealbot),
            xFlip: isFacingRight,
        };
    }
}