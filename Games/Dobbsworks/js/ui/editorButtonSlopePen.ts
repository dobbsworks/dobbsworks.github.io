class EditorButtonSlopePen extends EditorButton {

    constructor(public slopeFill: SlopeFill) {
        super(slopeFill.GetThumbnailImage(), "Slope pen");
        this.onClickEvents.push(() => {
            editorHandler.currentTool = new SlopePen(slopeFill);
            editorHandler.hotbar.OnToolSelect(this);
        })
    }

    Update(): void {
        super.Update();
        let isSelected = editorHandler.currentTool instanceof SlopePen && (<SlopeFill>editorHandler.currentTool.fillType).innerTileType === this.slopeFill.innerTileType;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    }

    CreateCopy() {
        let copy = new EditorButtonSlopePen(this.slopeFill);
        return copy;
    }
}