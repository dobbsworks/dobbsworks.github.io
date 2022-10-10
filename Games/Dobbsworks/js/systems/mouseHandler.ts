class MouseHandler {
    mouseX = 0;
    mouseY = 0;
    mouseScroll = 0;
    isMouseOver = false;
    isMouseDown = false;
    isMouseChanged = false;
    hasUserInteracted = false;

    constructor(public canvas: HTMLCanvasElement) {
        this.InitMouseHandlers();
    }

    InitMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.OnMouseDown, false);
        this.canvas.addEventListener("mouseup", this.OnMouseUp, false);
        this.canvas.addEventListener("mousemove", this.OnMouseMove, false);
        this.canvas.addEventListener("mouseout", this.OnMouseOut, false);
        this.canvas.addEventListener("touchstart", this.OnTouchStart, false);
        this.canvas.addEventListener("touchend", this.OnTouchEnd, false);
        this.canvas.addEventListener("touchmove", this.OnTouchMove, false);
        this.canvas.addEventListener("wheel", this.OnMouseScroll, false);
    }


    GetGameMouseTile(layer: LevelLayer, camera: Camera): TileCoordinate {
        let gamePixel = this.GetGameMousePixel(camera);
        let tileX = Math.floor(gamePixel.xPixel / layer.tileWidth);
        let tileY = Math.floor(gamePixel.yPixel / layer.tileHeight);
        return {tileX: tileX, tileY: tileY};
    }


    GetGameMousePixel(camera: Camera): Pixel {
        let pixel = this.GetCanvasMousePixel();
        return {xPixel: camera.x - (this.canvas.width/2) / camera.scale + (pixel.xPixel / camera.scale)
            , yPixel: camera.y - (this.canvas.height/2) / camera.scale + (pixel.yPixel / camera.scale)};
    }

    GetCanvasMousePixel(): Pixel {
        if (document.fullscreenElement) {
            let boundingRect = this.canvas.getBoundingClientRect();
            let targetWidthToHeightRatio = this.canvas.width / this.canvas.height;
            let currentWidthToHeightRatio = boundingRect.width / boundingRect.height;

            if (targetWidthToHeightRatio <= currentWidthToHeightRatio) {
                // screen is too wide, dead zone at left and right
                let scaleUpRatio = boundingRect.height / this.canvas.height;
                let currentCanvasWidth = scaleUpRatio * this.canvas.width;
                let deadZoneWidth = (boundingRect.width - currentCanvasWidth)/2;
                return {xPixel: (this.mouseX - deadZoneWidth) / scaleUpRatio, yPixel: this.mouseY / scaleUpRatio};
            } else {
                // screen is too tall, dead zone at top and bottom
                let scaleUpRatio = boundingRect.width / this.canvas.width;
                let currentCanvasHeight = scaleUpRatio * this.canvas.height;
                let deadZoneHeight = (boundingRect.height - currentCanvasHeight)/2;
                return {xPixel: this.mouseX / scaleUpRatio, yPixel: (this.mouseY - deadZoneHeight) / scaleUpRatio};
            }
        }
        return {xPixel: this.mouseX, yPixel: this.mouseY};
    }

    UpdateMouseChanged() {
        this.isMouseChanged = false;
        this.mouseScroll = 0;
    }

    isMouseClicked() {
        return this.isMouseChanged && this.isMouseDown;
    }

    OnMouseDown(e: MouseEvent) {
        mouseHandler.isMouseOver = true;
        mouseHandler.hasUserInteracted = true;
        if (e.button === 0) {
            mouseHandler.isMouseDown = true;
            mouseHandler.isMouseChanged = true;
        }
    }

    OnMouseUp(e: MouseEvent) {
        mouseHandler.isMouseOver = true;
        if (e.button === 0) {
            mouseHandler.isMouseDown = false;
            mouseHandler.isMouseChanged = true;
        }
    }

    OnMouseMove(e: MouseEvent) {
        mouseHandler.mouseX = e.offsetX;
        mouseHandler.mouseY = e.offsetY;
        if (document.body.style.cursor == "none") {
            document.body.style.cursor = "unset";
        }
    }

    OnMouseOut(e: MouseEvent) {
        mouseHandler.isMouseOver = false;
        mouseHandler.OnMouseMove(e);
        // mouseHandler.isMouseChanged = mouseHandler.isMouseDown;
        // mouseHandler.isMouseDown = false;
    }

    OnMouseScroll(e: any) {
        mouseHandler.isMouseOver = true;
        if (e.deltaY > 0) mouseHandler.mouseScroll = 1;
        if (e.deltaY < 0) mouseHandler.mouseScroll = -1;
        e.preventDefault();
    }

    OnTouchStart(e: any) {
        // //TODO - account for canvas position
        // mouseHandler.mouseX = e.touches[0].pageX - e.target.offsetLeft;
        // mouseHandler.mouseY = e.touches[0].pageY - e.target.offsetTop;
        // mouseHandler.isMouseDown = true;
        // mouseHandler.isMouseChanged = true;
        // e.preventDefault();
    }

    OnTouchEnd(e: TouchEvent) {
        // mouseHandler.isMouseDown = false;
        // mouseHandler.isMouseChanged = true;
    }

    OnTouchMove(e: TouchEvent) {
        mouseHandler.mouseX = e.touches[0].pageX;
        mouseHandler.mouseY = e.touches[0].pageY;
        e.preventDefault();
    }
}