"use strict";
var MoneyService = /** @class */ (function () {
    function MoneyService() {
        var _this = this;
        this.currentFunds = 0;
        this.fundsToAnimate = 0;
        // fetch actual value from DB at app start, store as static
        DataService.GetUserCurrency().then(function (amount) {
            _this.currentFunds = +(amount);
        });
    }
    return MoneyService;
}());
