class UIText extends UIElement {
    width: number = 0;
    textWidth = 0;
    height: number = 0;
    xOffset: number = 0;
    yOffset: number = 0;
    textAlign: "left" | "right" | "center" = "center";

    strokeColor: string = "transparent";
    strokeWidth: number = 4;
    font: "grobold" | "arial" | "courier" = "grobold";

    constructor(x: number, y: number, public text: string, public fontSize: number, public fillColor: string) {
        super(x, y);

        camera.ctx.font = `${fontSize}px sans-serif`;
        camera.ctx.textAlign = "center";
        this.width = camera.ctx.measureText(text).width;
        this.textWidth = this.width;
        this.height = fontSize;
    }

    IsMouseOver(): boolean {
        return false;
    }

    GetMouseOverElement(): UIElement | null { return null; }

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.textAlign = this.textAlign;
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        if (this.font == "grobold" && this.text.indexOf("#") > -1 && this.textAlign == "left") {
            //font doesn't include a # glyph for some reason???
            ctx.font = `${this.fontSize}px ${"grobold"}`;

            let segments = this.text.split("#");
            let x = this.x + this.xOffset;
            let poundLength = ctx.measureText("#").width;

            for (let i=0; i<segments.length; i++) {
                let segment = segments[i];
                
                // todo, outline if ever needed

                ctx.font = `${this.fontSize}px ${"grobold"}`;
                ctx.fillText(segment, x, this.y + this.yOffset);
                x += (ctx.measureText(segment).width || 0);

                if (i < segments.length - 1) {
                    ctx.font = `${this.fontSize}px ${"arial"}`;
                    // bump # over by 5 px to line up better
                    ctx.fillText("#", x + 5, this.y + this.yOffset);
                    x += poundLength;
                }
            }

        } else {
            ctx.font = `${this.fontSize}px ${this.font}`;

            if (this.strokeColor != "transparent") {
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeText(this.text, this.x + this.xOffset, this.y + this.yOffset);
            }

            ctx.fillText(this.text, this.x + this.xOffset, this.y + this.yOffset);
        }
    }
}

let groboldFont = new FontFace('grobold', 'url(/fonts/GROBOLD.ttf)');
groboldFont.load();
groboldFont.loaded.then(a => {
    document.fonts.add(a);
}).catch(a => console.error(a))