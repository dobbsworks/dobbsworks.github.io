class Player extends Sprite {
    color = "blue";
    hp = 5;
    hurtTimer = 0;
    isOnGround = false;

    Update() {
        if (isMouseDown) {
            // weapon fired
            weaponHandler.GetCurrent().PullTrigger();
        }
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        this.isOnGround = (touchedBorders.some(x => x instanceof Floor || x instanceof Platform));

        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (this.hurtTimer === 0) {
                if (touchingSprite instanceof Enemy) {
                    this.hp -= 1;
                    if (this.hp <= 0) {
                        // you are dead, not big surprise
                        this.isActive = false;
                        deathCount++;
                        setTimeout(() => {
                            player = new Player(0, 0);
                            renderer.target = player;
                            sprites.push(player)
                        }, 1000)
                    } else {
                        this.hurtTimer = 60;
                    }
                }
            }
            if (touchingSprite instanceof Loot) {
                touchingSprite.isActive = false;
                loot += touchingSprite.value;
            }
            if (touchingSprite instanceof LevelExit) {
                // level complete!
                levelHandler.LoadZone();
            }
        }
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
        }
    }

}