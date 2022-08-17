class EditorButtonEraser extends EditorButton {

    constructor() {
        super(tiles["editor"][0][0], "Eraser");
        this.linkedTool = new Eraser();
        this.onClickEvents.push(() => {
            editorHandler.currentTool = this.linkedTool;
        });
    }

    linkedTool!: Eraser;

    Update(): void {
        this.isSelected = editorHandler.currentTool === this.linkedTool;
        this.borderColor = this.isSelected ? "#FF2E" : "#FF20";
        super.Update();
    }
}