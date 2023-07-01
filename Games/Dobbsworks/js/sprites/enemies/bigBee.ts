class Bigby extends Enemy {

    public height: number = 17;
    public width: number = 22;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    anchor = null;
    bounceTimer = 0;

    connectedSprite: Sprite | null = null;
    protected connectionDistance: number = 0;
    protected isInitialized = false;

    Initialize(): void {
        this.GrabItem();
    }


    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }
        if (!this.WaitForOnScreen()) return;

        this.SkyPatrol(0.3);
        this.ApplyInertia();
        this.dy *= 0.9;
        this.ReactToWater();
        this.ReactToVerticalWind();
        if (this.connectedSprite) {
            this.UpdateConnectedSprite(this.connectedSprite);
            this.MoveConnectedSprite(this.connectedSprite);
            let playerGrabbed = this.HandlePlayerGrab(this.connectedSprite);
            if (playerGrabbed) {
                this.connectedSprite = null;
            } else {
                this.MoveConnectedSprite(this.connectedSprite);
            }
        } else {
            this.GrabItem();
        }

        if (this.bounceTimer > 0) {
            this.bounceTimer++;
            if (this.bounceTimer > 30) this.bounceTimer = 0;
        }
    }

    GrabItem(): void {
        let possibleConnectionSprite = this.GetPotentialMotorCargo(1, 5);
        if (possibleConnectionSprite && possibleConnectionSprite.yBottom <= this.yBottom + 12) {
            let targetAlreadyOnMotor = possibleConnectionSprite.GetParentMotor();
            let isHeld = this.layer.sprites.some(a => a instanceof Player && a.heldItem == a);
            let isMotor = possibleConnectionSprite instanceof Motor;
            if (!targetAlreadyOnMotor && !isHeld && !isMotor) {
                this.connectedSprite = possibleConnectionSprite;
                this.connectionDistance = this.height + 2;
            }
        }
    }

    HandlePlayerGrab(sprite: Sprite): boolean {
        let players = <Player[]>this.layer.sprites.filter(a => a instanceof Player);
        for (let player of players) {
            if (player.heldItem == sprite && player.heldItem.canBeHeld) {
                return true;
            }
        }
        return false;
    }

    MoveConnectedSprite(sprite: Sprite): void {
        if (sprite instanceof Enemy) {
            sprite.direction = this.dx > 0 ? 1 : -1;
        }

        sprite.x = this.xMid - sprite.width / 2;
        sprite.y = this.y + this.connectionDistance;
        sprite.dx = this.dx;
        sprite.dy = this.dy;
    }

    UpdateConnectedSprite(sprite: Sprite): void {
        if (!sprite) return;
        if (!sprite.updatedThisFrame) {
            sprite.SharedUpdate();
            sprite.Update();
            if (sprite instanceof Enemy) {
                sprite.EnemyUpdate();
            }
            sprite.updatedThisFrame = true;
        }
    }

    OnBounce(): void {
        this.bounceTimer = 1;
    }
    

    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }



    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(frameNum / 5) % 2;
        let row = 0;
        if (this.bounceTimer > 0) {
            let a = Math.cos(this.bounceTimer * 0.3);
            row = 2;
            if (a > 0.4) row = 1;
            if (a < -0.4) row = 3;
        }
        return {
            imageTile: tiles["bigby"][col][row],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 4,
            yOffset: 4
        };
    }

    OnBeforeDraw(camera: Camera): void {
        if (this.connectionDistance == 0 || this.connectedSprite == null) return;
        let x = (this.xMid - camera.x) * camera.scale + camera.canvas.width / 2;
        let yGameStart = (this.y + 15);
        let y = (yGameStart - camera.y) * camera.scale + camera.canvas.height / 2;
        let yGameEnd = this.connectedSprite.y;
        let drawHeight = (yGameEnd - yGameStart) * camera.scale;

        camera.ctx.fillStyle = "black";
        camera.ctx.fillRect(x - 0.5 * camera.scale, y, 1 * camera.scale, drawHeight);
    }
}