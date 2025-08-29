function SaveState() {
    var saveObj = {
        unlockedLocations: Object.values(locations).filter(a => a.unlocked).map(a => a.key),
        unlockedRecipes: recipes.filter(a => a.unlocked).map(a => a.key),
        recipeCounters: recipes.map(a => ({key: a.key, counter: a.counter})),
        resources: Object.values(resources).map(a => ({key: a.key, value: a.value, displayed: a.displayed})),
        gameTime: gameTime,
        loggedMessages: loggedMessages,
        completedEventIds: completedEventIds,
        queuedEvents: queuedEvents,
        buttonData: buttons.map((obj,i) => ({
            id: obj.key, 
            remainingTimes: obj.instances.map(b => b.remainingActionTime), 
            employees: obj.employees,
        }) )
    }
    localStorage.setItem("save", JSON.stringify(saveObj));
}

function ClearSave() {
    let confirmed = confirm("Are you sure you want to delete your save? You will lose all progess.");
    if (confirmed) {
        localStorage.setItem("save", "");
        window.location.reload();
    }
}

function InitSave() {
    var loadedSave = localStorage.getItem("save");
    if (loadedSave == null || loadedSave == "") {
        DoIntroCinematic();
    } else {
        let saveObj = JSON.parse(loadedSave);
        for (let locationKey of saveObj.unlockedLocations) {
            UnlockItem(locationKey);
        }
        for (let recipeKey of saveObj.unlockedRecipes) {
            UnlockItem(recipeKey);
        }
        if (saveObj.recipeCounters) {
            for (let recipeCounter of saveObj.recipeCounters) {
                recipes.filter(a => a.key == recipeCounter.key)[0].counter = recipeCounter.counter;
            }
        }
        for (let savedResource of saveObj.resources) {
            resources[savedResource.key].value = savedResource.value;
            resources[savedResource.key].displayed = savedResource.displayed;
            if (savedResource.displayed) {
                resources[savedResource.key].div.style.display = "";
            }
        }
        for (let loggedMessage of saveObj.loggedMessages) {
            PrintToLog(loggedMessage, true);
        }
        completedEventIds = saveObj.completedEventIds;
        queuedEvents = saveObj.queuedEvents;
        RefreshButtons();

        for (let buttonDatum of saveObj.buttonData) {
            let buttonObj = buttons.filter(a => a.key == buttonDatum.id)[0];
            if (!buttonObj) {
                console.log("No button with id ", buttonDatum.id);
                continue;
            }
            buttonObj.employees = buttonDatum.employees;
            for (let remainingTime of buttonDatum.remainingTimes) {
                let htmlElement = document.createElement("div");
                buttonObj.htmlInstances.appendChild(htmlElement);
                buttonObj.instances.push({
                    remainingActionTime: remainingTime,
                    htmlElement: htmlElement,
                });
            }
        }
        RefreshButtons();
    }

    setInterval(SaveState, 1000 * 15);
}