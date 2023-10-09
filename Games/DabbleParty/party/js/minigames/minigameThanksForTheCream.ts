class MinigameThanksForTheCream extends MinigameBase {
    title = "Thanks For The Cream";
    instructions = [
        "Quintuple scoop, please! Move your cone to catch",
        "the falling scoops of ice cream. You'll earn more",
        "points for well-centered stacks."
    ];
    backdropTile: ImageTile = tiles["bgBeach"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][1][3];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Horizontal, "Move cone"),
    ];
    songId = "desert";

    cone!: SimpleSprite;
    coneScoops: Sprite[] = [];
    range = 100;

    Initialize(): void {
        this.cone = new SimpleSprite(0, 200, tiles["iceCream"][4][0]);
        this.sprites.push(this.cone);
    }

    // image size 150px tiles

    LaunchScoops(): void {
        let targetX = 0;
        for (let i = 0; i < 5; i++) {
            let leftEdge = Math.max(targetX - this.range, -350);
            let rightEdge = Math.min(targetX + this.range, 350);
            targetX = Random.GetRandInt(leftEdge, rightEdge);
            let y = 300 + i * 100;
            let scoop = new SimpleSprite(targetX, y, tiles["iceCream"][playerIndex][0], (spr) => {
                spr.y -= 5;
                let targetY = -300 - (+(spr.name) * 225);
                if (spr.y < targetY) {
                    this.CreateBigScoop(spr.x);
                    spr.isActive = false;
                }
            }).Scale(0.25);
            scoop.name = i.toString();
            this.sprites.unshift(scoop);
            audioHandler.PlaySound("jump", false);
        }
        this.range += 25;
        if (this.range > 200) this.range = 200;
    }

    CreateBigScoop(x: number) {
        let scoop = new SimpleSprite(x, -300, tiles["iceCream"][playerIndex][0], (spr) => {
            spr.y += 5;
            if (spr.name == "big") {
                let targetY = this.cone.y - 85 - (this.coneScoops.length) * 75;
                let targetX = this.cone.x;
                if (this.coneScoops.length > 0) targetX = this.coneScoops[this.coneScoops.length - 1].x;
                let xDistance = Math.abs(targetX - spr.x);
                if (spr.y == targetY && xDistance < 50) {
                    this.coneScoops.push(spr);
                }
            }
            if (spr.y > 300) spr.isActive = false;
        });
        scoop.name = "big";
        this.sprites.push(scoop);
    }

    Update(): void {
        let move = 0;
        let moveSpeed = 5;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && this.cone.x > -350) {
            move -= moveSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && this.cone.x < 350) {
            move += moveSpeed;
        }

        this.cone.x += move;

        if (!this.isEnded && this.timer >= 0) {
            let cycle = this.timer % (60 * 8);
            if (cycle == 0) {
                this.LaunchScoops();
            }
            if (cycle > 60*8 - 50 && cycle < 60*8 - 25) {
                this.cone.y += 20;
            }
            if (cycle ==  60*8 - 25) {
                // score it!
                for (let i = 0; i < this.coneScoops.length; i++) {
                    let x = i == 0 ? this.cone.x : this.coneScoops[i-1].x;
                    let xDelta = Math.abs(this.coneScoops[i].x - x);

                    // 3 points for very close, 2 for ok, 1 for at least it's attached
                    if (xDelta < 10) this.score++;
                    if (xDelta < 25) this.score++;
                    if (xDelta < 50) this.score++;
                }
                audioHandler.PlaySound("dobbloon", false);

                this.coneScoops.forEach(a => a.isActive = false);
                this.coneScoops = [];
                this.sprites.filter(a => a.name == "big").forEach(a => a.name = "dead");
            }
            if (cycle >  60*8 - 25) {
                this.cone.y -= 20;
            }
        }

        for (let i = 0; i < this.coneScoops.length; i++) {
            let scoop = this.coneScoops[i];
            scoop.x += move;
            scoop.y = this.cone.y - 85 - i * 75
        }


        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    }

    GetRemainingTicks(): number {
        return (60 * 64 - 1) - this.timer;
    }

}