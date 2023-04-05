"use strict";
var UIElement = /** @class */ (function () {
    function UIElement(x, y) {
        this.x = x;
        this.y = y;
        this.parentElement = null;
        this.isHidden = false;
        this.fixedPosition = false;
        this.width = 0;
        this.height = 0;
        this.targetWidth = 0;
        this.targetHeight = 0;
        this.moveSpeed = 0.25;
        this.targetX = x;
        this.targetY = y;
    }
    UIElement.prototype.Update = function () {
        this.ApproachTargetValue("x", "targetX");
        this.ApproachTargetValue("y", "targetY");
        this.ApproachTargetValue("width", "targetWidth");
        this.ApproachTargetValue("height", "targetHeight");
    };
    UIElement.prototype.SnapToPlace = function () {
        this.x = this.targetX;
        this.y = this.targetY;
        this.width = this.targetWidth;
        this.height = this.targetHeight;
    };
    UIElement.prototype.CheckAndUpdateMousedOver = function () {
        if (!this.isHidden) {
            if (this.IsMouseOver()) {
                uiHandler.mousedOverElements.push(this);
            }
            if (this instanceof Panel) {
                for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                    var el = _a[_i];
                    if (el)
                        el.CheckAndUpdateMousedOver();
                }
                if (this.scrollBar)
                    this.scrollBar.CheckAndUpdateMousedOver();
            }
        }
    };
    UIElement.prototype.ApproachTargetValue = function (rawProperty, targetProperty) {
        var value = this[rawProperty];
        var target = this[targetProperty];
        var ratioDiff = Math.abs(target == 0 ? value : ((value - target) / target));
        if (ratioDiff < 0.0005) {
            this[rawProperty] = target;
        }
        else {
            this[rawProperty] += (target - value) * this.moveSpeed;
            // previously 0.15
        }
    };
    return UIElement;
}());
