class Button extends Panel {

    borderRadius = 0;
    radioKey = "";
    onClickEvents: (() => void)[] = [];
    normalBackColor = "#002b";
    mouseoverBackColor = "#224b";
    isMousedOver: boolean = false;
    isNoisy: boolean = false;
    isSelected: boolean = false;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.onClickEvents.push(() => {
            if (this.radioKey !== "") {
                let buttons = <Button[]>uiHandler.GetAllElements().
                    filter(a => a instanceof Button && a != this && a.radioKey === this.radioKey);
                buttons.forEach(a => a.isSelected = false);
            }
        })
    }

    Update(): void {
        super.Update();
        let oldMousedOver = this.isMousedOver;
        this.isMousedOver = this.IsMouseOver();
        if (!oldMousedOver && this.isMousedOver) {
            if (this.isNoisy) audioHandler.PlaySound("small-beep", true);
        }
        this.backColor = this.isMousedOver ? this.mouseoverBackColor : this.normalBackColor;
    }

    Click(): void {
        if (this.isNoisy) audioHandler.PlaySound("small-confirm", true);
        this.onClickEvents.forEach(a => a());
        uiHandler.lastClickedButton = this;
        uiHandler.dragSource = this;
    }
}