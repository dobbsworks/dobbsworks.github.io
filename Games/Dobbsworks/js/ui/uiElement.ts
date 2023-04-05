abstract class UIElement {

    constructor(public x: number, public y: number) {
        this.targetX = x;
        this.targetY = y;
    }

    targetX!: number;
    targetY!: number;
    parentElement: UIElement | null = null;
    isHidden = false;
    fixedPosition = false;

    width: number = 0;
    height: number = 0;
    targetWidth: number = 0;
    targetHeight: number = 0;

    moveSpeed = 0.25;

    abstract Draw(ctx: CanvasRenderingContext2D): void;

    Update(): void {
        this.ApproachTargetValue("x", "targetX");
        this.ApproachTargetValue("y", "targetY");
        this.ApproachTargetValue("width", "targetWidth");
        this.ApproachTargetValue("height", "targetHeight");
    }

    SnapToPlace(): void {
        this.x = this.targetX;
        this.y = this.targetY;
        this.width = this.targetWidth;
        this.height = this.targetHeight;
    }

    abstract IsMouseOver(): boolean;

    abstract GetMouseOverElement(): UIElement | null;

    CheckAndUpdateMousedOver(): void {
        if (!this.isHidden) {
            if (this.IsMouseOver()) {
                uiHandler.mousedOverElements.push(this);
            }
            if (this instanceof Panel) {
                for (let el of this.children) {
                    if (el) el.CheckAndUpdateMousedOver();
                }
                if (this.scrollBar) this.scrollBar.CheckAndUpdateMousedOver();
            }
        }
    }
    

    ApproachTargetValue(rawProperty: "width" | "height" | "x" | "y", targetProperty: keyof UIElement): void {
        let value = <number>this[rawProperty];
        let target = <number>this[targetProperty];
        let ratioDiff = Math.abs(target == 0 ? value : ((value - target) / target));
        if (ratioDiff < 0.0005) {
            this[rawProperty] = target;
        } else {
            this[rawProperty] += (target - value) * this.moveSpeed;
            // previously 0.15
        }
    }
}