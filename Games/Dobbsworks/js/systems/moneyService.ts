class MoneyService {

    currentFunds = 0;
    fundsToAnimate = 0;

    constructor() {
        // fetch actual value from DB at app start, store as static
        DataService.GetUserCurrency().then(amount => {
            this.currentFunds = +(amount);
        })
    }

    // this service manages tracking how much currency the player has 
    // FOR THE UI

    // It will not be trusted for the purposes of making transactions,
    // only for animating values and enabling/disabling buttons

    // Actual changes to player currency should be handled on the backend


}