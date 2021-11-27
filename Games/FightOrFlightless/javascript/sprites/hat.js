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
    buildingTimeRemaining = 0;
    buildingTimeTotal = 0;
    buildingSprite = null;

    Update() {
        if (this.buildingTimeRemaining > 0) {
            this.buildingTimeRemaining--;
            if (this.buildingTimeRemaining <= 0) {
                sprites.push(this.buildingSprite);
                navMesh = new NavMesh();
            }
        } else {
            this.HandleMovement();
            this.HandleBuilding();
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

    HandleBuilding() {
        let isGroundAtLocation = sprites.
            filter(a => a instanceof GroundTile).
            some(a => a.tileX === this.tileX && a.tileY === this.tileY);

        let isBlockingSpriteAtLocation = sprites.
            filter(a => a.blocksBuild).
            some(a => a.tileX === this.tileX && a.tileY === this.tileY);

        for (let actionKeyIndex in actionKeys) {
            let actionKeyName = actionKeys[actionKeyIndex]
            if (keyState[actionKeyName]) {
                let blueprint = currentBlueprints[actionKeyIndex];
                if (blueprint) {
                    if (!isBlockingSpriteAtLocation && isGroundAtLocation) {
                        let cost = blueprint.baseCost;
                        if (money >= cost) {
                            let spriteToBuild = blueprint.constructedSprite;
                            this.buildingSprite = new spriteToBuild(this.tileX, this.tileY);
                            let doesSpriteBlockNav = this.buildingSprite.blocksNav;
                            if (doesSpriteBlockNav) {
                                let newMesh = new NavMesh([{ tileX: this.tileX, tileY: this.tileY }]);
                                let pathStillClear = newMesh.mesh.some(a => a.critical && a.distance);
                                if (!pathStillClear) continue;
                                navMesh = newMesh;
                            }

                            money -= cost;

                            this.buildingTimeRemaining = blueprint.baseBuildTime;
                            this.buildingTimeTotal = blueprint.baseBuildTime;
                            break;
                        }
                    }
                }
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

    OnAfterDraw() {
        if (this.buildingTimeRemaining > 0) {
            ctx.fillStyle = "#3a3c86";
            ctx.fillRect(this.x - 18, this.y + 8, 36, 8);
            ctx.fillStyle = "red";
            let completeRatio = this.buildingTimeRemaining / this.buildingTimeTotal;
            ctx.fillRect(this.x - 16 + (32 * (1 - completeRatio)), this.y + 10, 32 * completeRatio, 4);
        }
    }
}