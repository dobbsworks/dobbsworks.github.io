"use strict";
var ToastService = /** @class */ (function () {
    function ToastService() {
        this.messageQueue = [];
        this.currentMessage = null;
        this.currentMessageTimer = 0;
    }
    ToastService.prototype.AddMessage = function (message, image) {
        this.messageQueue.push({ text: message, image: image });
    };
    ToastService.prototype.AnnounceAvatarUnlock = function (image) {
        this.AddMessage("New avatar image unlocked!", image);
    };
    ToastService.prototype.Update = function () {
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
    };
    ToastService.prototype.Draw = function (ctx) {
        if (this.currentMessage) {
            var panelX = 600;
            var panelY = 486;
            if (this.currentMessageTimer < 30) {
                panelY += (30 - this.currentMessageTimer) * 4;
            }
            if (this.currentMessageTimer > 210) {
                panelY += (this.currentMessageTimer - 210) * 4;
            }
            ctx.fillStyle = "#000D";
            ctx.fillRect(panelX, panelY, 350, 80);
            var img = this.currentMessage.image;
            ctx.drawImage(img.src, img.xSrc, img.ySrc, img.width, img.height, panelX, panelY, 80, 80);
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "left";
            ctx.fillText(this.currentMessage.text, panelX + 85, panelY + 50);
        }
    };
    return ToastService;
}());
