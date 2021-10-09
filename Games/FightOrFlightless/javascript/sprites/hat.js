class Hat extends Sprite {

    constructor(tileX, tileY) {
        super(
            tileX * cellWidth,
            tileY * cellHeight,
            images.art);
        this.tile = 2;
        this.tileX = tileX;
        this.tileY = tileY;
    }

    framesPerMove = 20;
    drawOrder = 100;

    Update() {
        this.HandleMovement();

        let isGroundAtLocation = sprites.
            filter(a => a instanceof GroundTile).
            some(a => a.tileX === this.tileX && a.tileY === this.tileY);

        let isBlockingSpriteAtLocation = sprites.
            filter(a => a.blocksBuild).
            some(a => a.tileX === this.tileX && a.tileY === this.tileY);

        if (keyState.action1) {
            if (!isBlockingSpriteAtLocation && isGroundAtLocation) {
                let cost = 100;
                if (money >= cost) {
                    money -= cost;
                    sprites.push(new Snowman(this.tileX, this.tileY));
                }
            }
        } else if (keyState.action2) {
            if (!isBlockingSpriteAtLocation && isGroundAtLocation) {
                let newMesh = new NavMesh([{ tileX: this.tileX, tileY: this.tileY }]);
                if (newMesh.mesh.some(a => a.critical && a.distance)) {
                    let cost = 20;
                    if (money >= cost) {
                        money -= cost;
                        sprites.push(new SnowWall(this.tileX, this.tileY));
                        navMesh = newMesh;
                    }
                }
            }
        }

        if (this.age % 10 === 0) {
            let snowBank = sprites.
                find(a => a instanceof SnowBank && a.tileX === this.tileX && a.tileY === this.tileY);
            if (snowBank && snowBank.money > 0) {
                // grab money
                let grabRate = 1;
                let moneyGrabbed = Math.min(grabRate, snowBank.money);
                snowBank.money -= moneyGrabbed;
                money += moneyGrabbed;
            }
        }

    }

    HandleMovement() {
        let targetX = this.tileX * cellWidth;
        let targetY = this.tileY * cellHeight;
        if (targetX === this.x && targetY === this.y) {
            //TODO bound-check
            if (keyState.up) this.tileY -= 1;
            if (keyState.down) this.tileY += 1;
            if (keyState.left) this.tileX -= 1;
            if (keyState.right) this.tileX += 1;
        }
        targetX = this.tileX * cellWidth;
        targetY = this.tileY * cellHeight;

        if (targetX !== this.x) {
            let moveSpeed = cellWidth / this.framesPerMove;
            if (Math.abs(this.x - targetX) < moveSpeed) {
                this.x = targetX;
            } else {
                this.x += moveSpeed * (this.x < targetX ? 1 : -1);
            }
        }
        if (targetY !== this.y) {
            let moveSpeed = cellHeight / this.framesPerMove;
            if (Math.abs(this.y - targetY) < moveSpeed) {
                this.y = targetY;
            } else {
                this.y += moveSpeed * (this.y < targetY ? 1 : -1);
            }
        }
    }

}