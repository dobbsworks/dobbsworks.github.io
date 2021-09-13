class HoverCat extends Sprite {
    constructor(x, y) {
        super(images.dobbs, x, y);
        this.groundY = y;
        this.tile = 5;
    }

    scale = 2;
    direction = "right";
    targetTile = null;
    dy = 0;
    idleX = 1600;

    Update(frameNum) {
        let grav = 2;
        let speed = 12;
        if (!this.targetTile) {
            if (this.direction === "right") {
                pb.tiles.sort((a, b) => a.col - b.col);
            } else {
                pb.tiles.sort((a, b) => -a.col + b.col);
            }
            this.targetTile = pb.tiles.find(a => a.guessed && !a.revealed);
        }

        if (this.targetTile) {
            let targetX = this.targetTile.sprite.x + (this.direction === "right" ? -1 : 1) * 200;
            if (this.y === this.groundY) {
                // on ground
                let dirSign = targetX > this.x ? 1 : -1;
                this.x += speed * dirSign;
                if (Math.abs(targetX - this.x) <= speed) {
                    this.x = targetX;
                    this.Jump(this.targetTile.row);
                }
            } else if (this.x === targetX) {
                // in air, lined up with tile
                if (Math.abs(this.y - this.targetTile.sprite.y) < 250) {
                    pb.RevealTile(this.targetTile);
                    this.targetTile = null;
                }
            }
        } else {
            if (Math.abs(this.x) !== Math.abs(this.idleX) && this.y === this.groundY) {
                // need to move to side
                let targetX = (this.x < 0 ? -1 : 1) * this.idleX;
                this.direction = (this.x < targetX ? "right" : "left")
                let dirSign = targetX > this.x ? 1 : -1;
                this.x += speed * dirSign;
                if (Math.abs(targetX - this.x) <= speed) {
                    this.x = targetX;
                    this.direction = (targetX === this.idleX ? "left" : "right")
                }
            }
        }

        this.y += this.dy;
        if (this.y < this.groundY) {
            this.dy += grav;
        } else {
            this.y = this.groundY;
        }

        if (Math.abs(this.x) === this.idleX) {
            this.tile = 5;
        } else if (this.y !== this.groundY) {
            this.tile = 8
        } else {

            this.tile = Math.floor(frameNum / 10) % 2 === 0 ? 6 : 7
        }
        if (this.direction === "left") this.tile += 5;

        // this.tile = Math.floor(frameNum / musicBeat*2) % 6;
        // this.x -= 4;
        // if (this.x < -1000) this.isActive = false;
    }

    Jump(targetRowNum) {
        this.dy = [-60, -50, -35, -10][targetRowNum];
    }

    //jump 60, 50, 35, 0
}
