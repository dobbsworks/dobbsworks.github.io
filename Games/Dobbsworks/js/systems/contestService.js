"use strict";
var ContestService = /** @class */ (function () {
    function ContestService() {
        DataService.GetCurrentContest().then(function (data) {
            ContestService.currentContest = data;
        });
    }
    ContestService.currentContest = null;
    return ContestService;
}());
