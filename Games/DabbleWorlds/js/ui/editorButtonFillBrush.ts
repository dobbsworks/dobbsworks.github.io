class EditorButtonFillBrush extends EditorButton {

    constructor(public fillBrushType: FillBrushType, private imageTile: ImageTile) {
        super(imageTile);
        this.onClickEvents.push(() => {
            editorHandler.selectedFillBrush = this.fillBrushType;
            if (editorHandler.currentTool instanceof FillBrush) {
                editorHandler.currentTool = new editorHandler.selectedFillBrush(editorHandler.currentTool.fillType);
            }
        })
    }

    Update(): void {
        super.Update();
        let isSelected = editorHandler.selectedFillBrush === this.fillBrushType;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    }
}