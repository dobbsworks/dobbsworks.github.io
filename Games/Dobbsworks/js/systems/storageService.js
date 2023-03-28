"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
    StorageService.PopNextDeathCounter = function () {
        var allDeathCounts = JSON.parse(localStorage.getItem("deaths") || "[]");
        if (allDeathCounts.length == 0)
            return null;
        var levelCounter = allDeathCounts[0];
        allDeathCounts = allDeathCounts.filter(function (a) { return a.levelCode != levelCounter.levelCode; });
        localStorage.setItem("deaths", JSON.stringify(allDeathCounts));
        return levelCounter;
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
    StorageService.SaveKeyboardMappings = function () {
        var added = KeyboardHandler.GetNonDefaultMappings();
        var removed = KeyboardHandler.GetRemovedDefaultMappings();
        var objects = __spreadArrays(added.map(function (a) { return ({ k: a.k, v: a.v.keyCode, s: "+" }); }), removed.map(function (a) { return ({ k: a.k, v: a.v.keyCode, s: "-" }); }));
        localStorage.setItem("mapping", JSON.stringify(objects));
    };
    StorageService.LoadKeyboardMappings = function () {
        var mappings = JSON.parse(localStorage.getItem("mapping") || "[]");
        var _loop_1 = function (mapping) {
            var action = (Object.values(KeyAction).find(function (a) { return a.keyCode == mapping.v; }));
            if (mapping.s == "+") {
                KeyboardHandler.keyMap.push({ k: mapping.k, v: action });
            }
            if (mapping.s == "-") {
                KeyboardHandler.keyMap = KeyboardHandler.keyMap.filter(function (a) { return !(a.k == mapping.k && a.v == action); });
            }
        };
        for (var _i = 0, mappings_1 = mappings; _i < mappings_1.length; _i++) {
            var mapping = mappings_1[_i];
            _loop_1(mapping);
        }
    };
    StorageService.GetPreferenceBool = function (key, initialValue) {
        var saved = localStorage.getItem("pref-" + key);
        if (saved === null)
            return initialValue;
        return saved == "1";
    };
    StorageService.SetPreferenceBool = function (key, newValue) {
        var value = newValue ? "1" : "0";
        localStorage.setItem("pref-" + key, value);
    };
    return StorageService;
}());
