class AudioHandler {
    audioCtxMusic!: AudioContext;
    audioCtxSfx!: AudioContext;

    lowPassNode!: BiquadFilterNode;
    gainNodeMusic!: GainNode;
    gainNodeSfx!: GainNode;
    startMuted = false;

    initialized = false;
    currentBgm = "";

    audioObjects: AudioObject[] = [];
    segments: {src: HTMLAudioElement, endTime: number}[] = [];

    Initialize(): void {
        if (this.initialized) return;
        if (mouseHandler.hasUserInteracted) {
            this.audioCtxMusic = new AudioContext();
            this.audioCtxSfx = new AudioContext();

            this.initialized = true;
            this.LoadAudioFiles();
            
            this.gainNodeMusic = this.audioCtxMusic.createGain();
            this.gainNodeMusic.gain.value = this.ConvertVolumeToGain(StorageService.GetMusicVolume());
    
            this.gainNodeSfx = this.audioCtxSfx.createGain();
            this.gainNodeSfx.gain.value = this.ConvertVolumeToGain(StorageService.GetSfxVolume());
            if (this.startMuted) {
                this.gainNodeMusic.gain.value = 0;
                this.gainNodeSfx.gain.value = 0;
            }
    
            this.lowPassNode = this.audioCtxMusic.createBiquadFilter();
            this.lowPassNode.type = "lowpass"
            this.lowPassNode.frequency.setValueAtTime(24000, this.audioCtxMusic.currentTime);
            this.lowPassNode.gain.setValueAtTime(25, this.audioCtxMusic.currentTime);
            
            for (let audioObject of this.audioObjects) {
                if (audioObject.isMusic) {
                    audioObject.src.loop = true;
                    audioObject.node.connect(this.gainNodeMusic).connect(this.lowPassNode).connect(this.audioCtxMusic.destination);
                } else if (audioObject.isSfx) {
                    audioObject.node.connect(this.gainNodeSfx).connect(this.audioCtxSfx.destination);
                }
            }
            audioHandler.SetBackgroundMusic("silence");
        } else {
            setTimeout(() => {audioHandler.Initialize.apply(audioHandler)}, 100);
        }
    }

    Mute(): void {
        if (this.gainNodeMusic && this.gainNodeMusic.gain) this.gainNodeMusic.gain.value = 0;
        if (this.gainNodeSfx && this.gainNodeSfx.gain) this.gainNodeSfx.gain.value = 0;
    }

    Unmute(): void {
        this.gainNodeMusic.gain.value = this.ConvertVolumeToGain(StorageService.GetMusicVolume());
        this.gainNodeSfx.gain.value = this.ConvertVolumeToGain(StorageService.GetSfxVolume());
    }

    LoadAudioFiles(): void {
        let audioFiles = Array.from(document.getElementsByTagName("audio"));
        for (let audioFile of audioFiles) {
            this.audioObjects.push(new AudioObject(audioFile, this));
        }
    }

    SetBackgroundMusic(id: string) {
        if (this.currentBgm === id) return;
        // stop all other music
        for (let audioObject of this.audioObjects) {
            if (audioObject && audioObject.isMusic) {
                audioObject.src.pause();
                audioObject.src.currentTime = 0;
            }
        }
        let bgm = this.audioObjects.find(a => a.id === id);
        if (bgm) {
            bgm.src.play().then().catch(e => console.error(e));
        }
        this.currentBgm = id;
    }

    Update(): void {
        this.HandleMusicLoop();
        this.HandleSegments();
    }

    HandleMusicLoop(): void {
        let bgm = this.audioObjects.find(a => a.id === this.currentBgm);
        if (bgm) {
            let bpm = +(bgm.src.dataset.bpm || "0");
            let introBeats = +(bgm.src.dataset.introBeats || "0");
            let loopBeats = +(bgm.src.dataset.loopBeats || "0");
            if (bpm && introBeats && loopBeats) {
                let loopLengthSeconds = (loopBeats / bpm) * 60;
                let loopPointSeconds = ((introBeats + loopBeats) / bpm) * 60;
                if (bgm.src.currentTime > loopPointSeconds) {
                    bgm.src.currentTime -= loopLengthSeconds;
                }
            }
        }
    }

