"use strict";
var ContestService = /** @class */ (function () {
    function ContestService() {
        this.FetchContest();
    }
    ContestService.prototype.FetchContest = function () {
        var _this = this;
        DataService.GetCurrentContest().then(function (data) {
            if (data.isHidden) {
                // hidden contests are only available when testing
                if (!location.href.startsWith("https://localhost")) {
                    ContestService.currentContest = null;
                    return;
                }
            }
            ContestService.currentContest = data;
            var now = new Date();
            var refreshTime = null;
            // find the soonest time that the contest state will change
            var timesToCheck = [data.endTime, data.resultsTime, data.votingTime, data.openEntryTime];
            for (var _i = 0, timesToCheck_1 = timesToCheck; _i < timesToCheck_1.length; _i++) {
                var time = timesToCheck_1[_i];
                if (new Date(time) > now)
                    refreshTime = new Date(time);
            }
            if (refreshTime) {
                var msUntilRefresh = (+refreshTime - +now);
                setTimeout(function () {
                    _this.FetchContest();
                }, msUntilRefresh);
            }
        });
    };
    ContestService.currentContest = null;
    return ContestService;
}());
