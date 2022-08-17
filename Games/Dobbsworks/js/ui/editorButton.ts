class EditorButton extends Button {
    constructor(imageTile: ImageTile, public tooltip: string = "") {
        super(0, 0, 60, 60);
        this.AddChild(new ImageFromTile(0,0,50,50, imageTile));
        this.onClickEvents.push(() => {
            if (this.radioKey !== "") {
                let buttons = <EditorButton[]>uiHandler.GetAllElements().
                    filter(a => a instanceof EditorButton && a != this && a.radioKey === this.radioKey);
                buttons.forEach(a => a.isSelected = false);
            }
        })
    }
    isSelected: boolean = false;
    radioKey: string = "";

    CreateCopy(): EditorButton | null {
        return null;
    };
    
    Draw(ctx: CanvasRenderingContext2D): void { 
        if (this.isHidden) return;
        super.Draw(ctx);
        if (this.isMousedOver) editorHandler.mouseOverButton = this;
    }
    
    DrawTooltip(ctx: CanvasRenderingContext2D): void { 
        let text = this.tooltip;
        if (!text) return;
        ctx.textAlign = "center";
        ctx.font = `${16}px Arial`;
        let upperY = this.y - 40;
        if (upperY < 5) upperY = this.y + this.height + 15;
        let textWidth = ctx.measureText(text).width;
        let panelWidth = Math.max(this.width, textWidth + 8);
        let midX = this.x + this.width / 2;
        if (midX + panelWidth/2 > camera.canvas.width) midX = camera.canvas.width - panelWidth/2 - 5;
        if (midX - panelWidth/2 < 0) midX = panelWidth/2 + 5;

        ctx.fillStyle = "#002f";
        ctx.fillRect(midX - panelWidth/2, upperY, panelWidth, 25);

        ctx.fillStyle = "#FFF";
        ctx.fillText(text, midX, upperY + 20)

    }

}