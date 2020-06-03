// Scramble letters/numbers, leave spaces and special characters in place
// e.g. "Final Fantasy: Crystal Chronicles" 
// into "NYTNE RCSAAOA: FHTSICY CLRLANLFSI"
function ScrambleWord(word) {
    word = word.toUpperCase();
    let letters = word.split("");
    let scrambledLetters = [];
    let alphanumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while (letters.length) {
        let randomIndex = Math.floor(Math.random() * letters.length);
        let letter = letters.splice(randomIndex, 1)[0];
        if (alphanumeric.indexOf(letter) > -1) {
            scrambledLetters.push(letter);
        }
    }
    // only scramble alphanumeric characters
    let ret = "";
    for (let i=0; i<word.length; i++) {
        if (alphanumeric.indexOf(word[i]) > -1) {
            ret += scrambledLetters.pop();
        } else {
            ret += word[i];
        }
    }
    return ret;
}

function RandomFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
}
