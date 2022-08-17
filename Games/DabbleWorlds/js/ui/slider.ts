class Slider extends Button {

    constructor(x: number, y: number, width: number, height: number, public onChange: (newValue: number) => void) {
        super(x, y, width, height);
        this.onClickEvents.push(() => {
            this.SlideToMousePosition();
        });
    }

    SlideToMousePosition() {
        if (this.layout == "horizontal") {
            let clickRatioX = (mouseHandler.GetCanvasMousePixel().xPixel - this.x) / this.width;
            clickRatioX = Math.max(0, Math.min(1, clickRatioX));
            this.value = clickRatioX * this.range + this.minValue;
        } else {
            let clickRatioY = (mouseHandler.GetCanvasMousePixel().yPixel - this.y) / this.height;
            clickRatioY = Math.max(0, Math.min(1, clickRatioY));
            this.value = clickRatioY * this.range + this.minValue;
        }
        this.LockToStep();
        this.onChange(this.value);
    }

    layout: "vertical" | "horizontal" = "horizontal";
    sliderSize = 10;
    handleThickness = 10;
    handleBorderThickness = 5;
    value = 30;
    minValue = 0;
    maxValue = 100;
    step = 5; // value will always be a multiple of step
    fillColor = "#224";
    handleBorderColor = "#224";

    get range(): number {
        return this.maxValue - this.minValue;
    }

    get ratio(): number {
        return (this.value - this.minValue) / this.range;
    }

    LockToStep(): void {
        this.value = Math.round(this.value / this.step) * this.step;
    }

    Update(): void {
        super.Update();
        this.backColor = "#0000";
        if (uiHandler.mousedOverElements.indexOf(this) > -1 && mouseHandler.mouseScroll != 0) {
            this.value += ((mouseHandler.mouseScroll > 0) ? 1 : -1) * (this.step);
            this.LockToStep();
            if (this.value < this.minValue) this.value = this.minValue;
            if (this.value > this.maxValue) this.value = this.maxValue;
            this.onChange(this.value);
            //audioHandler.PlaySound("scroll", true);
        }

        if (uiHandler.dragSource == this) {
            this.SlideToMousePosition();
            //audioHandler.PlaySound("scroll", true);
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.handleBorderColor;
        if (this.layout == "horizontal") {
            let y = (this.height - this.sliderSize) / 2 + this.y;
            ctx.fillRect(this.x, y, this.width, this.sliderSize);
            let handleX = this.width * this.ratio + this.x - this.handleThickness / 2;
            ctx.fillRect(handleX - this.handleBorderThickness, this.y - this.handleBorderThickness, 
                this.handleThickness + this.handleBorderThickness * 2, this.height + this.handleBorderThickness * 2);
            ctx.fillStyle = this.fillColor;
            ctx.fillRect(handleX, this.y, this.handleThickness, this.height);
        } else {
            let x = (this.width - this.sliderSize) / 2 + this.x;
            ctx.fillRect(x, this.y, this.sliderSize, this.height);
            let handleY = this.height * ( this.ratio) + this.y - this.handleThickness / 2;
            ctx.fillRect(this.x - this.handleBorderThickness, handleY - this.handleBorderThickness, 
                this.width + this.handleBorderThickness * 2, this.handleThickness + this.handleBorderThickness * 2);
                ctx.fillStyle = this.fillColor;
                ctx.fillRect(this.x, handleY, this.width, this.handleThickness);
        }

    }
}

class HueSlider extends Slider {

    sliderSize = 10;
    handleThickness = 10;
    handleBorderThickness = 5;
    value = 30;
    maxValue = 360;
    fillColor = "#FFF";
    handleBorderColor = "#224";

    Update(): void {
        super.Update();
        this.fillColor = `hsl(${this.value.toFixed(0)},100%,50%)`;
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        let y = (this.height - this.sliderSize) / 2 + this.y;
        ctx.drawImage(tiles["rainbow"][0][0].src, this.x, y, this.width, this.sliderSize);
        ctx.fillStyle = this.handleBorderColor;
        let ratio = this.value / this.maxValue;
        let handleX = this.width * ratio + this.x - this.handleThickness / 2;
        ctx.fillRect(handleX - this.handleBorderThickness, this.y - this.handleBorderThickness, this.handleThickness + this.handleBorderThickness * 2, this.height + this.handleBorderThickness * 2);
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(handleX, this.y, this.handleThickness, this.height);

    }
}

class GradientSlider extends Slider {
    gradColorLow: string = "#000";
    gradColorMid: string = "#000";
    gradColorHigh: string = "#000";
    maxValue = 100;

    Draw(ctx: CanvasRenderingContext2D): void {
        var grd = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        grd.addColorStop(0, this.gradColorLow);
        grd.addColorStop(0.5, this.gradColorMid);
        grd.addColorStop(1, this.gradColorHigh);
        ctx.fillStyle = grd;
        let y = (this.height - this.sliderSize) / 2 + this.y;
        ctx.fillRect(this.x, y, this.width, this.sliderSize);
        ctx.fillStyle = this.handleBorderColor;
        let ratio = this.value / this.maxValue;
        let handleX = this.width * ratio + this.x - this.handleThickness / 2;
        ctx.fillRect(handleX - this.handleBorderThickness, this.y - this.handleBorderThickness, this.handleThickness + this.handleBorderThickness * 2, this.height + this.handleBorderThickness * 2);
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(handleX, this.y, this.handleThickness, this.height);
    }

}