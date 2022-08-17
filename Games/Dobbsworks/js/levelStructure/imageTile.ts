class ImageTile {
    constructor(
        public src: HTMLImageElement | HTMLCanvasElement,
        public xSrc: number,
        public ySrc: number,
        public width: number,
        public height: number
    ) { }

    public yOffset: number = 0;
    public xOffset: number = 0;

    Draw(ctx: CanvasRenderingContext2D, destX: number, destY: number, zoom: number, xFlip: boolean = false, yFlip: boolean = false, scale: number = 1) {
        if (xFlip || yFlip) ctx.scale(xFlip ? -1 : 1, yFlip ? -1 : 1);
        destY += this.yOffset;
        destX += this.xOffset;
        ctx.drawImage(this.src, this.xSrc + 0.1, this.ySrc + 0.1, this.width - 0.2, this.height - 0.2,
            xFlip ? -destX - this.width * zoom : destX,
            yFlip ? -destY - this.width * zoom : destY,
            this.width * zoom * scale, this.height * zoom * scale);
        if (xFlip || yFlip) ctx.scale(xFlip ? -1 : 1, yFlip ? -1 : 1);
    }

    DrawToScreen(ctx: CanvasRenderingContext2D, canvasX: number, canvasY: number, scale: number = 4) {
        canvasY += this.yOffset;
        canvasX += this.xOffset;
        ctx.drawImage(this.src, this.xSrc + 0.1, this.ySrc + 0.1, this.width - 0.2, this.height - 0.2,
            canvasX, canvasY, this.width * scale, this.height * scale);
    }


    GetRecolor(
        hueShift: number,
        saturationRatio: number,
        brightnessRatio: number): ImageTile {

        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = this.width;
        tempCanvas.height = this.height;
        let tempCtx = tempCanvas.getContext("2d");

        function alphaToString(a: number) {
            // a is [0,255]
            let str = a.toString(16);
            if (str.length == 1) return "0" + str;
            return str;
        }

        try {
            tempCtx?.drawImage(this.src, this.xSrc, this.ySrc, this.width, this.height, 0, 0, this.width, this.height);
            let imageData = tempCtx?.getImageData(0, 0, this.width, this.height);


            if (imageData?.data && tempCtx) {
                tempCtx.clearRect(0, 0, this.width, this.height);
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var pos = y * this.width + x;
                        let r = imageData.data[pos * 4 + 0];
                        let g = imageData.data[pos * 4 + 1];
                        let b = imageData.data[pos * 4 + 2];
                        let a = imageData.data[pos * 4 + 3];

                        let hsl = rgbToHSL(r, g, b);
                        hsl.h += hueShift + 360;
                        hsl.h %= 360;
                        hsl.s *= saturationRatio;
                        hsl.l *= brightnessRatio;
                        if (hsl.l > 1) hsl.l = 1;
                        let rgb = hslToRGB(hsl);

                        tempCtx.fillStyle = rgb + alphaToString(a);
                        tempCtx.fillRect(x, y, 1, 1);
                    }
                }
            }
            return new ImageTile(<any>tempCanvas, 0, 0, this.width, this.height);
        } catch (e) {
            console.error(e);
            return this;
        }
    }

    Scale(scaleRatio: number, flipX: boolean, flipY: boolean): ImageTile {

        let tempCanvas = document.createElement("canvas");
        let imageWidth = this.width * scaleRatio;
        let imageHeight = this.height * scaleRatio;

        tempCanvas.width = imageWidth;
        tempCanvas.height = imageHeight;
        let tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
            tempCtx.scale((flipX ? -1 : 1), (flipY ? -1 : 1));
            tempCtx.translate(flipX ? -tempCanvas.width : 0, flipY ? -tempCanvas.height : 0);
            tempCtx.drawImage(this.src, this.xSrc, this.ySrc, this.width, this.height, 0, 0, tempCanvas.width, tempCanvas.height);
        }

        // TODO
        // tile up images

        // // we want to tile our scaled up image enough times to cover 2 width/heights of the entire game view 
        // // so that we only have to draw the bg layer once instead of tiling it
        // let tileCount = Math.max(1, camera.canvas.width / imageWidth, camera.canvas.height / imageHeight); 
        // let tiledCanvas = document.createElement("canvas");
        // tiledCanvas.width = imageWidth * tileCount;
        // tiledCanvas.height = imageHeight * tileCount;
        // let tiledCtx = tiledCanvas.getContext("2d");
        // if (tiledCtx) {
        //     for (let x = 0; x < tileCount; x++) {
        //         for (let y = 0; y < tileCount; y++) {
        //             tiledCtx.drawImage(tempCanvas, 0, 0, imageWidth, imageHeight, imageWidth * x, imageHeight * y, imageWidth, imageHeight);
        //         }
        //     }
        // }

        return new ImageTile(<any>tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
    }

    GetSquareThumbnail(): ImageTile {
        let targetWidth = Math.floor(50 / 4);
        let targetHeight = targetWidth;
        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
        let tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
            tempCtx.drawImage(this.src, this.xSrc, this.ySrc, this.height, this.height, 0, 0, targetWidth, targetHeight);
        }
        return new ImageTile(<any>tempCanvas, 0, 0, targetWidth, targetHeight);
    }
}

function rgbStringToHSL(rgb: string) {
    // strip the leading # if it's there
    rgb = rgb.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (rgb.length == 3) {
        rgb = rgb.replace(/(.)/g, '$1$1');
    }
    return rgbToHSL(
        parseInt(rgb.substring(0, 2), 16),
        parseInt(rgb.substring(2, 4), 16),
        parseInt(rgb.substring(4, 6), 16)
    )
}

// exepcts a string and returns an object
function rgbToHSL(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    var cMax = Math.max(r, g, b),
        cMin = Math.min(r, g, b),
        delta = cMax - cMin,
        l = (cMax + cMin) / 2,
        h = 0,
        s = 0;

    if (delta == 0) {
        h = 0;
    }
    else if (cMax == r) {
        h = 60 * (((g - b) / delta) % 6);
    }
    else if (cMax == g) {
        h = 60 * (((b - r) / delta) + 2);
    }
    else {
        h = 60 * (((r - g) / delta) + 4);
    }

    if (delta == 0) {
        s = 0;
    }
    else {
        s = (delta / (1 - Math.abs(2 * l - 1)))
    }

    return {
        h: h,
        s: s,
        l: l
    }
}

// expects an object and returns a string
function hslToRGB(hsl: Hsl) {
    var h = hsl.h,
        s = hsl.s,
        l = hsl.l,
        c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r, g, b;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else {
        r = c;
        g = 0;
        b = x;
    }

    r = normalize_rgb_value(r, m);
    g = normalize_rgb_value(g, m);
    b = normalize_rgb_value(b, m);

    return rgbToHex(r, g, b);
}

function normalize_rgb_value(color: number, m: number) {
    color = Math.floor((color + m) * 255);
    if (color < 0) {
        color = 0;
    }
    return color;
}

function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}