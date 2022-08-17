class Spacer extends Panel {

    backColor: string = "#4440";

    IsMouseOver(): boolean { return false; }
    GetMouseOverElement(): UIElement | null { return null; }

    Update(): void {
        this.ApproachTargetValue("x", "targetX");
        this.ApproachTargetValue("y", "targetY");
        this.ApproachTargetValue("width", "targetWidth");
        this.ApproachTargetValue("height", "targetHeight");
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.isHidden) return;
        ctx.fillStyle = this.backColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}