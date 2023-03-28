class SpinRing extends Sprite {

    public height: number = 10;
    public width: number = 22;
    respectsSolidTiles = false;
    public allowsSpinJump: boolean = true;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return SpinRingRight; }

    protected col = 0;
    protected overlayType: SpriteType = ColorRingOverlay;
    private overlay: ColorRingOverlay | null = null;
    public direction: Direction = Direction.Up;

    spinTimer = 0;
    animationOffset = 0;
    isReusable = true;

    rowOffset = 0;
    spriteInteractList: Sprite[] = [];

    Update(): void {
        if (!this.overlay) {
            this.overlay = <ColorRingOverlay>(new this.overlayType(this.x, this.y, this.layer, []));
            this.overlay.direction = this.direction;
            this.overlay.width = this.width;
            this.overlay.height = this.height;
            this.layer.sprites.push(this.overlay);
        }

        this.spriteInteractList = this.spriteInteractList.filter(a => a.Overlaps(this));

        if (this.spinTimer > 0) {
            this.spinTimer--;
            this.animationOffset += this.spinTimer / 2;
        }

        this.overlay.x = this.x;
        this.overlay.y = this.y;
        this.overlay.animationOffset = this.animationOffset;

        let touchingSprites = this.layer.sprites.filter(a => {
            if (!a.Overlaps(this)) return false;
            if (a instanceof SpinRing) return false;
            if (a instanceof Yoyo) return false;
            if (player && player.heldItem == a && !(a instanceof Rocket)) return false;
            if (player == a && player.heldItem && player.heldItem instanceof Rocket) return false;
            
            let parentMotor = <Motor>this.layer.sprites.find(spr => spr instanceof Motor && spr.connectedSprite == a);
            if (parentMotor) return false;
            return true;
        });
        touchingSprites.forEach(spr => this.OnSpriteTouch(spr));
    }

    OnSpriteTouch(sprite: Sprite): void {
        // void for regular ring
    }

    OnPlayerUseSpinRing(): void {
        this.spinTimer = 30;
        if (!this.isReusable) {
            this.ReplaceWithSpriteType(Poof);
            if (this.overlay) this.overlay.isActive = false;
        }
    }

    GetFrameData(frameNum: number): FrameData[] {
        let isPointedVertically = this.direction.x == 0;
        let imageSource = isPointedVertically ? "colorRing" : "colorRing2";
        if (editorHandler.isInEditMode) {
            let frames = [{
                imageTile: isPointedVertically ? tiles[imageSource][0][0 + this.rowOffset] : tiles[imageSource][0 + this.rowOffset][0],
                xFlip: false,
                yFlip: false,
                xOffset: 2,
                yOffset: 1
            }, {
                imageTile: isPointedVertically ? tiles[imageSource][1][0 + this.rowOffset] : tiles[imageSource][0 + this.rowOffset][1],
                xFlip: false,
                yFlip: false,
                xOffset: 2,
                yOffset: 1
            }];
            if (this.direction) {
                let arrowCol = [Direction.Right, null, Direction.Up, null, Direction.Left, null, Direction.Down, null].indexOf(this.direction);
                frames.push({
                    imageTile: tiles["arrows"][arrowCol][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: this.direction.x == 0 ? -5 : (this.direction.x * -6 + 1),
                    yOffset: this.direction.y == 0 ? -5 : (this.direction.y * -6 + 2)
                });
            }
            return frames;
        }

        let row = Math.floor((frameNum + this.animationOffset) / 5) % 3;
        return [{
            imageTile: isPointedVertically ? tiles[imageSource][this.col][row + this.rowOffset] : tiles[imageSource][row + this.rowOffset][this.col],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 1
        }];
    }

    GetThumbnail(): ImageTile {
        let col = Direction.All.indexOf(this.direction);
        return tiles["colorRingThumb"][col][0 + this.rowOffset / 3];
    }
}

class ColorRingOverlay extends SpinRing {
    protected col = 1;
    zIndex = 1;
    Update() { }
}
class SpinRingRight extends SpinRing {
    public height: number = 22;
    public width: number = 10;
    public direction: Direction = Direction.Right;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return SpinRingDown; }
}
class SpinRingDown extends SpinRing {
    public direction: Direction = Direction.Down;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return SpinRingLeft; }
}
class SpinRingLeft extends SpinRingRight {
    public direction: Direction = Direction.Left;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return SpinRing; }
}


