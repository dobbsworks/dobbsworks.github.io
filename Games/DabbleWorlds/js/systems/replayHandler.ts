class ReplayHandler {

    replayData: Uint8Array = new Uint8Array(500);
    replayIndex: number = 0;
    latestByte: number = -1;
    currentInputTimesInARow: number = 0;

    ExportToBase64(): string {
        return btoa(String.fromCharCode.apply(null, <any>this.replayData));
    }

    ImportFromBase64(b64: string) {
        this.replayData = new Uint8Array(atob(b64).split('').map(function (c) { return c.charCodeAt(0); }));
    }

    StoreFrame(): void {
        if (this.replayIndex >= this.replayData.length) {
            // increase buffer size
            let newArray = new Uint8Array(this.replayData.length + 500);
            newArray.set(this.replayData, 0);
            this.replayData = newArray;
        }

        let keyState = KeyboardHandler.GetStateAsByte();

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
        
            
    }

    LoadFrame(): void {
        if (this.currentInputTimesInARow > 0) {
            KeyboardHandler.SetStateFromByte(this.latestByte);
            this.currentInputTimesInARow--;
            return;
        }

        if (this.replayIndex >= this.replayData.length) return;

        this.latestByte = this.replayData[this.replayIndex];
        this.currentInputTimesInARow = this.replayData[this.replayIndex + 1] - 1;
        this.replayIndex += 2;
        KeyboardHandler.SetStateFromByte(this.latestByte);
    }
}