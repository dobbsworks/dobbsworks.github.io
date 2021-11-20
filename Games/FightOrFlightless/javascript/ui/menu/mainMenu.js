class MainMenu {

    LoadMainMenu() {
        let playButton = uiHandler.Button("Import Level", {
            centerX: canvas.width / 2,
            y: 400,
            width: 250,
            height: 100
        }, this.ImportLevel.bind(this));

        let editorButton = uiHandler.Button("Level Editor", {
            right: playButton.left - 25,
            y: 400,
            width: 200,
            height: 50
        }, SwitchToEditor);

        let historyButton = uiHandler.Button("Version " + versionNumber, {
            left: playButton.right + 25,
            y: 400,
            width: 200,
            height: 50
        }, this.ShowVersionHistory.bind(this));
    }


    ImportLevel() {
        let text = prompt("Enter scenario text:");
        if (!text) return;
        let scenario = JSON.parse(text);
        LoadScenario(scenario);
        uiHandler.elements = [];
    }

    ShowVersionHistory() {
        uiHandler.elements = [];
        document.getElementById("versionHistory").style.display = "block";
        document.getElementById("versionHistoryText").innerHTML = versionHistory;
    }
}