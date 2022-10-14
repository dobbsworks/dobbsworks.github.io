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
var EditorButtonSong = /** @class */ (function (_super) {
    __extends(EditorButtonSong, _super);
    function EditorButtonSong(songId) {
        var _this = _super.call(this, tiles["musicnotes"][songId % 6][Math.floor(songId / 6)], songId === 0 ? "Remove level music" : "Set level music") || this;
        _this.songId = songId;
        _this.onClickEvents.push(function () {
            currentMap.songId = songId;
            var songName = audioHandler.levelSongList[_this.songId];
            audioHandler.SetBackgroundMusic(songName);
        });
        return _this;
    }
    EditorButtonSong.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var isSelected = currentMap.songId == this.songId;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    };
    return EditorButtonSong;
}(EditorButton));
