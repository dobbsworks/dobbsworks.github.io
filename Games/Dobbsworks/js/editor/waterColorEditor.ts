class WaterColorEditor extends Panel {
    fixedPosition = true;
    backColor = "#1138";
    colorRgb: string = "";
    colorPanel!: RgbPanel;

    constructor(x: number, y: number, width: number, height: number, private property: string) {
        super(x, y, width, height);

        let panelHeight = height - this.margin * 2;

        this.colorPanel = new RgbPanel(width - this.margin * 2, panelHeight, (rgb: string) => {
            this.colorRgb = rgb;
            this.UpdateColors();
        }, true);

        this.AddChild(this.colorPanel);
    }

    UpdateColors(): void {
        (currentMap as any)[this.property] = this.colorRgb;
        new WaterRecolor().ApplyRecolors();
        currentMap.waterLayer.isDirty = true;
    }
}