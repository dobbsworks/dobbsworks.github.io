class EditorButtonBackgroundSource extends EditorButton {

    constructor(public backgroundSource: BackgroundSource, private container: BackgroundLayerEditor) {
        super(backgroundSource.thumbnail);
        this.onClickEvents.push(() => {
            container.selectedSource = backgroundSource;
            container.OnChange();
        })
    }

    Update(): void {
        super.Update();
        let isSelected = this.container.selectedSource === this.backgroundSource;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    }
}