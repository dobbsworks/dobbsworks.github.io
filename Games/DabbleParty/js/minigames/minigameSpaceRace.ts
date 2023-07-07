class MinigameSpaceRace extends MinigameBase {
    title = "Space Race";
    instructions = [
        "Pilot your ship as far as you can through the vast",
        "reaches of space. Travel through rings to speed up,",
        "and avoid the ship-slowing meteors."
    ];
    backdropTile: ImageTile = tiles["space"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][0][3];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Vertical, "Move"),
    ];
    songId = "computer";
    rocket!: Sprite;
    bg1!: Sprite;
    bg2!: Sprite;
    bgScale = 6;

    movingItems: Sprite[] = [];

    rocketSpeed = 4;
    totalDistance = 0;

    Initialize(): void {
        this.bg1 = new SimpleSprite(-450*this.bgScale, 400, tiles["space"][0][0]).Scale(this.bgScale);
        this.bg2 = new SimpleSprite(442*this.bgScale, 400, tiles["space"][0][0]).Scale(this.bgScale);
        this.sprites.push(this.bg2, this.bg1);

        this.rocket = new SimpleSprite(-350, 0, tiles["rocket"][0][playerIndex]).Scale(0.2);
        this.sprites.push(this.rocket);
        
        this.movingItems = this.GetThings();
        this.sprites.push(...this.movingItems);
    }

    GetThings(): Sprite[] {
        let ret: Sprite[] = [];
        Random.SetSeed(2);
        for (let i=0; i<2000; i++) {
            let val = Random.GetRand();
            if (val < 0.1) {
                let x = i * 100 + 300;
                let y = Random.GetRandInt(-180, 180);
                if (val < 0.03) {
                    let spr = new SimpleSprite(x, y, tiles["spaceThings"][0][0], spr => {});
                    spr.name = "rings";
                    ret.push(spr);
                } else {
                    let spr = new SimpleSprite(x, y, tiles["spaceThings"][1][0], spr => {
                        spr.rotation += 0.01;
                    })
                    spr.name = "rock";
                    ret.push(spr);
                }
            }
        }
        ret.forEach(a => a.Scale(0.25));
        return ret;
    }

    Update(): void {
        this.bg1.x -= this.rocketSpeed * 0.5;
        this.bg2.x -= this.rocketSpeed * 0.5;
        if (this.bg2.x < -60) {
            this.bg1.x += 892 * this.bgScale;
            this.bg2.x += 892 * this.bgScale;
        }

        let rocketVerticalSpeed = 4;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.rocket.y -= rocketVerticalSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.rocket.y += rocketVerticalSpeed;
        }
        if (this.rocket.y > 180) this.rocket.y = 180;
        if (this.rocket.y < -180) this.rocket.y = -180;

        this.bg1.y = 200 - (this.rocket.y) / 4;
        this.bg2.y = this.bg1.y;


        let overlap = this.movingItems.find(a => a.Overlaps(this.rocket));
        if (overlap) {
            if (overlap.name == "rings") {
                this.rocketSpeed += 5;
                audioHandler.PlaySound("dobbloon", false);
            }
            if (overlap.name == "rock") {
                this.rocketSpeed *= 0.5;
                audioHandler.PlaySound("crash", false);
            }
            overlap.isActive = false;
        }



        this.rocketSpeed += 0.005;
        let maxRocketSpeed = 100;
        if (this.rocketSpeed > maxRocketSpeed) this.rocketSpeed = maxRocketSpeed;
        let minRocketSpeed = 4;
        if (this.rocketSpeed < minRocketSpeed) this.rocketSpeed = minRocketSpeed;
        this.totalDistance += this.rocketSpeed;

        this.movingItems.forEach(a => {
            a.x -= this.rocketSpeed;
        })

        let isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.movingItems.forEach(a => a.isActive = false);
            this.SubmitScore(Math.floor(this.totalDistance));
        }
    }
}