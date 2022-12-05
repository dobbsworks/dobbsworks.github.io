class CarnivalPrizeMenu extends Menu {
    stopsMapUpdate = true;
    backgroundColor = "#000";

    timer = 0;
    private backButton!: Button;
    private payButton!: Button;
    private deadPayButton!: Button;
    private playButton!: Button;
    private prizeDisplay!: PrizeDisplay;
    private bank = new PiggleBank(camera.canvas.width / 4, 0);
    protected gameState: "paying" | "starting" | "waiting" | "running" | "prize" | "done" = "paying";

    playCost = 10;
    unlockResult: null | AvatarUnlockResultDt = null;

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        let imageContainer = new Panel(-5, -5, camera.canvas.width + 10, camera.canvas.height + 10);
        imageContainer.backColor = "#F000"
        ret.push(imageContainer);

        let bg = new ImageFromTile(0, 0, camera.canvas.width, camera.canvas.height, tiles["carnivalBack"][0][1]);
        bg.fixedPosition = true;
        bg.zoom = 1;
        imageContainer.AddChild(bg);

        this.backButton = this.CreateBackButton();
        ret.push(this.backButton);

        ret.push(...this.GetGameElements());
        ret.push(this.bank);

        this.payButton = new Button(345, 480, 270, 85);
        this.payButton.normalBackColor = "#F00";
        this.payButton.mouseoverBackColor = "#F44";
        this.payButton.borderRadius = 4;
        this.payButton.borderColor = "#000";
        let coinIcon = new ImageFromTile(0, 0, 75, 75, tiles["dobbloon"][0][0]);
        this.payButton.AddChild(coinIcon);
        let costText = new UIText(0, 0, this.playCost + "/play", 40, "white");
        costText.yOffset = this.payButton.height / 2 + 10;
        costText.xOffset = -10;
        costText.textAlign = "right";
        this.payButton.AddChild(costText);
        ret.push(this.payButton);

        this.payButton.onClickEvents.push(() => {
            this.payButton.isHidden = true;
            this.backButton.isHidden = true;

            // // TODO REMOVE
            // setTimeout(() => {
            //     this.unlockResult = {
            //         ItemCode: "1AC",
            //         Success: true
            //     }
            //     this.OnSuccessfulSpendCall();
            // }, 1000);

            DataService.RollForUnlock(this.playCost).then(rollResult => {
                this.unlockResult = rollResult;
                this.OnSuccessfulSpendCall();
            }).catch(err => {
                UIDialog.Alert("Unable to complete transaction, please try again later.", "OK");
                MenuHandler.GoBack();
            });
        });

        this.deadPayButton = new Button(345, 480, 270, 85);
        this.deadPayButton.normalBackColor = "#888";
        this.deadPayButton.mouseoverBackColor = "#888";
        this.deadPayButton.borderRadius = 4;
        this.deadPayButton.borderColor = "#000";
        let deadcoinIcon = new ImageFromTile(0, 0, 75, 75, tiles["dobbloon"][0][0]);
        this.deadPayButton.AddChild(deadcoinIcon);
        let deadcostText = new UIText(0, 0, this.playCost + "/play", 40, "white");
        deadcostText.yOffset = this.deadPayButton.height / 2 + 10;
        deadcostText.xOffset = -10;
        deadcostText.textAlign = "right";
        this.deadPayButton.AddChild(deadcostText);
        ret.push(this.deadPayButton);

        this.deadPayButton.onClickEvents.push(() => {
            audioHandler.PlaySound("error", true);
        });

        this.playButton = new Button(645, 480, 270, 85);
        this.playButton.normalBackColor = "#F00";
        this.playButton.mouseoverBackColor = "#F44";
        this.playButton.borderRadius = 4;
        this.playButton.borderColor = "#000";
        let playText = new UIText(0, 0, "GO", 40, "white");
        playText.yOffset = this.playButton.height / 2 + 10;
        playText.xOffset = this.playButton.width / 2;
        playText.textAlign = "center";
        this.playButton.AddChild(playText);
        this.playButton.isHidden = true;
        ret.push(this.playButton);
        this.playButton.onClickEvents.push(() => {
            this.SwitchState("running");
        })

        this.prizeDisplay = new PrizeDisplay(camera.canvas.width / 2, -400);
        ret.push(this.prizeDisplay);

        this.SwitchState("paying");
        return ret;
    }

    OnSuccessfulSpendCall(): void {
        this.bank.RemoveCoins(this.playCost);
        this.SwitchState("starting");
    }


    Update(): void {
        super.Update();
        this.timer++;
        this.bank.Update();

        switch (this.gameState) {
            case "starting":
                this.GameStartUpdate();
                break;
            case "waiting":
                this.GameWaitUpdate();
                break;
            case "running":
                this.GameRunningUpdate();
                break;
            case "prize":
                this.PrizeUpdate();
                break;
        }
    }

    private PrizeUpdate(): void {
        if (this.timer == 1 && this.unlockResult) {
            this.prizeDisplay.avatarCode = this.unlockResult.itemCode;
            this.prizeDisplay.isNew = this.unlockResult.success;
            if (this.unlockResult?.success) {
                toastService.AnnounceAvatarUnlock(AvatarCustomizationMenu.GetImageFrom3CharCode(this.unlockResult.itemCode));
            }
        }
        let targetY = camera.canvas.height / 2;
        if (this.timer > 120) {
            targetY = -600;
        }
        if (this.timer == 150) {
            this.SwitchState("done");
            this.SwitchState("paying");
        }


        this.prizeDisplay.targetY = targetY;
    }

    SwitchState(newState: "paying" | "starting" | "waiting" | "running" | "prize" | "done"): void {
        this.gameState = newState;
        this.timer = 0;
        if (newState == "waiting") this.playButton.isHidden = false;
        if (newState == "running") this.playButton.isHidden = true;
        if (newState == "done") this.backButton.isHidden = false;
        if (newState == "paying") {
            this.payButton.isHidden = moneyService.currentFunds < this.playCost;
            this.deadPayButton.isHidden = moneyService.currentFunds >= this.playCost;
            this.unlockResult = null;
        }
    }

    wheel!: PrizeWheel;
    protected GetGameElements(): UIElement[] {
        this.wheel = new PrizeWheel(camera.canvas.width / 2, camera.canvas.height / 2 - 40);
        return [this.wheel];
    }
    protected GameStartUpdate(): void {
        // wheel rears back, then speeds up
        if (this.timer == 1) {
            this.wheel.speed = -0.02;
        }
        if (this.timer < 100) {
            this.wheel.speed *= 0.95;
        }
        if (this.timer >= 100 && this.timer < 120) {
            this.wheel.speed += 0.005;
        }
        if (this.timer == 130) {
            this.wheel.speed = 0.1;
            this.SwitchState("waiting");
        }
        this.wheel.Update();
    }
    protected GameWaitUpdate(): void {
        // wheel continues at static pace
        this.wheel.Update();
    }
    protected GameRunningUpdate(): void {
        // wheel waits until over correct slice, then slows down at predefined intervals
        if (this.wheel.targetTheta == -1 && this.unlockResult) {
            let isOnPrize = this.wheel.IsThetaOnPrize(this.wheel.theta);
            let isOnCorrectSlice = (isOnPrize && this.unlockResult.itemCode) || (!isOnPrize && !this.unlockResult.itemCode);
            if (isOnCorrectSlice) {
                this.wheel.targetTheta = this.wheel.theta + (4 * Math.PI);
            }
        } else {
            let remainingTheta = this.wheel.targetTheta - this.wheel.theta;
            if (remainingTheta < 0.002) {
                // close enough, lock in
                this.wheel.theta = this.wheel.targetTheta;
                this.wheel.speed = 0;
                this.SwitchState("prize");
            } else {
                let targetSpeed = remainingTheta * 0.02;
                if (targetSpeed < this.wheel.speed) {
                    this.wheel.speed = targetSpeed;
                }
            }
        }
        this.wheel.Update();
    }
}

