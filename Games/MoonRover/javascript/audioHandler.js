class AudioHandler {

    constructor() {
    }
    audioCtxMusic;
    audioCtxSfx;

    lowPassNode;
    gainNodeMusic;
    gainNodeSfx;
    initialMusicVolume = 0.4;
    initialSfxVolume = 1;
    volumeScale = 5;

    initialized = false;
    audioLibrary = {};
    currentBgm = null;

    Initialize() {
        if (this.initialized) return;
        if (hasUserInteracted) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtxMusic = new AudioContext();
            this.audioCtxSfx = new AudioContext();
            this.LoadAudioFiles();
    
            this.gainNodeMusic = this.audioCtxMusic.createGain();
            this.gainNodeMusic.gain.value = this.initialMusicVolume;
    
            this.gainNodeSfx = this.audioCtxMusic.createGain();
            this.gainNodeSfx.gain.value = this.initialSfxVolume;
    
            this.lowPassNode = this.audioCtxMusic.createBiquadFilter();
            this.lowPassNode.type = "lowpass"
            this.lowPassNode.frequency.setValueAtTime(24000, this.audioCtxMusic.currentTime);
            this.lowPassNode.gain.setValueAtTime(25, this.audioCtxMusic.currentTime);
    
            for (let key in this.audioLibrary) {
                let audioObject = this.audioLibrary[key];
                if (audioObject.isMusic) {
                    audioObject.src.loop = true;
                    audioObject.node.connect(this.gainNodeMusic).connect(this.lowPassNode).connect(this.audioCtxMusic.destination);
                } 
                if (audioObject.isSfx) {
                    audioObject.node.connect(this.gainNodeSfx).connect(this.audioCtxMusic.destination);
                }
            }
            
            audioHandler.SetBackgroundMusic("music-title");
        } else {
            setTimeout(() => {audioHandler.Initialize.apply(audioHandler)}, 100);
        }
    }

    LoadAudioFiles() {
        let audioFiles = document.getElementsByTagName("audio");
        for (let audioFile of audioFiles) {
            let key = audioFile.id;
            let isMusic = audioFile.parentElement.id === "music";
            let isSfx = audioFile.parentElement.id === "sfx";
            this.audioLibrary[key] = {
                node: this.audioCtxMusic.createMediaElementSource(audioFile),
                src: audioFile,
                isMusic: isMusic,
                isSfx: isSfx,
            };
        }
    }

    SetLowPass(turnOn) {
        this.lowPassNode.frequency.setValueAtTime(turnOn ? 700 : 24000, this.audioCtxMusic.currentTime);
    }

    GetMusicVolume() {
        let ret = 0;
        if (audioHandler.gainNodeMusic) {
            ret = audioHandler.gainNodeMusic.gain.value * audioHandler.volumeScale;
        } else {
            ret = audioHandler.initialMusicVolume * audioHandler.volumeScale;
        }
        return +(ret.toFixed(2));
    }

    GetSfxVolume() {
        let ret = 0;
        if (audioHandler.gainNodeSfx) {
            ret = audioHandler.gainNodeSfx.gain.value * audioHandler.volumeScale;
        } else {
            ret = audioHandler.initialSfxVolume * audioHandler.volumeScale;
        }
        return +(ret.toFixed(2));
    }

    SetMusicVolume(vol) {
        if (audioHandler.gainNodeMusic) {
            audioHandler.gainNodeMusic.gain.value = vol/audioHandler.volumeScale;
        } else {
            audioHandler.initialMusicVolume = vol/audioHandler.volumeScale;
        }
    }

    SetSfxVolume(vol) {
        if (audioHandler.gainNodeSfx) {
            audioHandler.gainNodeSfx.gain.value = vol/audioHandler.volumeScale;
            audioHandler.PlaySound("mog-happy");
        } else {
            audioHandler.initialSfxVolume = vol/audioHandler.volumeScale;
        }
    }


    SetBackgroundMusic(key) {
        if (this.currentBgm === key) return;
        // stop all other music
        for (let k in this.audioLibrary) {
            let audioObject = this.audioLibrary[k];
            if (audioObject && audioObject.isMusic) {
                audioObject.src.pause();
                audioObject.src.currentTime = 0;
            }
        }
        let bgm = this.audioLibrary[key];
        if (bgm) {
            bgm.src.play();
        }
        this.currentBgm = key;
    }

    PlaySound(key, preventInterrupt) {
        let audioObject = this.audioLibrary[key];
        if (audioObject) {
            if (preventInterrupt) {
                if (audioObject.src.currentTime === 0 || audioObject.src.currentTime === audioObject.src.duration) {
                    audioObject.src.currentTime = 0;
                    audioObject.src.play();
                }
            } else {
                audioObject.src.currentTime = 0;
                audioObject.src.play();
            }
        }
    }



}