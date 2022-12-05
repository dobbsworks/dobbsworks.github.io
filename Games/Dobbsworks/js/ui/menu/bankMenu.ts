class BankMenu extends Menu {
    stopsMapUpdate = true;
    backgroundColor = "#DA0";
    backgroundColor2 = "#431";

    private bank = new PiggleBank(camera.canvas.width / 2, 0);

    private continueButton!: Button;


    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];

        let buttonWidth = 200;
        let buttonHeight = 50;
        this.continueButton = new Button(camera.canvas.width - buttonWidth - 20, camera.canvas.height - buttonHeight - 20, buttonWidth, buttonHeight);
        let continueText = new UIText(camera.canvas.width / 2, this.continueButton.y + 20, "CONTINUE", 20, "#FFF");
        this.continueButton.AddChild(continueText);
        continueText.xOffset = this.continueButton.width / 2 - 5;
        continueText.yOffset = 30;
        this.continueButton.onClickEvents.push(() => {
            MenuHandler.GoBack();
        })

        ret.push(this.continueButton);
        this.continueButton.isHidden = true;



        ret.push(this.bank);

        return ret;
    }


    Update(): void {
        this.bank.Update();

        if (this.bank.IsDone()) {
            this.continueButton.isHidden = false;
        }
    }

}

class PiggleBank extends UIElement {

    Draw(ctx: CanvasRenderingContext2D): void {
        for (let coin of [...this.incomingCoins, ...this.outgoingCoins].filter(a => !a.processed)) {
            let frame = Math.floor(coin.frame / 10) % 6;
            let coinTile = tiles["dobbloon"][frame][0];
            let coinScale = 4;
            ctx.drawImage(coinTile.src, coinTile.xSrc, coinTile.ySrc, coinTile.width, coinTile.height,
                coin.x - (coinScale * coinTile.width / 2),
                coin.y,
                coinTile.width * coinScale, coinTile.height * coinScale);
        }

        // 36x32
        let bankFrame = [1, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 2, 1, 0, 0, 1, 2, 3, 2][Math.floor(this.bankAnimationTimer)];
        let imageTile = tiles["piggleBank"][bankFrame][0];
        let scale = 8;
        ctx.drawImage(imageTile.src, imageTile.xSrc, imageTile.ySrc, imageTile.width, imageTile.height,
            this.x - (scale * imageTile.width / 2),
            400,
            imageTile.width * scale, imageTile.height * scale);


        if (this.x == camera.canvas.width / 2) {
            let bubbleImage = tiles["bankBubble"][0][0];
            ctx.drawImage(bubbleImage.src, bubbleImage.xSrc, bubbleImage.ySrc, bubbleImage.width, bubbleImage.height,
                80, 350, bubbleImage.width, bubbleImage.height);
        }

        // draw money amount
        ctx.font = `${48}px ${"Grobold"}`;
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        let text = moneyService.currentFunds.toString();
        
        if (this.x == camera.canvas.width / 2) {
            ctx.strokeText(text, 220, 370);
            ctx.fillText(text, 220, 370);
        } else {
            ctx.strokeText(text, 235, 550);
            ctx.fillText(text, 235, 550);
        }
    }

    incomingCoins: { x: number, y: number, frame: number, processed: boolean }[] = [];
    outgoingCoins: { x: number, y: number, frame: number, processed: boolean }[] = [];
    timer = 0;
    bankAnimationTimer = 0;

    RemoveCoins(coinCount: number): void {
        for (let i = 0; i < coinCount; i++) {
            let x = (Math.random() * 4) - 2 + this.x;
            let y = i * 100 + Math.random() * 50  + 400;
            let frame = Math.floor(Math.random() * 60);
            this.outgoingCoins.push({ x: x, y: y, frame: frame, processed: false });
        }
    }

    Update() {
        this.timer++;

        if (this.bankAnimationTimer > 0) this.bankAnimationTimer -= 0.25;

        if (this.timer == 20) {

            let numCoins = moneyService.fundsToAnimate;
            for (let i = 0; i < numCoins; i++) {
                let x = (Math.random() * 0.8 + 0.1) * camera.canvas.width;
                let y = i * -100 + Math.random() * 50 - 100;
                let frame = Math.floor(Math.random() * 60);
                this.incomingCoins.push({ x: x, y: y, frame: frame, processed: false });
            }

        }

        let targetX = this.x;
        for (let coin of this.incomingCoins.filter(a => !a.processed)) {
            coin.x += (targetX - coin.x) * 0.02;
            coin.y += 4;
            coin.frame++;
            if (coin.y > 400) {
                coin.processed = true;
                this.bankAnimationTimer = 18;
                moneyService.fundsToAnimate--;
                moneyService.currentFunds++;

                audioHandler.PlaySound("dobbloon", false);
            }
        }

        for (let coin of this.outgoingCoins.filter(a => !a.processed)) {
            if (coin.y < 400) coin.x += (targetX > coin.x) ? -0.3 : 0.3;
            coin.y -= 4;
            coin.frame++;
            if (coin.y < 400 && coin.y >= 396) {
                this.bankAnimationTimer = 18;
                moneyService.currentFunds--;
                audioHandler.PlaySound("dobbloon", false);
            }
            if (coin.y < -100) {
                coin.processed = true;
            }
        }

    }

    IsDone(): boolean {
        return this.incomingCoins.every(a => a.processed) && this.outgoingCoins.every(a => a.processed) && this.bankAnimationTimer <= 0 && this.timer > 60;
    }

    IsMouseOver(): boolean {
        return false;
    }
    GetMouseOverElement(): UIElement | null {
        return null;
    }

}