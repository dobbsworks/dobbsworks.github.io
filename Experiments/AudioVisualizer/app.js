// https://codepen.io/njmcode/pen/WbWyWz

// Create audio context
var AUDIO = new (window.AudioContext || window.webkitAudioContext)();
if(!AUDIO) console.error('Web Audio API not supported :(');

// Create and configure analyzer node and storage buffer
var analyzer = AUDIO.createAnalyser();
analyzer.fftSize = 128;
var bufferLength = analyzer.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);


// Cache HTML elements
var vid = document.getElementById('src-audio'),
        vizArea = document.getElementById('viz');


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
}


function init() {

    document.body.style.opacity = 1.0;

    // Connect video to analyzer and analyzer to audio-out
    var source = AUDIO.createMediaElementSource(vid);
    source.connect(analyzer);
    analyzer.connect(AUDIO.destination);
    
    $segs = createSegments(bufferLength)
    loop();
}


// Main loop
function loop() {

    if (vid.ended) {
        setTimeout(() => {
            document.body.style.opacity = 0.0;
        }, 0.5);
    }
    requestAnimationFrame(loop);
    update();

}


// Kick it off when the video is playable
var isStarted = false;
// vid.addEventListener('loadeddata', Start, false);
// document.body.addEventListener('click', Start, false);
document.getElementById('songUpload').addEventListener('change', function(event){
    var file = this.files[0];
    var blob = window.URL || window.webkitURL;
    var fileURL = blob.createObjectURL(file);
    document.getElementById('src-audio').src = fileURL;
    document.getElementById('src-audio').addEventListener('loadeddata', () => {
        console.log("BEEP")
    }, false);
});

document.getElementById('trackNameUpload').addEventListener('change', function(event){
    document.getElementById('trackName').innerText = document.getElementById('trackNameUpload').value;
});

function ButtonStart() {
    document.getElementById('page1').style.display = "none";
    init();
    document.getElementById("video").play();
    setTimeout( () => {
        AUDIO.resume();
        vid.play();
    }, 3000);
}

function Start() {
    if (isStarted) return;
    init();
    
    isStarted = true;

    var params = new URL(window.location.href).searchParams;
    var autoplay = params.get("autoplay")
    if (autoplay) {
        console.log("Autoplaying")
        AUDIO.resume();
        vid.play();
    } else {
        const playOverlay = document.createElement('div');
        playOverlay.style.position = 'fixed';
        playOverlay.style.backgroundColor = 'rgba(0,0,100,0.3)';
        playOverlay.style.top = '0';
        playOverlay.style.left = '0';
        playOverlay.style.right = '0';
        playOverlay.style.bottom = '0';
        playOverlay.style.display = 'flex';
        playOverlay.style.alignItems = 'center';
        playOverlay.style.justifyContent = 'center';
        const playBut = document.createElement('button');
        playBut.textContent = 'Click to play';
        playBut.style.padding = '1em';
        playOverlay.appendChild(playBut);
        playBut.addEventListener('click', (e) => {
            playOverlay.remove();
            AUDIO.resume();
            vid.play();
        });
        document.body.appendChild(playOverlay);
    }

}