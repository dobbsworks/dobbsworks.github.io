"use strict";
var DeathLogService = /** @class */ (function () {
    function DeathLogService() {
    }
    DeathLogService.LogDeathCounts = function () {
        var deathCount = StorageService.PopNextDeathCounter();
        while (deathCount != null) {
            if (deathCount.levelCode != "") {
                var progressModel = new LevelProgressModel(deathCount.levelCode, 0, deathCount.deathCount);
                DataService.LogLevelPlayDone(progressModel).then(function (awardsModel) { });
            }
            deathCount = StorageService.PopNextDeathCounter();
        }
    };
    return DeathLogService;
}());