    HandleSegments(): void {
        let now = +(new Date());
        let toRemove = this.segments.filter(a => a.endTime <= now);
        this.segments = this.segments.filter(a => toRemove.indexOf(a) == -1);
        toRemove.forEach(a => {
            a.src.pause();
            a.src.currentTime = 0;
        });
    }

    SetLowPass(turnOn: boolean) {
        this.lowPassNode.frequency.setValueAtTime(turnOn ? 700 : 24000, this.audioCtxMusic.currentTime);
    }
    
    PlaySound(id: string, restartIfPlaying: boolean): boolean {
        let audioObject = this.audioObjects.find(a => a.id === id);
        if (audioObject) {
            return !!audioObject.Play(restartIfPlaying);
        }
        return false;
    }

    PlaySegment(id: string, segmentIndex: number): boolean {
        let audioObject = this.audioObjects.find(a => a.id === id);
        if (audioObject) {
            let src = audioObject.Play(false);
            let bpm = +(src.dataset.bpm || "88");
            let secondsPerSegment = 60 / bpm / 2;
            src.currentTime = secondsPerSegment * segmentIndex;
            this.segments.push({src: src, endTime: +(new Date()) + secondsPerSegment*1000});
        }
        return false;
    }

    GetMusicVolume(): number {
        return StorageService.GetMusicVolume();
    }
    GetSfxVolume(): number {
        return StorageService.GetSfxVolume();
    }

    SetMusicVolume(value: number): void {
        StorageService.SetMusicVolume(value);
        this.gainNodeMusic.gain.value = this.ConvertVolumeToGain(value);
    }
    SetSfxVolume(value: number): void {
        StorageService.SetSfxVolume(value);
        this.gainNodeSfx.gain.value = this.ConvertVolumeToGain(value);
    }

    ConvertVolumeToGain(val: number): number {
        return val / 100;
    }

    levelSongList: string[] = [
        "silence",
        "intro",
        "desert",
        "grassland",
        "adventure",
        "carnival",
        "haunt",
        "sky",
        "computer",
        "chill",
        "crunch",
        "frost",
        "forest",
        "waltz",
        "faire",
        "choir",
        "meditate",
        "slime",
        "chipper",
        "jungle",
        "clocktower",
        "overdue",
        "cherry",
        "shake",
        "stairs",
    ]
}


class AudioObject {
    node!: MediaElementAudioSourceNode;
    src!: HTMLAudioElement;
    isMusic!: boolean;
    isSfx!: boolean;
    id!: string;
    copySrc: HTMLAudioElement[] = [];

    constructor(public audioElement: HTMLAudioElement, audioHandler: AudioHandler) {
        this.src = audioElement;
        this.id = audioElement.id;
        if (!this.id) {
            let srcText = this.src.src;
            let srcSegments = srcText.split("/");
            this.id = srcSegments[srcSegments.length - 1].split(".mp3")[0];
        }
        let parentEl = audioElement.parentElement;
        this.isMusic = parentEl?.id === "music" || false;
        this.isSfx = parentEl?.id === "sfx" || false;
        if (this.isMusic) {
            this.node = audioHandler.audioCtxMusic.createMediaElementSource(audioElement);
        } else {
            this.node = audioHandler.audioCtxSfx.createMediaElementSource(audioElement);
        }
    }

    Play(restartIfPlaying: boolean): HTMLAudioElement {
        if (restartIfPlaying) {
            this.src.currentTime = 0;
            this.src.play();
            return this.src;
        } else {
            if (this.src.currentTime === 0 || this.src.currentTime === this.src.duration) {
                // if src element is unstarted or at end
                this.src.currentTime = 0;
                this.src.play();
                return this.src;
            } else {
                // element is still playing
                for (let copy of this.copySrc) {
                    if (copy.currentTime === 0 || copy.currentTime === copy.duration) {
                        copy.currentTime = 0;
                        copy.play();
                        return copy;
                    }
                }

                if (this.isMusic) {
                    console.error("Tried to overlap music node");
                    return this.src;
                }

                // still not returned, create new instance of sound
                let newSrc = <HTMLAudioElement>this.src.cloneNode();
                newSrc.currentTime = 0;
                if (this.isSfx) {
                    let newNode = audioHandler.audioCtxSfx.createMediaElementSource(newSrc);
                    newNode.connect(audioHandler.gainNodeSfx).connect(audioHandler.audioCtxSfx.destination);
                }
                newSrc.play();
                this.copySrc.push(newSrc);
                return newSrc;
            }
        }
    }
}