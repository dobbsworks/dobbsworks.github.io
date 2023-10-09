class MinigameHoopstersForever extends MinigameBase {
    title = "Hoopsters Forever";
    instructions = [
        "Line up your shot and go for the goal! Try to find",
        "the right angle and power for your shot. And remember:",
        "hoopsters are forever."
    ];
    backdropTile: ImageTile = tiles["bgHoops"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][0][1];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Move, "Adjust angle"),
        new InstructionControl(Control.Button, "(Hold) Adjust power"),
        new InstructionControl(Control.Button, "(Release) Launch shot"),
    ];
    songId = "choir";

    ball!: SimpleSprite;
    hoop!: SimpleSprite;
    hoopOverlay!: SimpleSprite;
    launcher!: SimpleSprite;

    launchPower = 0;
    powerDirection = 1;
    goalIn = false;
    didBallGoAboveGoal = false;

    Initialize(): void {
        Random.SetSeed(5);
        this.hoop = new SimpleSprite(80, 200, tiles["hoops"][playerIndex][0]);
        this.hoopOverlay = new SimpleSprite(80, 200, tiles["hoops"][1][1]);
        this.ball = new SimpleSprite(19, 1000, tiles["hoops"][0][1]);
        this.launcher = new SimpleSprite(-350, 170, tiles["hoops"][2][1]);
        this.sprites.push(this.hoop, this.ball, this.hoopOverlay, this.launcher);
        this.SetHoopPosition();
    }

    Update(): void {
        let rotationSpeed = 0.03;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) || KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
            this.launcher.rotation -= rotationSpeed;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) || KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
            this.launcher.rotation += rotationSpeed;
        }
        if (this.launcher.rotation > 0) this.launcher.rotation = 0;
        if (this.launcher.rotation < -Math.PI / 2) this.launcher.rotation = -Math.PI / 2;

        if (!this.isEnded && this.timer >= 0) {
            this.ball.rotation += 0.03;
            this.ball.dy += 0.2;
            this.ball.y += this.ball.dy;
            this.ball.x += this.ball.dx;

            let rimX1 = this.hoop.x - 65;
            let rimX2 = this.hoop.x + 65;
            let rimY = this.hoop.y + 15;
            let rimRadius = 10;
            let ballRadius = 38;

            if (this.ball.y < this.hoop.y) this.didBallGoAboveGoal = true;

            for (let rimX of [rimX1, rimX2]) {

                let distanceFromRimCenterToCenter = Math.sqrt((rimX - this.ball.x) ** 2 + (rimY - this.ball.y) ** 2);
                if (distanceFromRimCenterToCenter < rimRadius + ballRadius) {
                    // hit the rim!
                    // mirror velocity across tangent vector, then reverse
                    let theta = Math.atan2(this.ball.y - rimY, this.ball.x - rimX);
                    let oldVelocityAngle = Math.atan2(this.ball.dy, this.ball.dx);
                    let newVelocityAngle = oldVelocityAngle + (theta - oldVelocityAngle) * 2 + Math.PI;
                    let velocityMagnitude = Math.sqrt(this.ball.dy ** 2 + this.ball.dx ** 2);

                    // don't let ball be overinflated, dampen velocity
                    velocityMagnitude = velocityMagnitude * 0.5 + 1;
                    this.ball.dy = velocityMagnitude * Math.sin(newVelocityAngle);
                    this.ball.dx = velocityMagnitude * Math.cos(newVelocityAngle);

                    this.ball.y += this.ball.dy;
                    this.ball.x += this.ball.dx;
                    audioHandler.PlaySound("soccer", false);
                }
            }

            let distanceFromGoalCenterToCenter = Math.sqrt((this.hoop.x - this.ball.x) ** 2 + (rimY + 15 - this.ball.y) ** 2);
            if (distanceFromGoalCenterToCenter < ballRadius + 18 && !this.goalIn && this.didBallGoAboveGoal) {
                // goal!
                this.goalIn = true;
                this.score++;
                audioHandler.PlaySound("dobbloon", false);
                let scoreUp = new SimpleSprite(this.ball.x + 1, this.ball.y, tiles["droppingItems"][3][0], (s) => {
                    s.y -= 2;
                    if (s.age > 50) s.isActive = false;
                }).Scale(2);
                this.sprites.push(scoreUp);
            }
            
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, false)) {
                this.launchPower += this.powerDirection;
                if (this.launchPower == 100 || this.launchPower == 0) this.powerDirection *= -1;
            }

            if (this.goalIn && this.IsBallOffScreen()) {
                // reset board
                this.goalIn = false;
                this.SetHoopPosition();
            }

            if (!KeyboardHandler.IsKeyPressed(KeyAction.Action1, false) && this.launchPower > 0) {
                // FIRE!
                let launchSpeed = this.launchPower / 5;
                this.ball.dx = launchSpeed * Math.cos(this.launcher.rotation);
                this.ball.dy = launchSpeed * Math.sin(this.launcher.rotation);
                this.ball.x = this.launcher.x + 50 * Math.cos(this.launcher.rotation);
                this.ball.y = this.launcher.y + 50 * Math.sin(this.launcher.rotation);
                
                this.powerDirection = 1;
                this.launchPower = 0;
                this.didBallGoAboveGoal = false;
            }
        }

        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    }

    GetRemainingTicks(): number {
        return 60 * 60 - this.timer;
    }

    SetHoopPosition(): void {
        this.hoop.x = Random.GetRandInt(-120, 380);
        this.hoop.y = Random.GetRandInt(0, 120);
        this.hoopOverlay.x = this.hoop.x;
        this.hoopOverlay.y = this.hoop.y;
    }

    IsBallOffScreen(): boolean {
        let isBallOob = this.ball.y > 400 || this.ball.x > 600;
        return isBallOob && !this.isEnded && this.timer >= 0;
    }

    OnAfterDraw(camera: Camera): void {
        if (!this.isEnded) {
            camera.ctx.fillStyle = KeyboardHandler.IsKeyPressed(KeyAction.Action1, false) ? "#0008" : "#0001";
            camera.ctx.fillRect( 30, 510, 40, -204);
            camera.ctx.fillStyle = "lime";
            camera.ctx.fillRect( 32, 508, 36, -this.launchPower * 2);
        }
        //camera.ctx.fillRect(camera.canvas.width / 2 + this.hoop.x - 9, camera.canvas.height / 2 +this.hoop.y + 15 + 15 - 9, 18, 18);
    }
}