class TileNode {
    constructor(tile) {
        this.tile = tile;
    }

    parent = null;
    children = [];
    zIndex = 1; 
    xAnchorOffset = 0;
    yAnchorOffset = 0;

    AddChild(tileNode, xAnchorOffset, yAnchorOffset, zIndex) {
        tileNode.parent = this;
        tileNode.xAnchorOffset = xAnchorOffset;
        tileNode.yAnchorOffset = yAnchorOffset;
        if (zIndex) tileNode.zIndex = zIndex;
        this.children.push(tileNode);
        return tileNode;
    }

    getX(t) {
        let x = this.offsetX(t);
        if (this.parent) x += this.parent.getX(t);
        return x + this.xAnchorOffset;
    }
    getY(t) {
        let y = this.offsetY(t);
        if (this.parent) y += this.parent.getY(t);
        return y + this.yAnchorOffset;
    }

    offsetX(t) {
        return 0;
    }
    offsetY(t) {
        return 0;
    }

    static GetWave(speed, amplitude, offset) {
        return (t) => (Math.cos(speed * t * (Math.PI * 2)) + 1)/2 * amplitude + offset;
    }

    GetRecursiveNodeList() {
        return [this, ...this.children.flatMap(x=> x.GetRecursiveNodeList())];
    }

    Print(tileWidth, tileHeight, numberOfFrames) {
        //returns canvas
        let newCanvas = document.createElement("canvas");
        newCanvas.width = tileWidth*numberOfFrames;
        newCanvas.height = tileHeight;
        newCanvas.style.width = newCanvas.width + "px";
        newCanvas.style.height = newCanvas.height + "px";
        newCanvas.style.display = "none";

        document.body.appendChild(newCanvas);
        let context = newCanvas.getContext("2d");
        context.imageSmoothingEnabled = false;
        let nodeList = this.GetRecursiveNodeList();
        nodeList.sort((a,b)=>a.zIndex-b.zIndex);

        let frameX = 0;
        for (let frameNumber = 0; frameNumber < numberOfFrames; frameNumber++) {
            let t = frameNumber / numberOfFrames;
            for (let node of nodeList) {
                node.tile.Draw(context, node.getX(t) + frameX, node.getY(t));
            }
            frameX += tileWidth;
        }
        return newCanvas;
    }
}