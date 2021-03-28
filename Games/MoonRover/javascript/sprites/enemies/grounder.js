class EnemyGrounder extends Enemy {
    maxHp = 7;
    direction = 1;
    aggro = false;
    jumpCharge = 0;

    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders(null, 1);
        let ground = touchedBorders.find(x => x instanceof Platform);
        let floor = touchedBorders.find(x => x instanceof Floor);

        let playerDistSq = (this.x - player.x) ** 2 + (this.y - player.y) ** 2;
        if (playerDistSq < 400 ** 2) {
            // player got close, switch to aggro mode
            this.aggro = true;
        }

        let isOnGround = ground || floor;
        if (isOnGround) this.jumpCharge++;
        if (this.aggro) {
            this.direction = (this.x > player.x ? -1 : 1);
            let playerHeightDist = this.y - player.y;
            if (playerHeightDist > 0 && isOnGround && this.jumpCharge > 20) {
                // jump
                this.jumpCharge = 0;
                let jumpHeight = playerHeightDist / 60;
                if (jumpHeight < 4) jumpHeight = 4;
                if (jumpHeight > 10) jumpHeight = 10;
                this.dy -= jumpHeight;
            }
        } else {
            if (touchedBorders.some(x => x instanceof LeftWall)) {
                this.direction = 1;
            } else if (touchedBorders.some(x => x instanceof RightWall)) {
                this.direction = -1;
            } else if (ground) {
                if (this.x <= ground.x1 + 80) this.direction = 1;
                if (this.x >= ground.x2 - 80) this.direction = -1;
            }
        }

        let accel = this.aggro ? 0.06 : 0.02;
        if (isOnGround) this.dx += this.direction * accel;

        let maxSpeed = 8;
        if (Math.abs(this.dx) > maxSpeed) {
            this.dx *= 0.95;
        } else {
            if (isOnGround) this.dx *= 0.99;
        }
    }

    GetFrameData() {
        return {
            tileset: tileset.bluebot,
            frame: this.AnimateByFrame(tileset.bluebot),
            xFlip: this.direction > 0,
        };
    }
}