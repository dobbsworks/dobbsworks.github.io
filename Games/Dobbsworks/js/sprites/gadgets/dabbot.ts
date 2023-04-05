class Dabbot extends Sprite {

    public height: number = 9;
    public width: number = 5;
    public direction: -1 | 1 = 1;
    respectsSolidTiles = true;
    public heldItem: Sprite | null = null;
    public throwTimer: number = 999; // how long since throwing something
    public coyoteTimer: number = 999; // how long since not on ground // start this value above threshold so that player cannot immediately jump if starting in air, must hit ground first
    public jumpTimer: number = -1; // how long have we been ascending for current jump
    canBeHeld = true;

    Update(): void {
        this.Movement(); // includes gravity
        this.ItemUpdate();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        this.UpdateHeldItemLocation();
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    }

    Movement(): void {
        let isJumpPressed = KeyboardHandler.IsKeyPressed(KeyAction.Action1, true);
        if (isJumpPressed && this.isOnGround) {
            this.dy -= 1.5;
            this.parentSprite = null;
        }
        let leftHeld = KeyboardHandler.IsKeyPressed(KeyAction.Left, false);
        let rightHeld = KeyboardHandler.IsKeyPressed(KeyAction.Right, false);
        let targetDirection = 0;
        if (leftHeld && !rightHeld) {
            targetDirection = -1;
        }
        if (!leftHeld && rightHeld) {
            targetDirection = 1;
        }
        if (targetDirection != 0) {
            this.direction = targetDirection == 1 ? 1 : -1;
            this.dx += targetDirection * 0.1;
            if (this.dx > 1) this.dx = 1;
            if (this.dx < -1) this.dx = -1;
        }
    }

    ItemUpdate(): void {
        this.throwTimer++;
        let startedHolding = false;
        if (!this.heldItem
            && KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)
            && this.throwTimer > 20) {
            // try to grab item?

            for (let sprite of this.layer.sprites.filter(a => a.canBeHeld)) {
                if (sprite.age < 10) continue; // can't grab items that just spawned (prevent grabbing shell after shell jump)

                if (sprite instanceof Dabbot) {
                    let d = sprite as Dabbot;
                    while (d.heldItem instanceof Dabbot) d = d.heldItem;
                    if (d == this) continue
                }

                if (this.IsGoingToOverlapSprite(sprite)) {
                    this.heldItem = sprite;
                    startedHolding = true;

                    audioHandler.PlaySound("pick-up", true);
                    break;
                }
            }

            if (this.heldItem == null) {
                // check for items we can hang from
                let myX = this.x + this.GetTotalDx();
                let myY = this.y + this.GetTotalDy();
                for (let sprite of this.layer.sprites.filter(a => a.canHangFrom && (a.framesSinceThrown > 30 || a.framesSinceThrown == -1))) {
                    // special overlap logic for y coords:
                    let spriteX = sprite.x + sprite.GetTotalDx();
                    let spriteYBottom = sprite.yBottom + sprite.GetTotalDy();
                    let isXOverlap = myX < spriteX + sprite.width && myX + this.width > spriteX;
                    let isYOverlap = Math.abs(spriteYBottom - myY) < 2.5;
                    if (isXOverlap && isYOverlap) {
                        this.heldItem = sprite;
                        startedHolding = true;
                        audioHandler.PlaySound("pick-up", true);
                        break;
                    }
                }
            }
        }
        
        if (this.heldItem) {
            let players = <Player[]>this.layer.sprites.filter(a => a instanceof Player);
            for (let player of players) {
                if (player.heldItem == this.heldItem) {
                    this.heldItem = null;
                    return;
                }
            }

            if (this.parentSprite == this.heldItem) {
                this.parentSprite = null;
            }
            this.heldItem.parentSprite = null;
            if (!this.heldItem.updatedThisFrame) {
                this.heldItem.updatedThisFrame = true;
                this.heldItem.Update();
            }
            if (this.heldItem && this.heldItem.canBeHeld) {
                this.UpdateHeldItemLocation();

                if (!startedHolding && !KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) {
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                        this.heldItem.OnUpThrow(this, this.direction);
                    } else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                        this.heldItem.OnDownThrow(this, this.direction);
                    } else {
                        this.heldItem.OnThrow(this, this.direction);
                    }
                    this.heldItem.GentlyEjectFromSolids();

                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                    this.throwTimer = 0;
                    audioHandler.PlaySound("throw", true);
                }
            } else if (this.heldItem && this.heldItem.canHangFrom) {
                if (this.isOnCeiling) {
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                } else if (this.isOnGround) {
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                } else {
                    this.x = this.heldItem.xMid - this.width / 2;
                    this.y = this.heldItem.yBottom;
                    this.dx = this.heldItem.dx;
                    this.dy = this.heldItem.dy;
                    this.dxFromPlatform = 0;
                    this.dyFromPlatform = 0;
                    this.GentlyEjectFromSolids();

                    if (!KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) {
                        this.heldItem.framesSinceThrown = 1;
                        this.heldItem = null;
                    }
                    if (this.heldItem) {
                        let xDistanceFromTarget = Math.abs(this.heldItem.xMid - this.width / 2 - this.x);
                        let yDistanceFromTarget = Math.abs(this.heldItem.yBottom - this.y);
                        if (xDistanceFromTarget > 2 || yDistanceFromTarget > 2) {
                            this.heldItem.framesSinceThrown = 1;
                            this.heldItem = null;
                        }
                    }
                }
            }
            if (!this.heldItem?.isActive) this.heldItem = null;
        }
    }

    UpdateHeldItemLocation(): void {
        if (this.heldItem && this.heldItem.canBeHeld) {
            this.heldItem.x = this.x + this.width / 2 - this.heldItem.width / 2;
            this.heldItem.y = this.y - this.heldItem.height;
            this.heldItem.dx = 0;
            this.heldItem.dy = 0;
            this.heldItem.dxFromPlatform = 0;
            this.heldItem.dyFromPlatform = 0;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["dabbot"][0][0],
            xFlip: this.direction != 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 3
        };
    }
}