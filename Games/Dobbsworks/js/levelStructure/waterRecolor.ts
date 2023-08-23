class WaterRecolor {

    public ApplyRecolors(): void {
        this.ApplyRecolor(tiles["water"][0][0].src, rgbaStringToHSLA(currentMap.waterColor), 0);
        this.ApplyRecolor(tiles["purpleWater"][0][0].src, rgbaStringToHSLA(currentMap.purpleWaterColor), 0);
        this.ApplyRecolor(tiles["lava"][0][0].src, rgbaStringToHSLA(currentMap.lavaColor), 18);
    }

    public ApplyRecolor(targetImage: HTMLImageElement, color: Hsla, stripeOffset: number): void {
        let sourceImage = tiles["waterSourceImage"][0][0].src as HTMLImageElement;

        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = sourceImage.width;
        tempCanvas.height = sourceImage.height;
        let tempCtx = tempCanvas.getContext("2d");

        let blue = 255;
        let red = (256**2) * 255;
        let magenta = (256**2) * 255 + 255;
        let yellow = (256**2) * 255 + (256) * 255;
        let white = (256**2) * 255 + (256) * 255 + 255;
        let cyan = (256) * 255 + 255;
        let lime = (256) * 255;
        let black = 0;

        let mainColor = hslaToRGBA(color);

        let stripe = {...color};
        stripe.h += stripeOffset;
        if (stripeOffset != 0) {
            stripe.a = 1;
        }

        let stripeColor = hslaToRGBA(stripe);
        let waterfallMainColor = mainColor;
        let waterfallStripe = {...color};
        waterfallStripe.s *= 0.42;
        waterfallStripe.l = (waterfallStripe.l + 1) / 2;
        waterfallStripe.a = 1;
        let waterfallStripeColor = hslaToRGBA(waterfallStripe);
        let surfaceColor = "#FFFFFFEE";

        if (stripeOffset != 0) {
            let lavaSurface = {...color};
            lavaSurface.h += stripeOffset * 2;
            if (stripeOffset != 0) {
                lavaSurface.a = 1;
            }
            surfaceColor = hslaToRGBA(lavaSurface);
        }
        
        let edge1 = {...color};
        edge1.l *= 0.83;
        edge1.a = 1;
        let edge1Color = hslaToRGBA(edge1);
        
        let edge2 = {...color};
        edge2.l *= 0.71;
        edge2.a = 1;
        let edge2Color = hslaToRGBA(edge2);

        try {
            tempCtx?.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);
            let imageData = tempCtx?.getImageData(0, 0, sourceImage.width, sourceImage.height);

            if (imageData?.data && tempCtx) {
                tempCtx.clearRect(0, 0, sourceImage.width, sourceImage.height);
                for (var y = 0; y < sourceImage.height; y++) {
                    for (var x = 0; x < sourceImage.width; x++) {
                        var pos = y * sourceImage.width + x;
                        let r = imageData.data[pos * 4 + 0];
                        let g = imageData.data[pos * 4 + 1];
                        let b = imageData.data[pos * 4 + 2];
                        let a = imageData.data[pos * 4 + 3];

                        let colorSum = r * (256**2) + g * 256 + b;

                        if (colorSum == blue) tempCtx.fillStyle = mainColor;
                        else if (colorSum == red) tempCtx.fillStyle = stripeColor;
                        else if (colorSum == magenta) tempCtx.fillStyle = waterfallMainColor;
                        else if (colorSum == yellow) tempCtx.fillStyle = waterfallStripeColor;
                        else if (colorSum == white) tempCtx.fillStyle = surfaceColor;
                        else if (colorSum == cyan) tempCtx.fillStyle = edge1Color;
                        else if (colorSum == lime) tempCtx.fillStyle = edge2Color;
                        else {
                            tempCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a/255})`;
                        }
                        if (tempCtx.fillStyle != "#FFF0") {
                            tempCtx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            }

            if (debugMode) document.body.appendChild(tempCanvas)

            targetImage.width = tempCanvas.width;
            targetImage.height = tempCanvas.height;
            targetImage.src = tempCanvas.toDataURL();
        } catch (e) {
            console.error(e);
        }
    }
}