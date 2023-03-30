class EditorButtonFillBrush extends EditorButton {

    constructor(public fillBrushType: FillBrushType, imageTile: ImageTile, index: number) {
        super(imageTile);
        this.onClickEvents.push(() => {
            editorHandler.selectedFillBrush = this.fillBrushType;
            if (editorHandler.currentTool instanceof FillBrush) {
                editorHandler.currentTool = new editorHandler.selectedFillBrush(editorHandler.currentTool.fillType);
            }
            StorageService.SetPreference("brush", index.toString());
        })
    }

    Update(): void {
        super.Update();
        let isSelected = editorHandler.selectedFillBrush === this.fillBrushType;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    }
}