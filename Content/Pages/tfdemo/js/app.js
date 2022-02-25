window.onload = Initialize;
function Initialize() {
    let image = document.getElementById("supImage");
    if (image) {
        const options = ["goombud", "mecha", "mole", "pokey", "roy", "toadette", "yoshi"];
        let randIndex = Math.floor(Math.random() * options.length);
        let selectedImageName = options[randIndex];
        image.src = image.src.replace("mecha", selectedImageName);
        image.style.opacity = "1";
    }

    let tabs = document.getElementsByClassName("nav-item");
    for (let tab of tabs) {
        tab.onclick = OnClickTab;
    }
}

function OnClickTab(e) {
    let tabs = document.getElementsByClassName("nav-item");
    let targets = document.querySelectorAll("[data-tab]");

    for (let tab of tabs) {
        tab.classList.remove("nav-selected");
        if (tab == e.target) {
            tab.classList.add("nav-selected");
        }
    }
    for (let target of targets) {
        target.classList.add("hidden");
        if (target.dataset.tab == e.target.dataset.target) {
            target.classList.remove("hidden");
        }
    }
}