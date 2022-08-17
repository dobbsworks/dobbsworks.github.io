"use strict";
var StorageService = /** @class */ (function () {
    function StorageService() {
    }
    StorageService.GetSavedLevel = function (slot) {
        return {
            level: localStorage.getItem("save_" + slot) || "",
            thumb: localStorage.getItem("thumb_" + slot) || ""
        };
    };
    StorageService.SetSavedLevel = function (slot, level, thumb) {
        try {
            localStorage.setItem("save_" + slot, level);
            localStorage.setItem("thumb_" + slot, thumb);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    };
    StorageService.IncrementDeathCounter = function (levelCode) {
        var allDeathCounts = JSON.parse(localStorage.getItem("deaths") || "[]");
        var thisLevelCounter = allDeathCounts.find(function (a) { return a.levelCode == levelCode; });
        if (!thisLevelCounter) {
            thisLevelCounter = { levelCode: levelCode, deathCount: 0 };
            allDeathCounts.push(thisLevelCounter);
        }
        thisLevelCounter.deathCount++;
        localStorage.setItem("deaths", JSON.stringify(allDeathCounts));
        return thisLevelCounter.deathCount;
    };
    StorageService.PopDeathCounter = function (levelCode) {
        var allDeathCounts = JSON.parse(localStorage.getItem("deaths") || "[]");
        var thisLevelCounter = allDeathCounts.find(function (a) { return a.levelCode == levelCode; });
        allDeathCounts = allDeathCounts.filter(function (a) { return a.levelCode != levelCode; });
        localStorage.setItem("deaths", JSON.stringify(allDeathCounts));
        return thisLevelCounter ? thisLevelCounter.deathCount : 0;
    };
    StorageService.GetMusicVolume = function () {
        return +(localStorage.getItem("musicVol") || "75");
    };
    StorageService.GetSfxVolume = function () {
        return +(localStorage.getItem("sfxVol") || "65");
    };
    StorageService.SetMusicVolume = function (val) {
        if (val < 0 || val > 100)
            throw "Invalid volume level";
        localStorage.setItem("musicVol", val.toString());
    };
    StorageService.SetSfxVolume = function (val) {
        if (val < 0 || val > 100)
            throw "Invalid volume level";
        localStorage.setItem("sfxVol", val.toString());
    };
    return StorageService;
}());
