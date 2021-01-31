class AudioHandler {

    constructor() {
    }
    audioCtxMusic;
    audioCtxSfx;

    lowPassNode;
    gainNodeMusic;
    gainNodeSfx;
    musicVolume = 4;
    sfxVolume = 5;

    initialized = false;
    audioLibrary = {};

    Initialize() {
        if (this.initialized) return;
        if (hasUserInteracted) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtxMusic = new AudioContext();
            this.audioCtxSfx = new AudioContext();
            this.LoadAudioFiles();
    
            this.gainNodeMusic = this.audioCtxMusic.createGain();
            this.gainNodeMusic.gain.value = this.musicVolume/10;
    
            this.gainNodeSfx = this.audioCtxMusic.createGain();
            this.gainNodeSfx.gain.value = this.sfxVolume/10;
    
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
            
            audioHandler.SetBackgroundMusic("music-level-1");
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
                isSfx: isSfx
            };
        }
    }

    SetLowPass(turnOn) {
        this.lowPassNode.frequency.setValueAtTime(turnOn ? 700 : 24000, this.audioCtxMusic.currentTime);
    }

    //TODO
    // Volume controls


    SetBackgroundMusic(key) {
        // stop all other music
        for (let k in this.audioLibrary) {
            let audioObject = this.audioLibrary[k];
            if (audioObject && audioObject.isMusic) {
                audioObject.src.pause();
                audioObject.src.currentTime = 0;
            }
        }
        let bgm = this.audioLibrary[key];
        if (bgm) bgm.src.play();
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