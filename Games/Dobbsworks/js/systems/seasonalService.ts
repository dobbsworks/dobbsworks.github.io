class SeasonalService {

    private static event: SeasonalEvent | null = null;

    static GetEvent(): SeasonalEvent {
        if (!SeasonalService.event) {

            let currentMonth = new Date().getMonth() + 1; // js 0-indexes months
            let currentDate = new Date().getDate();

            if (currentMonth == 10 && currentDate == 31) {
                SeasonalService.event = SeasonalEvent.Halloween;
            } else if (currentMonth == 4 && currentDate == 1) {
                SeasonalService.event = SeasonalEvent.AprilFools;
            } else{
                SeasonalService.event = SeasonalEvent.None;
            }

        }
        return SeasonalService.event;
    }


}

enum SeasonalEvent {
    None,
    Halloween,
    AprilFools
}