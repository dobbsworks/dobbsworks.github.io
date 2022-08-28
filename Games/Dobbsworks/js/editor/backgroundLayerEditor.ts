class BackgroundLayerEditor extends Panel {

    fixedPosition = true;
    backColor = "#1138";
    margin = 0;
    scrollPanel!: Panel;
    depthSlider!: Slider;
    xScrollPanel!: Panel;
    yScrollPanel!: Panel;
    xScrollSlider!: Slider;
    yScrollSlider!: Slider;
    scaleSlider!: Slider;
    verticalFlip: boolean = false;
    horizontalFlip: boolean = false;

    selectedSource!: BackgroundSource;
    hslOffset!: Hsl;
    colorEdit!: RgbPanel;
    scalePower: number = 0;

    constructor(public layerIndex: number) {
        super(85, 90, 720, 340);

        let bgLayer = currentMap.backgroundLayers[layerIndex];

        this.hslOffset = { ...bgLayer.hslOffset };
        this.selectedSource = bgLayer.backgroundSource;

        let sourceSelectionPanel = editorHandler.CreateFloatingButtonPanel(
            BackgroundSource.GetSources().map(a => new EditorButtonBackgroundSource(a, this)),
            5, 3);
        sourceSelectionPanel.fixedPosition = false;
        sourceSelectionPanel.isHidden = false;
        sourceSelectionPanel.targetX -= 80;
        sourceSelectionPanel.x = sourceSelectionPanel.targetX;
        this.AddChild(sourceSelectionPanel);

        this.scrollPanel = new Panel(0, 0, 0, 340);
        this.scrollPanel.backColor = "#1138";
        this.scrollPanel.margin = 0;

        this.depthSlider = this.CreateSlider(
            (newValue: number) => { bgLayer.cameraScrollSpeed = newValue; this.OnChange(); },
            tiles["editor"][2][4], tiles["editor"][1][4], 0, 1, 0.3);
        this.depthSlider.value = bgLayer.cameraScrollSpeed;
        this.depthSlider.step = 0.1;

        this.xScrollSlider = this.CreateSlider(
            (newValue: number) => { bgLayer.autoHorizontalScrollSpeed = -newValue; this.OnChange(); },
            tiles["editor"][1][5], tiles["editor"][2][5], -10, 10, 0);
        this.xScrollSlider.value = bgLayer.autoHorizontalScrollSpeed;
        this.xScrollPanel = <Panel>this.xScrollSlider.parentElement;
        this.xScrollSlider.step = 0.25;

        this.yScrollSlider = this.CreateSlider(
            (newValue: number) => { bgLayer.autoVerticalScrollSpeed = -newValue; this.OnChange(); },
            tiles["editor"][1][6], tiles["editor"][2][6], -10, 10, 0);
        this.yScrollSlider.value = bgLayer.autoVerticalScrollSpeed;
        this.yScrollPanel = <Panel>this.yScrollSlider.parentElement;
        this.yScrollSlider.step = 0.25;

        this.scaleSlider = this.CreateSlider(
            (newValue: number) => { this.scalePower = newValue; this.OnChange(); },
            tiles["editor"][1][7], tiles["editor"][2][7], -10, 10, 0);
        this.scaleSlider.value = bgLayer.scale;
        this.scaleSlider.step = 1;

        let colorAndAnchorPanel = new Panel(0, 0, 180, 340);
        colorAndAnchorPanel.backColor = "#1138";
        let anchorPanel = new Panel(0, 0, 140, 90);
        let anchorButton1 = new EditorButtonToggle(tiles["editor"][2][3], "Toggle vertical flip", false, (newSelectedState: boolean) => {
            this.verticalFlip = newSelectedState;
            this.OnChange();
        });
        anchorPanel.AddChild(anchorButton1);
        let anchorButton2 = new EditorButtonToggle(tiles["editor"][2][1], "Toggle horizontal flip", false, (newSelectedState: boolean) => {
            this.horizontalFlip = newSelectedState;
            this.OnChange();
        });
        anchorPanel.AddChild(anchorButton2);
        colorAndAnchorPanel.AddChild(anchorPanel);
        colorAndAnchorPanel.layout = "vertical";
        let hsl = { ...this.hslOffset };
        this.colorEdit = new RgbPanel(140, 280, (rgb: string) => {
            let hsl = rgbStringToHSL(rgb);
            this.hslOffset = { h: hsl.h, s: hsl.s * 1, l: hsl.l * 2 };
            this.OnChange();
        });
        this.colorEdit.SetColor(hslToRGB({
            h: hsl.h,
            s: hsl.s,
            l: hsl.l / 2
        }))
        colorAndAnchorPanel.AddChild(this.colorEdit);
        this.AddChild(colorAndAnchorPanel);


        this.AddChild(this.scrollPanel);
        this.targetWidth = 440 + this.scrollPanel.width;
        this.backColor = "#0000";
    }

    CreateSlider(onChange: (newValue: number) => void, topTileImage: ImageTile, bottomTileImage: ImageTile, min: number, max: number, defaultVal: number): Slider {
        let container = new Panel(0, 0, 70, 340);
        let slider = new Slider(0, 0, 70, 180, onChange);
        slider.handleThickness = 15;
        slider.handleBorderThickness = 0;
        slider.layout = "vertical";
        slider.minValue = min;
        slider.maxValue = max;
        slider.value = defaultVal;
        container.layout = "vertical";
        container.AddChild(new Spacer(0, 0, 1, 1));
        container.AddChild(new ImageFromTile(0, 0, 50, 50, bottomTileImage));
        container.AddChild(slider);
        container.AddChild(new ImageFromTile(0, 0, 50, 50, topTileImage));
        container.AddChild(new Spacer(0, 0, 1, 1));
        this.scrollPanel.AddChild(container);
        this.scrollPanel.targetWidth += 70;
        this.scrollPanel.width += 70;
        return slider;
    }

    OnChange(): void {
        let bgLayer = currentMap.backgroundLayers[this.layerIndex];
        if (bgLayer.backgroundSource != this.selectedSource) {
            this.hslOffset = { ...this.selectedSource.defaultRecolor };
            bgLayer.backgroundSource = this.selectedSource;
            this.colorEdit.SetColor(hslToRGB({
                h: this.hslOffset.h,
                s: this.hslOffset.s,
                l: this.hslOffset.l / 2
            }))
        }
        bgLayer.hslOffset = this.hslOffset;
        let scaleRatio = Math.pow(2, this.scalePower / 4);
        bgLayer.imageTiles = Object.values(this.selectedSource.imageTiles).map(a => a.GetRecolor(this.hslOffset.h, this.hslOffset.s, this.hslOffset.l).Scale(scaleRatio, this.horizontalFlip, this.verticalFlip));
        bgLayer.scale = this.scalePower;
        bgLayer.cameraScrollSpeed = this.depthSlider.value;
        bgLayer.verticalAnchor = this.verticalFlip ? (this.selectedSource.defaultVerticalAnchor == "top" ? "bottom" : "top") : this.selectedSource.defaultVerticalAnchor;
        bgLayer.horizontalFlip = this.horizontalFlip;


        if (this.xScrollSlider) {
            bgLayer.autoHorizontalScrollSpeed = this.xScrollSlider.value;
            this.xScrollPanel.isHidden = !bgLayer.backgroundSource.xLoop;
        }
        if (this.yScrollSlider) {
            bgLayer.autoVerticalScrollSpeed = this.yScrollSlider.value;
            this.yScrollPanel.isHidden = !bgLayer.backgroundSource.yLoop;
        }
    }
}