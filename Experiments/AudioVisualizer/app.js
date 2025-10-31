// https://codepen.io/njmcode/pen/WbWyWz

// Create audio context
var AUDIO = new (window.AudioContext || window.webkitAudioContext)();
if(!AUDIO) console.error('Web Audio API not supported :(');

// Create and configure analyzer node and storage buffer
var analyzer = AUDIO.createAnalyser();
analyzer.fftSize = 128;
var bufferLength = analyzer.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
var currentSong;

window.onload = init;

var targetLoopTimeInSeconds = 60 * 6;


// Cache HTML elements
var audioSrc = document.getElementById('src-audio');
var targetVolume = 0.125;
audioSrc.volume = 0.125;
audioSrc.addEventListener('ended', LoopAudio, false);
document.body.appendChild(audioSrc);
var songList = [];
var autoplaySkipIndeces = [];

var vizArea = document.getElementById('viz');


// Creates a set of divs with graded BG colors.
// Returns it as an array of jQuery-wrapped elements for
// later manipulation.
function createSegments(numSegments) {
    var segCollection = [];
    var colorSlice = Math.floor(255 / numSegments);
    
    for(var i = 0; i < numSegments; i++) {
        var s = document.createElement('div');
        var g = colorSlice * i;
        var r = 127 - (colorSlice * i);
        s.classList.add('viz-seg');
        s.style.backgroundColor = 'rgba(' + r + ',' + g + ',255,1)';
        vizArea.appendChild(s);
        segCollection.push(s);
    }
    return segCollection;
}


var $segs, rot = 0;

// Main update/render method.
// Gets the current frequency data and transforms the div set based on it.
// Used jQuery because I'm too lazy to look up my transform-prefix shiv.
function update() {
    analyzer.getByteFrequencyData(dataArray);
    for(var i = 0; i < bufferLength; i++) {
        // Scaled based on frequency, staggered rotation
        var segScale = dataArray[i] / 255;
		$segs[i].style.height = (300 * segScale + 12) + "px"; 
    }
    if(++rot > 360) rot = 0;


    if (isFading) {
        let fadeSpeed = 0.001;
        if (audioSrc.volume > fadeSpeed) audioSrc.volume -= fadeSpeed;
        else audioSrc.volume = 0.0;
    } 
    if (targetLoopTimeInSeconds < accruedLoopTime + audioSrc.currentTime) {
        NextSong();
    }
}


function init() {
    document.body.style.opacity = 1.0;
    // Connect audio to analyzer and analyzer to audio-out
    var source = AUDIO.createMediaElementSource(audioSrc);
    source.connect(analyzer);
    analyzer.connect(AUDIO.destination);
    $segs = createSegments(bufferLength)
    loop();
    LoadSettings();
    InitializeControls();
}


// Main loop
function loop() {
    requestAnimationFrame(loop);
    update();
}


var currentFolder = "";
function InitializeControls() {
    var audioElements = document.querySelectorAll("#audioContainer > *")
    var controls = document.getElementById("controls");
    controls.innerHTML = "";
    var folderIter = "";
    songList = [];
    for (let i = 0; i < audioElements.length; i++) {
        let audioElement = audioElements[i];
        songList.push(audioElement);
        let button = document.createElement("div");
        button.innerText = audioElement.innerText;
        button.dataset.index = i;
        button.classList.add("controlButton");
        if (audioElement.tagName == "AUDIO") {
            button.innerText = audioElement.dataset.name;
            audioElement.volume = 0.25;
            button.dataset.songIndex = i;
            if (autoplaySkipIndeces.indexOf(i) > -1) {
                button.classList.add("skipped");
            }
            button.onclick = (e) => {
                if (e.shiftKey) {
                    e.preventDefault();
                    if (autoplaySkipIndeces.indexOf(i) > -1) {
                        autoplaySkipIndeces.splice(autoplaySkipIndeces.indexOf(i),1);
                    } else {
                        autoplaySkipIndeces.push(i);
                    }
                    SaveSettings();
                    InitializeControls();
                } else {
                    PlaySong(audioElement);
                }
            }
            if (folderIter == currentFolder) {
                controls.appendChild(button);
            }
        } else {
            folderIter = audioElement.innerText;
            button.classList.add("folderButton");
            button.onclick = () => {
                OpenFolder(audioElement.innerText);
            }
            controls.appendChild(button);
        }
    }
}


function PlaySong(audioElement) {
    var button = Array.from(document.querySelectorAll(".controlButton")).filter(a => a.innerText == audioElement.dataset.name)[0] ;

    for (let el of document.querySelectorAll(".buttonPlaying")) {
        el.classList.remove("buttonPlaying");
    }
    button.classList.add("buttonPlaying");

    accruedLoopTime = 0.0;
    audioSrc.src = audioElement.src;
    AUDIO.resume();
    audioSrc.play();
    document.getElementById("video").play();
    document.getElementById("trackName").innerText = audioElement.dataset.name;

    let composer = "Cassidy’s Records";
    if (audioElement.dataset.by) {
        composer = audioElement.dataset.by;
    }
    document.getElementById("composer").innerText = composer;
    
    currentSong = audioElement;
    audioSrc.currentTime = 0.0;
}

function OpenFolder(folderName) {
    currentFolder = folderName;
    InitializeControls();
}

var accruedLoopTime = 0.0;
function LoopAudio() {
    if (currentSong.dataset.loops == "false") {
        audioSrc.volume = 0.0;
        NextSong();
        return;
    };
    accruedLoopTime += audioSrc.currentTime;
    audioSrc.currentTime = parseFloat(currentSong.dataset.loopPoint);
    audioSrc.play();
}


var isFading = false;
function NextSong() {
    isFading = true;

    if (audioSrc.volume <= 0) {
        var currentIndex = songList.indexOf(currentSong);
        var newIndex = (currentIndex + 1) % songList.length;
        while (autoplaySkipIndeces.indexOf(newIndex) > -1 || songList[newIndex].tagName != "AUDIO" ) {
            newIndex = (newIndex + 1) % songList.length;
        }

        audioSrc.volume = targetVolume;
        PlaySong(songList[newIndex]);
        isFading = false;
    }
}


function SaveSettings() {
    localStorage["autoskips"] = JSON.stringify(autoplaySkipIndeces);
}

function LoadSettings() {
    autoplaySkipIndeces = JSON.parse(localStorage["autoskips"] || "[]");
}