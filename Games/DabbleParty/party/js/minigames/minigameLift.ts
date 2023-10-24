class MinigameLift extends MinigameBase {
    title = "Like You Don't Even Want A Lift";
    instructions = [
        "This busted elevator's buttons change depending on what",
        "floor it's on. Some buttons will go up, some will go down.",
        "Try to remember the right button for each floor!"
    ];
    backdropTile: ImageTile = tiles["bgElevator"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][2][1];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Move, "Select button"),
        new InstructionControl(Control.Button, "Press button"),
    ];
    songId = "slime";
    backdropBuildings!: SimpleSprite;
    skyscraper!: SimpleSprite;

    digits: SimpleSprite[] = [];
    buttons: SimpleSprite[] = [];

    targetDisplayFloor: number = 1;
    currentDisplayFloor: number = 1;
    accelTimer = 0;
    elevatorDirection = 0;
    selectedIndex = -1;

    floors: number[][] = [];

    Initialize(): void {
        this.backdropBuildings = new SimpleSprite(266, 50, tiles["skyscrapers"][0][0]);
        this.skyscraper = new SimpleSprite(242, -160, tiles["bigSkyscraper"][0][0]);

        this.digits = [
            new SimpleSprite(-315, -198, tiles["elevatorDisplay"][12][0]),
            new SimpleSprite(-255, -198, tiles["elevatorDisplay"][0][0]),
            new SimpleSprite(-195, -198, tiles["elevatorDisplay"][1][0]),
        ];

        this.sprites.push(this.backdropBuildings, this.skyscraper, ...this.digits);

        for (let i = 0; i < 100; i++) {
            // create a floor
            let floor = this.GetButtonEffectsForFloorIndex(i);
            this.floors.push(floor);
        }

        this.ResetButtons();
    }

    GetButtonEffectsForFloorIndex(floorIndex: number): number[] {
        let buttonCount = 5 + Math.floor(floorIndex / 2);
        let maxUp = 2;
        let maxDown = Math.min(floorIndex, 3);
        let pool: number[] = [1]; 
        for (let a = 1; a <= maxUp; a++) pool.push(a);
        for (let a = 1; a <= maxDown; a++) pool.push(-a);

        if (pool.length > buttonCount) console.error("Button pool should always be smaller than number needed");

        let poolIter = [...pool];
        let ret: number[] = [];
        while (ret.length < buttonCount) {
            if (poolIter.length == 0) poolIter = [...pool];
            let index = Random.GetSeededRandInt(0, poolIter.length - 1);
            let removed = poolIter.splice(index, 1)[0];
            ret.push(removed);
        }

        return ret;
    }

    ResetButtons(): void {
        this.buttons.forEach(a => a.isActive = false);
        this.buttons = [];

        let buttonEffects = this.floors[this.currentDisplayFloor - 1];
        let buttonCount = buttonEffects.length;
        let buttonsPerRow = 5;
        for (let i = 0; i < buttonCount; i++) {
            let row = Math.floor(i / buttonsPerRow)
            let col = i % buttonsPerRow;
            let button = new SimpleSprite(col * 70 + -390, row * 70 + -70, tiles["elevatorButton"][0][0]);
            button.name = i.toString();
            this.buttons.push(button);
        }
        this.sprites.push(...this.buttons);
    }

    UpdateSelectedButton(): void {
        if (this.selectedIndex == -1) {
            this.selectedIndex = 0;
        }

        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            if (this.selectedIndex >= 5) this.selectedIndex -= 5;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true)) {
            if (this.selectedIndex % 5 != 0) this.selectedIndex -= 1;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true)) {
            if (this.selectedIndex % 5 != 4) this.selectedIndex += 1;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            if (this.selectedIndex <= this.buttons.length - 1 - 5) this.selectedIndex += 5;
        }
        if (this.selectedIndex > this.buttons.length) this.selectedIndex = this.buttons.length - 1;
        if (this.selectedIndex < 0) this.selectedIndex = 0;



        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].imageTile = tiles["elevatorButton"][0][0];
            if (i == this.selectedIndex) this.buttons[i].imageTile = tiles["elevatorButton"][1][0];
        }
    }

    UpdateFloorDisplay(): void {
        if (this.elevatorDirection == 0) {
            this.digits[0].imageTile = tiles["elevatorDisplay"][12][0];
        } else if (this.elevatorDirection > 0) {
            this.digits[0].imageTile = tiles["elevatorDisplay"][10][0];
        } else if (this.elevatorDirection < 0) {
            this.digits[0].imageTile = tiles["elevatorDisplay"][11][0];
        }
        let displayNumber =
            this.elevatorDirection > 0 ?
                Math.floor(this.currentDisplayFloor) :
                Math.ceil(this.currentDisplayFloor);
        let firstDigit = Math.floor(displayNumber / 10);
        let secondDigit = displayNumber % 10;
        this.digits[1].imageTile = tiles["elevatorDisplay"][firstDigit][0];
        this.digits[2].imageTile = tiles["elevatorDisplay"][secondDigit][0];
    }

    Update(): void {
        if (Math.abs(this.currentDisplayFloor - this.targetDisplayFloor) < 0.5) {
            this.accelTimer--;
            if (this.accelTimer < 30) this.accelTimer = 30;
            if (Math.abs(this.currentDisplayFloor - this.targetDisplayFloor) < 0.05) {
                //arrived at floor
                this.currentDisplayFloor = this.targetDisplayFloor;
                this.accelTimer = 0;
                if (this.elevatorDirection != 0) {
                    this.elevatorDirection = 0;
                    this.ResetButtons();
                }
            } else {
                this.elevatorDirection = this.currentDisplayFloor > this.targetDisplayFloor ? -1 : 1;
                this.currentDisplayFloor += this.elevatorDirection * this.accelTimer / 60 * 0.01;
            }
        } else {
            this.accelTimer += 1;
            if (this.accelTimer > 60) this.accelTimer = 60;
            this.elevatorDirection = this.currentDisplayFloor > this.targetDisplayFloor ? -1 : 1;
            this.currentDisplayFloor += this.elevatorDirection * this.accelTimer / 60 * 0.01;
        }

        this.UpdateFloorDisplay();

        if (this.elevatorDirection == 0 && this.timer >= 0) {
            this.UpdateSelectedButton();

            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && !this.isEnded) {
                this.buttons[this.selectedIndex].imageTile = tiles["elevatorButton"][2][0];
                let effect = this.floors[this.currentDisplayFloor - 1][this.selectedIndex];
                this.targetDisplayFloor += effect;
                this.score += effect;
                if (effect > 0) audioHandler.PlaySound("dobbloon", false);
                if (effect < 0) audioHandler.PlaySound("error", false);
            }
        }

        this.backdropBuildings.y = (this.currentDisplayFloor - 1) * 20 + 50;
        this.skyscraper.y = (this.currentDisplayFloor - 1) * 40 - 160;

        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    }

    GetRemainingTicks(): number {
        return 60 * 60 - this.timer;
    }
}