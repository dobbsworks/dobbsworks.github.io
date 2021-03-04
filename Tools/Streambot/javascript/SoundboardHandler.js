function CommandSoundBoard(user, args) {
    let searchString = args[0];
    let results = soundboardHandler.play(searchString);
    return results;
}

function CommandSoundBoardRandom(user, args) {
    let results = soundboardHandler.play("random");
    return results;
}

function CommandSoundList(user, args) {
    let page = +(args[0]);
    let numPerPage = 16;
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
    masterVolume: 0.8,
    initialized: false,
    maxConcurrent: 3,
    pendingSounds: [],
    playingSounds: [],
    sounds: [
        { volume: 0.8, key: "bowser-laugh", file: "sm64_bowser_laugh.wav" },
        { volume: 0.9, key: "korok-yahaha", file: "yahaha.mp3" },
        { volume: 0.5, key: "korok-jingle", file: "korok-jingle.mp3" },
        { volume: 0.3, key: "tf2-victory", file: "tf2-victory.mp3" },
        { volume: 0.3, key: "tf2-fail", file: "tf2-fail.mp3" },
        { volume: 0.3, key: "fickle-wheel", file: "fickle-wheel.mp3" },
        { volume: 0.7, key: "barrel-roll", file: "barrel-roll.mp3" },
        { volume: 0.7, key: "hey-listen", file: "hey-listen.mp3" },
        { volume: 0.7, key: "kirby-hi", file: "kirby-hi.mp3" },
        { volume: 0.9, key: "wario-laugh", file: "wario-laugh.mp3" },
        { volume: 0.7, key: "instruction-book", file: "instruction-book.mp3" },
        { volume: 0.9, key: "toast", file: "toast.mp3" },
        { volume: 0.8, key: "sm64-game-over", file: "sm64-game-over.mp3" },
        { volume: 0.8, key: "drum-rimshot", file: "drum-rimshot.mp3" },
        { volume: 0.8, key: "crickets", file: "crickets.mp3" },
        { volume: 0.17, key: "space", file: "space.mp3" },
        { volume: 0.2, key: "space-dad", file: "space-dad.mp3" },
        { volume: 0.3, key: "space-space", file: "space-space.mp3" },
        { volume: 0.1, key: "diggy-hole", file: "diggy-hole.mp3" },
        { volume: 1.0, key: "maybe", file: "maybe.mp3" },
    ],
    findSound: (arg) => {
        let sound = soundboardHandler.sounds.find(x => x.id === +(arg));
        if (!sound) {
            sound = soundboardHandler.sounds.find(x => x.key === arg.toLowerCase());
        }
        if (!sound && arg && arg.toLowerCase() === "random") {
            let soundIndex = Math.floor(Math.random() * soundboardHandler.sounds.length);
            sound = soundboardHandler.sounds[soundIndex];
        }
        return sound;
    },
    initSounds: () => {
        if (!soundboardHandler.initialized) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            let target = soundboardHandler.sounds.length;
            if (soundboardHandler.sounds.map(x => x.key).filter(onlyUnique).length !== target) {
                console.error("SOUNDBOARD DATA ERROR: KEY");
            }
            for (let i=0; i<soundboardHandler.sounds.length; i++) {
                soundboardHandler.sounds[i].id = i+1;
            }
            setInterval(soundboardHandler.update, 200);
            soundboardHandler.initialized = true;
        }
    },
    play: (arg) => {
        soundboardHandler.initSounds();
        let sound = soundboardHandler.findSound(arg);
        if (!sound) return {success: false, message: "Sound not found, use !sounds to check available options"};
        let url = soundboardHandler.baseUrl + sound.file;
        let audio = new Audio(url);
        audio.volume = sound.volume * soundboardHandler.masterVolume;
        if (audio.volume > 1) audio.volume = 1;
        if (audio.volume < 0) audio.volume = 0;
        if (audio.duration > 15) return {success: false, message: "ok, so Dobbs might've goofed this sound up, try a different one."};
        //audio.play();
        soundboardHandler.pendingSounds.push(audio);
        return {success: true, message: `Playing sound ${sound.id}, ${sound.key}.`};
    },
    update: () => {
        soundboardHandler.playingSounds = soundboardHandler.playingSounds.filter(s => !s.paused);
        if (soundboardHandler.playingSounds.length < soundboardHandler.maxConcurrent) {
            let nextSound = soundboardHandler.pendingSounds.splice(0,1)[0];
            if (nextSound) {
                nextSound.play();
                soundboardHandler.playingSounds.push(nextSound);
            }
        }
    },
}
soundboardHandler.initSounds();