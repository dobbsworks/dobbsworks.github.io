class ContestService {
    static currentContest: ContestDT | null = null;

    constructor() {
        this.FetchContest();
    }

    FetchContest(): void {
        DataService.GetCurrentContest().then(data => {
            if (data.isHidden) {
                // hidden contests are only available when testing
                if (!location.href.startsWith("https://localhost")) {
                    ContestService.currentContest = null;
                    return;
                }
            }

            ContestService.currentContest = data;

            let now = new Date();
            let refreshTime: null | Date = null;

            // find the soonest time that the contest state will change
            let timesToCheck = [data.endTime, data.resultsTime, data.votingTime, data.openEntryTime];
            for (let time of timesToCheck) {
                if (new Date(time) > now) refreshTime  = new Date(time);
            }

            if (refreshTime) {
                let msUntilRefresh = (+refreshTime - +now);
                setTimeout( () => {
                    this.FetchContest();
                }, msUntilRefresh);
            }
        });
    }


}