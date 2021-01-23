
function InitKeyHandlers() {
    document.addEventListener("keydown", OnKeyDown, false);
}

function OnKeyDown(e) {
    let keyText = e.key;
    if ("123456789".indexOf(keyText) > -1) {
        let keyNumber = +(e.key);
        weaponHandler.SelectWeaponByIndex(keyNumber-1);
    } else if (keyText == "Escape") {
        pauseHandler.onPauseButtonPressed();
    } else {
        console.log(keyText)
    }
}