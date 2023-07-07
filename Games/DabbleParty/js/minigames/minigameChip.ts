class MinigameChip extends MinigameBase {
    title = "Legally Distinct Chip Game";
    instructions = [
        "Drop your chip and cross your fingers!",
        "You can't drop a chip until the previous",
        "one is done dropping."
    ];
    backdropTile: ImageTile = tiles["bgGQ"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][0][0];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Button, "Drop chip")
    ];
    songId = "carnival";

    chip!: SimpleSprite;
    pins: SimpleSprite[] = [];
    cards: SimpleSprite[] = [];

    chipStartingY = -240;

    Initialize(): void {
        this.chip = new SimpleSprite(0, this.chipStartingY, tiles["chips"][0][0]);
        let row = 0;
        for (let y = 150; y > -180; y -= 52) {
            row++;
            for (let x = -240; x <= 300; x += 60) {
                if (row % 2) {
                    let pin = new SimpleSprite(x - 30, y, tiles["chips"][1][0]);
                    this.pins.push(pin);
                } else {
                    let pin = new SimpleSprite(x - 60, y, tiles["chips"][1][0]);
                    this.pins.push(pin);
                    if (x == 300) {
                        let pin2 = new SimpleSprite(x, y, tiles["chips"][1][0]);
                        this.pins.push(pin2);
                    }
                }
            }
        }

        this.cards.push(new SimpleSprite(0, 210, tiles["chips"][0][1]));
        for (let i = 1; i <= 4; i++) {
            this.cards.push(new SimpleSprite(60 * i, 210, tiles["chips"][i][1]));
            this.cards.push(new SimpleSprite(-60 * i, 210, tiles["chips"][i][1]));
        }

        this.sprites.push(...this.cards, this.chip, ...this.pins);
    }



    Update(): void {
        if (this.chip.y == this.chipStartingY) {
            this.chip.x += 7;
            if (this.chip.x > 300) this.chip.x -= 600;
        }

        if (!this.isEnded && this.timer >= 0) {
            if (this.chip.y == this.chipStartingY) {
                if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                    this.chip.y += 1;
                    this.chip.dy = 0;
                    this.chip.dx = 0.1;
                    audioHandler.PlaySound("pomp", false);
                }
            } else {
                this.chip.rotation += 0.03;
                this.chip.dy += 0.2;
                this.chip.y += this.chip.dy;
                this.chip.x += this.chip.dx;

                let pinRadius = 2; // 4
                let chipRadius = 22; // 24
                let collidePin = this.pins.find(pin => Math.sqrt((pin.x - this.chip.x) ** 2 + (pin.y - this.chip.y) ** 2) < pinRadius + chipRadius);
                if (collidePin) {
                    audioHandler.PlaySound("pop", false);
                    // mirror velocity across tangent vector, then reverse
                    let theta = Math.atan2(this.chip.y - collidePin.y, this.chip.x - collidePin.x);
                    let oldVelocityAngle = Math.atan2(this.chip.dy, this.chip.dx);
                    let newVelocityAngle = oldVelocityAngle + (theta - oldVelocityAngle) * 2 + Math.PI;
                    let velocityMagnitude = Math.sqrt(this.chip.dy ** 2 + this.chip.dx ** 2);

                    // don't let ball be overinflated, dampen velocity
                    velocityMagnitude = velocityMagnitude * 0.5 + 0.8;
                    this.chip.dy = velocityMagnitude * Math.sin(newVelocityAngle);
                    this.chip.dx = velocityMagnitude * Math.cos(newVelocityAngle);

                    this.chip.y += this.chip.dy;
                    this.chip.x += this.chip.dx;
                }
            }

            if (this.chip.y > 180 && this.chip.y < 200) {
                let col = Math.floor((Math.abs(this.chip.x) + 30) / 60);
                let pointArray = [1000, 1, 100, 50, 10];
                let earnedPoints = pointArray[col] || 0;
                this.score += earnedPoints;
                audioHandler.PlaySound("dobbloon", false);
                this.ResetChip();
            }

            if (this.IsChipOffScreen()) {
                this.ResetChip();
            }
        }

        let isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }
    }

    ResetChip(): void {
        this.chip.y = this.chipStartingY;
        this.chip.x = -300;
    }

    IsChipOffScreen(): boolean {
        let isChipOob = this.chip.y > 400 || this.chip.x > 600 || this.chip.x < -600;
        return isChipOob && !this.isEnded && this.timer >= 0;
    }
}