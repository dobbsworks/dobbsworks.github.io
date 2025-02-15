abstract class UIDialog {

    // list of selection

    options: UIDialogOption[] = [];
    promptText: string = "";
    promptLines: string[] = [];
    suppressKeyNavigation = false;
    title: string = "";
    targetTime: Date | null = null;
    targetTimeText: string = "";

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#0009";
        ctx.strokeStyle = "#BBB";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        ctx.fillStyle = "#226";
        ctx.fillRect(200, 150, ctx.canvas.width - 400, ctx.canvas.height - 300);
        ctx.strokeRect(200, 150, ctx.canvas.width - 400, ctx.canvas.height - 300);

        ctx.fillStyle = "white";
        ctx.font = `${16}px ${"arial"}`;
        ctx.textAlign = "center";

        if (this.promptLines.length == 0) {
            this.promptLines = UISplitLines(ctx, this.promptText, 450);
        }
        let yIter = 200;

        if (this.title) {
            ctx.font = `${24}px ${"grobold"}`;
            ctx.fillText(this.title, ctx.canvas.width / 2, yIter);
            ctx.font = `${16}px ${"arial"}`;
            yIter += 36;
        }

        for (let line of this.promptLines) {
            ctx.fillText(line, ctx.canvas.width / 2, yIter);
            yIter += 18;
        }


        let xIter = 230;

        if (this.targetTime) {
            let remainingTime = +new Date(this.targetTime) - +new Date();
            if (remainingTime < 0) remainingTime = 0;
            let remainingTimeText = Utility.MsToTimeText(remainingTime);
            let text = this.targetTimeText + ": " + remainingTimeText;
            ctx.fillStyle = "#BBB";
            ctx.textAlign = "left";
            ctx.fillText(text, xIter, 370 - 15);
            ctx.textAlign = "center";
        }


        if (this.options.length == 1) xIter += 175 * 2;
        for (let option of this.options) {
            if (option.x == -1) {
                option.x = xIter;
                option.y = 370;
                option.xRight = option.x + 150;
                option.yBottom = option.y + 40;
                xIter += 175;
                if (this.options.length == 2) xIter += 175;
            }

            option.Draw(ctx);
        }
    }

    AddFiveStarButtons(onClick: (oneToFiveRank: number) => void): void {
        let xIter = 230;
        for (let i = 1; i <= 5; i++) {
            let newOption = new UIDialogStarVote(i, () => {
                onClick(i);
            });
            newOption.x = xIter;
            newOption.xRight = xIter + 76;
            newOption.y = 320 - 76;
            newOption.yBottom = 320;
            this.options.push(newOption);
            xIter += 106;
        }
    }

    Update(): void {
        this.options.forEach(a => a.Update());
        if (this.options.some(a => a.isMouseOver)) {
            document.body.style.cursor = "pointer";

            if (mouseHandler.isMouseClicked()) {
                let option = this.options.find(a => a.isMouseOver);
                if (option) {
                    MenuHandler.Dialog = null;
                    option.action(...this.GetButtonActionParameters());
                    this.OnAnyAction();
                    mouseHandler.isMouseDown = false;
                }
            }

        } else {
            document.body.style.cursor = "unset";
        }

        if (MenuHandler.Dialog == this) {
            // no options clicked
            if (KeyboardHandler.IsKeyPressed(KeyAction.Cancel, true) && !this.suppressKeyNavigation) {
                this.OnKeyboardCancel();
                this.OnAnyAction();
                MenuHandler.Dialog = null;
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Confirm, true) && !this.suppressKeyNavigation) {
                this.OnKeyboardConfirm();
                this.OnAnyAction();
                MenuHandler.Dialog = null;
            }
        }
    }

    GetButtonActionParameters(): any[] {
        return [];
    }

    OnAnyAction(): void { }

    OnKeyboardConfirm(): void { }
    OnKeyboardCancel(): void { }

    static SetCountdown(title: string, targetTime: Date) {
        if (MenuHandler.Dialog) {
            MenuHandler.Dialog.targetTime = targetTime;
            MenuHandler.Dialog.targetTimeText = title;
        }
    }

    static Alert(info: string, confirmButtonText: string): void {
        MenuHandler.Dialog = new UIAlert(info, confirmButtonText);
    }
    static Confirm(info: string, confirmButtonText: string, rejectButtonText: string, confirmAction: () => void): void {
        MenuHandler.Dialog = new UIConfirm(info, confirmButtonText, rejectButtonText, confirmAction);
    }
    static SmallPrompt(info: string, confirmButtonText: string, maxLength: number, confirmAction: (text: string) => void, allowedCharacters: string = ""): void {
        MenuHandler.Dialog = new UISmallPrompt(info, confirmButtonText, maxLength, confirmAction, allowedCharacters);
    }
    static ReadKey(info: string, confirmButtonText: string, rejectButtonText: string, confirmAction: () => void): void {
        MenuHandler.Dialog = new UIReadKey(info, confirmButtonText, rejectButtonText, confirmAction);
    }
}

function UISplitLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

class UIDialogOption {
    constructor(
        public text: string,
        public action: (...args: any[]) => void
    ) { }
    x: number = -1;
    xRight: number = -1;
    y: number = -1;
    yBottom: number = -1;
    color: string = "#000A"

    isMouseOver = false;

    Update(): void {
        let mouseX = mouseHandler.GetCanvasMousePixel().xPixel;
        let mouseY = mouseHandler.GetCanvasMousePixel().yPixel;
        this.isMouseOver = (mouseX >= this.x &&
            mouseX <= this.xRight &&
            mouseY >= this.y &&
            mouseY <= this.yBottom);
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.xRight - this.x, this.yBottom - this.y);

