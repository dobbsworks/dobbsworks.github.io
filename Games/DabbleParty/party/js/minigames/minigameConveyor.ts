interface ConveyorSpot {
    left: number;
    right: number;
    top: number;
    direction: -1 | 1;
    axles: SimpleSprite[];
    x1: number;
    x2: number;
    y: number;
}

class MinigameConveyor extends MinigameBase {
    title = "Conveyor Surveyor";
    instructions = [
        "Sort as many boxes as you can into the matching",
        "crates! There's no penalty for boxes going into",
        "the wrong place."
    ];
    backdropTile: ImageTile = tiles["bgConveyor"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][1][0];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Up, "Reverse upper conveyors"),
        new InstructionControl(Control.Horizontal, "Reverse middle conveyors"),
        new InstructionControl(Control.Down, "Reverse lower conveyors"),
    ];
    songId = "clocktower";
    axles: SimpleSprite[] = [];
    overlays: SimpleSprite[] = [];

    conveyorSpots: ConveyorSpot[] = [
        { left: 40 * 5, right: 40 * 10, top: 40 * 3, direction: 1, axles: [], x1: 0, x2: 0, y: 0 },
        { left: 40 * 14, right: 40 * 19, top: 40 * 3, direction: 1, axles: [], x1: 0, x2: 0, y: 0 },
        { left: 40 * 2, right: 40 * 6, top: 40 * 6, direction: -1, axles: [], x1: 0, x2: 0, y: 0 },
        { left: 40 * 9, right: 40 * 15, top: 40 * 6, direction: -1, axles: [], x1: 0, x2: 0, y: 0 },
        { left: 40 * 18, right: 40 * 22, top: 40 * 6, direction: -1, axles: [], x1: 0, x2: 0, y: 0 },
        { left: 40 * 5, right: 40 * 11.25, top: 40 * 9, direction: 1, axles: [], x1: 0, x2: 0, y: 0 },
        { left: 40 * 12.75, right: 40 * 19, top: 40 * 9, direction: 1, axles: [], x1: 0, x2: 0, y: 0 }
    ]

    Initialize(): void {
        for (let c of this.conveyorSpots) {
            c.x1 = c.left - camera.canvas.width / 2;
            c.x2 = c.right - camera.canvas.width / 2;
            c.y = c.top - camera.canvas.height / 2;

            let index = c.direction == 1 ? 3 : 4;
            let axle1 = new SimpleSprite(c.left + 20 - camera.canvas.width / 2, c.top + 20 - camera.canvas.height / 2, tiles['conveyorBlocks'][index][0]);
            let axle2 = new SimpleSprite(c.right - 20 - camera.canvas.width / 2, c.top + 20 - camera.canvas.height / 2, tiles['conveyorBlocks'][index][0]);
            this.axles.push(axle1, axle2);
            c.axles = [axle1, axle2];
        }

        this.overlays.push(
            new SimpleSprite(-300, 250, tiles["conveyorCrates"][0][0]),
            new SimpleSprite(0, 250, tiles["conveyorCrates"][1][0]),
            new SimpleSprite(300, 250, tiles["conveyorCrates"][2][0]),
            new SimpleSprite(-420, 250, tiles["conveyorCrates"][3][0]),
            new SimpleSprite(420, 250, tiles["conveyorCrates"][3][0]),
            new SimpleSprite(-180, -270, tiles["conveyorCrates"][4][0]),
            new SimpleSprite(180, -270, tiles["conveyorCrates"][4][0]),
        )

        this.sprites.push(...this.axles, ...this.overlays);
    }

    CreateNewBox(): void {
        let x = Random.RandFrom([-180, 180]);
        let y = -220;
        let boxIndex = Random.GetRandInt(0, 2);
        let box = new SimpleSprite(x, y, tiles['conveyorBlocks'][boxIndex][0]);
        box.name = boxIndex.toString();
        this.sprites.push(box);
    }

    FlipConveyor(conveyorSpot: ConveyorSpot) {
        conveyorSpot.direction *= -1;
        let tile = tiles['conveyorBlocks'][conveyorSpot.direction == 1 ? 3 : 4][0];
        conveyorSpot.axles.forEach(a => {
            a.imageTile = tile;
        })
    }

    Update(): void {
        for (let box of this.sprites.filter(a => a.name.length > 0)) {
            let conveyorBelow = this.conveyorSpots.find(a => a.x1 < box.x + 20 && a.x2 > box.x - 20 && a.y >= box.y + 20);
            box.dy += 0.2;
            box.y += box.dy;
            if (conveyorBelow) {
                if (box.y + 20 >= conveyorBelow.y) {
                    // on conveyor
                    box.y = conveyorBelow.y - 20;
                    box.dy = 0;
                    box.x += conveyorBelow.direction * 1;
                }
            }

            if (box.y >= 210) {
                box.isActive = false;
                let crate = this.overlays.find(a => Math.abs(a.x - box.x) < 12);
                if (crate) {
                    crate.dy = 10; // store wiggle in dy, whatever
                    // check for right box
                    if (crate == this.overlays[+box.name]) {
                        this.score++;
                        audioHandler.PlaySound("dobbloon", false);
                        this.sprites.push(new ScoreSprite(box.x, box.y));
                    }
                }
            }
        }

        for (let overlay of this.overlays) {
            if (overlay.dy > 0) {
                overlay.xScale = ([1, 0.9, 0.85, 0.9, 1.05, 1.2, 1.3, 1.35, 1.3, 1.2, 1.05][overlay.dy] + 1) / 2;
                overlay.yScale = overlay.xScale;
                overlay.dy--;
            }
        }


        for (let conveyor of this.conveyorSpots) {
            conveyor.axles.forEach(a => {
                a.rotation += 0.1 * conveyor.direction;
            })
        }

        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            for (let index of [0, 1]) {
                this.FlipConveyor(this.conveyorSpots[index]);
            }
            audioHandler.PlaySound("erase", false);
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true) || KeyboardHandler.IsKeyPressed(KeyAction.Right, true) || KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            for (let index of [2, 3, 4]) {
                this.FlipConveyor(this.conveyorSpots[index]);
            }
            audioHandler.PlaySound("erase", false);
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            for (let index of [5, 6]) {
                this.FlipConveyor(this.conveyorSpots[index]);
            }
            audioHandler.PlaySound("erase", false);
        }

        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }

        let timerSeconds = this.timer / 60;
        if (timerSeconds % 1 == 0 && timerSeconds > 0 && timerSeconds < 60) {
            this.CreateNewBox();
        }
    }

    GetRemainingTicks(): number {
        return 60 * 60 - this.timer;
    }

    OnBeforeDrawSprites(camera: Camera): void {
        for (let conveyor of this.conveyorSpots) {
            let x1 = conveyor.left - camera.canvas.width / 2;
            let xMid = (conveyor.right + conveyor.left) / 2 - camera.canvas.width / 2;
            let x2 = conveyor.right - camera.canvas.width / 2;
            let scale = (conveyor.right - conveyor.left) / 40 - 2;
            let y = conveyor.top - camera.canvas.height / 2;
            let imageRow = conveyor.direction == 1 ? 2 : 1;
            (tiles['conveyorBlocks'][0][imageRow] as ImageTile).Draw(camera, x1 + 20, y + 20, 1, 1, false, false, 0);
            (tiles['conveyorBlocks'][2][imageRow] as ImageTile).Draw(camera, x2 - 20, y + 20, 1, 1, false, false, 0);
            (tiles['conveyorBlocks'][1][imageRow] as ImageTile).Draw(camera, xMid, y + 20, scale, 1, false, false, 0);
        }
    }
}