class EditorButtonTile extends EditorButton {

    static AllTileButtons: EditorButtonTile[] = [];

    constructor(public tileType: TileType, public tooltip: string) {
        super(tileType.imageTile, tooltip);
        this.linkedFillType = new SimpleFill(tileType);
        this.onClickEvents.push(() => {
            editorHandler.currentTool = new editorHandler.selectedFillBrush(this.linkedFillType);
            editorHandler.hotbar.OnToolSelect(this);
        });
        EditorButtonTile.AllTileButtons.push(this);
    }

    linkedFillType!: FillType;

    Update(): void {
        super.Update();
        let isSelected = editorHandler.currentTool instanceof FillBrush && editorHandler.currentTool.fillType === this.linkedFillType;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    }

    AppendImage(imageTile: ImageTile): EditorButtonTile {
        if (imageTile == tiles["uiButtonAdd"][0][0]) {
            let image = new ImageFromTile(0, 0, 60, 60, imageTile);
            image.zoom = 1;
            this.AddChild(image);
        } else {
            this.AddChild(new ImageFromTile(0, 0, 50, 50, imageTile));
        }
        return this;
    }

    CreateCopy() {
        let copy = new EditorButtonTile(this.tileType, this.tooltip);
        copy.linkedFillType = this.linkedFillType;
        copy.children = [];
        copy.AddChild(new ImageFromTile(0,0,50,50, (<ImageFromTile>this.children[0]).imageTile));
        for (let child of this.children.slice(1)) {
            let img = (<ImageFromTile>child).imageTile;
            copy.AppendImage(img);
        }
        return copy;
    }
}