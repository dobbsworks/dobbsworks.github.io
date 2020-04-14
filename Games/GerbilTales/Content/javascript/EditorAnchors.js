var anchorType = {
    center: { type: 'center', cursor: 'move', sides: [] },
    left: { type: 'left', cursor: 'ew-resize', sides: ['left'] },
    right: { type: 'right', cursor: 'ew-resize', sides: ['right'] },
    top: { type: 'top', cursor: 'ns-resize', sides: ['top'] },
    bottom: { type: 'bottom', cursor: 'ns-resize', sides: ['bottom'] },
    topleft: { type: 'topleft', cursor: 'nwse-resize', sides: ['top','left'] },
    topright: { type: 'topright', cursor: 'nesw-resize', sides: ['top','right'] },
    bottomleft: { type: 'bottomleft', cursor: 'nesw-resize', sides: ['bottom','left'] },
    bottomright: { type: 'bottomright', cursor: 'nwse-resize', sides: ['bottom', 'right'] }
}

function EditorAnchor(parent, myAnchorType, onChange) {
    this.parent = parent;
    this.onChange = onChange;
    this.anchorType = myAnchorType;
    this.color = new Color(255, 0, 0, 1.0);
    this.size = 16;

    this.draw = function () {
        gameViewContext.strokeStyle = this.color.toString();
        gameViewContext.lineWidth = 3;
        var sprite = parent.createSprite();
        var x = camera.convertX(sprite.x);
        var y = camera.convertY(sprite.y);

        if (this.anchorType == anchorType.left || this.anchorType == anchorType.topleft || this.anchorType == anchorType.bottomleft)
            x = camera.convertX(sprite.getLeft()) - parent.offset;
        if (this.anchorType == anchorType.right || this.anchorType == anchorType.topright || this.anchorType == anchorType.bottomright)
            x = camera.convertX(sprite.getRight()) + parent.offset;
        if (this.anchorType == anchorType.top || this.anchorType == anchorType.topleft || this.anchorType == anchorType.topright)
            y = camera.convertY(sprite.getTop()) - parent.offset;
        if (this.anchorType == anchorType.bottom || this.anchorType == anchorType.bottomleft || this.anchorType == anchorType.bottomright)
            y = camera.convertY(sprite.getBottom()) + parent.offset;

        this.left = x - this.size / 2;
        this.right = this.left + this.size;
        this.top = y - this.size / 2;
        this.bottom = this.top + this.size;

        gameViewContext.strokeRect(this.left, this.top, this.size, this.size);
    }

    this.isCoordinateWithin = function (x, y) {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
    }

    this.onRelease = function () {
        for (var i = 0; i < this.parent.editables.length; i++) {
            var editable = this.parent.editables[i];
            if (editable.paramType == paramTypes.integer) {
                this.parent[editable.paramName] = parseInt(this.parent[editable.paramName]);
            }
        }
    }
}

var cameraAnchor = new EditorAnchor(null, null, function (dX, dY) {
    camera.x -= (2*dX / editorScale);
    camera.y -= (2*dY / editorScale);
});
cameraAnchor.draw = function () { };
cameraAnchor.onRelease = function () { };

function ResizerAnchorSet(parent) {
    var ret = [];

    ret.push(new LeftAnchor(parent));
    ret.push(new RightAnchor(parent));
    ret.push(new TopAnchor(parent));
    ret.push(new BottomAnchor(parent));
    ret.push(new TopLeftAnchor(parent));
    ret.push(new TopRightAnchor(parent));
    ret.push(new BottomLeftAnchor(parent));
    ret.push(new BottomRightAnchor(parent));
    ret.push(new CenterAnchor(parent));

    return ret;
}

function CenterAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.center, null);
    this.onChange = function (dX, dY) {
        if (this.parent.width) this.parent.width = parseInt(this.parent.width)
        if (this.parent.height) this.parent.height = parseInt(this.parent.height)
        this.parent.tileX += dX / editorScale;
        this.parent.tileY += dY / editorScale;
    };
    this.draw = function () { }
    this.isCoordinateWithin = function (x, y) {
        var sprite = parent.createSprite();
        var left = camera.convertX(sprite.getLeft()) - parent.offset;
        var right = camera.convertX(sprite.getRight()) + parent.offset;
        var top = camera.convertY(sprite.getTop()) - parent.offset;
        var bottom = camera.convertY(sprite.getBottom()) + parent.offset;

        return x >= left && x <= right && y >= top && y <= bottom;
    }
}

function LeftAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.left, null);
    this.onChange = function (dX, dY) {
        this.parent.tileX += (dX / editorScale);
        this.parent.width -= (dX / editorScale);
    };
}

function RightAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.right, null);
    this.onChange = function (dX, dY) {
        this.parent.width += (dX / editorScale);
    };
}

function TopAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.top, null);
    this.onChange = function (dX, dY) {
        this.parent.tileY += (dY / editorScale);
        this.parent.height -= (dY / editorScale);
    };
}

function BottomAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.bottom, null);
    this.onChange = function (dX, dY) {
        this.parent.height += (dY / editorScale);
    };
}

function TopLeftAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.topleft, null);
    this.onChange = function (dX, dY) {
        this.parent.tileY += (dY / editorScale);
        this.parent.height -= (dY / editorScale);
        this.parent.tileX += (dX / editorScale);
        this.parent.width -= (dX / editorScale);
    };
}

function TopRightAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.topright, null);
    this.onChange = function (dX, dY) {
        this.parent.tileY += (dY / editorScale);
        this.parent.height -= (dY / editorScale);
        this.parent.width += (dX / editorScale);
    };
}

function BottomLeftAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.bottomleft, null);
    this.onChange = function (dX, dY) {
        this.parent.height += (dY / editorScale);
        this.parent.tileX += (dX / editorScale);
        this.parent.width -= (dX / editorScale);
    };
}

function BottomRightAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.bottomright, null);
    this.onChange = function (dX, dY) {
        this.parent.height += (dY / editorScale);
        this.parent.width += (dX / editorScale);
    };
}

function RadiusAnchor(parent) {
    EditorAnchor.call(this, parent, anchorType.topright, null);
    this.onChange = function (dX, dY) {
        this.parent.radius += (dX / editorScale / 2);
    };
}