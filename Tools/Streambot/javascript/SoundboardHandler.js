function CommandSoundBoard(user, args) {
    let searchString = args[0];
    let playSuccess = soundboardHandler.play(searchString);

    let message = "";
    if (!playSuccess) message = "Sound not found, use !sounds to check available options";
    return { message: message, success: playSuccess };
}

function CommandSoundList(user, args) {
    let page = +(args[0]);
    let numPerPage = 5;
    let maxPage = Math.ceil(soundboardHandler.sounds.length / numPerPage);
    if (!page || page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    page = Math.floor(page);
    let firstEl = (page - 1) * numPerPage;
    let lastEl = firstEl + numPerPage; 
    let sounds = soundboardHandler.sounds.slice(firstEl, lastEl);

    let ret = sounds.map(s => ` ${s.id}. ${s.key}`).join(', ');
    ret = `Page (${page}/${maxPage}): ` + ret;
    return { message: ret, success: true };
}



var soundboardHandler = {
    baseUrl: "https://dobbsworks.github.io/Tools/Streambot/audio/",
    masterVolume: 0.5,
    sounds: [
        { volume: 0.8, key: "bowser-laugh", file: "sm64_bowser_laugh.wav" },
        { volume: 1.0, key: "korok-yahaha", file: "yahaha.mp3" },
        { volume: 0.8, key: "korok-jingle", file: "korok-jingle.mp3" },
        { volume: 0.5, key: "tf2-victory", file: "tf2-victory.mp3" },
        { volume: 0.5, key: "tf2-fail", file: "tf2-fail.mp3" },
        { volume: 0.5, key: "fickle-wheel", file: "fickle-wheel.mp3" },
        { volume: 0.7, key: "barrel-roll", file: "barrel-roll.mp3" },
        { volume: 0.7, key: "hey-listen", file: "hey-listen.mp3" },
        { volume: 0.7, key: "kirby-hi", file: "kirby-hi.mp3" },
        { volume: 0.7, key: "wario-laugh", file: "wario-laugh.mp3" },
        { volume: 0.7, key: "spaghetti", file: "spaghetti.mp3" },
        { volume: 0.7, key: "find-princess", file: "find-princess.mp3" },
        { volume: 0.7, key: "instruction-book", file: "instruction-book.mp3" },
        { volume: 0.7, key: "toast", file: "toast.mp3" },
        { volume: 0.7, key: "sm64-game-over", file: "sm64-game-over.mp3" },
        { volume: 0.7, key: "drum-rimshot", file: "drum-rimshot.mp3" },
        { volume: 0.7, key: "crickets", file: "crickets.mp3" }
    ],
    findSound: (arg) => {
        let sound = soundboardHandler.sounds.find(x => x.id === +(arg));
        if (!sound) sound = soundboardHandler.sounds.find(x => x.key === arg);
        return sound;
    },
    initialized: false,
    initSounds: () => {
        if (!soundboardHandler.initialized) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            let target = soundboardHandler.sounds.length;
            // if (soundboardHandler.sounds.map(x => x.id).filter(onlyUnique).length !== target) {
            //     console.error("SOUNDBOARD DATA ERROR: ID");
            // }
            if (soundboardHandler.sounds.map(x => x.key).filter(onlyUnique).length !== target) {
                console.error("SOUNDBOARD DATA ERROR: KEY");
            }
            for (let i=0; i<soundboardHandler.sounds.length; i++) {
                soundboardHandler.sounds[i].id = i+1;
            }
            soundboardHandler.initialized = true;
        }
    },
    play: (arg) => {
        soundboardHandler.initSounds();
        let sound = soundboardHandler.findSound(arg);
        if (!sound) return false;
        let url = soundboardHandler.baseUrl + sound.file;
        let audio = new Audio(url);
        audio.volume = sound.volume * soundboardHandler.masterVolume;
        if (audio.volume > 1) audio.volume = 1;
        if (audio.volume < 0) audio.volume = 0;
        audio.play();
        return true;
    }
}