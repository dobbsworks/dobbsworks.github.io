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
    maxWidth = 305;

    lines = [];
    isSplit = false;

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
            if (ctx.measureText(line).width <= this.maxWidth) {
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
                            textWidth = ctx.measureText(proposedLine).width;
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
    }

    Draw() {
        if (!this.text) return;
        ctx.font = `${this.isBold ? "700 " : ""} ${this.fontSize}px Arial`;
        ctx.textAlign = this.textAlign;

        if (!this.isSplit) this.SplitTextIntoLines();
        let y = this.y;
        for (let line of this.lines) {
            ctx.fillStyle = this.colorText;
            if (line.startsWith("[bad]")) {
                line = line.replace("[bad]","");
                ctx.fillStyle = this.colorTextBad;
            }
            if (line.startsWith("[good]")) {
                line = line.replace("[good]","");
                ctx.fillStyle = this.colorTextGood;
            }
            ctx.fillText(line, this.x, y);
            y += this.fontSize + 4;
        }
    }


}