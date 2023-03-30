class EditorButtonTrackTool extends EditorButton {
    constructor() {
        super(tiles["editor"][6][0], "Track Pen");
        this.onClickEvents.push(() => {
            editorHandler.currentTool = new editorHandler.selectedFillBrush(new TrackPlacer());
            editorHandler.hotbar.OnToolSelect(this);
        });
    }

    Update(): void {
        this.isSelected = editorHandler.currentTool instanceof FillBrush && editorHandler.currentTool.fillType instanceof TrackPlacer;
        this.borderColor = this.isSelected ? "#FF2E" : "#FF20";
        super.Update();
    }

    CreateCopy() {
        let copy = new EditorButtonTrackTool();
        return copy;
    }
}