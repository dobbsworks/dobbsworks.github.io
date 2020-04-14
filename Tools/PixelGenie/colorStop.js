var ColorStop = (function () {
    function ColorStop(color, value) {
        this.color = color;
        this.value = value;
    }
    return ColorStop;
}());
function GetColorFromLightRatio(ratio, colorStops) {
    for (var _i = 0, colorStops_1 = colorStops; _i < colorStops_1.length; _i++) {
        var stop = colorStops_1[_i];
        if (ratio >= stop.value)
            return stop.color;
    }
    return "rgba(0,0,0,0)";
}
function ClearColorStopsFromPage() {
    var colorStops = document.getElementsByClassName("colorStop");
    for (var i = colorStops.length - 1; i >= 0; i--) {
        var colorStop = colorStops[i];
        if (colorStop.parentElement.style.display === "none")
            continue;
        colorStop.remove();
    }
}
function GetColorStopsFromPage() {
    var colorStopColors = document.getElementsByClassName("colorStopColor");
    var colorStopValues = document.getElementsByClassName("colorStopValue");
    var ret = [];
    for (var i = 0; i < colorStopColors.length; i++) {
        var colorInput = colorStopColors[i];
        var valueInput = colorStopValues[i];
        if (colorInput.parentElement.parentElement.style.display === "none")
            continue;
        var stop = new ColorStop(colorInput.value, parseFloat(valueInput.value));
        ret.push(stop);
    }
    ret.sort(function (a, b) { return b.value - a.value; }); //sort desc
    return ret;
}
function AddNewColorStop(color, threshold) {
    var newStop = document.createElement("div");
    newStop.innerHTML = colorThresholdHtmlTemplate.replace("#000000", color).replace("0.0", threshold.toString());
    colorThresholdContainer.appendChild(newStop);
}
function DeleteColorStop(el) {
    el.parentElement.remove();
}
function GeneratePalette() {
    ClearColorStopsFromPage();
    var targetColorInput = document.getElementById("colorGenStart");
    var shadowColorInput = document.getElementById("colorGenShadow");
    var targetColor = Color.FromHex(targetColorInput.value);
    var shadowColor = Color.FromHex(shadowColorInput.value);
    var fadeRatioInput = document.getElementById("colorGenFade");
    var fadeRatio = parseFloat(fadeRatioInput.value);
    var colorStepsInput = document.getElementById("colorGenSteps");
    var colorSteps = parseFloat(colorStepsInput.value);
    var shorterHueInput = document.getElementById("useShorterHueDistance");
    var useShorterHueDistance = shorterHueInput.checked;
    CreateColorSpread(targetColor, shadowColor, fadeRatio, colorSteps, useShorterHueDistance);
}
function CreateColorSpread(baseColor, shadowColor, fadeRatio, colorSteps, useShorterHueDistance) {
    var baseHsl = baseColor.toHsl();
    var shadowHsl = shadowColor.toHsl();
    var shadowHue = shadowHsl.h;
    var defaultIsLonger = Math.abs(baseHsl.h - shadowHsl.h) > 0.5;
    if (defaultIsLonger ? useShorterHueDistance : !useShorterHueDistance /*xor*/) {
        shadowHue -= 1;
    }
    var stopValue = 0.85;
    var weight = 1;
    for (var i = 0; i < colorSteps; i++) {
        var newColor = Color.FromHsl(WeightedAvg(baseHsl.h, shadowHue, 1 - weight), WeightedAvg(baseHsl.s, shadowHsl.s, 1 - weight), WeightedAvg(baseHsl.l, shadowHsl.l, 1 - weight));
        weight *= fadeRatio;
        if (i === colorSteps - 1) {
            stopValue = 0;
            if (document.getElementById("transparentPalette").checked) {
                stopValue = 0.01;
            }
        }
        AddNewColorStop(newColor.toHex(), Math.floor(stopValue * 100) / 100);
        stopValue *= 0.9;
    }
}
//# sourceMappingURL=colorStop.js.map