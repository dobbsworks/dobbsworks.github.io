function CommandSoundBoard(user, args) {
    let searchString = args[0];
    let playSuccess = soundboardHandler.play(searchString);
    return { message: "", success: playSuccess };
}

function CommandSoundList(user, args) {
    let page = +(args[0]);
    let numPerPage = 5;
    let maxPage = Math.ceiling(soundboardHandler.sounds.length / numPerPage);
    if (!page || page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    page = Math.floor(page);
    let firstEl = (page - 1) * numPerPage;
    let lastEl = firstEl + numPerPage - 1; 
    let sounds = soundboardHandler.sounds.slice(firstEl, lastEl);

    let ret = sounds.map(s => ` ${s.id}. ${s.key}`).join(', ');
    return { message: ret, success: true };
}



var soundboardHandler = {
    baseUrl: "https://dobbsworks.github.io/Tools/Streambot/audio/",
    sounds: [
        { id: 1, volume: 1.0, key: "bowser-laugh", file: "sm64_bowser_laugh.wav" },
        { id: 2, volume: 1.0, key: "korok-yahaha", file: "yahaha.mp3" },
        { id: 3, volume: 1.0, key: "korok-jingle", file: "korok-jingle.mp3" },
        { id: 4, volume: 1.0, key: "fickle-wheel", file: "fickle-wheel.mp3" }
    ],
    findSound: (arg) => {
        let sound = this.sounds.find(x => x.id === +(arg));
        if (!sound) sound = this.sounds.find(x => x.key === arg);
        return sound;
    },
    isValidated: false,
    validateSounds: () => {
        if (!this.isValidated) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            let target = this.sounds.length;
            if (this.sounds.map(x => x.id).filter(onlyUnique).length !== target) {
                console.error("SOUNDBOARD DATA ERROR: ID");
            }
            if (this.sounds.map(x => x.key).filter(onlyUnique).length !== target) {
                console.error("SOUNDBOARD DATA ERROR: KEY");
            }
            this.isValidated = true;
        }
    },
    play: (arg) => {
        this.validateSounds();
        let sound = this.findSound(arg);
        if (!sound) return false;
        let url = this.baseUrl + sound.file;
        let audio = new Audio('audio_file.mp3');
        audio.volume = sound.volume;
        audio.play();
        return true;
    }
}