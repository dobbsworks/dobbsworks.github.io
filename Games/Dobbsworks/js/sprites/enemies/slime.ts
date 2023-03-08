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
    rowNumber = 0;

    numberOfGroundFrames = 20;

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
                    this.OnGroundLanding();
                    this.animateTimer = 1;
                }
                this.jumpPrepTimer++;
                this.dx *= 0.5;

                this.WhileOnGround();

                if (this.jumpPrepTimer > this.numberOfGroundFrames) {
                    this.jumpPrepTimer = 0;
                    this.dy = -2.5;
                    this.parentSprite = null;
                    this.OnJump();
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

    OnJump(): void { }
    WhileOnGround(): void { }
    OnGroundLanding(): void {
        audioHandler.PlaySound("stuck-jump", true);
        this.CreateSlimeGround(TileType.Slime);
    }

    CreateSlimeGround(slimeGround: TileType): void {
        let xs = [this.xMid, this.xMid - 6, this.xMid + 6].map(a => Math.floor(a / this.layer.tileWidth)).filter(Utility.OnlyUnique);
        let y = Math.floor((this.yBottom + 1) / this.layer.tileHeight);
        xs.forEach(x => this.AttemptToSlime(x, y, slimeGround));
    }

    CanSlimeTile(tile: LevelTile): boolean {
        return !tile.tileType.isExemptFromSlime;
    }

    AttemptToSlime(xIndex: number, yIndex: number, slimeGround: TileType) {
        let tile = this.layer.GetTileByIndex(xIndex, yIndex);
        let semisolid = tile.GetSemisolidNeighbor();

        // TODO
        // when it's possible to wash off slime we'll need to store the previous semisolid

        if (tile.tileType == TileType.Air) {
            if (semisolid && semisolid.tileType.solidity == Solidity.Top) {
                if (this.CanSlimeTile(semisolid)) {
                    semisolid.layer.SetTile(xIndex, yIndex, slimeGround);
                }
            }
        } else {
            if (tile.tileType.solidity == Solidity.Block && this.CanSlimeTile(tile)) {
                tile.layer.map?.semisolidLayer.SetTile(xIndex, yIndex, slimeGround);
            }
        }
    }

    OnBounce(): void {
        this.canBeBouncedOn = false;
        this.isInDeathAnimation = true;
        this.dx = 0;
        this.dy = 0;
        this.OnDead();

        if (player) player.isSpinJumping = false;
    }

    GetFrameData(frameNum: number): FrameData {
        let frames = [0, 1, 2, 3, 4, 3, 2, 1];
        let frame = frames[Math.floor(this.frameCounter) % frames.length];
        if (this.isInDeathAnimation) {
            frame = Math.floor(this.squishTimer / 5) + 5;
            if (frame > 9) frame = 9;
        }
        return {
            imageTile: tiles["slime"][frame][this.rowNumber],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 1,
            yOffset: 0
        };
    }

}

class ChillyJelly extends LittleJelly {
    numberOfGroundFrames = 150;
    rowNumber = 1;
    // WhileOnGround(): void {
    //     if (this.jumpPrepTimer == 1) {
    //     }
    // }
    OnJump(): void {
        let frost = this.layer.sprites.filter(a => a instanceof FrostEffect && a.targetSprite == this);
        if (frost.length == 0) {
            let frostSprite = new FrostEffect(this.x, this.y, this.layer, []);
            frostSprite.targetSprite = this;
            this.layer.sprites.push(frostSprite);
        }
    }
    OnGroundLanding(): void {
        audioHandler.PlaySound("stuck-jump", true);
        this.CreateSlimeGround(TileType.IceTop);
        // let frost = this.layer.sprites.filter(a => a instanceof FrostEffect && a.targetSprite == this);
        // if (player) {
        //     let frostSpeed = (player.xMid < this.xMid ? -1 : 1)
        //     frost.forEach(a => a.dx = frostSpeed * 1);
        //     frost.forEach(a => { if (a instanceof FrostEffect) a.targetSprite = null });
        // }
        let frost = this.layer.sprites.filter(a => a instanceof FrostEffect && a.targetSprite == this);
        for (let f of frost) f.isActive = false;
    }
}

class FrostEffect extends Enemy {
    height = 18;
    width = 25;
    killedByProjectiles = false;
    respectsSolidTiles = false;

    timer = 0;
    targetSprite: Sprite | null = null;

    Update(): void {
        if (this.targetSprite) {
            this.x = this.targetSprite.xMid - this.width / 2;
            this.y = this.targetSprite.yMid - this.height / 2;
            if (!this.targetSprite.isActive) this.isActive = false;
        } else {
            this.timer++;
            this.ApplyInertia();
            if (this.timer > 60) {
                this.isActive = false;
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["frostEffect"][Math.floor(frameNum / 5) % 8][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 3
        }
    }
}