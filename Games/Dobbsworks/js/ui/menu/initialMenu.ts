class InitialMenu extends Menu {
    stopsMapUpdate = true;
    blocksPause = true;
    backgroundColor = "#000";

    CreateElements(): UIElement[] {
        let ret: UIElement[] = [];
        
        let playWithAudioButton = new Button(50, 50, camera.canvas.width - 100, camera.canvas.height / 2 - 100);
        let withSoundText = new UIText(0,0, "Play with sound", 40, "white");
        playWithAudioButton.AddChild(withSoundText);
        withSoundText.xOffset = playWithAudioButton.width / 2 - 5;
        withSoundText.yOffset = -75;

        let playMutedButton = new Button(50, camera.canvas.height / 2 + 50, camera.canvas.width - 100, camera.canvas.height / 2 - 100);
        let mutedText = new UIText(0,0, "Play muted", 40, "white");
        playMutedButton.AddChild(mutedText);
        mutedText.xOffset = playMutedButton.width / 2 - 5;
        mutedText.yOffset = -75;
        
        let playDemoButton = new Button(50, camera.canvas.height / 4 + 50, camera.canvas.width - 100, camera.canvas.height / 2 - 100);
        let playDemoText = new UIText(0,0, "Click to try the demo", 40, "white");
        playDemoButton.AddChild(playDemoText);
        playDemoText.xOffset = playDemoButton.width / 2 - 5;
        playDemoText.yOffset = -75;

        if (isDemoMode) {
            ret.push(playDemoButton);
        } else {
            ret.push(playWithAudioButton, playMutedButton);
        }
        
        playDemoButton.onClickEvents.push(() => {
            this.GoToMainMenu();
        })
        playWithAudioButton.onClickEvents.push(() => {
            this.GoToMainMenu();
        })
        playMutedButton.onClickEvents.push(() => {
            audioHandler.startMuted = true;
            audioHandler.Mute();
            this.GoToMainMenu();
        })

        return ret;
    }

    GoToMainMenu(): void {
        this.Hide(1);
        setTimeout(() => {
            this.Dispose();
            audioHandler.SetBackgroundMusic("intro");
        }, 200)
        MenuHandler.CreateMenu(MainMenu);
    }
}