class FragileSpinRing extends SpinRing {
    overlayType = FragileSpinRingOverlay;
    rowOffset = 3;
    isReusable = false;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return FragileSpinRingRight; }
}
class FragileSpinRingOverlay extends FragileSpinRing {
    protected col = 1;
    zIndex = 1;
    Update() { }
}
class FragileSpinRingRight extends FragileSpinRing {
    public height: number = 22;
    public width: number = 10;
    public direction: Direction = Direction.Right;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return FragileSpinRingDown; }
}
class FragileSpinRingDown extends FragileSpinRing {
    public direction: Direction = Direction.Down;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return FragileSpinRingLeft; }
}
class FragileSpinRingLeft extends FragileSpinRingRight {
    public direction: Direction = Direction.Left;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return FragileSpinRing; }
}


class PortalRing extends SpinRing {
    overlayType = PortalRingOverlay;
    rowOffset = 6;
    isReusable = false;
    direction = Direction.Up;
    allowsSpinJump: boolean = false;
    public anchor: Direction | null = null;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return PortalRingRight; }

    OnSpriteTouch(sprite: Sprite): void {
        if (this.spriteInteractList.indexOf(sprite) > -1) {
            // recently warped this sprite, ignore
            return;
        }
        let destination = this.GetPairedPortal();
        this.spinTimer = 30;
        if (destination) {
            let grantVelocityBoost = true;
            destination.spinTimer = 30;
            sprite.x = destination.xMid - sprite.width / 2;
            sprite.y = destination.yMid - sprite.height / 2;

            if (this.direction == destination.direction) {
                if (this.direction.x == 0) {
                    // both up, or both down
                    sprite.dy *= -1;
                } else {
                    // both left, or both right
                    sprite.dx *= -1;
                }
            } else {
                if (this.direction.x == destination.direction.x || this.direction.y == destination.direction.y) {
                    // a left and right, or an up and down
                    grantVelocityBoost = false;
                } else {
                    // change orientation
                    sprite.dx = destination.direction.x * 2;
                    sprite.dy = destination.direction.y;
                    if (destination.direction.y == -1) sprite.dy = -2;
                }
            }

            if (grantVelocityBoost) {
                if (destination.direction.y == 0 || sprite.dy <= 0) {
                    sprite.dx += destination.direction.x * 1;
                    sprite.dy += Math.abs(destination.direction.y) * -1;
                }
            }

            audioHandler.PlaySound("warp", true);
            destination.spriteInteractList.push(sprite);
            if (sprite instanceof Player && sprite.heldItem) {
                destination.spriteInteractList.push(sprite.heldItem);
            }
        }
    }

    GetPairedPortal(): PortalRing|null {
        let allDoors = <PortalRing[]>this.layer.sprites.filter(a => a instanceof PortalRing && a != this && a.zIndex != 1);
        if (allDoors.length == 0) return null;
        if (allDoors.length == 1) return allDoors[0];
        let doorHorizontalDistances = allDoors.map(a => Math.abs(a.x - this.x));
        
        doorHorizontalDistances.sort((a,b) => a - b);
        let minHorizontalDistance = doorHorizontalDistances[0];

        // grab all doors that are tied for closest horizontally
        let closestDoorsHorizontally = allDoors.filter(a => Math.abs(a.x - this.x) == minHorizontalDistance);
        if (closestDoorsHorizontally.length == 1) return closestDoorsHorizontally[0];

        let doorVerticalDistances = closestDoorsHorizontally.map(a => Math.abs(a.y - this.y));
        
        doorVerticalDistances.sort((a,b) => a - b);
        let minVerticalDistance = doorVerticalDistances[0];

        // grab all doors that are tied for closest vertically AND horizontally
        let closestDoors = closestDoorsHorizontally.filter(a => Math.abs(a.y - this.y) == minVerticalDistance);
        if (closestDoors.length == 1) return closestDoors[0];
        
        closestDoors.sort((a,b)=> (a.x - b.x) * 100000 + (a.y - b.y))
        return closestDoors[0];
    }
}
class PortalRingOverlay extends PortalRing {
    protected col = 1;
    zIndex = 1;
    Update() { }
}

class PortalRingRight extends PortalRing {
    public height: number = 22;
    public width: number = 10;
    public direction: Direction = Direction.Right;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return PortalRingDown; }
}
class PortalRingDown extends PortalRing {
    public direction: Direction = Direction.Down;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return PortalRingLeft; }
}
class PortalRingLeft extends PortalRingRight {
    public direction: Direction = Direction.Left;
    public static get clockwiseRotationSprite(): (SpriteType | null) { return PortalRing; }
}