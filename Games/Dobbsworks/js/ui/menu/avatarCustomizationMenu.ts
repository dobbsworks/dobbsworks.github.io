
class AvatarLayerElement {
    constructor(public id: number, public imageSource: ImageTile) { }
}

class AvatarPanel extends Panel {
    constructor(avatarCode: string) {
        super(0, 0, 40, 40);
        this.margin = 0;
        this.backColor = "#F00D";
        if (avatarCode) {
            let segments = avatarCode.split(",");
            for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
                let codeSegment = segments[segmentIndex];
                let id = Utility.IntFromB64(codeSegment);
                let func = [AvatarCustomizationMenu.GetBackImage, AvatarCustomizationMenu.GetFocusImage, AvatarCustomizationMenu.GetFrameImage][segmentIndex];
                let imageTile = func(id);
                let imageFromTile = new ImageFromTile(0, 0, 40, 40, imageTile);
                imageFromTile.zoom = 2;
                this.AddChild(imageFromTile);
            }
        }
    }
}

class AvatarCustomizationMenu extends Menu {
    stopsMapUpdate = true;
    backgroundColor = "#022";

    static selectedElementIndeces: number[] = [0, 0, 0];
    static username: string = "";
    previewPanel!: Panel;
    usernameTextElement!: UIText;
    selectionPanels!: Panel;

    unlockedElements: string = "";

    availableFocusElements: AvatarLayerElement[] = [];
    availableBackElements: AvatarLayerElement[] = [];
    availableFrameElements: AvatarLayerElement[] = [];

    CreateElements(): UIElement[] {

        DataService.GetUserData().then(userData => {
            this.usernameTextElement.text = userData.username;
            AvatarCustomizationMenu.username = userData.username;
            AvatarCustomizationMenu.ImportFromAvatarString(userData.avatar);
            this.unlockedElements = userData.unlocks;
            this.RefreshAvailableElements();
        })


        let ret: UIElement[] = [];

        this.selectionPanels = new Panel(0, 0, 350, 520);

        let mainPanel = new Panel(20, 20, 900, 520);
        mainPanel.AddChild(this.selectionPanels);

        let profilePanel = new Panel(0, 0, 500, 170);
        profilePanel.margin = 0;
        profilePanel.backColor = "#1138";

        let namePanel = new Panel(0, 0, 330, 80);
        this.usernameTextElement = new UIText(0, 0, "", 28, "white");
        this.usernameTextElement.textAlign = "left";
        this.usernameTextElement.yOffset = 32;
        this.usernameTextElement.xOffset = 4;
        let nameEditButton = new Button(0, 0, 48, 48);
        let editImage = new ImageFromTile(0, 0, 36, 36, tiles["editor"][4][0]);
        editImage.zoom = 3;
        nameEditButton.AddChild(editImage);
        nameEditButton.onClickEvents.push(() => {
            UIDialog.SmallPrompt("What would you like your Dabble Worlds name to be?", "Done", 16, (newName) => {
                if (newName) {
                    AvatarCustomizationMenu.username = newName;
                    this.usernameTextElement.text = newName;
                }
            }, UISmallPrompt.SimpleCharacters)
        });

        namePanel.AddChild(this.usernameTextElement);
        namePanel.AddChild(nameEditButton);

        let medalPanel = new Panel(0, 0, 330, 80);
        let rightPanel = new Panel(0, 0, 330, 170);
        rightPanel.layout = "vertical";
        rightPanel.margin = 0;
        rightPanel.AddChild(namePanel);
        rightPanel.AddChild(medalPanel);

        this.previewPanel = new Panel(0, 0, 170, 170);
        profilePanel.AddChild(this.previewPanel);
        profilePanel.AddChild(rightPanel);

        let rightSide = new Panel(0, 0, 500, 500);
        rightSide.margin = 0;
        rightSide.layout = "vertical";
        rightSide.AddChild(profilePanel);

        mainPanel.AddChild(rightSide);



        let buttons = new Panel(0, 0, 500, 60);
        let cancelButton = new Button(0, 0, 240, 60);
        let cancelText = new UIText(0, 0, "Cancel", 24, "white");
        cancelText.yOffset = 34;
        cancelButton.AddChild(new Spacer(0, 0, 0, 0));
        cancelButton.AddChild(cancelText);
        cancelButton.AddChild(new Spacer(0, 0, 0, 0));
        buttons.AddChild(cancelButton);
        cancelButton.onClickEvents.push(() => {
            MenuHandler.GoBack();
        });
        let saveButton = new Button(0, 0, 240, 60);
        let saveText = new UIText(0, 0, "Save Changes", 24, "white");
        saveText.yOffset = 34;
        saveButton.AddChild(new Spacer(0, 0, 0, 0));
        saveButton.AddChild(saveText);
        saveButton.AddChild(new Spacer(0, 0, 0, 0));
        saveButton.onClickEvents.push(() => {
            if (AvatarCustomizationMenu.username) {
                let newAvatarString = AvatarCustomizationMenu.ExportAvatarString();
                DataService.UpdateNameAndAvatar(newAvatarString, AvatarCustomizationMenu.username);
                MenuHandler.GoBack();
            } else {
                UIDialog.Alert("Something went wrong saving the changes, please try again later!", "OK");
            }
        });
        buttons.AddChild(saveButton);
        rightSide.AddChild(buttons);



        ret.push(mainPanel);

        return ret;
    }


