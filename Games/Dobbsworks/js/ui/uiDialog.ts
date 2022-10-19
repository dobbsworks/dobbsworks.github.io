abstract class UIDialog {

    // list of selection

    options: UIDialogOption[] = [];
    promptText: string = "";
    promptLines: string[] = [];

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
        for (let line of this.promptLines) {
            ctx.fillText(line, ctx.canvas.width / 2, yIter);
            yIter += 18;
        }

        let xIter = 230;
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

            ctx.fillStyle = option.color;
            ctx.fillRect(option.x, option.y, option.xRight - option.x, option.yBottom - option.y);

            ctx.strokeStyle = option.isMouseOver ? "#BBB" : "#BBB8";
            ctx.strokeRect(option.x, option.y, option.xRight - option.x, option.yBottom - option.y);
            ctx.fillStyle = "#BBB";
            ctx.fillText(option.text, (option.x + option.xRight) / 2, option.yBottom - 15);
        }
    }

    Update(): void {
        this.options.forEach(a => a.Update());
        if (this.options.some(a => a.isMouseOver)) {
            document.body.style.cursor = "pointer";

            if (mouseHandler.isMouseClicked()) {
                let option = this.options.find(a => a.isMouseOver);
                if (option) {
                    option.action(...this.GetButtonActionParameters());
                    this.OnAnyAction();
                    MenuHandler.Dialog = null;
                }
            }

        } else {
            document.body.style.cursor = "unset";
        }
    }

    GetButtonActionParameters(): any[] {
        return [];
    }

    OnAnyAction(): void {}

    static Alert(info: string, confirmButtonText: string): void {
        MenuHandler.Dialog = new UIAlert(info, confirmButtonText);
    }
    static Confirm(info: string, confirmButtonText: string, rejectButtonText: string, confirmAction: () => void): void {
        MenuHandler.Dialog = new UIConfirm(info, confirmButtonText, rejectButtonText, confirmAction);
    }
    static SmallPrompt(info: string, confirmButtonText: string, maxLength: number, confirmAction: (text: string) => void): void {
        MenuHandler.Dialog = new UISmallPrompt(info, confirmButtonText, maxLength, confirmAction);
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
        this.isMouseOver = (mouseHandler.mouseX >= this.x &&
            mouseHandler.mouseX <= this.xRight &&
            mouseHandler.mouseY >= this.y &&
            mouseHandler.mouseY <= this.yBottom);
    }
}

class UISmallPrompt extends UIDialog {
    constructor(
        messageText: string,
        confirmText: string,
        private maxLength: number,
        private onConfirmAction: (value: string) => void
    ) {
        super();
        this.options.push(new UIDialogOption(confirmText, onConfirmAction));
        this.promptText = messageText;
    }

    inputForm!: HTMLInputElement;

    GetButtonActionParameters() {
        return [this.inputForm.value];
    }

    OnAnyAction(): void {
        try {
            document.body.removeChild(this.inputForm);
        } catch (e) {}
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
            };
            document.body.appendChild(this.inputForm);
            this.inputForm.focus();
            if (this.maxLength) this.inputForm.maxLength = this.maxLength;
            this.inputForm.style.opacity = "0";
            this.inputForm.style.position = "fixed";
        } else {
            this.inputForm.focus();
        }
    }
}

class UIAlert extends UIDialog {
    constructor(
        messageText: string,
        confirmText: string,
        onConfirmAction: () => void = () => { }
    ) {
        super();
        this.options.push(new UIDialogOption(confirmText, onConfirmAction));
        this.promptText = messageText;
    }
}

class UIConfirm extends UIDialog {
    constructor(
        messageText: string,
        confirmText: string,
        rejectText: string,
        onConfirmAction: () => void
    ) {
        super();
        let opt1 = new UIDialogOption(rejectText, () => { });
        opt1.color = "#115B";
        let opt2 = new UIDialogOption(confirmText, onConfirmAction);
        this.options.push(opt1, opt2);
        this.promptText = messageText;
    }
}