"use strict";
var SeasonalService = /** @class */ (function () {
    function SeasonalService() {
    }
    SeasonalService.GetEvent = function () {
        if (!SeasonalService.event) {
            var currentMonth = new Date().getMonth() + 1; // js 0-indexes months
            var currentDate = new Date().getDate();
            if (currentMonth == 10 && currentDate == 31) {
                SeasonalService.event = SeasonalEvent.Halloween;
            }
            else if (currentMonth == 4 && currentDate == 1) {
                SeasonalService.event = SeasonalEvent.AprilFools;
            }
            else {
                SeasonalService.event = SeasonalEvent.None;
            }
        }
        return SeasonalService.event;
    };
    SeasonalService.event = null;
    return SeasonalService;
}());
var SeasonalEvent;
(function (SeasonalEvent) {
    SeasonalEvent[SeasonalEvent["None"] = 0] = "None";
    SeasonalEvent[SeasonalEvent["Halloween"] = 1] = "Halloween";
    SeasonalEvent[SeasonalEvent["AprilFools"] = 2] = "AprilFools";
})(SeasonalEvent || (SeasonalEvent = {}));
