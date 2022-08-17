class EditorButtonDrawerHandle extends EditorButton {

    constructor(private imageTile: ImageTile, tooltip: string, public revealedElements: Panel[]) {
        super(imageTile, tooltip);
        revealedElements.forEach(a => {
            this.AddChild(a);
            a.fixedPosition = true;
        })
        this.onClickEvents.push(() => {
            this.isSelected = !this.isSelected;
        });
    }

    Update(): void {
        if (this.isSelected) {
            if (uiHandler.lastClickedButton != this && uiHandler.lastClickedButton != null) {
                let parentIter = <UIElement>uiHandler.lastClickedButton;
                while (parentIter.parentElement != this.parentElement && parentIter.parentElement != null) {
                    parentIter = parentIter.parentElement;
                }
                if (parentIter.parentElement != this.parentElement) {
                    this.isSelected = false;
                }
            }
        }
        this.borderColor = this.isSelected ? "#2FFE" : "#FF20";

        if (this.isSelected) {
            this.revealedElements.forEach(a => {
                a.isHidden = false;
                a.targetWidth = a.initialWidth;
            });
        } else {
            this.revealedElements.forEach(a => {
                a.isHidden = true;
                a.targetWidth = 0;
                a.width = 0;
            });
        }

        super.Update();
    }
}