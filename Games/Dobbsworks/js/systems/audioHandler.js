"use strict";
var AudioHandler = /** @class */ (function () {
    function AudioHandler() {
        this.startMuted = false;
        this.initialized = false;
        this.currentBgm = "";
        this.audioObjects = [];
        this.segments = [];
        this.levelSongList = [
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
        ];
    }
    AudioHandler.prototype.Initialize = function () {
        if (this.initialized)
            return;
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
            this.lowPassNode.type = "lowpass";
            this.lowPassNode.frequency.setValueAtTime(24000, this.audioCtxMusic.currentTime);
            this.lowPassNode.gain.setValueAtTime(25, this.audioCtxMusic.currentTime);
            for (var _i = 0, _a = this.audioObjects; _i < _a.length; _i++) {
                var audioObject = _a[_i];
                if (audioObject.isMusic) {
                    audioObject.src.loop = true;
                    audioObject.node.connect(this.gainNodeMusic).connect(this.lowPassNode).connect(this.audioCtxMusic.destination);
                }
                else if (audioObject.isSfx) {
                    audioObject.node.connect(this.gainNodeSfx).connect(this.audioCtxSfx.destination);
                }
            }
            audioHandler.SetBackgroundMusic("silence");
        }
        else {
            setTimeout(function () { audioHandler.Initialize.apply(audioHandler); }, 100);
        }
    };
    AudioHandler.prototype.Mute = function () {
        if (this.gainNodeMusic && this.gainNodeMusic.gain)
            this.gainNodeMusic.gain.value = 0;
        if (this.gainNodeSfx && this.gainNodeSfx.gain)
            this.gainNodeSfx.gain.value = 0;
    };
    AudioHandler.prototype.LoadAudioFiles = function () {
        var audioFiles = Array.from(document.getElementsByTagName("audio"));
        for (var _i = 0, audioFiles_1 = audioFiles; _i < audioFiles_1.length; _i++) {
            var audioFile = audioFiles_1[_i];
            this.audioObjects.push(new AudioObject(audioFile, this));
        }
    };
    AudioHandler.prototype.SetBackgroundMusic = function (id) {
        if (this.currentBgm === id)
            return;
        // stop all other music
        for (var _i = 0, _a = this.audioObjects; _i < _a.length; _i++) {
            var audioObject = _a[_i];
            if (audioObject && audioObject.isMusic) {
                audioObject.src.pause();
                audioObject.src.currentTime = 0;
            }
        }
        var bgm = this.audioObjects.find(function (a) { return a.id === id; });
        if (bgm) {
            bgm.src.play().then().catch(function (e) { return console.error(e); });
        }
        this.currentBgm = id;
    };
    AudioHandler.prototype.Update = function () {
        this.HandleMusicLoop();
        this.HandleSegments();
    };
    AudioHandler.prototype.HandleMusicLoop = function () {
        var _this = this;
        var bgm = this.audioObjects.find(function (a) { return a.id === _this.currentBgm; });
        if (bgm) {
            var bpm = +(bgm.src.dataset.bpm || "0");
            var introBeats = +(bgm.src.dataset.introBeats || "0");
            var loopBeats = +(bgm.src.dataset.loopBeats || "0");
            if (bpm && introBeats && loopBeats) {
                var loopLengthSeconds = (loopBeats / bpm) * 60;
                var loopPointSeconds = ((introBeats + loopBeats) / bpm) * 60;
                if (bgm.src.currentTime > loopPointSeconds) {
                    bgm.src.currentTime -= loopLengthSeconds;
                }
            }
        }
    };
    AudioHandler.prototype.HandleSegments = function () {
        var now = +(new Date());
        var toRemove = this.segments.filter(function (a) { return a.endTime <= now; });
        this.segments = this.segments.filter(function (a) { return toRemove.indexOf(a) == -1; });
        toRemove.forEach(function (a) {
            a.src.pause();
            a.src.currentTime = 0;
        });
    };
    AudioHandler.prototype.SetLowPass = function (turnOn) {
        this.lowPassNode.frequency.setValueAtTime(turnOn ? 700 : 24000, this.audioCtxMusic.currentTime);
    };
    AudioHandler.prototype.PlaySound = function (id, restartIfPlaying) {
        var audioObject = this.audioObjects.find(function (a) { return a.id === id; });
        if (audioObject) {
            return !!audioObject.Play(restartIfPlaying);
        }
        return false;
    };
    AudioHandler.prototype.PlaySegment = function (id, segmentIndex) {
        var audioObject = this.audioObjects.find(function (a) { return a.id === id; });
        if (audioObject) {
            var src = audioObject.Play(false);
            var bpm = +(src.dataset.bpm || "88");
            var secondsPerSegment = 60 / bpm / 2;
            src.currentTime = secondsPerSegment * segmentIndex;
            this.segments.push({ src: src, endTime: +(new Date()) + secondsPerSegment * 1000 });
        }
        return false;
    };
    AudioHandler.prototype.GetMusicVolume = function () {
        return StorageService.GetMusicVolume();
    };
    AudioHandler.prototype.GetSfxVolume = function () {
        return StorageService.GetSfxVolume();
    };
    AudioHandler.prototype.SetMusicVolume = function (value) {
        StorageService.SetMusicVolume(value);
        this.gainNodeMusic.gain.value = this.ConvertVolumeToGain(value);
    };
    AudioHandler.prototype.SetSfxVolume = function (value) {
        StorageService.SetSfxVolume(value);
        this.gainNodeSfx.gain.value = this.ConvertVolumeToGain(value);
    };
    AudioHandler.prototype.ConvertVolumeToGain = function (val) {
        return val / 100;
    };
    return AudioHandler;
}());
var AudioObject = /** @class */ (function () {
    function AudioObject(audioElement, audioHandler) {
        this.audioElement = audioElement;
        this.copySrc = [];
        this.src = audioElement;
        this.id = audioElement.id;
        if (!this.id) {
            var srcText = this.src.src;
            var srcSegments = srcText.split("/");
            this.id = srcSegments[srcSegments.length - 1].split(".mp3")[0];
        }
        var parentEl = audioElement.parentElement;
        this.isMusic = (parentEl === null || parentEl === void 0 ? void 0 : parentEl.id) === "music" || false;
        this.isSfx = (parentEl === null || parentEl === void 0 ? void 0 : parentEl.id) === "sfx" || false;
        if (this.isMusic) {
            this.node = audioHandler.audioCtxMusic.createMediaElementSource(audioElement);
        }
        else {
            this.node = audioHandler.audioCtxSfx.createMediaElementSource(audioElement);
        }
    }
    AudioObject.prototype.Play = function (restartIfPlaying) {
        if (restartIfPlaying) {
            this.src.currentTime = 0;
            this.src.play();
            return this.src;
        }
        else {
            if (this.src.currentTime === 0 || this.src.currentTime === this.src.duration) {
                // if src element is unstarted or at end
                this.src.currentTime = 0;
                this.src.play();
                return this.src;
            }
            else {
                // element is still playing
                for (var _i = 0, _a = this.copySrc; _i < _a.length; _i++) {
                    var copy = _a[_i];
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
                var newSrc = this.src.cloneNode();
                newSrc.currentTime = 0;
                if (this.isSfx) {
                    var newNode = audioHandler.audioCtxSfx.createMediaElementSource(newSrc);
                    newNode.connect(audioHandler.gainNodeSfx).connect(audioHandler.audioCtxSfx.destination);
                }
                newSrc.play();
                this.copySrc.push(newSrc);
                return newSrc;
            }
        }
    };
    return AudioObject;
}());
