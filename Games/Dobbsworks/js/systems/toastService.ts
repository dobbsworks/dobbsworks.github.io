class ToastService {

    private messageQueue: { text: string, image: ImageTile }[] = [];

    private currentMessage: { text: string, image: ImageTile } | null = null;
    private currentMessageTimer = 0;

    private AddMessage(message: string, image: ImageTile): void {
        this.messageQueue.push({ text: message, image: image });
    }

    public AnnounceAvatarUnlock(image: ImageTile): void {
        this.AddMessage("New avatar image unlocked!", image);
    }

    Update(): void {
        if (!this.currentMessage && this.messageQueue.length) {
            this.currentMessage = this.messageQueue.shift() || null;
            this.currentMessageTimer = 0;
        }

        if (this.currentMessage) {
            this.currentMessageTimer++;
            if (this.currentMessageTimer > 240) {
                this.currentMessage = null;
            }
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.currentMessage) {
            let panelX = 600;
            let panelY = 486;
            if (this.currentMessageTimer < 30) {
                panelY += (30 - this.currentMessageTimer) * 4;
            }
            if (this.currentMessageTimer > 210) {
                panelY += (this.currentMessageTimer - 210) * 4;
            }

            ctx.fillStyle = "#000D";
            ctx.fillRect(panelX, panelY, 350, 80);

            let img = this.currentMessage.image;
            ctx.drawImage(img.src, img.xSrc, img.ySrc, img.width, img.height, panelX, panelY, 80, 80);

            ctx.fillStyle = "white";
            ctx.font = `20px Arial`;
            ctx.textAlign = "left";
            ctx.fillText(this.currentMessage.text, panelX + 85, panelY + 50);

        }

    }
}