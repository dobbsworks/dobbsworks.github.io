class SaveSlotChart extends Panel {

    constructor(x: number, y: number, public width: number, public height: number) {
        super(x, y, width, height);
    }

    public numSlotsLive: number = 0;
    public numSlotsCleared: number = 0;
    public numSlotsPending: number = 0;
    public numSlotsTotal: number = 0;

    Update(): void {
        super.Update();
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.isHidden) return;
        super.Draw(ctx);

        let totalChartWidth = this.width - this.margin * 2;
        let totalChartHeight = 15;

        let liveColor = "#75b3ff";
        let pendingColor = "#ff7575";
        let readyColor = "#75ff82";
        let freeColor = "#999";
        let liveWidth = this.numSlotsLive / this.numSlotsTotal * totalChartWidth;
        let pendingWidth = this.numSlotsPending / this.numSlotsTotal * totalChartWidth;
        let readyWidth = this.numSlotsCleared / this.numSlotsTotal * totalChartWidth;
        let x = this.x + this.margin;
        let y = this.y + this.margin;

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.fillStyle = freeColor;
        ctx.fillRect(x, y, totalChartWidth, totalChartHeight);
        ctx.strokeRect(x, y, totalChartWidth, totalChartHeight);
        ctx.fillStyle = liveColor;
        ctx.fillRect(x, y, liveWidth, totalChartHeight);
        ctx.strokeRect(x, y, liveWidth, totalChartHeight);
        ctx.fillStyle = readyColor;
        ctx.fillRect(x + liveWidth, y, readyWidth, totalChartHeight);
        ctx.strokeRect(x + liveWidth, y, readyWidth, totalChartHeight);
        ctx.fillStyle = pendingColor;
        ctx.fillRect(x + liveWidth + readyWidth, y, pendingWidth, totalChartHeight);
        ctx.strokeRect(x + liveWidth + readyWidth, y, pendingWidth, totalChartHeight);
        ctx.strokeRect(x + liveWidth, y, pendingWidth, totalChartHeight);
        ctx.strokeRect(x, y, totalChartWidth, totalChartHeight);

        let boxWidth = totalChartWidth / this.numSlotsTotal;
        for (let i = 0; i < this.numSlotsTotal; i++) {
            ctx.strokeRect(x + i * boxWidth, y, boxWidth, totalChartHeight);
        }


        // and then text:

        let fontSize = 14;
        y = this.y + this.margin * 2 + totalChartHeight + fontSize;
        x = this.x + this.margin;
        ctx.font = `${fontSize}px Arial`;

        function DrawText(text: string): void {
            ctx.fillText(text, x, y);
            x += ctx.measureText(text).width + 10;
        }

        ctx.fillStyle = liveColor;
        DrawText(`${this.numSlotsLive} live`);

        if (this.numSlotsCleared > 0) {
            x = Math.max(x, this.x + this.margin + liveWidth);
            ctx.fillStyle = readyColor;
            DrawText(`${this.numSlotsCleared} ready to publish`);
        }

        if (this.numSlotsPending > 0) {
            x = Math.max(x, this.x + this.margin + liveWidth + readyWidth);
            ctx.fillStyle = pendingColor;
            DrawText(`${this.numSlotsPending} pending`);
        }

        ctx.fillStyle = freeColor;
        let numAvailable = this.numSlotsTotal - this.numSlotsLive - this.numSlotsPending - this.numSlotsCleared;
        if (numAvailable > 0) {
            x = Math.max(x, this.x + this.margin + liveWidth + readyWidth + pendingWidth);
            DrawText(`${numAvailable} free upload slot${numAvailable == 1 ? "" : "s"}`);
        }
    }
}