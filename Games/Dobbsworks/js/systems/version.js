"use strict";
var Version = /** @class */ (function () {
    function Version() {
    }
    Version.Compare = function (v1, v2) {
        var v1Subs = v1.split(".");
        var v2Subs = v2.split(".");
        if (v1 == v2)
            return 0;
        for (var i = 0; i < v1Subs.length; i++) {
            var v1Sub = +(v1Subs[i]);
            var v2Sub = +(v2Subs[i]);
            if (v1Sub < v2Sub)
                return -1;
            if (v1Sub > v2Sub)
                return 1;
            if (isNaN(v1Sub) || isNaN(v2Sub)) {
                if (v1Subs[i] != v2Subs[i])
                    return v1Subs[i] < v2Subs[i] ? -1 : 1;
            }
        }
        console.error("Unhandled version comparison: ", v1, v2);
        return 0;
    };
    Version.IsLevelVersionNewerThanClient = function (levelVersion) {
        return Version.Compare(Version.Current, levelVersion) == -1;
    };
    Version.DoesCurrentLevelUseOldDoorPairing = function () {
        if (!currentMap)
            return false;
        return Version.Compare("1.6.0", currentMap.mapVersion) == 1;
    };
    Version.DoesCurrentLevelUseOldLava = function () {
        if (!currentMap)
            return false;
        return Version.Compare("1.11.0", currentMap.mapVersion) == 1;
    };
    Version.Current = "1.13.0";
    return Version;
}());