class PrizeDisplay extends UIElement {
    avatarCode: string = "";
    timer = 0;
    isNew = false;

    FillStarburst(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, numPoints: number, r1: number, r2: number, thetaOffset: number): void {
        ctx.beginPath();
        let thetaDelta = Math.PI / numPoints;
        let theta = 0;
        for (let i = 0; i < numPoints * 2; i++) {
            theta += thetaDelta;
            let r = (i % 2 == 0) ? r1 : r2;
            let x = centerX + r * Math.cos(theta + thetaOffset);
            let y = centerY + r * Math.sin(theta + thetaOffset);
            ctx.lineTo(x, y);
        }
        ctx.fill();
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.avatarCode) {
            let imageTile = AvatarCustomizationMenu.GetImageFrom3CharCode(this.avatarCode);
            // draw a starburst and the image on top
            this.timer++;
            let thetaOffset = this.timer / 300;
            ctx.fillStyle = "#AA8500";
            this.FillStarburst(ctx, this.x, this.y + 3, 32, 150, 180, -thetaOffset);
            ctx.fillStyle = "#FFD700";
            this.FillStarburst(ctx, this.x, this.y, 32, 150, 180, -thetaOffset);
            ctx.fillStyle = "#AAAA00";
            this.FillStarburst(ctx, this.x, this.y + 3, 24, 100, 130, thetaOffset);
            ctx.fillStyle = "#FFFF00";
            this.FillStarburst(ctx, this.x, this.y, 24, 100, 130, thetaOffset);

            ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height, this.x - 80, this.y - 80, 80 * 2, 80 * 2);


            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.font = `30px Grobold`;
            ctx.textAlign = "center";
            ctx.fillText("Received:", this.x, this.y - 80);
            ctx.strokeText("Received:", this.x, this.y - 80);

