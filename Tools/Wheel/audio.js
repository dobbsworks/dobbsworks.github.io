function playAudio(id, volume) {
    let sound = document.getElementById(id);
    sound.volume = volume || 0.1;
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}