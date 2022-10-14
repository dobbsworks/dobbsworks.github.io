class EditorButtonSong extends EditorButton {

    constructor(public songId: number) {
        super(tiles["musicnotes"][songId % 6][Math.floor(songId / 6)], songId === 0 ? "Remove level music" : "Set level music");
        this.onClickEvents.push(() => {
            currentMap.songId = songId;
            let songName = audioHandler.levelSongList[this.songId];
            audioHandler.SetBackgroundMusic(songName);
        })
    }

    Update(): void {
        super.Update();
        let isSelected = currentMap.songId == this.songId;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    }
}