            if (this.isNew) {
                ctx.font = `60px Grobold`;
                let hue = ((this.timer * 3) % 360).toFixed(0);
                ctx.fillStyle = `hsl(${hue},100%,50%)`;
                ctx.fillText("New!", this.x, this.y + 120);
                ctx.strokeText("New!", this.x, this.y + 120);
            } else {
                ctx.fillText("Already owned", this.x, this.y + 100);
                ctx.strokeText("Already owned", this.x, this.y + 100);
            }
        }
    }


    IsMouseOver(): boolean { return false; }
    GetMouseOverElement(): UIElement | null { return null; }

}

class PrizeWheel extends UIElement {

    targetTheta = -1;
    theta = 0;
    speed = 0;
    prizeRanges: { t0: number, t1: number }[] = []

    Draw(ctx: CanvasRenderingContext2D): void {
        let radius = 150;

        ctx.fillStyle = "#759";
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "lime";
        for (let slice of this.prizeRanges) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.arc(this.x, this.y, radius, this.theta - slice.t0, this.theta - slice.t1, true);
            ctx.fill();
        }

        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = "#999";
        ctx.beginPath();
        ctx.moveTo(this.x + radius + 10, this.y);
        ctx.lineTo(this.x + radius + 10 + 30, this.y + 15);
        ctx.lineTo(this.x + radius + 10 + 30, this.y - 15);
        ctx.lineTo(this.x + radius + 10, this.y);
        ctx.fill();
    }

    IsThetaOnPrize(theta: number): boolean {
        theta %= (2 * Math.PI);
        return this.prizeRanges.some(a => theta > a.t0 && theta < a.t1);
    }

    Update() {
        super.Update();
        if (this.prizeRanges.length == 0) {
            let sliceCount = 8;
            let sliceSize = 2 * Math.PI / sliceCount;
            for (let i = 0; i < sliceCount; i += 2) {
                let t0 = i * sliceSize;
                let t1 = t0 + sliceSize;
                this.prizeRanges.push({ t0: t0, t1: t1 });
            }
        }

        this.theta += this.speed;
    }


    IsMouseOver(): boolean {
        return false;
    }
    GetMouseOverElement(): UIElement | null {
        return null;
    }

}