    static ImportFromAvatarString(avatarString: string): void {
        if (avatarString) {
            for (let i = 0; i < 3; i++) {
                AvatarCustomizationMenu.selectedElementIndeces[i] = Utility.IntFromB64(avatarString.split(",")[i]);
            }
        }
    }

    static ExportAvatarString(): string {
        return AvatarCustomizationMenu.selectedElementIndeces.map(a => {
            return Utility.toTwoDigitB64(a);
        }).join(",");
    }

    RefreshAvailableElements(): void {
        this.availableFocusElements = this.GetAllFocusElements().filter(a => this.unlockedElements.split(",").indexOf("1" + Utility.toTwoDigitB64( a.id)) > -1);
        this.availableBackElements = this.GetAllBackElements().filter(a => this.unlockedElements.split(",").indexOf("0" + Utility.toTwoDigitB64( a.id)) > -1);
        this.availableFrameElements = this.GetAllFrameElements().filter(a => this.unlockedElements.split(",").indexOf("2" + Utility.toTwoDigitB64( a.id)) > -1);
        
        let panel1 = this.GetSelectionPanel(this.availableFocusElements, 0, 1);
        let panel2 = this.GetSelectionPanel(this.availableBackElements, 0, 0);
        let panel3 = this.GetSelectionPanel(this.availableFrameElements, 0, 2);
        this.selectionPanels.children = [];
        this.selectionPanels.AddChild(panel1);
        this.selectionPanels.AddChild(panel2);
        this.selectionPanels.AddChild(panel3);
        
        this.UpdatePreview();
    }

    UpdatePreview(): void {
        let back = this.availableBackElements.find(a => a.id === AvatarCustomizationMenu.selectedElementIndeces[0]);
        let focus = this.availableFocusElements.find(a => a.id === AvatarCustomizationMenu.selectedElementIndeces[1]);
        let frame = this.availableFrameElements.find(a => a.id === AvatarCustomizationMenu.selectedElementIndeces[2]);

        this.previewPanel.children = [];

        for (let customization of [back, focus, frame]) {
            if (customization) {
                let imageTile = new ImageFromTile(0, 0, 160, 160, customization.imageSource);
                imageTile.zoom = 8;
                this.previewPanel.AddChild(imageTile);
            }
        }

    }

    GetSelectionPanel(contents: AvatarLayerElement[], selectedIndex: number, layerNum: number): Panel {
        let newPanel = new Panel(0, 0, 100, 500);
        newPanel.backColor = "#0044";
        newPanel.layout = "vertical";

        for (let i = 0; i < contents.length; i++) {
            let id = contents[i].id;
            let button = new AvatarCustomizationButton(contents[i].imageSource, layerNum, id);
            button.radioKey = "avatar" + layerNum;
            button.onClickEvents.push(() => {
                button.isSelected = true;
                AvatarCustomizationMenu.selectedElementIndeces[layerNum] = id;
                this.UpdatePreview();
            })
            if (i < 5) {
                newPanel.AddChild(button);
            } else {
                newPanel.scrollableChildrenDown.push(button);
            }
        }

        return newPanel;
    }

    GetAllFocusElements(): AvatarLayerElement[] {
        let ret: AvatarLayerElement[] = []
        for (let i = 0; i < 21; i++) {
            ret.push(new AvatarLayerElement(i, AvatarCustomizationMenu.GetFocusImage(i)));
        }
        return ret;
    } 

    GetAllFrameElements(): AvatarLayerElement[] {
        let ret: AvatarLayerElement[] = []
        for (let i = 0; i < 5; i++) {
            ret.push(new AvatarLayerElement(i, AvatarCustomizationMenu.GetFrameImage(i)));
        }
        return ret;
    }

    GetAllBackElements(): AvatarLayerElement[] {
        let ret: AvatarLayerElement[] = []
        for (let i = 0; i < 8; i++) {
            ret.push(new AvatarLayerElement(i, AvatarCustomizationMenu.GetBackImage(i)));
        }
        return ret;
    }


    static GetFocusImage(id: number): ImageTile {
        return tiles["avatars"][id % 16][Math.floor(id / 16)]
    }  
    static GetFrameImage(id: number): ImageTile {
        id += 16 * 9;
        return tiles["avatars"][id % 16][Math.floor(id / 16)]
    } 
    static GetBackImage(id: number): ImageTile {
        id += 16 * 6;
        return tiles["avatars"][id % 16][Math.floor(id / 16)]
    }  

}


class AvatarCustomizationButton extends Button {
    constructor(imageTile: ImageTile, private layer: number, private id: number) {
        super(0, 0, 90, 90);
        this.AddChild(new ImageFromTile(0, 0, 80, 80, imageTile));
    }

    Update(): void {
        super.Update();
        this.isSelected = AvatarCustomizationMenu.selectedElementIndeces[this.layer] === this.id;
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
    }

}