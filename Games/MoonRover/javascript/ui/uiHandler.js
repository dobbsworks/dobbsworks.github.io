class UIHandler {

    elements = [];
    history = [];
    debugMode = false;
    extraCursor = false;
    initialized = false;
    timer = 0;

    getButtons() {
        return this.elements.filter(x => x instanceof Button);
    }
    RemoveButtons() {
        this.elements = this.elements.filter(x => !(x instanceof Button));
    }

    Shelve() {
        // throws all ui elements on a history stack for later retrieval
        this.history.push(this.elements);
        this.elements = [];
    }

    Restore() {
        this.elements = this.history.pop();
    }

    buttonLastClicked = 0;
    Update() {
        this.timer++;
        let mouseOverAnyButton = false;
        for (let button of this.getButtons()) {
            if (button.isMouseOver()) {
                if (button.isDisabled) {
                    if (isMouseClicked()) {
                        audioHandler.PlaySound("beep-03");
                    }
                } else {
                    if (isMouseDown) {
                        button.holdTimer += 1;
                        if (button.holdTimer > 60) {
                            if (button.onHold) button.onHold();
                        }
                    }
                    mouseOverAnyButton = true;
                    let canClick = (this.timer - this.buttonLastClicked > 5);
                    if (isMouseClicked() && canClick) {
                        this.buttonLastClicked = this.timer;
                        if (button instanceof Toggle) {
                            button.Toggle();
                        } else {
                            if (button.onClick) button.onClick();
                            audioHandler.PlaySound("beep-02");
                        }
                        // isMouseDown = false;
                        // isMouseChanged = false;
                    }
                }
            } else {
                button.holdTimer = 0;
            }
        }
        if (isMouseClicked()) {
            sidebarHandler.toMoveIndex = -1;
        }

        for (let toggle of this.elements.filter(x => x instanceof Toggle)) {
            if (toggle.IsOn) toggle.state = toggle.IsOn();
        }

        document.body.style.cursor = mouseOverAnyButton ? "pointer" : "unset";

        for (let el of this.elements) {
            el.x += (el.targetX - el.x) / 10;
            el.y += (el.targetY - el.y) / 10;
        }

        
        if (!pauseHandler.isPaused && !mainMenuHandler.isOnMainMenu) {
            timerHandler.Update();
        }
    }

    // immediately move to target locations
    Snap() {
        for (let el of this.elements) {
            el.x = el.targetX;
            el.y = el.targetY;
        }
    }

    Draw() {
        let t0 = performance.now();

        let msPerFrame = performanceData.map(x => x.total).reduce((a, b) => a + b, 0) / performanceData.length;
        let drawMsPerFrame = performanceData.map(x => x.draw).reduce((a, b) => a + b, 0) / performanceData.length;
        let updateMsPerFrame = performanceData.map(x => x.update).reduce((a, b) => a + b, 0) / performanceData.length;
        //let fps = Math.floor(1000 / msPerFrame) * 1;

        if (shopHandler.isInShop) {
            sidebarHandler.DrawSideBar();
            this.DrawTimer();
            shopHandler.DrawShop();
        } else if (pauseHandler.isPaused) {

        } else if (mainMenuHandler.isOnMainMenu) {

        } else {
            if (player.isActive) {
                sidebarHandler.DrawSideBar();
                this.DrawTimer();
            }
        }

        for (let el of this.elements) {
            el.Draw();
        }

        let uiDrawTime = performance.now() - t0;
        if (this.debugMode) {
            this.DrawDebugLines([
                { text: "ms/frame", value: msPerFrame },
                { text: "ms/update", value: updateMsPerFrame },
                { text: "ms/draw", value: drawMsPerFrame },
                { text: "ms/ui", value: uiDrawTime },
            ])
        }
    }

    FormatFPS(x) {
        return (Math.floor(1000 * x) / 1000).toFixed(3);
    }

    DrawDebugLines(lines) {
        let y = 21;
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - 150 - 10, 0, 160, lines.length * 19 + 12);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        for (let line of lines) {
            ctx.fillText(line.text + ": ", canvas.width - 150, y);
            ctx.fillText(this.FormatFPS(line.value), canvas.width - 50, y);
            y += 19;
        }
    }


    DrawTimer() {
        if (timerHandler.displayed) {
            timerHandler.DrawTimer();
        }
    }
}