class LittleJelly extends Enemy {
    height = 10;
    width = 13;
    respectsSolidTiles = true;
    squishTimer = 0;
    jumpPrepTimer = 0;
    canBeBouncedOn = true;
    frameCounter = 0;
    animateTimer = 0;
    wasOnGround = false;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            if (this.squishTimer == 2) audioHandler.PlaySound("stuck-jump", true);
            this.squishTimer++;
            this.ApplyGravity();
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {
            if (this.isOnGround) {
                if (!this.wasOnGround) {
                    // just landed
                    audioHandler.PlaySound("stuck-jump", true);
                    this.CreateSlimeGround();
                    this.animateTimer = 1;
                }
                this.jumpPrepTimer++;
                this.dx *= 0.5;
                if (this.jumpPrepTimer > 20) {
                    this.jumpPrepTimer = 0;
                    this.dy = -2.5;
                    //this.animateTimer = 1;
                }
                this.wasOnGround = true;
                if (player) {
                    if (player.xMid < this.xMid) this.direction = -1;
                    if (player.xMid > this.xMid) this.direction = 1;
                }
            } else {
                this.SkyPatrol(0.35);
                this.wasOnGround = false;
            }

            this.ApplyGravity();
            this.ReactToWater();
        }

        if (this.animateTimer > 0) {
            this.animateTimer++;
            this.frameCounter += 0.4;
            if (this.animateTimer > 20) {
                this.animateTimer = 0;
                this.frameCounter = 0;
            }
        }
    }

    CreateSlimeGround(): void {
        let xs = [this.xMid, this.xMid - 6, this.xMid + 6].map(a => Math.floor(a / this.layer.tileWidth)).filter(Utility.OnlyUnique);
        let y = Math.floor((this.yBottom + 1) / this.layer.tileHeight);
        xs.forEach(x => this.AttemptToSlime(x, y));
    }

    AttemptToSlime(xIndex: number, yIndex: number) {
        let tile = this.layer.GetTileByIndex(xIndex, yIndex);
        let semisolid = tile.GetSemisolidNeighbor();

        // TODO
        // when it's possible to wash off slime we'll need to store the previous semisolid

        if (tile.tileType == TileType.Air) {
            if (semisolid && semisolid.tileType.solidity == Solidity.Top) {
                if (!semisolid.tileType.isExemptFromSlime) {
                    semisolid.layer.SetTile(xIndex, yIndex, TileType.Slime);
                }
            }
        } else {
            if (tile.tileType.solidity == Solidity.Block && !tile.tileType.isExemptFromSlime) {
                tile.layer.map?.semisolidLayer.SetTile(xIndex, yIndex, TileType.Slime);
            }
        }
    }

    OnBounce(): void {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
        this.OnDead();
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0, 1, 2, 3, 4, 3, 2, 1];
        let frame = frames[Math.floor(this.frameCounter) % frames.length];
        if (this.isInDeathAnimation) {
            frame = Math.floor(this.squishTimer / 5) + 5;
            if (frame > 9) frame = 9;
        }
        return {
            imageTile: tiles["slime"][frame][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    }

}