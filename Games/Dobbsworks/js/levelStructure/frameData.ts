interface FrameData {
    imageTile: ImageTile;
    xFlip: boolean;
    yFlip: boolean;
    xOffset: number;
    yOffset: number;
}


var ghostImage: HTMLImageElement;
function GetGhostFrameData(fd: FrameData): FrameData {
    let oldImage = fd.imageTile;
    if (!ghostImage) ghostImage = <HTMLImageElement>document.getElementById("ghostImage");
    let imageTile = new ImageTile(ghostImage, oldImage.xSrc, oldImage.ySrc, oldImage.width, oldImage.height);

    let ret = {
        imageTile: imageTile,
        xFlip: fd.xFlip,
        yFlip: fd.yFlip,
        xOffset: fd.xOffset,
        yOffset: fd.yOffset,
    }

    return ret;
}