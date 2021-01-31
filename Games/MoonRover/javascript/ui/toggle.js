class Toggle extends Button {

    constructor(x, y, text) {
        super(x, y, text);
    }

    state = true;

    IsOn() {
        return false;
    }

    FillBox() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    Toggle() {
        this.state = !this.state;
        this.onClick(this.state);
    }

}