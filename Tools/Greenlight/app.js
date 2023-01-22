let lights = ["green", "yellow", "red"];
let lightIndex = 0;

function Init() {
    var initLight = document.getElementsByClassName("green")[0];
    initLight.classList.add("active");
}

function OnClick() {
    for (light of document.getElementsByClassName("active")) {
        light.classList.remove("active");
    }
    lightIndex++;
    let targetLight = lights[lightIndex % lights.length];
    var nextLight = document.getElementsByClassName(targetLight)[0];
    nextLight.classList.add("active");
}

window.onload = () => { Init(); }