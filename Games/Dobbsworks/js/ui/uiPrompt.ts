abstract class UIPrompt {

    // list of selection
    
    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#0004";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

}

class Confirm extends UIPrompt {

}

class Prompt extends UIPrompt {

}

class Alert extends UIPrompt {

}