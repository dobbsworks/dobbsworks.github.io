class UiHandler {
    elements = [];
    history = [];
    timer = 0;
    buttonLastClicked = 0;
    

    Shelve() {
        // throws all ui elements on a history stack for later retrieval
        this.history.push(this.elements);
        this.elements = [];
    }

    Restore() {
        this.elements = this.history.pop();
    }

    Draw() {
        for (let el of this.elements) {
            el.Draw();
        }
    }
    
    getButtons() {
        return this.elements.filter(x => x instanceof UiButton);
    }
    
    Update() {
        this.timer++;
        let mouseOverAnyButton = false;
        for (let button of this.getButtons()) {
            if (button.isMouseOver()) {
                if (button.isDisabled) {
                    if (isMouseClicked()) {
                        //audioHandler.PlaySound("beep-03");
                    }
                } else {
                    mouseOverAnyButton = true;
                    let canClick = (this.timer - this.buttonLastClicked > 5);
                    if (isMouseClicked() && canClick) {
                        this.buttonLastClicked = this.timer;
                        
                        if (button.onClick) button.onClick();
                        //audioHandler.PlaySound("beep-02");
                    }
                }
            } else {
                button.holdTimer = 0;
            }
        }
    }

    Button(name, props, onClick) {
        if (props.left !== undefined) props.x = props.left;
        if (props.top !== undefined) props.y = props.top;

        //TODO - error-checking

        let width = props.width;
        if (!width) {
            if (props.x && props.centerX) width = 2 * (props.centerX - props.x);
            if (props.right && props.centerX) width = 2 * (props.right - props.centerX);
            if (props.x && props.right) width = props.right - props.x;
        }
        let x = props.x;
        if (!x) {
            if (props.centerX) x = props.centerX - width/2;
            if (props.right) x = props.right - width;
        }


        let height = props.height;
        if (!height) {
            if (props.y && props.centerY) height = 2 * (props.centerY - props.y);
            if (props.bottom && props.centerY) height = 2 * (props.bottom - props.centerY);
            if (props.y && props.bottom) height = props.bottom - props.y;
        }
        let y = props.y;
        if (!y) {
            if (props.centerY) y = props.centerY - height/2;
            if (props.bottom) y = props.bottom - height;
        }

        let button = new UiButton(name, x, y, width, height, onClick);
        this.elements.push(button);
        return button;
    }
}

 