class EditorButtonToggle extends EditorButton {

    constructor(imageTile: ImageTile, tooltip: string, initialState: boolean, public onChange: (newSelectedState: boolean) => void) {
        super(imageTile, tooltip);
        this.isSelected = initialState;
        this.onClickEvents.push(() => {
            this.isSelected = !this.isSelected;
            this.onChange(this.isSelected);
        })
    }

    Update(): void {
        super.Update();
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
    }
}