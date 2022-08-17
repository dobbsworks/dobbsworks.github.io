"use strict";
var ghostImage;
function GetGhostFrameData(fd) {
    var oldImage = fd.imageTile;
    if (!ghostImage)
        ghostImage = document.getElementById("ghostImage");
    var imageTile = new ImageTile(ghostImage, oldImage.xSrc, oldImage.ySrc, oldImage.width, oldImage.height);
    var ret = {
        imageTile: imageTile,
        xFlip: fd.xFlip,
        yFlip: fd.yFlip,
        xOffset: fd.xOffset,
        yOffset: fd.yOffset,
    };
    return ret;
}
