window.onload = function () {
    var fileInput = document.getElementById("fileInput");
    fileInput.onchange = OnFileSelect;

    var canvas = document.getElementById("canvas");
    var image = document.getElementById("img");

    var imageHandler = new ImageHandler(canvas, image);

    function OnFileSelect() {
        var file = this.files[0];
        var fileReader = new FileReader();
        var imageLoaded = document.createElement("img");
        fileReader.onload = function (fileLoadedEvent) {
            imageHandler.imageChange(fileLoadedEvent.target.result);
        };
        fileReader.readAsDataURL(file);
    }

    var leftOffsetInput = document.getElementById("leftOffset");
    var rightOffsetInput = document.getElementById("rightOffset");
    var topOffsetInput = document.getElementById("topOffset");
    var bottomOffsetInput = document.getElementById("bottomOffset");
    leftOffsetInput.onchange = function (e) {
        imageHandler.offsetChange(parseFloat(e.target.value), Offset.left);
    };
    rightOffsetInput.onchange = function (e) {
        imageHandler.offsetChange(parseFloat(e.target.value), Offset.right);
    };
    topOffsetInput.onchange = function (e) {
        imageHandler.offsetChange(parseFloat(e.target.value), Offset.top);
    };
    bottomOffsetInput.onchange = function (e) {
        imageHandler.offsetChange(parseFloat(e.target.value), Offset.bottom);
    };

    var pixelsPerRow = document.getElementById("pixelsPerRow");
    var rows = document.getElementById("rows");
    var pixelsPerColumn = document.getElementById("pixelsPerColumn");
    var columns = document.getElementById("columns");
    pixelsPerRow.onchange = function (e) {
        rows.value = imageHandler.pixelPerRowChange(parseFloat(e.target.value)).toString();
    };
    rows.onchange = function (e) {
        pixelsPerRow.value = imageHandler.rowCountChange(parseFloat(e.target.value)).toString();
    };
    pixelsPerColumn.onchange = function (e) {
        columns.value = imageHandler.pixelPerColumnChange(parseFloat(e.target.value)).toString();
    };
    columns.onchange = function (e) {
        pixelsPerColumn.value = imageHandler.columnCountChange(parseFloat(e.target.value)).toString();
    };

    var zoomInput = document.getElementById("zoom");
    zoomInput.onchange = function (e) {
        imageHandler.setZoom(parseFloat(e.target.value));
    };

    var smoothingInput = document.getElementById("smoothing");
    smoothingInput.onchange = function (e) {
        imageHandler.setImageSmoothing(e.target.checked);
    };

    var colorInput = document.getElementById("color");
    colorInput.onchange = function (e) {
        imageHandler.setGridColor(e.target.value);
    };
};

var Offset = (function () {
    function Offset() {
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    }
    Offset.left = "left";
    Offset.right = "right";
    Offset.top = "top";
    Offset.bottom = "bottom";
    return Offset;
})();

var Slices = (function () {
    function Slices(pixelsPerSlice, slices) {
        this.pixelsPerSlice = pixelsPerSlice;
        this.slices = slices;
    }
    Slices.FromPixelsPerSliceAndTotal = function (pps, totalSize) {
        return new Slices(pps, totalSize / pps);
    };
    Slices.FromSliceCountAndTotal = function (count, totalSize) {
        return new Slices(totalSize / count, count);
    };
    return Slices;
})();

var ImageHandler = (function () {
    function ImageHandler(canvas, image) {
        this.canvas = canvas;
        this.image = image;
        this.zoom = 1;
        this.smoothing = true;
        this.offset = new Offset();
        this.rows = new Slices(1, 1);
        this.columns = new Slices(1, 1);
        this.gridColor = "#000000";
        this.ctx = canvas.getContext("2d");
    }
    Object.defineProperty(ImageHandler.prototype, "drawableWidth", {
        get: function () {
            return this.image.width - this.offset.left - this.offset.right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageHandler.prototype, "drawableHeight", {
        get: function () {
            return this.image.height - this.offset.top - this.offset.bottom;
        },
        enumerable: true,
        configurable: true
    });

    ImageHandler.prototype.imageChange = function (imageString) {
        this.image.src = imageString;
        this.canvas.width = this.image.width * this.zoom;
        this.canvas.height = this.image.height * this.zoom;
        this.rows = Slices.FromSliceCountAndTotal(8, this.drawableHeight);
        this.columns = Slices.FromSliceCountAndTotal(8, this.drawableWidth);
        this.redraw();
    };

    ImageHandler.prototype.offsetChange = function (newValue, offsetType) {
        this.offset[offsetType] = newValue;
        this.redraw();
    };

    ImageHandler.prototype.pixelPerRowChange = function (newValue) {
        this.rows = Slices.FromPixelsPerSliceAndTotal(newValue, this.drawableHeight);
        this.redraw();
        return this.rows.slices;
    };

    ImageHandler.prototype.pixelPerColumnChange = function (newValue) {
        this.columns = Slices.FromPixelsPerSliceAndTotal(newValue, this.drawableWidth);
        this.redraw();
        return this.columns.slices;
    };

    ImageHandler.prototype.rowCountChange = function (newValue) {
        this.rows = Slices.FromSliceCountAndTotal(newValue, this.drawableHeight);
        this.redraw();
        return this.rows.pixelsPerSlice;
    };

    ImageHandler.prototype.columnCountChange = function (newValue) {
        this.columns = Slices.FromSliceCountAndTotal(newValue, this.drawableWidth);
        this.redraw();
        return this.columns.pixelsPerSlice;
    };

    ImageHandler.prototype.setZoom = function (newValue) {
        this.zoom = newValue;
        this.imageChange(this.image.src);
        this.redraw();
    };

    ImageHandler.prototype.setImageSmoothing = function (newValue) {
        this.smoothing = newValue;
        this.redraw();
    };

    ImageHandler.prototype.setGridColor = function (newValue) {
        this.gridColor = newValue;
        this.redraw();
    };

    ImageHandler.prototype.redraw = function () {
        this.ctx.imageSmoothingEnabled = this.smoothing;
        if (this.columns.pixelsPerSlice <= 0)
            return;
        if (this.rows.pixelsPerSlice <= 0)
            return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, this.offset.left * this.zoom, this.canvas.height);
        this.ctx.fillRect(this.canvas.width, 0, -this.offset.right * this.zoom, this.canvas.height);
        this.ctx.fillRect(0, 0, this.canvas.width, this.offset.top * this.zoom);
        this.ctx.fillRect(0, this.canvas.height, this.canvas.width, -this.offset.bottom * this.zoom);

        this.ctx.strokeStyle = this.gridColor;
        for (var x = this.offset.left; x <= this.image.width - this.offset.right; x += this.columns.pixelsPerSlice) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.zoom, 0);
            this.ctx.lineTo(x * this.zoom, this.canvas.height);
            this.ctx.stroke();
        }
        for (var y = this.offset.top; y <= this.image.height - this.offset.bottom; y += this.rows.pixelsPerSlice) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.zoom);
            this.ctx.lineTo(this.canvas.width, y * this.zoom);
            this.ctx.stroke();
        }
    };
    return ImageHandler;
})();
//# sourceMappingURL=app.js.map
