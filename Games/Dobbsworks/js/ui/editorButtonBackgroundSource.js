"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EditorButtonBackgroundSource = /** @class */ (function (_super) {
    __extends(EditorButtonBackgroundSource, _super);
    function EditorButtonBackgroundSource(backgroundSource, container) {
        var _this = _super.call(this, backgroundSource.thumbnail) || this;
        _this.backgroundSource = backgroundSource;
        _this.container = container;
        _this.onClickEvents.push(function () {
            container.selectedSource = backgroundSource;
            container.OnChange();
        });
        return _this;
    }
    EditorButtonBackgroundSource.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var isSelected = this.container.selectedSource === this.backgroundSource;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    };
    return EditorButtonBackgroundSource;
}(EditorButton));
