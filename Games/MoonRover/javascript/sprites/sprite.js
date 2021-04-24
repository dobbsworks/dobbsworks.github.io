class Sprite {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    dx = 0;
    dy = 0;
    isActive = true;
    color = "white";
    radius = 30;
    frame = 0;
    maxHp = 3;

    // tracks short circuit status
    shortedTimer = 0;

    // tracks how much fire has hit. Reach threshold to catch fire
    ignition = 0;
    ignitionTimer = 0;
    // tracks how much longer to burn
    burnTimer = 0;
    burnDamageTimer = 0;

    radarTimer = 0; // for blind char

    Ignite() {
        // sprite has touched fire, increment values to see if burn begins
        this.ignition++;
        this.ignitionTimer = 60;
    }

    Explode() {
        let explodeCount = 6;
        let explodeSpeed = 2;
        for (let i = 0; i < explodeCount; i++) {
            let e = new Explosion(this.x, this.y)
            let theta = i * 2 * Math.PI / explodeCount;
            e.dx = explodeSpeed * Math.cos(theta);
            e.dy = explodeSpeed * Math.sin(theta);
            sprites.push(e);
        }
    }

    SharedSpriteUpdate() {
        if (this.shortedTimer > 0) {
            this.shortedTimer--;
            this.ApplyGravity();
            this.UpdatePosition();
            this.ReactToBorders();
        }
        if (this.ignition > 0) {
            this.ignitionTimer--;
            if (this.ignitionTimer <= 0) {
                this.ignition = 0;
            }
            if (this.ignition >= 3) {
                if (this.burnTimer <= 0) {
                    // just now started burning
                    if (!(this instanceof EnemyBullet)) {
                        achievementHandler.ignitionTimes.push(new Date());
                    }
                }
                this.burnTimer = 60 * 3;
            }
        }
        if (this.burnTimer > 0) {
            this.burnTimer--;
            this.burnDamageTimer++;
            if (this.burnDamageTimer >= 60) {
                this.burnDamageTimer = 0;
                this.ApplyDamage(1);
            }
            if (Math.random() < 0.2) {
                sprites.push(new Flame(this.x, this.y));
            }
        } else {
            this.burnDamageTimer = 0;
        }

        if (this.radarTimer > 0) this.radarTimer -= 1;
    }

    Magnetize(duration) {
        this.shortedTimer = duration;
        sprites.filter(x => x instanceof Shock && x.parent === this).forEach(x => x.isActive = false);
        sprites.push(new Shock(this, duration));

    }

    ApplyDamage(damageAmount, bouncer, knockback) {
        let oldHp = Math.floor(this.hp);
        this.hp -= damageAmount;
        let newHp = Math.floor(this.hp);
        let visibleDamageAmount = oldHp - newHp;
        if (visibleDamageAmount > 0) {
            sprites.push(new DamageIndicator(this, visibleDamageAmount));
        }

        if (bouncer && knockback && !this.stationary) {
            this.BounceFrom(bouncer, knockback);
        }
    }

    Draw() {
        let isBlind = (currentCharacter && currentCharacter.isBlind);
        if (this.OnBeforeDraw) this.OnBeforeDraw();
        ctx.strokeStyle = "black";
        if (this.children && !isBlind) {
            for (let child of this.children) {
                if (child.isActive) {
                    renderer.Line(this.x, this.y, child.x, child.y);
                }
            }
        }

        if (this.IsOffScreen()) return;

        if (this.GetFrameData) {
            let frameData = this.GetFrameData();
            if (frameData) {
                let frame = frameData.tileset.tiles[frameData.frame];
                renderer.Tile(frame, this.x, this.y, frameData.xFlip);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            renderer.Circle(this.x, this.y, this.radius);
        }

        if (this.bubbleShieldTimer > 0) {
            let renderShield = this.bubbleShieldTimer > 30 || this.bubbleShieldTimer % 2;
            if (renderShield) {
                renderer.Tile(tileset.shield.tiles[0], this.x, this.y, false);
            }
        }

        if (this.OnAfterDraw) this.OnAfterDraw();
        if (uiHandler.debugMode) {
            ctx.strokeStyle = "white";
            renderer.Line(this.x, this.y, this.x + this.dx * 20, this.y + this.dy * 20);
            ctx.fillStyle = "#FFF0";
            renderer.Circle(this.x, this.y, this.radius);
        }

        if (isBlind) {
            if (this.radarTimer) {
                for (let ringTimer = this.radarTimer; ringTimer > 0; ringTimer -= 30) {
                    if (ringTimer > 60) continue;
                    let opacity = (ringTimer / 60).toString(16).slice(2, 3);
                    if (opacity.length == 0) opacity = "F";
                    let dist = 60 - ringTimer;
                    if (this.color.length === 4) ctx.strokeStyle = this.color + opacity;
                    if (this.color.length === 7) ctx.strokeStyle = this.color + opacity + opacity;
                    if (this.color.length === 9) ctx.strokeStyle = "#FFF0";
                    ctx.fillStyle = "#FFF0";
                    renderer.Circle(this.x, this.y, this.radius + dist);
                    ctx.strokeStyle = this.color
                    renderer.Circle(this.x, this.y, this.radius);
                }
            }
        }
    }

    AnimateByFrame(frameset) {
        return this.frame % frameset.tiles.length;
    }

    BounceFrom(bouncerSprite, bounceForce) {
        // TODO
        // vector should be normalized to make grazing shots less forceful
        let theta = Math.atan2(this.y - bouncerSprite.y, this.x - bouncerSprite.x);
        this.dx += bounceForce * Math.cos(theta);
        this.dy += bounceForce * Math.sin(theta);

    }

    IsOffScreen() {
        let buffer = renderer.MapR(this.r + 10);
        let centerX = renderer.MapX(this.x);
        let centerY = renderer.MapY(this.y);
        if (centerX + buffer < 0) return true;
        if (centerX - buffer > canvas.width) return true;
        if (centerY + buffer < 0) return true;
        if (centerY - buffer > canvas.height) return true;
    }

    Update() {
        // implemented by subclass
        console.error("HEY! You need to extend this class.")
    }

    IsTouchingSprite(sprite) {
        let deltaX = sprite.x - this.x;
        let deltaY = sprite.y - this.y;
        let distanceSquared = deltaX ** 2 + deltaY ** 2;
        let radiusSquared = (sprite.radius + this.radius) ** 2;
        return distanceSquared <= radiusSquared;
    }

    GetTouchingSprites() {
        return sprites.filter(x => x !== this && this.IsTouchingSprite(x));
    }

    ReactToBorders(bounciness, inertia) {
        let touchedBorders = [];
        if (!bounciness) bounciness = 0;
        if (inertia === null || inertia === undefined) inertia = 0.9;
        for (let border of borders) {
            if (border instanceof Floor) {
                if (this.y > border.y - this.radius) {
                    this.y = border.y - this.radius;
                    this.dy *= -bounciness;
                    this.dx *= inertia;
                    touchedBorders.push(border);
                }
            }
            if (border instanceof Ceiling) {
                if (this.y < border.y + this.radius) {
                    this.y = border.y + this.radius;
                    this.dy *= -bounciness;
                    touchedBorders.push(border);
                }
            }
            if (border instanceof LeftWall) {
                if (this.x < border.x + this.radius) {
                    this.x = border.x + this.radius;
                    this.dx *= -bounciness;
                    touchedBorders.push(border);
                }
            }
            if (border instanceof RightWall) {
                if (this.x > border.x - this.radius) {
                    this.x = border.x - this.radius;
                    this.dx *= -bounciness;
                    touchedBorders.push(border);
                }
            }
            if (border instanceof Platform) {
                let isOldSpriteOverPlatform = this.oldY + this.radius <= border.y;
                let isNewSpriteUnderPlatform = this.y + this.radius > border.y;
                if (isOldSpriteOverPlatform && isNewSpriteUnderPlatform) {
                    // let dy = this.y - this.oldY;
                    // let dx = this.x - this.oldX;
                    let isOldXInBounds = this.oldX >= border.x1 && this.oldX <= border.x2;
                    let isNewXInBounds = this.x >= border.x1 && this.x <= border.x2;
                    if (isOldXInBounds && isNewXInBounds) {
                        this.y = border.y - this.radius;
                        this.dy *= -bounciness;
                        this.dx *= !!bounciness ? 1 : inertia;
                        touchedBorders.push(border);
                    }
                }
            }
        }
        return touchedBorders;
    }

    UpdatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    ApplyDrag() {
        this.dx *= 0.98;
        this.dy *= 0.98;
    }

    ApplyGravity(optionalScaleValue) {
        let gravityValue = 0.07;
        if (optionalScaleValue !== undefined) {
            gravityValue *= optionalScaleValue;
        }
        this.dy += gravityValue;
    }
}