"use strict";
var ReplayHandler = /** @class */ (function () {
    function ReplayHandler() {
        this.replayData = new Uint8Array(500);
        this.replayIndex = 0;
        this.latestByte = -1;
        this.currentInputTimesInARow = 0;
    }
    ReplayHandler.prototype.ExportToBase64 = function () {
        return btoa(String.fromCharCode.apply(null, this.replayData));
    };
    ReplayHandler.prototype.ImportFromBase64 = function (b64) {
        this.replayData = new Uint8Array(atob(b64).split('').map(function (c) { return c.charCodeAt(0); }));
    };
    ReplayHandler.prototype.StoreFrame = function () {
        if (this.replayIndex >= this.replayData.length) {
            // increase buffer size
            var newArray = new Uint8Array(this.replayData.length + 500);
            newArray.set(this.replayData, 0);
            this.replayData = newArray;
        }
        var keyState = KeyboardHandler.GetStateAsByte();
        // initial input
        if (this.latestByte == -1) {
            this.latestByte = keyState;
            this.currentInputTimesInARow = 1;
            return;
        }
        if (keyState == this.latestByte) {
            // repeated input!
            this.currentInputTimesInARow++;
            // max out repeat at 255
        }
        if (keyState != this.latestByte || this.currentInputTimesInARow >= 255) {
            this.replayData[this.replayIndex] = this.latestByte;
            this.replayData[this.replayIndex + 1] = this.currentInputTimesInARow;
            this.replayIndex += 2;
            this.latestByte = keyState;
            this.currentInputTimesInARow = 1;
        }
    };
    ReplayHandler.prototype.LoadFrame = function () {
        if (this.currentInputTimesInARow > 0) {
            KeyboardHandler.SetStateFromByte(this.latestByte);
            this.currentInputTimesInARow--;
            return;
        }
        if (this.replayIndex >= this.replayData.length)
            return;
        this.latestByte = this.replayData[this.replayIndex];
        this.currentInputTimesInARow = this.replayData[this.replayIndex + 1] - 1;
        this.replayIndex += 2;
        KeyboardHandler.SetStateFromByte(this.latestByte);
    };
    return ReplayHandler;
}());
