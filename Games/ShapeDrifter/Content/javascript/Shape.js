function PrepareContextColors(strokeWidth, strokeColor, fillColor) {
    if (strokeColor != null) {
        gameViewContext.strokeStyle = strokeColor.toString();
        gameViewContext.lineWidth = strokeWidth;
    }
    if (fillColor != null) {
        gameViewContext.fillStyle = fillColor.toString();
    }
}

var shapes = {
    circle: {
        targetable: true,
        color: new Color(255, 0, 0, 1.0),
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.arc(x, y, radius, 0, 2 * Math.PI, false);
            gameViewContext.closePath();
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    square: {
        targetable: true,
        color: new Color(0, 0, 255, 1.0),
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.moveTo(x + radius, y + radius);
            gameViewContext.lineTo(x + radius, y - radius);
            gameViewContext.lineTo(x - radius, y - radius);
            gameViewContext.lineTo(x - radius, y + radius);
            gameViewContext.closePath();
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    triangle: {
        targetable: true,
        color: new Color(0, 255, 0, 1.0),
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.moveTo(x, y - radius);
            gameViewContext.lineTo(x + radius, y + radius);
            gameViewContext.lineTo(x - radius, y + radius);
            gameViewContext.closePath();
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    diamond: {
        targetable: true,
        color: new Color(255, 255, 0, 1.0),
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.moveTo(x, y - radius);
            gameViewContext.lineTo(x + radius, y);
            gameViewContext.lineTo(x, y + radius);
            gameViewContext.lineTo(x - radius, y);
            gameViewContext.closePath();
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    line: {
        targetable: false,
        draw: function (x1, y1, x2, y2, strokeWidth, strokeColor) {
            PrepareContextColors(strokeWidth, strokeColor, null);
            gameViewContext.beginPath();
            gameViewContext.moveTo(x1, y1);
            gameViewContext.lineTo(x2, y2);
            gameViewContext.closePath();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    ellipse: {
        targetable: false,
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            if (gameViewContext.ellipse) {
                gameViewContext.ellipse(x, y, radius, radius / 2, rotation, 2 * Math.PI, false);
            } else {
                gameViewContext.arc(x, y, radius, 0, 2 * Math.PI, false);
            }
            gameViewContext.closePath();
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    blob: {
        targetable: false,
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.arc(x, y, radius, Math.PI, 2 * Math.PI, false);
            if (gameViewContext.ellipse) {
                gameViewContext.ellipse(x, y, radius, radius / 2, rotation, 0, 2 * Math.PI, false);
            } else {
                gameViewContext.arc(x, y, radius, 0, 2 * Math.PI, false);
            }
            gameViewContext.closePath();
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    smile: {
        targetable: false,
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.arc(x, y, radius, Math.PI / 6, Math.PI * 5 / 6, false);
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    frown: {
        targetable: false,
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.arc(x, y, radius, Math.PI * 4 / 3, Math.PI * 5 / 3, false);
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    semicircle: {
        targetable: false,
        draw: function (x, y, radius, strokeWidth, strokeColor, fillColor, rotation) {
            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.arc(x, y, radius, 0, Math.PI, false);
            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    },
    roundedRectangle: {
        targetable: false,
        draw: function (x, y, width, height, cornerRadius, strokeWidth, strokeColor, fillColor, rotation) {
            var x1 = x - width / 2;
            var x2 = x1 + cornerRadius;
            var x4 = x + width / 2;
            var x3 = x4 - cornerRadius;

            var y1 = y - height / 2;
            var y2 = y1 + cornerRadius;
            var y4 = y + height / 2;
            var y3 = y4 - cornerRadius;

            PrepareContextColors(strokeWidth, strokeColor, fillColor);
            gameViewContext.beginPath();
            gameViewContext.arc(x2, y2, cornerRadius, Math.PI, 3 * Math.PI / 2, false);
            gameViewContext.lineTo(x3, y1);
            gameViewContext.arc(x3, y2, cornerRadius, 3 * Math.PI / 2, 0, false);
            gameViewContext.lineTo(x4, y3);
            gameViewContext.arc(x3, y3, cornerRadius, 0, Math.PI / 2, false);
            gameViewContext.lineTo(x2, y4);
            gameViewContext.arc(x2, y3, cornerRadius, Math.PI / 2, Math.PI, false);
            gameViewContext.closePath();

            if (fillColor != null) gameViewContext.fill();
            if (strokeColor != null) gameViewContext.stroke();
        }
    }
}

var shapeChoices = [];
for (var shape in shapes) if (shapes[shape].targetable) shapeChoices.push(shapes[shape]);