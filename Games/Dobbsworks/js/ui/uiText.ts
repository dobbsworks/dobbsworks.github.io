class UIText extends UIElement {
    width: number = 0;
    height: number = 0;
    xOffset: number = 0;
    yOffset: number = 0;
    textAlign: "left"|"right"|"center" = "center";

    strokeColor: string = "transparent";
    strokeWidth: number = 4;
    font: "grobold" | "arial" = "grobold";

    constructor(x: number, y: number, public text: string, public fontSize: number, public fillColor: string) {
        super(x, y);

        camera.ctx.font = `${fontSize}px sans-serif`;
        camera.ctx.textAlign = "center";
        this.width = camera.ctx.measureText(text).width;
        this.height = fontSize;
    }

    IsMouseOver(): boolean {
        return false;
    }

    GetMouseOverElement(): UIElement | null { return null; }

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.textAlign = this.textAlign;
        ctx.font = `${this.fontSize}px ${this.font}`;
        
        if (this.strokeColor != "transparent") {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeText(this.text, this.x + this.xOffset, this.y + this.yOffset);
        }
        
        ctx.fillStyle = this.fillColor;
        ctx.fillText(this.text, this.x + this.xOffset, this.y + this.yOffset);

    }
}

let groboldFont = new FontFace('grobold', 'url(/fonts/GROBOLD.ttf)');
groboldFont.load();
groboldFont.loaded.then(a => {
    document.fonts.add(a);
}).catch(a => console.error(a))