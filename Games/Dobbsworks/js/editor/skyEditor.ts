class SkyEditor extends Panel {
    fixedPosition = true;
    backColor = "#1138";
    topRgb: string = "";
    topColorPanel!: RgbPanel;
    bottomRgb: string = "";
    bottomColorPanel!: RgbPanel;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        let panelHeight = height - this.margin * 2;

        this.topColorPanel = new RgbPanel(200, panelHeight, (rgb: string) => {
            this.topRgb = rgb;
            this.UpdateSky();
        });
        this.bottomColorPanel = new RgbPanel(200, panelHeight, (rgb: string) => {
            this.bottomRgb = rgb;
            this.UpdateSky();
        })

        let vertSliderHeight = (this.height - this.margin * 5);

        let centerPanel = new Panel(0, 0, 200, panelHeight);
        let leftVertSlider = new Slider(0, 0, 40, vertSliderHeight, (newValue) => { currentMap.bgColorTopPositionRatio = newValue});
        leftVertSlider.value = 0;
        leftVertSlider.maxValue = 1;
        leftVertSlider.layout = "vertical"
        leftVertSlider.step = 0.05;
        centerPanel.AddChild(leftVertSlider);

        let rightVertSlider = new Slider(0, 0, 40, vertSliderHeight, (newValue) => { currentMap.bgColorBottomPositionRatio = newValue});
        rightVertSlider.value = 1;
        rightVertSlider.minValue = 0;
        rightVertSlider.maxValue = 1;
        rightVertSlider.layout = "vertical"
        rightVertSlider.step = 0.05;
        centerPanel.AddChild(rightVertSlider);


        this.AddChild(this.topColorPanel);
        this.AddChild(centerPanel);
        this.AddChild(this.bottomColorPanel);

        this.topColorPanel.SetColor("#00DDDD");
        this.bottomColorPanel.SetColor("#EEEEFF");

        let opacityPanel = new Panel(0, 0, 60, panelHeight);;
        let opacitySlider = new Slider(0, 0, 40, vertSliderHeight, (newValue) => {currentMap.overlayOpacity = newValue});
        opacitySlider.value = currentMap.overlayOpacity;
        opacitySlider.minValue = 0;
        opacitySlider.maxValue = 1;
        opacitySlider.step = 0.05;
        opacitySlider.layout = "vertical"
        opacityPanel.AddChild(opacitySlider);
        this.AddChild(opacityPanel);
    }

    UpdateSky(): void {
        currentMap.bgColorTop = this.topRgb;
        currentMap.bgColorBottom = this.bottomRgb;
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
        if (!this.isHidden) {
            var grd = camera.ctx.createLinearGradient(0, this.y + this.margin, 0, this.y + this.height - this.margin);
            grd.addColorStop(currentMap.bgColorTopPositionRatio, currentMap.bgColorTop);
            grd.addColorStop(currentMap.bgColorBottomPositionRatio, currentMap.bgColorBottom);
            camera.ctx.fillStyle = grd;
            camera.ctx.fillRect(this.x + this.width * 0.4, this.y + this.margin * 2, this.width * 0.1, this.height - this.margin * 4);
        }
    }
}

class RgbPanel extends Panel {

    hue: number = 0;
    sat: number = 0;
    lum: number = 0;
    hueSlider!: HueSlider;
    satSlider!: GradientSlider;
    lumSlider!: GradientSlider;
    margin = 30;

    constructor(width: number, height: number, private onValueSelected: (rgb: string) => void) {
        super(0, 0, width, height);
        this.layout = "vertical";
        this.hueSlider = new HueSlider(0, 0, width, height / 5, (newValue: number) => { this.hue = newValue; this.OnChange(); });
        this.lumSlider = new GradientSlider(0, 0, width, height / 5, (newValue: number) => { this.lum = newValue; this.OnChange(); });
        this.satSlider = new GradientSlider(0, 0, width, height / 5, (newValue: number) => { this.sat = newValue; this.OnChange(); });
        this.AddChild(this.hueSlider);
        this.AddChild(this.satSlider);
        this.AddChild(this.lumSlider);
        this.OnChange();
    }

    SetColor(rgb: string): void {
        let hsl = rgbStringToHSL(rgb);
        this.hue = hsl.h;
        this.sat = hsl.s * 100;
        this.lum = hsl.l * 100;
        this.hueSlider.value = this.hue;
        this.satSlider.value = this.sat;
        this.lumSlider.value = this.lum;
        this.OnChange();
    }

    OnChange(): void {
        this.satSlider.gradColorLow = `hsl(${this.hue.toFixed(0)},0%,50%)`;
        this.satSlider.gradColorMid = `hsl(${this.hue.toFixed(0)},50%,50%)`;
        this.satSlider.gradColorHigh = `hsl(${this.hue.toFixed(0)},100%,50%)`;
        this.satSlider.fillColor = `hsl(${this.hue.toFixed(0)},${this.sat.toFixed(0)}%,50%)`

        this.lumSlider.gradColorLow = `hsl(${this.hue.toFixed(0)},${this.sat.toFixed(0)}%,0%)`;
        this.lumSlider.gradColorMid = `hsl(${this.hue.toFixed(0)},${this.sat.toFixed(0)}%,50%)`;
        this.lumSlider.gradColorHigh = `hsl(${this.hue.toFixed(0)},${this.sat.toFixed(0)}%,100%)`;
        this.lumSlider.fillColor = `hsl(${this.hue.toFixed(0)},${this.sat.toFixed(0)}%,${this.lum.toFixed(0)}%)`

        let rgb = hslToRGB({h: this.hue, s: this.sat / 100, l: this.lum / 100});
        this.onValueSelected(rgb);
    }
}