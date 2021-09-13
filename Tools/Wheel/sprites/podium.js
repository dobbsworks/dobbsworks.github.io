class Podium {
    constructor(x, y, baseColor) {
        let centerOffset = 50;
        this.displayText = new StaticText("", 40, "white", "black", x, y + centerOffset);
        this.displayTextShadow = new StaticText("", 40, "black", "black", x + 1, y + 2 + centerOffset);

        sprites.push(
            new Rect(baseColor, x, y + centerOffset, 300, 100),
            this.displayTextShadow,
            this.displayText,
        )
    }

    SetText(text) {
        this.displayText.text = text;
        this.displayTextShadow.text = text;
    }
}