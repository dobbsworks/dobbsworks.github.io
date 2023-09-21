class MinigameDodgePodge extends MinigameBase {
    title = "Dodge Podge";
    instructions = [
        "Steer your balloon to dodge the cannon blasts!",
        "The occasional coin flying by is worth an extra",
        "point, so go for the gold!"
    ];
    backdropTile: ImageTile = tiles["bgBalloon"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][2][0];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Move, "Move"),
    ];
    songId = "sky";
    balloon!: Sprite;

    score = 100;
    balloonSpeed = 3;

    cannons: Sprite[] = [];
    bulletTimes: {frame: number, cannonIndex: number, isCoin: boolean}[] = [];

    Initialize(): void {
        this.balloon = new SimpleSprite(0, 0, tiles["cannon"][playerIndex][1]);
        this.sprites.push(this.balloon);
        for (let y = -225; y <= 225; y += 90) {
            let cannonLeft = new SimpleSprite(-440, y, tiles["cannon"][0][0]);
            let cannonRight = new SimpleSprite(440, y, tiles["cannon"][0][0]);
            cannonRight.rotation = Math.PI;
            this.cannons.push(cannonLeft, cannonRight);
        }
        this.sprites.push(...this.cannons);
        this.bulletTimes = this.GetBulletTimes();
    }

    GetBulletTimes(): {frame: number, cannonIndex: number, isCoin: boolean}[] {
        let ret: {frame: number, cannonIndex: number, isCoin: boolean}[] = [];
        Random.SetSeed(5);
        for (let i=0; i<60*60; i += 10) {
            let val = Random.GetRand();
            let threshold = Math.max(0.1, i / 6000 * 1.1);
            if (val < threshold) {
                let cannonIndex = Random.GetRandInt(0, this.cannons.length-1);
                let isCoin = Random.GetRand() < 0.2;
                ret.push({frame: i, cannonIndex: cannonIndex, isCoin: isCoin});
            }
        }
        return ret;
    }

    Update(): void {
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.balloon.y -= this.balloonSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.balloon.y += this.balloonSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false)) {
            this.balloon.x -= this.balloonSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false)) {
            this.balloon.x += this.balloonSpeed;
        }

        if (this.balloon.x < -330) this.balloon.x = -330;
        if (this.balloon.x > 330) this.balloon.x = 330;
        if (this.balloon.y < -225) this.balloon.y = -225;
        if (this.balloon.y > 225) this.balloon.y = 225;


        let bulletTime = this.bulletTimes.find(a => a.frame == this.timer);
        if (bulletTime) {
            let cannon = this.cannons[bulletTime.cannonIndex];
            let cannonSide = cannon.x < 0 ? -1 : 1;
            let image = bulletTime.isCoin ? tiles["dobbloon"][0][0] : tiles["cannon"][1][0];
            let bullet = new SimpleSprite(cannon.x + 20 * -cannonSide, cannon.y, image, (spr) => {
                let bulletSpeed = 4;
                spr.x += bulletSpeed * -cannonSide;
                if (spr.name == "coin") {
                    (spr as SimpleSprite).Animate(0.25);
                }
            });
            bullet.name = bulletTime.isCoin ? "coin" : "bullet";
            if (bulletTime.isCoin) bullet.Scale(0.6);
            this.sprites.push(bullet);
            if (bulletTime.isCoin) {
                audioHandler.PlaySound("confirm", false);
            } else {
                audioHandler.PlaySound("pomp", false);
            }
        }

        let overlap = this.sprites.find(a => a != this.balloon && this.balloon.DistanceBetweenCenters(a) < 65);
        if (overlap) {
            if (overlap.name == "coin") {
                this.score++;
                audioHandler.PlaySound("dobbloon", false);
                overlap.isActive = false;
            }
            if (overlap.name == "bullet") {
                this.score--;
                overlap.isActive = false;
                audioHandler.PlaySound("hurt", false);
            }
        }

        let isGameOver = this.timer == 60 * 64;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }
    }
}