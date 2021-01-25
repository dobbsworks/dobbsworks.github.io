
function InitKeyHandlers() {
    document.addEventListener("keydown", OnKeyDown, false);
}

function OnKeyDown(e) {
    let keyText = e.key;
    if ("123456789".indexOf(keyText) > -1) {
        let keyNumber = +(e.key);
        weaponHandler.SelectWeaponByIndex(keyNumber - 1);
    } else if (keyText == "Escape") {
        pauseHandler.onPauseButtonPressed();
    } else if (keyText == "F11") {
        //openFullscreen();
    } else {
        console.log(keyText)
    }
    //e.preventDefault();
}

function openFullscreen() {
    //TODO - need to fix how mouse position is handled in full screen
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
    }
}