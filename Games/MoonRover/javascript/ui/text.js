class Text extends UIElement {

    constructor(x, y, text) {
        super();
        this.targetX = x;
        this.targetY = y;
        this.x = x;
        this.y = y;
        this.text = text;
    }

    textAlign = "center";
    isBold = false;
    fontSize = 16;
    font = "Arial";
    maxWidth = 305;

    lines = [];
    commands = [];
    isSplit = false;
    slowReveal = false;

    isMouseOver() {
        return mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height;
    }

    SplitTextIntoLines() {
        // divides on spaces/newlines to avoid breaking maxwidth
        let ret = [];
        let lines = this.text.split("\n");
        for (let line of lines) {
            if (ctx.measureText(this.RemoveCommands(line)).width <= this.maxWidth) {
                ret.push(line);
            } else {
                let words = line.split(" ");
                if (words.length === 1) {
                    // can't break it up, we're breaking maxwidth
                    ret.push(line);
                } else {
                    // could binary search this, but it's not too expensive
                    // below takes ~1.65 ms on 80 words
                    while (words.length) {
                        let wordCountTest = 1;
                        for (let textWidth = 0;
                            wordCountTest < words.length;
                            wordCountTest++) {
                            let proposedLine = words.slice(0, wordCountTest);
                            textWidth = ctx.measureText(this.RemoveCommands(proposedLine.join(" "))).width;
                            if (textWidth > this.maxWidth) {
                                wordCountTest--;
                                break;
                            }
                        }
                        if (wordCountTest > 1 && wordCountTest === words.length) wordCountTest--;
                        ret.push(words.splice(0, wordCountTest).join(" "));
                    }
                    let t1 = performance.now();
                }
            }
        }
        this.isSplit = true; // avoid running this more than once per text blurb
        this.lines = ret;
        this.ExtractCommands();
    }

    ExtractCommands() {
        for (let lineNum = 0; lineNum < this.lines.length; lineNum++) {
            let text = this.lines[lineNum];
            this.lines[lineNum] = this.RemoveCommands(text);
            let matches = text.matchAll(/\[[^[]*\]/gm);
            let lineCommands = [];
            for (let match of matches) {
                let colNum = match.index - lineCommands.map(x => x.raw.length).reduce((a, b) => a + b, 0);
                lineCommands.push({
                    lineNum: lineNum,
                    colNum: colNum,
                    raw: match[0],
                    value: match[0].replace("[", "").replace("]", "").split(":")[0],
                    param: match[0].replace("[", "").replace("]", "").split(":")[1],
                })
            }
            this.commands.push(...lineCommands);
        }
    }

    RemoveCommands(text) {
        // extracts all text between brackets, returns remainder
        if (text.replace) return text.replace(/\[[^[]*\]/gm, "");
        return text;
    }

    timer = 0;
    pause = 0;
    speed = 1;
    revealIndex = 0;
    Draw() {
        let newCharTime = false;
        if (!this.text) return;
        if (this.pause > 0) {
            this.pause--;
            if (isMouseDown) this.pause -= 2;
        } else {
            this.timer += (isMouseDown ? 1 : 0.35) * this.speed;
            if (this.timer > 1) {
                this.timer--;
                this.revealIndex++;
                newCharTime = true;
            }
        }
        ctx.font = `${this.isBold ? "700 " : ""} ${this.fontSize}px ${this.font}`;
        ctx.textAlign = this.textAlign;

        if (!this.isSplit) this.SplitTextIntoLines();
        let y = this.y;
        let completeLineCharCount = 0;
        let isDone = false;
        for (let lineNum = 0; lineNum < this.lines.length; lineNum++) {
            let line = this.lines[lineNum];
            ctx.fillStyle = this.colorText;
            if (this.commands.some(x => x.lineNum === lineNum && x.value === "bad")) {
                ctx.fillStyle = this.colorTextBad;
            }
            if (this.commands.some(x => x.lineNum === lineNum && x.value === "good")) {
                ctx.fillStyle = this.colorTextGood;
            }

            if (this.slowReveal) {
                if (this.revealIndex <= completeLineCharCount + line.length) {
                    let charsToDraw = this.revealIndex - completeLineCharCount;
                    line = line.substring(0, charsToDraw);
                    if (charsToDraw) {
                        isDone = true;
                        let finalChar = line[line.length - 1];
                        if (newCharTime && /^[A-Z0-9]$/i.test(finalChar)) {
                            audioHandler.PlaySound("mog-beep");
                        }
                        let commands = this.commands.filter(x => !x.done && ((x.lineNum === lineNum && x.colNum <= line.length) || x.lineNum < lineNum));
                        for (let command of commands) {
                            command.done = true;
                            if (command.value === "pause") {
                                this.pause += command.param ? command.param : 30;
                            }
                            if (command.value === "face") {
                                shopHandler.mogFace = shopHandler.mogFaces[command.param ? command.param : "happy"];
                            }
                            if (command.value === "sound") {
                                audioHandler.PlaySound(command.param ? command.param : "mog-intro");
                            }
                            if (command.value === "speed") {
                                this.speed = parseFloat(command.param ? command.param : "1");
                            }
                        }
                    }
                }
            }

            ctx.fillText(line, this.x, y);
            if (isDone) break;
            completeLineCharCount += line.length;
            y += this.fontSize + 4;
        }
    }


}