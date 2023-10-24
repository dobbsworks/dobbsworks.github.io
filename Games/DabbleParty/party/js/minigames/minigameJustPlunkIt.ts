class MinigameJustPlunkIt extends MinigameBase {
    title = "Just Plunk It";
    instructions = [
        "Fiddle with the dial and slider to get the highest number.",
        "There are six 10-second rounds. The timer in the top-left",
        "shows how much time you have before the next round."
    ];
    backdropTile: ImageTile = tiles["bgPlunk"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][1][1];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Horizontal, "Polarize flange dampener"),
        new InstructionControl(Control.Vertical, "Stabilize degausser"),
    ];
    songId = "meditate";

    dial!: SimpleSprite;
    slider!: SimpleSprite;
    meter!: SimpleSprite;
    digits: SimpleSprite[] = [];
    targetRotation = 0;
    targetSlide = 0;

    Initialize(): void {
        this.dial = new SimpleSprite(-242, 94, tiles["plunkControls"][0][0]);
        this.slider = new SimpleSprite(350/2, 57, tiles["plunkControls"][1][0]);
        this.meter = new SimpleSprite(-292, -163, tiles["plunkControls"][2][0]);

        for (let i=0; i<4; i++) {
            let digit = new SimpleSprite(80 * i + 20, -150, tiles["plunkDisplay"][0][0]).Scale(3);
            this.digits.push(digit as SimpleSprite);
        }

        this.sprites.push(this.dial, this.slider, this.meter, ...this.digits);
    }

    RandomizeTarget(): void {
        this.targetRotation = Random.GetRand() * Math.PI * 2;
        this.targetSlide = Random.GetSeededRandInt(0, 350/5) * 5;
    }

    GetCurrentPlunkValue(): number {
        let theta1 = this.dial.rotation;
        let theta2 = this.targetRotation;
        const PHI = Math.PI * 2;
        let rotationDistance = (((theta1 - theta2) % PHI) + PHI) % PHI;
        if (rotationDistance > Math.PI) rotationDistance = PHI - rotationDistance;

        let slideDistance = Math.abs(this.targetSlide - this.slider.x);
        let ret = 9999 - (rotationDistance * 1000 + slideDistance * 10);
        return Math.min(9999, Math.max(0, ret));
    }

    Update(): void {
        let sliderSpeed = 5;
        let rotationSpeed = 0.05;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && this.slider.x > 0) {
            this.slider.x -= sliderSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && this.slider.x < 350) {
            this.slider.x += sliderSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.dial.rotation += rotationSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.dial.rotation -= rotationSpeed;
        }

        this.meter.rotation = (this.timer % (60 * 10)) / 600 * Math.PI * 2;

        let plunkCurrent = 2147 + Math.floor(Math.random() * 5000);
        if (!this.isEnded && this.timer >= 0) {
            plunkCurrent = this.GetCurrentPlunkValue();
            if ((this.timer % (60 * 10)) == 0) {
                //score current 
                if (this.timer > 1) {
                    
                    this.score += Math.floor(plunkCurrent / 10) + 1;
                    audioHandler.PlaySound("confirm", false);
                }

                this.RandomizeTarget();
            }

        } else {

        }
        for (let i = 0; i < this.digits.length; i++) {
            let digitSprite = this.digits[i];
            let digitValue = Math.floor((plunkCurrent / Math.pow(10, this.digits.length - i - 1)) % 10);
            digitSprite.imageTile = tiles["plunkDisplay"][digitValue][0];
        }

        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    }

    GetRemainingTicks(): number {
        return 60 * 60 - this.timer;
    }


}