        ctx.strokeStyle = this.isMouseOver ? "#BBB" : "#BBB8";
        ctx.strokeRect(this.x, this.y, this.xRight - this.x, this.yBottom - this.y);
        ctx.fillStyle = "#BBB";
        ctx.fillText(this.text, (this.x + this.xRight) / 2, this.yBottom - 15);
    }
}

class UIDialogStarVote extends UIDialogOption {
    constructor(public rank: number, action: (...args: any[]) => void) {
        super("", action);
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        let imageCol = this.isMouseOver ? 2 : 0;
        if (MenuHandler.Dialog) {
            let mouseOverStar = <UIDialogStarVote>MenuHandler.Dialog.options.find(a => a instanceof UIDialogStarVote && a.isMouseOver);
            if (mouseOverStar && mouseOverStar.rank > this.rank) {
                imageCol = 1;
            }
        }

        let image = tiles["voteStars"][imageCol][0] as ImageTile;
        ctx.drawImage(image.src, image.xSrc, image.ySrc, image.width, image.height, this.x, this.y, this.xRight - this.x, this.yBottom - this.y);
    }
}

class UISmallPrompt extends UIDialog {
    constructor(
        messageText: string,
        confirmText: string,
        private maxLength: number,
        private onConfirmAction: (value: string) => void,
        private allowedCharacters: string // blank to allow all
    ) {
        super();
        let cancelOption = new UIDialogOption("Cancel", () => { });
        cancelOption.color = "#115B";
        this.options.push(cancelOption, new UIDialogOption(confirmText, onConfirmAction));
        this.promptText = messageText;
    }

    inputForm!: HTMLInputElement;

    static SimpleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-/=%`#@&(),.;'?! ";
    static LevelCodeCharacters = "ABCDEFabcdef0123456789";

    GetButtonActionParameters() {
        return [this.inputForm.value];
    }

    OnAnyAction(): void {
        try {
            document.body.removeChild(this.inputForm);
        } catch (e) { }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);

        ctx.fillStyle = "#EEE";
        ctx.strokeStyle = "#BBB8";
        ctx.fillRect(230, 300, 500, 40);
        ctx.strokeRect(230, 300, 500, 40);

        ctx.fillStyle = "#333";
        let textToDraw = this.inputForm.value;
        let caretPosition = this.inputForm.selectionStart ?? textToDraw.length;
        textToDraw = [textToDraw.slice(0, caretPosition), "|", textToDraw.slice(caretPosition)].join('');
        ctx.fillText(textToDraw, ctx.canvas.width / 2, 340 - 15);
    }

    Update() {
        super.Update();
        if (!this.inputForm) {
            this.inputForm = document.createElement('input');
            this.inputForm.onkeydown = (e) => {
                if (e.code === "Enter" || e.code === "NumpadEnter") {
                    this.onConfirmAction(this.inputForm.value);
                    document.body.removeChild(this.inputForm);
                    MenuHandler.Dialog = null;
                }
                if (e.code === "Escape") {
                    this.onConfirmAction(this.inputForm.value);
                    document.body.removeChild(this.inputForm);
                    MenuHandler.Dialog = null;
                }
            };
            document.body.prepend(this.inputForm);
            this.inputForm.focus();
            if (this.maxLength) this.inputForm.maxLength = this.maxLength;
            this.inputForm.style.opacity = "0";
            this.inputForm.style.position = "fixed";
            this.inputForm.style.top = "0";
        } else {
            this.inputForm.focus();
        }

        if (document.activeElement != this.inputForm) {
            KeyboardHandler.connectedInput = this.inputForm;
        } else {
            KeyboardHandler.connectedInput = null;
        }

        if (this.allowedCharacters.length) {
            this.inputForm.value = this.inputForm.value.split("").filter(a => this.allowedCharacters.indexOf(a) > -1).join("");;
        }
    }
}

class UIAlert extends UIDialog {
    constructor(
        messageText: string,
        confirmText: string,
        private onConfirmAction: () => void = () => { }
    ) {
        super();
        this.options.push(new UIDialogOption(confirmText, onConfirmAction));
        this.promptText = messageText;
    }

    OnKeyboardConfirm(): void { this.onConfirmAction(); }
    OnKeyboardCancel(): void { this.onConfirmAction(); }
}

class UIConfirm extends UIDialog {
    constructor(
        messageText: string,
        confirmText: string,
        rejectText: string,
        private onConfirmAction: () => void
    ) {
        super();
        let opt1 = new UIDialogOption(rejectText, () => { });
        opt1.color = "#115B";
        let opt2 = new UIDialogOption(confirmText, onConfirmAction);
        this.options.push(opt1, opt2);
        this.promptText = messageText;
    }

    OnKeyboardConfirm(): void { this.onConfirmAction(); }
}

class UIReadKey extends UIConfirm {
    constructor(
        messageText: string,
        confirmText: string,
        rejectText: string,
        onConfirmAction: () => void = () => { }
    ) {
        super(messageText, confirmText, rejectText, onConfirmAction);
        KeyboardHandler.lastPressedKeyCode = "";
    }

    private isLastLineAdded = false;
    suppressKeyNavigation = true;

    Update() {
        super.Update();

        if (!this.isLastLineAdded && this.promptLines.length) {
            this.promptLines.push("", "");
            this.isLastLineAdded = true;
        }
        let keyCode = KeyboardHandler.lastPressedKeyCode || "no key";
        if (Object.keys(KeyboardHandler.gamepadMap).indexOf(keyCode) > -1) {
            keyCode = (<any>KeyboardHandler).gamepadMap[keyCode];
        }

        this.promptLines[this.promptLines.length - 1] = "<" + keyCode + ">";
    }

    OnKeyboardConfirm(): void { };
    OnKeyboardCancel(): void { };
}